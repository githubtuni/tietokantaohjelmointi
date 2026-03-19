import http from 'http';
import fs from 'fs';
import { 
    getLasku, 
    getAsiakas, 
    getTyokohde, 
    addTyokohde, 
    addLasku, 
    addTuntityo, 
    getTarvikkeet, 
    addTarvikeToLasku
} from './db/db.js';

const hostname = '192.168.4.115';
const port = 8031; //ryhmä 3 porttinumero


const server = http.createServer(async (req, res) => {

    if (req.url === '/'){
        const html = fs.readFileSync('./public/index.html')
        res.setHeader('Content-Type','text/html')
        res.end(html)
    }

    else if (req.url === '/tuntityo' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
           body += chunk.toString();
        });

            
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                await addTuntityo(
                    data.lasku_id, 
                    data.paivamaara, 
                    data.tunnit, 
                    data.tyotyyppi_id, 
                    data.alepros
                );
                res.end('ok');
            } catch(error) {
                console.error(error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Server error' }));
                }
            });
    }

    else if (req.url ==='/tarvike' && req.method === 'GET') {
        try {
            const tarvikkeet = await getTarvikkeet();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(tarvikkeet));
        } catch(error) {
            res.statusCode = 500;
            res.end(JSON.stringify({error: "Database error" }));
        }
    }

    else if (req.url ==='/lasku_tarvike' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                await addTarvikeToLasku(data.lasku_id, data.tarvike_id, data.maara, data.alepros);
                res.end('ok');
            } catch (err) {
                console.error(err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Server error' }));
            }
        });
    }

    else if (req.url === '/lasku' && req.method === 'GET') {
        try {
            const laskut = await getLasku();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(laskut));
        } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Database error' }));
        }
    }

    else if (req.url === '/lasku' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                await addLasku(data.tyokohde_id, data.tyotyyppi);
                res.end('ok');
            } catch (err) {
                console.error(err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Server error' }));
            }
        });
    }

    else if (req.url === '/asiakas') {
        const customers = await getAsiakas();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(customers));
    }

    else if (req.url === '/tyokohde' && req.method === 'GET') {
        const sites = await getTyokohde();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(sites));
    }
    else if (req.url === '/tyokohde' && req.method === 'POST') {

        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', async () => {

            const data = JSON.parse(body);
            await addTyokohde(data.asiakas_id, data.nimi, data.osoite);
            res.end('ok');

        });

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


