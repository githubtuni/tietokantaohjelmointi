import http from 'http';
import fs from 'fs';
import { getAsiakas, getTyokohde } from './db/db.js';

const hostname = '192.168.4.115';
const port = 8031; //ryhmä 3 porttinumero


const server = http.createServer(async (req, res) => {

    if (req.url === '/'){
        const html = fs.readFileSync('./public/index.html')
        res.setHeader('Content-Type','text/html')
        res.end(html)
    }
    else if (req.url === '/asiakas') {
        const customers = await getAsiakas();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(customers));
    }

    else if (req.url === '/tyokohde') {
        const sites = await getTyokohde();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(sites));
    }

    else {
    res.statusCode = 404;
    res.end('Not found');
    }
    //res.statusCode = 200;
    
});



server.listen(port, hostname, () => {
 console.log(`Server running at http://tie-tkannat.it.tuni.fi:${port}`);
});
