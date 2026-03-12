import pkg from 'pg'
const { Pool } = pkg
import config from './config.js';

const pool = new Pool({
  user: config.dbUser,
  host: 'localhost',
  database: config.dbName,
  password: config.dbPassword,
  port: 5432,
})

export async function getAsiakas() {
    try {
      const result = await pool.query('SELECT * FROM asiakas');
      return result.rows;
    } catch (err) {
      console.error(err);
      return [];
    }
}

export async function getTyokohde() {
  try {
    const result = await pool.query('SELECT * FROM tyokohde');
    return result.rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function addTyokohde(asiakas_id, nimi, osoite) {

  try {
    await pool.query(
      "INSERT INTO tyokohde (asiakas_id, nimi, osoite) VALUES ($1,$2,$3)",
      [asiakas_id, nimi, osoite]
    );

  } catch (err) {
    console.error(err);
  }

} 