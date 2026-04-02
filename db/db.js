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

export async function addAsiakas(nimi, osoite) {
    try {
      await pool.query(
        "INSERT INTO asiakas (nimi, osoite) VALUES ($1,$2)",
        [nimi, osoite]
      );
    } catch(error) {
      console.error(error);
    }
}

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
      `INSERT INTO lasku (
        tyokohde_id, 
        tyotyyppi, 
        laskun_tila, 
        maksettu, 
        viivastyskorko, 
        laskutuslisa, 
        muistutusnumero
        ) 
        VALUES ($1,$2,'Kesken',false,0,0,0)`,
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

export async function getTuntityotByLasku(lasku_id) {
  const result = await pool.query(
    "SELECT * FROM tuntityo WHERE lasku_id = $1",
    [lasku_id]
  );
  return result.rows;
}

export async function getTarvikkeetByLasku(lasku_id) {
  const result = await pool.query(
    `SELECT t.nimi, lt.kpl 
     FROM lasku_tarvike lt
     JOIN tarvike t ON t.tarvike_id = lt.tarvike_id
     WHERE lt.lasku_id = $1`,
    [lasku_id]
  );
  return result.rows;
}

export async function getLaskuFull(lasku_id) {
  const result = await pool.query(`
    SELECT 
      l.lasku_id,
      l.tyotyyppi,
      a.nimi AS asiakas_nimi, a.osoite AS asiakas_osoite,
      tk.nimi AS kohde_nimi, tk.osoite AS kohde_osoite
    FROM lasku l
    JOIN tyokohde tk ON l.tyokohde_id = tk.tyokohde_id
    JOIN asiakas a ON tk.asiakas_id = a.asiakas_id
    WHERE l.lasku_id = $1
  `, [lasku_id]);

  return result.rows[0];
}

export async function getTuntityotFull(lasku_id) {
  const result = await pool.query(
    `SELECT 
        tt.nimi,
        tt.hinta,
        t.tunnit,
        t.alepros
     FROM tuntityo t
     JOIN tyotyyppi tt ON t.tyotyyppi_id = tt.tyotyyppi_id
     WHERE t.lasku_id = $1`,
    [lasku_id]
  );
  return result.rows;
}

export async function getTarvikkeetFull(lasku_id) {
  const result = await pool.query(
    `SELECT 
        t.nimi,
        t.myyntihinta,
        lt.kpl,
        lt.alepros
     FROM lasku_tarvike lt
     JOIN tarvike t ON t.tarvike_id = lt.tarvike_id
     WHERE lt.lasku_id = $1`,
    [lasku_id]
  );
  return result.rows;
}

export function laskeLasku(tuntityot, tarvikkeet) {
  let tyoSumma = 0;
  let tarvikeSumma = 0;

  for (let t of tuntityot) {
    const hinta = t.hinta * t.tunnit;
     const ale = t.alepros || 0;  
  const alennus = hinta * (ale / 100);
    tyoSumma += (hinta - alennus);
  }

  for (let tar of tarvikkeet) {
    const hinta = tar.myyntihinta * tar.kpl;
      const ale = tar.alepros || 0; 
  const alennus = hinta * (ale / 100);

    tarvikeSumma += (hinta - alennus);
    
  }
  return {
  tyoSumma,
  tarvikeSumma,
  kokonais: tyoSumma + tarvikeSumma,
  kotitalousvahennys: tyoSumma
};
}