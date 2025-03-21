const file = require('fs');

file.writeFile('test.txt', 'Hello, Node.js!', 'utf-8', (err) => {
  if(err){
    console.log('Error writing file:', err);
  } else{
    console.log('File Written Successfully');
  }
});