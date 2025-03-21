// 1️⃣3️⃣ Create an **EventEmitter** that:
//   - Emits a `"greet"` event  
//   - Logs `"Hello, Node.js!"` when the event is emitted  

const EventEmitter = require('events');
const customEmitter =  new EventEmitter();

customEmitter.on('greet' ,() => {
  console.log('Hello, Node.js!');
});

customEmitter.emit('greet');