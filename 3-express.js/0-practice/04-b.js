//📌 Task 4-b: Creating a New File Path
//👉 Use path.join() to create a new file path by joining "my-folder" and "newFile.txt".
const path = require('path');

const newFilePath = path.join('my-folder', 'newFile.txt');
console.log('New File Path: ', newFilePath);