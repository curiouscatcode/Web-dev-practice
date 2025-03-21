//7️⃣ Create a simple HTTP server using the http module that:
//   - Listens on **port 5000**  
//   - Responds with "Welcome to my server!"  
//   - Prints "Server is running on port 5000" in the console

const http = require('http');

const port = 5000;

const server = http.createServer((req, res) => {
  res.end('Welcome to my server');
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
}); 