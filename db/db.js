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

export async function addTarvikeToLasku(lasku_id, tarvike_id, kpl, alepros) {
    try {
      await pool.query(
        "INSERT INTO lasku_tarvike (lasku_id, tarvike_id, kpl, alepros) VALUES ($1,$2,$3,$4)",
        [lasku_id, tarvike_id, kpl, alepros]
      );
    } catch(err) {
      console.error(err);
    }
}

export async function getTarvikkeet() {
    try {
      const result = await pool.query('SELECT * from tarvike');
      return result.rows;
    } catch(error) {
      console.error(error);
      return [];
    }
}

export async function getLasku() {
    try {
      const result = await pool.query('SELECT * FROM lasku');
      return result.rows;
    } catch (err) {
      console.error(err);
      return [];
    }
}

export async function addLasku(tyokohde_id, tyotyyppi) {

  try {
    await pool.query(
      "INSERT INTO lasku (tyokohde_id, tyotyyppi, laskun_tila) VALUES ($1,$2,'kesken')",
      [tyokohde_id, tyotyyppi]
    );

  } catch (err) {
    console.error(err);
  }

} 

export async function addTuntityo(lasku_id, paivamaara, tunnit, tyotyyppi_id, alepros) {
  try {
    await pool.query(
      "INSERT INTO tuntityo (lasku_id, paivamaara, tunnit, tyotyyppi_id, alepros) VALUES ($1,$2,$3,$4,$5)",
      [lasku_id, paivamaara, tunnit, tyotyyppi_id, alepros]
    );
  } catch(err) {
    console.error(err);
  }
}

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
export async function getLaskuById(id) {

  const lasku = await pool.query(
    'SELECT * FROM lasku WHERE lasku_id = $1',
    [id]
  );

  const tuntityot = await pool.query(
    'SELECT * FROM tuntityo WHERE lasku_id = $1',
    [id]
  );

  return {
    lasku: lasku.rows[0],
    tuntityot: tuntityot.rows
  };
}