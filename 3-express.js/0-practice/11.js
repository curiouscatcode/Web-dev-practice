// 1️⃣1️⃣ Create an **async function** that:
//   - Waits for 2 seconds using `setTimeout`  
//   - Then logs `"2 seconds later..."`  
//   - Calls another function that logs `"Process finished"

const start = async () => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log('2 seconds later...');
      resolve();    // resolve() function is used to tell js that promise is complete
    }, 2000);
  });

  console.log('Process finished');
}

start();