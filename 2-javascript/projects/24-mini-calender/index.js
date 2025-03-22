const month = ['January', 'February', 'March', 'April', 
  'May', 'June', 'July', 'August', 'September', 'October', 'November'
  , 'December'
];
const d = new Date();
let name = month[d.getMonth()];
document.querySelector('.js-month').innerHTML = name;

const day = ['Monday', 'Tuesday', 'Wednesday', 
  'Thursday', 'Friday', 'Saturday', 'Sunday'
];

let nameOfDay= day[d.getDay()];
document.querySelector('.js-day').innerHTML = nameOfDay;

let date = d.getDate();
document.querySelector('.js-date').innerHTML = date;

let year = d.getFullYear();
document.querySelector('.js-year').innerHTML = year;
