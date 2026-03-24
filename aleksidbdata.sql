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
    paivamaara DATE,
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


INSERT INTO asiakas (Nimi, Osoite) VALUES ('Jaska Hosunen', 'Susimetsä');
INSERT INTO asiakas (Nimi, Osoite) VALUES ('Lissu Jokinen', 'Nurmitie');
INSERT INTO asiakas (Nimi, Osoite) VALUES ('Masa Näsänen', 'Masalantie');

INSERT INTO tyokohde (asiakas_id, nimi, osoite) VALUES (1,'Mökki', 'Susimetsä');
INSERT INTO tyokohde (asiakas_id, nimi, osoite) VALUES (1, 'Omakotitalo', 'Nurmitie');
INSERT INTO tyokohde (asiakas_id, nimi, osoite) VALUES (2, 'Maja', 'Huitsinneva');
INSERT INTO tyokohde (asiakas_id, nimi, osoite) VALUES (3, 'Asunto', 'Puotonkorpi');

INSERT INTO tyotyyppi (nimi, hinta, hinta_pvm) VALUES ('Suunnittelu', 55, '01-01-2026');
INSERT INTO tyotyyppi (nimi, hinta, hinta_pvm) VALUES ('Työ', 45, '01-01-2026');
INSERT INTO tyotyyppi (nimi, hinta, hinta_pvm) VALUES ('Aputyö', 35, '01-01-2026');

INSERT INTO toimittaja (nimi, osoite) VALUES
('ABB Oy', 'Niittylänkuja 2, 00320 Helsinki, Finland'),
('Schneider Electric Finland Oy', 'Keilaranta 1, 02150 Espoo, Finland'),
('Hager Oy', 'Sammontie 7, 00370 Helsinki, Finland'),
('Philips Finland Oy', 'Keilaranta 7, 02150 Espoo, Finland'),
('Siemens Oy', 'Tekniikantie 12, 02150 Espoo, Finland');

INSERT INTO tarvike (toimittaja_id, nimi, merkki, alv, yksikko, myyntihinta, sisaanostohinta, varastotilanne)
VALUES
(1, 'Johdonsuoja', 'ABB', 24.00, 'kpl', 35.90, 28.50, 50),
(2, 'Pistorasia', 'Schneider', 24.00, 'kpl', 12.50, 9.80, 120),
(5, 'Kytkin', 'Hager', 24.00, 'kpl', 7.90, 5.50, 200),
(3, 'Led-valaisin 12W', 'Philips', 24.00, 'kpl', 29.90, 22.50, 75),
(2, 'Kaapeli 3x2.5mm²', 'Nexans', 24.00, 'm', 1.50, 1.10, 1000),
(4, 'Sulake 16A', 'Siemens', 24.00, 'kpl', 3.50, 2.50, 300),
(5, 'Liitäntälaite LED', 'Tridonic', 24.00, 'kpl', 18.90, 14.20, 60),
(2, 'Kytkinpistorasia combo', 'Schneider', 24.00, 'kpl', 22.50, 17.80, 90),
(1, 'Kaapelikiinnike 10mm', 'ABB', 24.00, 'kpl', 0.35, 0.20, 500),
(3, 'Johdinsarja 5m', 'Philips', 24.00, 'kpl', 15.90, 12.50, 80);