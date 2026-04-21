import pkg from 'pg'
const { Pool } = pkg
import config from './config.js';
import { nextTick } from 'process';

const pool = new Pool({
  user: config.dbUser,
  host: 'localhost',
  database: config.dbName,
  password: config.dbPassword,
  port: 5432,
})

// Simulated user role
const userRole = "admin"

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
      const result = await pool.query(`
      SELECT 
        l.lasku_id,
        l.tyokohde_id,
        l.lahetys_pvm,
        l.maksu_pvm,
        l.laskun_tila,
        l.tyotyyppi,
        l.erapaiva,
        l.maksettu,
        l.ed_lasku_id,
        l.viivastyskorko,
        l.laskutuslisa,
        l.muistutusnumero,
        a.nimi AS asiakas_nimi, a.osoite AS asiakas_osoite,
        tk.nimi AS kohde_nimi, tk.osoite AS kohde_osoite
      FROM lasku l
      JOIN tyokohde tk ON l.tyokohde_id = tk.tyokohde_id
      JOIN asiakas a ON tk.asiakas_id = a.asiakas_id
      `);
      return result.rows;
    } catch (err) {
      console.error(err);
      return [];
    }
}

export async function updateLasku(lasku_id, laskun_tila, erapaiva, lahetys_pvm) {
  
  if (userRole !== "admin") {
    throw new Error("Requires admin privileges.")
  }

  try {
    await pool.query(
      `
      UPDATE lasku
      SET
        laskun_tila = $1,
        erapaiva = $2,
        lahetys_pvm = $3
      WHERE lasku_id = $4
      `,
      [laskun_tila, erapaiva, lahetys_pvm, lasku_id]
    );
  } catch (error) {
    console.error(error);
  }
}

export async function readyLasku(lasku_id, maksettu, maksu_pvm) {

  if (userRole !== "admin") {
    throw new Error("Requires admin privileges.")
  }

  try {
    await pool.query(
      `
      UPDATE lasku
      SET
        maksettu = $1,
        maksu_pvm = $2
      WHERE lasku_id = $3
      `,
      [maksettu, maksu_pvm, lasku_id]
    );
  } catch (error) {
    console.error(error);
  }
} 

export async function addLasku(tyokohde_id, tyotyyppi) {
  
  if (userRole !== "admin") {
    throw new Error("Requires admin privileges.")
  }

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

export async function addUrakkatyo(lasku_id, aloituspaiva, lopetuspaiva, hinta) {
  try {
    await pool.query(
      "INSERT INTO urakkatyo (lasku_id, aloituspaiva, lopetuspaiva, hinta) VALUES ($1,$2,$3,$4)",
      [lasku_id, aloituspaiva, lopetuspaiva, hinta]
    );
  } catch(err) {
    if (err.constraint === "urakkatyo_lasku_id_conflict") {
      throw new Error("Already exists")
    }
    console.error(err);
    throw(err)
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

export async function getUrakkatyotFull(lasku_id) {
  const result = await pool.query(
    `SELECT 
        u.sopimuspaiva,
        u.hinta,
        u.tila,
        u.aloituspaiva,
        u.lopetuspaiva
     FROM urakkatyo u
     WHERE u.lasku_id = $1`,
    [lasku_id]
  );
  // muuttaa hinnan stringistä numeeriseksi
  return result.rows.map((row) => {
    row.hinta = Number(row.hinta);
    return row;
  });
}

export async function getTarvikkeetFull(lasku_id) {
  const result = await pool.query(
    `SELECT 
        t.nimi,
        t.myyntihinta,
        t.alv,
        lt.kpl,
        lt.alepros
     FROM lasku_tarvike lt
     JOIN tarvike t ON t.tarvike_id = lt.tarvike_id
     WHERE lt.lasku_id = $1`,
    [lasku_id]
  );
  return result.rows;
}

export function laskeLasku({tyyppi, tyot, tarvikkeet}) {
  let tyoSumma = 0;
  let tarvikeSumma = 0;

  let alvTyoSumma = 0;
  let alvTarvikeSumma = 0;

  // työt

  if (tyyppi === "tuntityö") {
    for (let t of tyot) {
      const perus = t.hinta * t.tunnit;

      const ale = t.alepros || 0;
      const netto = perus - (perus * ale / 100);

      const alvPros = 24; // manuaalinen veroprosentin asetus
      const alv = netto * (alvPros / 100);

      tyoSumma += netto;
      alvTyoSumma += alv;
    }
  }
  else if (tyyppi === "urakkatyö") {
    for (let t of tyot) {
      const netto = t.hinta;

      const alvPros = 24;
      const alv = netto * (alvPros / 100);

      tyoSumma += netto;
      alvTyoSumma += alv;
    }
  }

  for (let tar of tarvikkeet) {
    const perus = tar.myyntihinta * tar.kpl;

    const ale = tar.alepros || 0; 
    const netto = perus - (perus * ale / 100);

    const alvPros = tar.alv || 24;
    const alv = netto * (alvPros / 100);

    tarvikeSumma += netto;
    alvTarvikeSumma += alv;
  }
  
  const kotitalousvahennys = tyoSumma + alvTyoSumma;
  const alvSumma = alvTyoSumma + alvTarvikeSumma;
  const kokonais = tyoSumma + tarvikeSumma + alvSumma;

  return {
    tyoSumma,
    tarvikeSumma,
    alvTyoSumma,
    alvTarvikeSumma,
    alvSumma,
    kokonais,
    kotitalousvahennys
};
}

export async function getR6() {
  try {
    const result = await pool.query(`
      SELECT 
        a.nimi AS asiakas,
        tk.osoite AS tyokohde,
        t.nimi AS tarvike,
        SUM(lt.kpl) AS maara
      FROM lasku_tarvike lt
      JOIN tarvike t ON lt.tarvike_id = t.tarvike_id
      JOIN toimittaja toimi ON t.toimittaja_id = toimi.toimittaja_id
      JOIN lasku l ON lt.lasku_id = l.lasku_id
      JOIN tyokohde tk ON l.tyokohde_id = tk.tyokohde_id
      JOIN asiakas a ON tk.asiakas_id = a.asiakas_id
      WHERE toimi.nimi = 'Junk Co'
      GROUP BY a.nimi, tk.osoite, t.nimi
      ORDER BY a.nimi

    `);

    return result.rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}


export async function getOriginalLaskuId(lasku_id) {
  const result = await pool.query(`
    WITH RECURSIVE original AS (
        SELECT lasku_id, ed_lasku_id
        FROM lasku
        WHERE lasku_id = $1

        UNION ALL

        SELECT l.id, l.ed_lasku_id
        FROM lasku l
        JOIN original o ON o.ed_lasku_id = l.lasku_id
    )
    SELECT lasku_id
    FROM original
    WHERE ed_lasku_id IS NULL
    LIMIT 1;
  `,[lasku_id]); 

  return result.rows[0];
}

export async function isParentLasku(lasku_id) {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT 1
      FROM lasku
      WHERE ed_lasku_id = $1
    ) AS "isParent";
  `, [lasku_id]);

  console.log(result.rows[0]);
  return result.rows[0].isParent;
}

export async function addReminderLasku(tyokohde_id, lahetys_pvm, tyotyyppi, erapaiva, ed_lasku_id, viivastyskorko, laskutuslisa, muistutusnumero) {
  
  if (userRole !== "admin") {
    throw new Error("Requires admin privileges.")
  }

  try {
    await pool.query(
      `INSERT INTO lasku (
        tyokohde_id,
        lahetys_pvm,
        laskun_tila,
        tyotyyppi,
        erapaiva,
        maksettu,
        ed_lasku_id,
        viivastyskorko,
        laskutuslisa,
        muistutusnumero
      ) 
      VALUES ($1,$2,'valmis',$3,$4,false,$5,$6,$7,$8)`,
      [tyokohde_id, lahetys_pvm, tyotyyppi, erapaiva, ed_lasku_id, viivastyskorko, laskutuslisa, muistutusnumero]
    );

  } catch (err) {
    console.error(err);
  }

} 

export async function getOldLasku(lasku_id) {
    try {
      const result = await pool.query(`
      SELECT 
        l.lasku_id,
        l.tyokohde_id,
        l.lahetys_pvm,
        l.maksu_pvm,
        l.tyotyyppi,
        l.erapaiva,
        l.maksettu,
        l.ed_lasku_id,
        l.viivastyskorko,
        l.laskutuslisa,
        l.muistutusnumero
      FROM lasku l
      WHERE l.lasku_id = $1
      `,[lasku_id]);
      return result.rows[0];
    } catch (err) {
      console.error(err);
      return [];
    }
}

