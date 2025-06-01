const { copyStringIntoBuffer } = require("pdf-lib");

const users = [
  { id: 1, name: "Alice", age: 22 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 18 },
  { id: 4, name: "David", age: 25 },
];

/*
Tasks:- 
 1. **🗺️ Use `.map()` to get all names in an array:**

```js
// Expected Output: ["Alice", "Bob", "Charlie", "David"]
```
*/

// const allNames = users.map((names) => {
//   console.log(names.name);
// });

/* 
2. **🔍 Use `.filter()` to find users older than 21:**

```js
// Expected Output: [{ id: 1, name: "Alice", ... }, { id: 2, ... }, { id: 4, ... }]
```
*/
// const filteredUsers = users.filter((users) => {
//   if (users.age > 21) {
//     console.log(users);
//   }
// });

/* 
3. **🔎 Use `.find()` to get the user with name "Charlie":**

```js
// Expected Output: { id: 3, name: "Charlie", age: 18 }
```
*/
// const findingUser = users.find((user) => {
//   if (user.name.toLowerCase() === "charlie") {
//     console.log(user);
//   }
// });

/*
4. **🎯 Use `.some()` to check if anyone is under 18:**

```js
// Expected Output: false
```
*/

// '.some()' checks if at least one element in the array meets the condition.

// const isUnderage = users.some((user) => user.age < 18);

// if (isUnderage) {
//   return console.log("Someone is underage !");
// } else {
//   return console.log("false");
// }

/*
5. **📉 Use `.sort()` to sort users by age (ascending):**

```js
// Expected Output: [{ id: 3, ... }, { id: 1, ... }, { id: 4, ... }, { id: 2, ... }]
```
*/

// const sortedUsers = users.sort((a, b) => a.age - b.age);

// console.log(sortedUsers);

/*
6. **🧮 Use `.reduce()` to calculate total age of all users:**

```js
// Expected Output: 95
```
*/

const totalAge = users.reduce((acc, user) => {
  return acc + user.age;
}, 0);

console.log(totalAge);
