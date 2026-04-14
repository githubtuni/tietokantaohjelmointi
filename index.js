import http from 'http';
import fs from 'fs';
import { 
    getLasku, 
    getAsiakas, 
    getTyokohde, 
    addTyokohde, 
    addLasku, 
    addTuntityo,
    addUrakkatyo, 
    getTarvikkeet, 
    addTarvikeToLasku,
    addAsiakas,
    updateLasku,
    readyLasku,
    getLaskuFull,
    getTarvikkeetFull,
    getTuntityotFull,
    getUrakkatyotFull,
    laskeLasku,
    getR6
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

    else if (req.url === '/urakkatyo' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
           body += chunk.toString();
        });

            
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                await addUrakkatyo(
                    data.lasku_id, 
                    data.aloituspaiva, 
                    data.lopetuspaiva, 
                    data.hinta
                );
                res.end('ok');
            } catch(error) {
                if (error.message === "Already exists") {
                    res.statusCode = 409;
                    res.end(JSON.stringify({ error: 'Urakkatyö exists for lasku'}))
                }
                else {
                    console.error(error);
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Server error' }));
                }
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

    else if (req.url === '/lasku_update' && req.method === 'POST') {
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                await updateLasku(
                    data.lasku_id,  
                    data.laskun_tila,
                    data.erapaiva,
                    data.lahetys_pvm
                )
                res.end('ok');
            } catch(error) {
                console.error(error);
                res.statusCode = 500;
                res.end(JSON.stringify({error: 'Server error'}));
            }
        });
    }

    else if (req.url === '/lasku_ready' && req.method === 'POST') {
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                await readyLasku(
                    data.lasku_id,  
                    data.maksettu,
                    data.maksu_pvm
                )
                res.end('ok');
            } catch(error) {
                console.error(error);
                res.statusCode = 500;
                res.end(JSON.stringify({error: 'Server error'}));
            }
        });
    }

    else if (req.url === '/lasku_by_id' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const lasku_id = data.lasku_id;

                if (!lasku_id) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Missing lasku_id' }));
                    return;
                }

                const lasku = await getLaskuFull(lasku_id);

                const tyyppi = lasku.tyotyyppi?.toLowerCase();
                let tyotRows = [];
                if (tyyppi === "tuntityö") {
                    tyotRows = await getTuntityotFull(lasku_id);
                } else if (tyyppi === "urakkatyö") {
                    tyotRows = await getUrakkatyotFull(lasku_id);
                } else {
                    tyotRows = [];
                }

                const tarvikkeet = await getTarvikkeetFull(lasku_id);

                const totals = laskeLasku({tyyppi, tyot: tyotRows, tarvikkeet});

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    lasku_id,
                    lasku,
                    tyot: {
                        tyyppi,
                        rows: tyotRows
                    },
                    tarvikkeet,
                    totals
                }));
            } catch (error) {
                console.error(error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Server error' }));
            }
        });
    }

    else if (req.url === '/asiakas' && req.method === 'GET') {
        const customers = await getAsiakas();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(customers));
    }

    else if (req.url === '/asiakas' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                await addAsiakas(data.nimi, data.osoite);
                res.end('ok');
            } catch (err) {
                console.error(err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Server error' }));
            }
        });
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
    else if (req.url === '/r6' && req.method === 'GET') {
    try {
        const data = await getR6();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Server error' }));
    }
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


