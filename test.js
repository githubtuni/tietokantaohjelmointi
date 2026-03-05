const { Pool, Client } = require('pg')
const pool = new Pool({
 user: 'xxx',
 host: 'localhost',
 database: 'xxx',
 password: 'xxx',
 port: 5432,
})
pool.query('SELECT * FROM testi', (err, res) => {
 console.log(err, res)
 pool.end()
})

