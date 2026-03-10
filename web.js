import http from 'http';
import fs from 'fs';


const hostname = '192.168.4.115';
const port = 8031; //ryhmä 3 porttinumero


const server = http.createServer((req, res) => {
 res.statusCode = 200;
 const html = fs.readFileSync('page.html')
 res.setHeader('Content-Type','text/html')
 res.end(html)
});



server.listen(port, hostname, () => {
 console.log(`Server running at http://${hostname}:${port}/`);
});
