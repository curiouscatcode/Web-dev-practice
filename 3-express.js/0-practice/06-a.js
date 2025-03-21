// 6️⃣ Modify the 05th code to use **async/await** instead of callbacks.
const { readFile, writeFile } = require('fs').promises;

const start = async () => {
  try { 
    const first = await readFile('test.txt', 'utf-8');
    console.log(first);
  } catch (error) {
    console.error('Error found: ', error);
  }
}

start();