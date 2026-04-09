-- fhnepe tietokanta sisältö:

-- asiakas
CREATE TABLE asiakas (
  Asiakas_id SERIAL PRIMARY KEY,
  Nimi VARCHAR(100),
  Osoite VARCHAR(200)
);

INSERT INTO asiakas (Nimi, Osoite) VALUES ('Jaska Hosunen', 'Susimetsä');
INSERT INTO asiakas (Nimi, Osoite) VALUES ('Lissu Jokinen', 'Nurmitie');
INSERT INTO asiakas (Nimi, Osoite) VALUES ('Masa Näsänen', 'Masalantie');


-- työkohde
CREATE TABLE tyokohde (
    tyokohde_id SERIAL PRIMARY KEY,
    asiakas_id INTEGER NOT NULL,
    nimi VARCHAR(100),
    osoite VARCHAR(200),
    FOREIGN KEY (asiakas_id) REFERENCES asiakas(asiakas_id)
);

INSERT INTO tyokohde (asiakas_id, nimi, osoite) VALUES ('1','nimi?', 'Susimetsä');
INSERT INTO tyokohde (asiakas_id, nimi, osoite) VALUES ('2','nimi?', 'Nurmitie');
INSERT INTO tyokohde (asiakas_id, nimi, osoite) VALUES ('2', 'nimi?', 'Huitsinneva');
INSERT INTO tyokohde (asiakas_id, nimi, osoite) VALUES ('3', 'nimi?', 'Puotonkorpi');

-- lasku
CREATE TABLE lasku (
    lasku_id SERIAL PRIMARY KEY,
    tyokohde_id INTEGER NOT NULL,
    pvm DATE,
    laskun_tila VARCHAR(100),
    työtyyppi VARCHAR(100),
    erapaiva DATE,
    maksettu BOOLEAN,
    ed_lasku_id INTEGER,
    viivastyskorko INTEGER,
    laskutuslisa INTEGER,
    muistutusnumero INTEGER,
    FOREIGN KEY (tyokohde_id) REFERENCES tyokohde(tyokohde_id),
    FOREIGN KEY (ed_lasku_id) REFERENCES lasku(lasku_id)
);

CREATE TABLE toimittaja (
    toimittaja_id SERIAL PRIMARY KEY,
    nimi VARCHAR(100),
    osoite VARCHAR(200)
);

CREATE TABLE tarvike (
    tarvike_id SERIAL PRIMARY KEY,
    toimittaja_id INTEGER NOT NULL,
    nimi VARCHAR(100),
    merkki VARCHAR(50),
    alv NUMERIC(4,2),
    yksikko VARCHAR(20),
    myyntihinta NUMERIC(10,2),
    sisaanostohinta NUMERIC(10,2),
    varastotilanne INTEGER,
    FOREIGN KEY (toimittaja_id) REFERENCES toimittaja(toimittaja_id)
);

CREATE TABLE tyotyyppi (
    tyotyyppi_id SERIAL PRIMARY KEY,
    nimi VARCHAR(100) NOT NULL,
    hinta NUMERIC(10,2) NOT NULL,
    hinta_pvm DATE NOT NULL
);

-- tänne lisätty päivämääriä!! mutta ei korjattu foreign key juttua (kommentti)
CREATE TABLE urakkatyo (
    urakkatyo_id SERIAL PRIMARY KEY,
    lasku_id INTEGER NOT NULL,
    sopimuspaiva DATE,
    aloituspaiva DATE,
    lopetuspaiva DATE,
    hinta NUMERIC(10,2),
    tila VARCHAR(50),
    FOREIGN KEY (lasku_id) REFERENCES lasku(lasku_id)
);

CREATE TABLE lasku_urakka (
    lasku_id INTEGER NOT NULL,
    urakkatyo_id INTEGER NOT NULL,
    PRIMARY KEY (lasku_id, urakkatyo_id),
    FOREIGN KEY (lasku_id) REFERENCES lasku(lasku_id),
    FOREIGN KEY (urakkatyo_id) REFERENCES urakkatyo(urakkatyo_id)
);

CREATE TABLE lasku_tarvike (
    lasku_id INTEGER NOT NULL,
    tarvike_id INTEGER NOT NULL,
    kpl INTEGER,
    alepros INTEGER,
    PRIMARY KEY (lasku_id, tarvike_id),
    FOREIGN KEY (lasku_id) REFERENCES lasku(lasku_id),
    FOREIGN KEY (tarvike_id) REFERENCES tarvike(tarvike_id)
);

CREATE TABLE tuntityo (
    tuntityo_id SERIAL PRIMARY KEY,
    lasku_id INTEGER NOT NULL,
    tyotyyppi_id INTEGER NOT NULL,
    paivamaara DATE,
    tunnit NUMERIC(5,2),
    alepros INTEGER,
    FOREIGN KEY (lasku_id) REFERENCES lasku(lasku_id),
    FOREIGN KEY (tyotyyppi_id) REFERENCES tyotyyppi(tyotyyppi_id)
);
