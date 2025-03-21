//📌 Task 4: Use the Path Module
//    Get the absolute path of test.txt.
//    Extract directory name, file name, and extension from the path.
const path = require('path');
const filePath = path.resolve('test.txt');
console.log('Absolute path:', filePath || 'not found');

console.log('Directory name:', path.dirname(filePath));
console.log('File name: ', path.basename(filePath));
console.log('Extension: ', path.extname(filePath));