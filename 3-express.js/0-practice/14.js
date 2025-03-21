// 1️⃣4️⃣ Create a **readable stream** that:
//   - Reads data from `bigfile.txt` (or any file)  
//   - Streams it to the console in chunks  
const {createReadStream} = require('fs');

const stream = createReadStream('./text.txt', {
    encoding:  'utf-8',
    highWaterMark: 5,       // With highWaterMark, you can control size of chunk manually. Here: 5byte
});

stream.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
});

stream.on('end', () => {
  console.log('Finished reading the file.');
});

stream.on('error', (err) => {
  console.log('Error reading file:', err);
});