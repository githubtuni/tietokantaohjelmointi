CREATE TABLE asiakas (
    asiakas_id SERIAL PRIMARY KEY,
    nimi VARCHAR(100),
    osoite VARCHAR(200)
);

CREATE TABLE tyokohde (
    tyokohde_id SERIAL PRIMARY KEY,
    asiakas_id INTEGER NOT NULL,
    nimi VARCHAR(100),
    osoite VARCHAR(200),
    FOREIGN KEY (asiakas_id) REFERENCES asiakas(asiakas_id)
);

CREATE TABLE lasku (
    lasku_id SERIAL PRIMARY KEY,
    tyokohde_id INTEGER NOT NULL,
    lahetys_pvm DATE,
    maksu_pvm DATE,
    laskun_tila VARCHAR(100),
    tyotyyppi VARCHAR(100),
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

CREATE TABLE urakkatyo (
    urakkatyo_id SERIAL PRIMARY KEY,
    lasku_id INTEGER NOT NULL,
    sopimuspaiva DATE,
    aloituspaiva DATE,
    lopetuspaiva DATE,
    hinta NUMERIC(10,2),
    tila VARCHAR(50),
    FOREIGN KEY (lasku_id) REFERENCES lasku(lasku_id),
    CONSTRAINT urakkatyo_lasku_id_conflict UNIQUE(lasku_id)
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

INSERT INTO asiakas (asiakas_id, nimi, osoite) VALUES 
(1, 'Hosunen Jaska', 'Susimetsä'),
(2, 'Jokinen Lissu', 'Nurmitie'),
(3, 'Näsänen Masa', 'Masalantie');

INSERT INTO tyokohde (asiakas_id, nimi, osoite) VALUES
(1, 'Asunto', 'Susimetsä'),
(2, 'Asunto', 'Nurmitie'),
(2, 'Mökki', 'Huitsinneva'),
(3, 'Mökki', 'Puotonkorpi'),
(3, 'Asunto', 'Masalantie');

INSERT INTO tyotyyppi (tyotyyppi_id, nimi, hinta, hinta_pvm) VALUES (1, 'Suunnittelu', 44.35, '01-01-2026');
INSERT INTO tyotyyppi (tyotyyppi_id, nimi, hinta, hinta_pvm) VALUES (2, 'Työ', 36.29, '01-01-2026');
INSERT INTO tyotyyppi (tyotyyppi_id, nimi, hinta, hinta_pvm) VALUES (3, 'Aputyö', 28.24, '01-01-2026');

INSERT INTO toimittaja (toimittaja_id, nimi, osoite) VALUES
(1, 'ABB Oy', 'Niittylänkuja 2, 00320 Helsinki, Finland'),
(2, 'Schneider Electric Finland Oy', 'Keilaranta 1, 02150 Espoo, Finland'),
(3, 'Hager Oy', 'Sammontie 7, 00370 Helsinki, Finland'),
(4, 'Philips Finland Oy', 'Keilaranta 7, 02150 Espoo, Finland'),
(5, 'Siemens Oy', 'Tekniikantie 12, 02150 Espoo, Finland'),
(6, 'How-data', 'HowTie 1'),
(7, 'Moponet', 'Moponetinkuja 1'),
(8, 'Tärsky Pub', 'Tie 1'),
(9, 'Junk Co', 'Junkintie 5'),
(10, 'Mopenet', 'Kuja 2');

INSERT INTO tarvike (toimittaja_id, nimi, merkki, alv, yksikko, myyntihinta, sisaanostohinta, varastotilanne)
VALUES
(1, 'Johdonsuoja', 'ABB', 24.00, 'kpl', 35.90, 28.50, 50),
(2, 'Pistorasia', 'Schneider', 24.00, 'kpl', 12.50, 9.80, 120),
(3, 'Kytkin', 'Hager', 24.00, 'kpl', 7.90, 5.50, 200),
(5, 'Led-valaisin 12W', 'Philips', 24.00, 'kpl', 29.90, 22.50, 75),
(2, 'Kaapeli 3x2.5mm²', 'Nexans', 24.00, 'm', 1.50, 1.10, 1000),
(5, 'Sulake 16A', 'Siemens', 24.00, 'kpl', 3.50, 2.50, 300),
(5, 'Liitäntälaite LED', 'Tridonic', 24.00, 'kpl', 18.90, 14.20, 60),
(2, 'Kytkinpistorasia combo', 'Schneider', 24.00, 'kpl', 22.50, 17.80, 90),
(1, 'Kaapelikiinnike 10mm', 'ABB', 24.00, 'kpl', 0.35, 0.20, 500),
(4, 'Johdinsarja 5m', 'Philips', 24.00, 'kpl', 15.90, 12.50, 80),
(7, 'Sahkojohto', 'Moponet', 24.00, 'm', 1.25, 1, 500),
(8, 'Opaskirja', 'Tärsky', 10.00, 'kpl', 10, 8, 150),
(7, 'Pistorasia', 'Moponet', 24.00, 'kpl', 12.5, 10, 50),
(9, 'Palohälytin', 'Junk', 24.00, 'kpl', 5, 4, 15);

-- Jokinen Lissu esimerkkilasku nro 4 esimerkkidatasta.
INSERT INTO lasku (
  lasku_id,
  tyokohde_id,
  lahetys_pvm,
  maksu_pvm,
  laskun_tila,
  tyotyyppi,
  erapaiva,
  maksettu,
  ed_lasku_id,
  viivastyskorko,
  laskutuslisa,
  muistutusnumero
)
VALUES (1, 2,'2026-02-01','2026-02-15','Valmis','tuntityö','2026-02-15',true,NULL,0,0,0);

-- Tuntityöt yllä olevaan nro 4 laskuun
INSERT INTO tuntityo (
  lasku_id,
  tyotyyppi_id,
  paivamaara,
  tunnit,
  alepros
)
VALUES 
(1,1,'2026-01-28',3,10),
(1,2,'2026-01-28',12,0);

-- Tarvikkeet nro 4 yllä olevaan laskuun
INSERT INTO lasku_tarvike (lasku_id, tarvike_id, kpl, alepros)
VALUES
(1, 11, 3, 10),
(1, 12, 1, 0),
(1, 13, 1, 20);

-- Jokinen Lissu esimerkkidata lasku nro 8
INSERT INTO lasku (
  lasku_id,
  tyokohde_id,
  lahetys_pvm,
  maksu_pvm,
  laskun_tila,
  tyotyyppi,
  erapaiva,
  maksettu,
  ed_lasku_id,
  viivastyskorko,
  laskutuslisa,
  muistutusnumero
)
VALUES (2, 3,'2026-03-01','2026-03-15','Valmis','urakkatyö','2026-02-15',false,NULL,0,0,0);

-- Lasku nro 8 esimerkkidatasta
INSERT INTO urakkatyo (lasku_id, sopimuspaiva, aloituspaiva, lopetuspaiva, hinta, tila) VALUES
(2, '2026-03-01', '2026-03-05', '2026-03-05', 50, null);

-- Lasku nro 8 esimerkkidatasta
INSERT INTO lasku_tarvike (lasku_id, tarvike_id, kpl, alepros)
VALUES (2, 14, 2, 0);

-- Näsänen Masa esimerkkilasku nro 9 esimerkkidatasta
INSERT INTO lasku (
  lasku_id,
  tyokohde_id,
  lahetys_pvm,
  maksu_pvm,
  laskun_tila,
  tyotyyppi,
  erapaiva,
  maksettu,
  ed_lasku_id,
  viivastyskorko,
  laskutuslisa,
  muistutusnumero
)
VALUES (3, 5,'2026-03-01',null,'Valmis','tuntityö','2026-03-15',false,NULL,0,0,0);

-- Tuntityöt yllä olevaan laskuun Masalle
INSERT INTO tuntityo (
  lasku_id,
  tyotyyppi_id,
  paivamaara,
  tunnit,
  alepros
)
VALUES 
(3,1,'2026-01-28',3,0),
(3,2,'2026-01-28',12,0);

-- Tarvikkeet yllä olevaan laskuun Masalle
INSERT INTO lasku_tarvike (lasku_id, tarvike_id, kpl, alepros)
VALUES
(3, 11, 3, 0),
(3, 13, 1, 0);
