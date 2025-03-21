//8️⃣ Modify the server to:
//  - Respond with **different messages** based on the request URL (e.g., `/about` → `"About us page"`, `/contact` → `"Contact us"`)  
//  - Set appropriate `Content-Type` headers for plain text and HTML responses  
const http = require('http');

const port = 5000;

const server = http.createServer((req, res) => {
  if(req.url === '/'){
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome to my server');
  }
  else if(req.url === '/about'){
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome to about page');
  }
  else if(req.url === '/contact'){
    res.setHeader('Content-Type', 'text/html');
    res.end(`<h1>Welcome to contact page </h1>
      <button>Hello</button>`
    );
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html'});
    res.end('404 Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);  
});