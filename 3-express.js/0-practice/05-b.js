const file = require('fs');

file.readFile('test.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
  } else{
    console.log('File contents:', data);
  }
});