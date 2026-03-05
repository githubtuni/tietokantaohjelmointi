import pool from './db.js'

async function test() {
    try {
        const result = await pool.query("SELECT * FROM asiakas")
        console.log(result.rows)
    } catch (err) {
        console.error("Virhe:", err)
    }
}


test()