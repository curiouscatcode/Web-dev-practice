const { appendFile } = require('fs').promises;

const start = async () => {
  try {
    const third = await appendFile('newFile.txt', '\n This is new appended text', 'utf-8');
    console.log('Content appended successfully');
  } catch (error) {
    console.error('Error found: ', error);
  }
}
start();