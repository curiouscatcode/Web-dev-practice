const fs = require('fs');

fs.appendFile('test.txt', '\nAppend text!', (err) => {
  if (err){
    console.error('Error appending file:', err);
  } else{
    console.log('File appended successfully');
  }
});

// Now, read the file and print its contents
  fs.readFile('test.txt', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
    } else {
      console.log('Updated File Contents:\n', data);
    }
  });