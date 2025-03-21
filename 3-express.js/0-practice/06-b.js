const { readFile, writeFile } = require('fs').promises;

const start = async () => {
  try {
    const second = await writeFile(
      'newFile.txt',
      'Trying to write file using async await',
      'utf-8'
    );
  } catch (error) {
    console.error('Error found: ', error);
  }
}

start();