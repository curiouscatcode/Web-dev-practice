// 1️⃣2️⃣ Use **Promises** to:
//   - Simulate fetching user data (`getUser()`) after 1 second  
//   - Simulate fetching orders (`getOrders()`) after another 2 seconds  
//   - Print the user and order data when both are ready  
const user = {
  id: '1', 
  name: 'Amit'
};

const order = {
  orderId: '101',
  item: 'Laptop'
};

function getUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(user);
    }, 1000);
  });
}

function getOrders() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(order);
    }, 2000);
  });
}

getUser().then((user) => {
  return getOrders().then((orders) => {
    console.log('User Data:', user);
    console.log('Order Data:', orders);
  });
});

// getUser().then(async (user) => {
//  const orders = await getOrders();
//  console.log('User Data:', user);
//  console.log('Order Data:', orders);
// });
