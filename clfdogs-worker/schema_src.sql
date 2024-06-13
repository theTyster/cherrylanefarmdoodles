/* NOTE: {{{
 * ⚠ADVISORY⚠
 * D1 SQLite schemas cannot contain comments. It jacks everything up.
 * To fix this, install pgformatter and use this alias to output a cleaned up
 * file:
 *   ´alias format='pg_format --nocomment --output schema.sql schema_src.sql'´
 *
 * Optimization guidelines: See https://www.sqlite.org/optoverview.html
 * }}}*/
-- DROP TABLES {{{
-- Chlidren Tables First
DROP TABLE IF EXISTS Dog_Group_Photos;

DROP TABLE IF EXISTS Families;

DROP TABLE IF EXISTS Adults;

DROP TABLE IF EXISTS Puppies;

DROP TABLE IF EXISTS Dogs;

-- Parent Tables

DROP TABLE IF EXISTS Group_Photos;

DROP TABLE IF EXISTS Headshots_Sm;

DROP TABLE IF EXISTS Headshots_Lg;

DROP TABLE IF EXISTS Pregnancies;

DROP TABLE IF EXISTS Litters;

pragma table_list;

/*}}}*/
-- CREATE TABLES{{{
-- Image Tables {{{
CREATE TABLE Group_Photos (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  URL TEXT UNIQUE NOT NULL CHECK (LENGTH(URL) <= 2000)
);

CREATE TABLE Headshots_Sm (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  URL TEXT UNIQUE NOT NULL CHECK (LENGTH(URL) <= 2000)
);

CREATE TABLE Headshots_Lg (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  URL TEXT UNIQUE NOT NULL CHECK (LENGTH(URL) <= 2000)
);

/*}}}*/
-- Pregnancies Table: Data related to all pregnancies {{{
CREATE TABLE Pregnancies (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  DUE_DATE DATE,
  HAS_DELIVERED BOOLEAN CHECK (HAS_DELIVERED IN (0, 1)) NOT NULL DEFAULT 0,
  BIRTHDAY DATE,
  CONSTRAINT due_date_before_birthday CHECK (UNIXEPOCH(DUE_DATE) < UNIXEPOCH(BIRTHDAY))
);

/*}}}*/
-- Litter Table: Collections of Puppies. {{{
CREATE TABLE Litters (
  ID INTEGER PRIMARY KEY AUTOINCREMENT
);

/*}}}*/
-- Dogs Table: Data relevant to all Dogs. {{{
CREATE TABLE Dogs (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  GENDER TEXT NOT NULL CHECK (GENDER IN ('M', 'F')),
  NOSE_COLOR TEXT NOT NULL CHECK (LENGTH(NOSE_COLOR) <= 16),
  COAT_COLOR TEXT NOT NULL CHECK (LENGTH(COAT_COLOR) <= 16),
  PERSONALITY TEXT CHECK (LENGTH(PERSONALITY) <= 140),
  --FK
  HEADSHOT_SMALL INTEGER UNIQUE,
  HEADSHOT_LARGE INTEGER UNIQUE,
  CONSTRAINT fk_dogs_headshot_small FOREIGN KEY (HEADSHOT_SMALL) REFERENCES Headshots_Sm (ID) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT fk_dogs_headshot_large FOREIGN KEY (HEADSHOT_LARGE) REFERENCES Headshots_Lg (ID) ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE INDEX idx_dog_gender ON Dogs (GENDER);

/*}}}*/
-- Adult Dogs Table: One Adult ID is one Dog. {{{
CREATE TABLE Adults (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  DOG_NAME TEXT UNIQUE NOT NULL CHECK (LENGTH(DOG_NAME) <= 16),
  BREEDER TEXT NOT NULL CHECK (LENGTH(BREEDER) <= 50),
  BIRTHDAY DATE NOT NULL,
  EYE_COLOR TEXT NOT NULL CHECK (LENGTH(EYE_COLOR) <= 16),
  IS_RETIRED BOOLEAN CHECK (IS_RETIRED IN (0, 1)) NOT NULL DEFAULT 0,
  FAVORITE_ACTIVITIES TEXT CHECK (LENGTH(FAVORITE_ACTIVITIES) <= 140),
  WEIGHT INTEGER CHECK (WEIGHT > 0),
  ENERGY_LEVEL TEXT CHECK (ENERGY_LEVEL IN ('Low', 'Medium-low', 'Medium', 'Medium-high', 'High')),
  --FK
  DOG_ID INTEGER,
  CONSTRAINT fk_adults_dog_id FOREIGN KEY (DOG_ID) REFERENCES Dogs (ID) ON DELETE CASCADE ON UPDATE CASCADE
);

/*}}}*/
-- Puppies Table: All Puppies born. {{{
CREATE TABLE Puppies (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  COLLAR_COLOR TEXT NOT NULL CHECK (LENGTH(COLLAR_COLOR) <= 16),
  IS_AVAILABLE BOOLEAN CHECK (IS_AVAILABLE IN (0, 1)) NOT NULL,
  GO_HOME_DATE DATE NOT NULL,
  --FK
  DOG_ID INTEGER,
  LITTER_ID INTEGER,
  CONSTRAINT fk_puppies_litter_id FOREIGN KEY (LITTER_ID) REFERENCES Litters (ID) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_puppies_dog_id FOREIGN KEY (DOG_ID) REFERENCES Dogs (ID) ON DELETE CASCADE ON UPDATE CASCADE
);

/*}}}*/
-- Families Table Relationships between Adults, Litters, and Pregnancies {{{
CREATE TABLE Families (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  --FK
  GROUP_PHOTO INTEGER,
  MOTHER INTEGER,
  FATHER INTEGER,
  PREGNANCY_ID INTEGER,
  LITTER_ID INTEGER,
  CONSTRAINT fk_families_group_photo_id FOREIGN KEY (GROUP_PHOTO) REFERENCES Group_Photos (ID) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT fk_families_mom_id FOREIGN KEY (MOTHER) REFERENCES Adults (ID) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_families_dad_id FOREIGN KEY (FATHER) REFERENCES Adults (ID) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_families_pregnancy_id FOREIGN KEY (PREGNANCY_ID) REFERENCES Pregnancies (ID) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT fk_families_litter_id FOREIGN KEY (LITTER_ID) REFERENCES Litters (ID) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT unique_families UNIQUE (GROUP_PHOTO, MOTHER, FATHER, LITTER_ID, PREGNANCY_ID)
);

/*}}}*/
-- Dog Group Photos Table{{{
CREATE TABLE Dog_Group_Photos (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  GROUP_PHOTO_ID INTEGER,
  DOG_ID INTEGER,
  CONSTRAINT fk_di_image_id FOREIGN KEY (GROUP_PHOTO_ID) REFERENCES Group_Photos (ID) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_di_dog_id FOREIGN KEY (DOG_ID) REFERENCES Dogs (ID) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT no_duplicates UNIQUE (GROUP_PHOTO_ID, DOG_ID)
);

/*}}}*/
/*}}}*/
-- INSERT STATEMENTS{{{
-- Image Table Inserts{{{
INSERT INTO Group_Photos (URL)
  VALUES
  ('https://example.com/group_img1.jpg'),
  ('https://example.com/group_img2.jpg'),
  ('https://example.com/group_img3.jpg'),
  ('https://example.com/group_img4.jpg'),
  ('https://example.com/group_img5.jpg'),
  ('https://example.com/group_img6.jpg'),
  ('https://example.com/group_img7.jpg'),
  ('https://example.com/group_img8.jpg');

INSERT INTO Headshots_Sm (URL)
  VALUES
  ('https://example.com/hs_sm_img1.jpg'),
  ('https://example.com/hs_sm_img2.jpg'),
  ('https://example.com/hs_sm_img3.jpg'),
  ('https://example.com/hs_sm_img4.jpg'),
  ('https://example.com/hs_sm_img5.jpg'),
  ('https://example.com/hs_sm_img6.jpg'),
  ('https://example.com/hs_sm_img7.jpg'),
  ('https://example.com/hs_sm_img8.jpg');

INSERT INTO Headshots_Lg (URL)
  VALUES
  ('https://example.com/hs_lg_img1.jpg'),
  ('https://example.com/hs_lg_img2.jpg'),
  ('https://example.com/hs_lg_img3.jpg'),
  ('https://example.com/hs_lg_img4.jpg'),
  ('https://example.com/hs_lg_img5.jpg'),
  ('https://example.com/hs_lg_img6.jpg'),
  ('https://example.com/hs_lg_img7.jpg'),
  ('https://example.com/hs_lg_img8.jpg');
/*}}}*/
-- Pregnancies Table{{{
INSERT INTO Pregnancies (DUE_DATE, HAS_DELIVERED, BIRTHDAY)
  VALUES
  ('2023-03-13', 1, '2024-05-29'),
  ('2023-01-19', 1, '2024-04-22'),
  ('2025-06-15', 0, NULL),
  ('2025-02-15', 0, NULL);

/*}}}*/
-- Litters Table {{{
INSERT INTO Litters DEFAULT VALUES;
INSERT INTO Litters DEFAULT VALUES;
INSERT INTO Litters DEFAULT VALUES;
INSERT INTO Litters DEFAULT VALUES;
/*}}}*/
-- Dogs Table{{{
INSERT INTO Dogs (GENDER, NOSE_COLOR, COAT_COLOR, PERSONALITY, HEADSHOT_SMALL, HEADSHOT_LARGE)
  VALUES
  ('M', 'Black', 'Brown', 'Friendly and energetic.', 1, 1),
  ('F', 'Brown', 'White', 'Calm and affectionate.', 2, 2),
  ('M', 'White', 'Black', 'Playful and loyal.', 3, 3),
  ('F', 'Brown', 'Black', 'Intelligent and curious.', 4, 4),
  -- Puppies
  ('F', 'Brown', 'Black', 'Intelligent and curious.', 8, 8),
  ('M', 'White', 'Black', 'Playful and loyal.', 5, 5),
  ('F', 'Brown', 'White', 'Calm and affectionate.', 6, 6),
  ('M', 'White', 'Black', 'Intelligent and loyal.', 7, 7);

  /*}}}*/
-- Adults Table{{{
INSERT INTO Adults (DOG_NAME, DOG_ID, BREEDER, BIRTHDAY, EYE_COLOR, IS_RETIRED, FAVORITE_ACTIVITIES, WEIGHT, ENERGY_LEVEL)
  VALUES
  ('Max', 1, 'Breeder A', '2018-05-12', 'Brown', 0, 'Playing fetch and running.', 25, 'High'),
  ('Bella', 2, 'Breeder B', '2019-02-28', 'Green', 1, 'Snuggling and sleeping.', 20, 'Medium'),
  ('Charlie', 3, 'Breeder A', '2017-11-15', 'Blue', 0, 'Chasing squirrels and swimming.', 30, 'High'),
  ('Lucy', 4, 'Breeder B', '2020-06-20', 'Brown', 0, 'Exploring and hiking.', 22, 'Medium-high');

/*}}}*/
-- Puppies Table{{{
INSERT INTO Puppies (COLLAR_COLOR, IS_AVAILABLE, GO_HOME_DATE, DOG_ID, LITTER_ID)
  VALUES
  ('Red', 1, '2025-06-01', 1, 1),
  ('Blue', 1, '2025-06-10', 1, 2),
  ('Green', 0, '2025-05-25', 2, 1),
  ('Yellow', 1, '2025-06-05', 2, 2);

/*}}}*/
  -- Families Table{{{
  INSERT INTO Families (GROUP_PHOTO, MOTHER, FATHER, PREGNANCY_ID, LITTER_ID)
    VALUES
    (1, 2, 1, 1, 1),
    (2, 2, 1, 2, 2),
    (3, 4, 3, 3, 3),
    (4, 4, 3, 4, 4);

/*}}}*/
-- Dog Group Photos Table{{{
INSERT INTO Dog_Group_Photos (GROUP_PHOTO_ID, DOG_ID)
  VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5),
  (6, 6),
  (7, 7),
  (8, 8),
  (1, 8),
  (3, 6),
  (2, 4),
  (3, 8),
  (2, 6);

/*}}}*/
/*}}}*/
-- vim: foldmethod=marker
