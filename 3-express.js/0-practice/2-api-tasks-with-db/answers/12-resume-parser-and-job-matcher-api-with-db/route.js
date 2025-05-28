const express = require('express');
const pool = require('./db');

const router = express.Router();

const multer = require('multer'); // to handle file uploads
const fs = require('fs');    // File system 
const pdfParse = require('pdf-parse');   // To extract text from PDFs

// set up multer to store files in memory (not hard disk)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST route to upload and parse a resume pdf
router.post('/upload-resume', upload.single('resume'), async (req,res) => {
  try {
    // Get the uploaded file 
    const file = req.file;

    // Check if a file was uploaded and it's a PDF - edge case
    if(!file || file.mimetype !== 'application/pdf'){
      return res.status(400).send('Please upload a valid PDF file.');
    }

    // Extract text content from the PDF file buffer
    const data = await pdfParse(file.buffer);
    const text = data.text;

    // Testing the extraction process
    /*
      // Temporary response to confirm the extracted text 
      res.status(200).json({
        extractedText: text
      });
    */

    // 2. define a list of known skills to check against
    const allSkills = [
      'java', 'Nodejs', 'Python', 'SQL', 'Excel', 'C++',
      'HTML', 'CSS', 'React', 'MongoDB', 'Javascript', 'Accounting', 'C'
    ];

    // 3. Convert resume text to lowercase
    const lowerText = text.toLowerCase();

    // helper function for regex
    function escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }    

    // 4. Extract matching skills from the text
    const extractedSkills = allSkills.filter(skill => {
      const escapedSkill = escapeRegex(skill); // safely handle special characters
      const pattern = new RegExp(`\\b${escapedSkill}\\b`, 'i'); // word boundary match
      return pattern.test(text);
    });

    // 5. Insert resume text and extracted skills into the database (resume_skills table)
    await pool.query(
      'INSERT INTO resume_skills (resume_text, skills) VALUES ($1, $2)',
      [text, extractedSkills]
    );
    
    // 6. Send only the matched skills as response 
    res.status(200).json({
      extractedSkills
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error processign the resume ');
  }
});

// GET REQUEST (READ)
router.get('/resumes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resume_skills');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error fetching resumes.');
  }
});


module.exports = router;