// 🔟 Use `lodash` to:
//   - Shuffle an array of numbers  
//   - Get a random element from an array  
//   - Check if a value is an object  
const _ = require('lodash');
// 1
console.log(_.shuffle([2, 20, 12, 5]));
// 2
console.log(_.sample([2, 3, 88, -9]));
// 3
const amit = (name1, name2) => {
  return name1 + name2
}

console.log(_.isObject(amit)); //true since functions in js are objects 
console.log(_.isObject({})); //true
console.log(_.isObject(null)); //false