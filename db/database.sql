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

