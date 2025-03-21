// 3-a
const os = require('os');
const uptime = os.uptime();
const hours = Math.floor(uptime / 3600);
const minutes = Math.floor((uptime % 3600) / 60);
const seconds = Math.floor(uptime % 60);

console.log(`System Uptime: ${hours}h ${minutes}m ${seconds}s`);
// 3-b
console.log(`Home Directory: ${os.homedir()}`);

// 3-c 
const totalMemGB = (os.totalmem() / (1024 ** 3)).toFixed(2);
console.log(`Total System Memory: ${totalMemGB} GB`);