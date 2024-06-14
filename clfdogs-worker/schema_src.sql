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
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  groupPhoto TEXT UNIQUE NOT NULL CHECK (LENGTH(groupPhoto) <= 2000)
);

CREATE TABLE Headshots_Sm (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  headshotSmall TEXT UNIQUE NOT NULL CHECK (LENGTH(headshotSmall) <= 2000)
);

CREATE TABLE Headshots_Lg (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  headshotLarge TEXT UNIQUE NOT NULL CHECK (LENGTH(headshotLarge) <= 2000)
);

/*}}}*/
-- Litters Table {{{
CREATE TABLE Litters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dueDate DATE NOT NULL,
  birthday DATE,
  goHomeDate DATE,
  constraint date_orders CHECK (UNIXEPOCH(dueDate) < UNIXEPOCH(birthday) < UNIXEPOCH(goHomeDate))
  constraint no_birthday_no_go_home CHECK ((birthday IS NULL AND goHomeDate is NULL) OR
                                           (birthday IS NOT NULL AND goHomeDate IS NOT NULL))
);

/*}}}*/
-- Dogs Table: Data relevant to all Dogs. {{{
CREATE TABLE Dogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gender TEXT NOT NULL CHECK (gender IN ('M', 'F')),
  noseColor TEXT NOT NULL CHECK (LENGTH(noseColor) <= 16),
  coatColor TEXT NOT NULL CHECK (LENGTH(coatColor) <= 16),
  personality TEXT CHECK (LENGTH(personality) <= 140),
  --FK
  headshotSmall INTEGER UNIQUE,
  headshotLarge INTEGER UNIQUE,
  constraint fk_dogs_headshot_small FOREIGN KEY (headshotSmall) REFERENCES Headshots_Sm (id) ON DELETE NO ACTION ON UPDATE CASCADE,
  constraint fk_dogs_headshot_large FOREIGN KEY (headshotLarge) REFERENCES Headshots_Lg (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE INDEX idx_dog_gender ON Dogs (gender);

/*}}}*/
-- Adult Dogs Table: One Adult ID is one Dog. {{{
CREATE TABLE Adults (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dogName TEXT NOT NULL CHECK (LENGTH(dogName) <= 16),
  breeder TEXT NOT NULL CHECK (LENGTH(breeder) <= 50),
  birthday DATE NOT NULL,
  eyeColor TEXT NOT NULL CHECK (LENGTH(eyeColor) <= 16),
  isRetired BOOLEAN NOT NULL CHECK (isRetired IN (0, 1)) DEFAULT 0,
  favoriteActivities TEXT CHECK (LENGTH(favoriteActivities) <= 140),
  weight INTEGER CHECK (weight > 0),
  energyLevel TEXT CHECK (energyLevel IN ('Low', 'Medium-low', 'Medium', 'Medium-high', 'High')),
  --FK
  dogId INTEGER,
  constraint fk_adults_dog_id FOREIGN KEY (dogId) REFERENCES Dogs (id) ON DELETE CASCADE ON UPDATE CASCADE
);

/*}}}*/
-- Puppies Table: All Puppies born. {{{
CREATE TABLE Puppies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  collarColor TEXT NOT NULL CHECK (LENGTH(collarColor) <= 16),
  isAvailable BOOLEAN CHECK (isAvailable IN (0, 1)) NOT NULL,
  --FK
  dogId INTEGER,
  litterId INTEGER,
  constraint fk_puppies_litter_id FOREIGN KEY (litterId) REFERENCES Litters (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_puppies_dog_id FOREIGN KEY (dogId) REFERENCES Dogs (id) ON DELETE CASCADE ON UPDATE CASCADE
);

/*}}}*/
-- Families Table Relationships between Adults, and Litters {{{
CREATE TABLE Families (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  --FK
  groupPhoto INTEGER,
  mother INTEGER,
  father INTEGER,
  litterId INTEGER,
  CONSTRAINT fk_families_group_photo_id FOREIGN KEY (groupPhoto) REFERENCES Group_Photos (id) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT fk_families_mom_id FOREIGN KEY (mother) REFERENCES Adults (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_families_dad_id FOREIGN KEY (father) REFERENCES Adults (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_families_litter_id FOREIGN KEY (litterId) REFERENCES Litters (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT unique_families UNIQUE (groupPhoto, mother, father, litterId)
);

/*}}}*/
-- Dog Group Photos Table{{{
CREATE TABLE Dog_Group_Photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  groupPhotoId INTEGER,
  dogId INTEGER,
  constraint fk_di_image_id FOREIGN KEY (groupPhotoId) REFERENCES Group_Photos (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_di_dog_id FOREIGN KEY (dogId) REFERENCES Dogs (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT no_duplicates UNIQUE (groupPhotoId, dogId)
);

/*}}}*/
/*}}}*/
-- INSERT STATEMENTS{{{
-- Image Table Inserts{{{
INSERT INTO Group_Photos (groupPhoto)
  VALUES
  ('https://example.com/group_img1.jpg'),
  ('https://example.com/group_img2.jpg'),
  ('https://example.com/group_img3.jpg'),
  ('https://example.com/group_img4.jpg'),
  ('https://example.com/group_img5.jpg'),
  ('https://example.com/group_img6.jpg'),
  ('https://example.com/group_img7.jpg'),
  ('https://example.com/group_img8.jpg');

INSERT INTO Headshots_Sm (headshotSmall)
  VALUES
  ('https://example.com/hs_sm_img1.jpg'),
  ('https://example.com/hs_sm_img2.jpg'),
  ('https://example.com/hs_sm_img3.jpg'),
  ('https://example.com/hs_sm_img4.jpg'),
  ('https://example.com/hs_sm_img5.jpg'),
  ('https://example.com/hs_sm_img6.jpg'),
  ('https://example.com/hs_sm_img7.jpg'),
  ('https://example.com/hs_sm_img8.jpg');

INSERT INTO Headshots_Lg (headshotLarge)
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
-- Litters Table{{{
INSERT INTO Litters (dueDate, birthday, goHomeDate)
  VALUES
  ('2023-03-13', '2024-06-01', '2025-05-29'),
  ('2023-01-19', '2024-06-10', '2025-04-22'),
  ('2025-06-15', NULL, NULL),
  ('2025-02-15', NULL, NULL);

/*}}}*/
-- Dogs Table{{{
INSERT INTO Dogs (gender, noseColor, coatColor, personality, headshotSmall, headshotLarge)
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
INSERT INTO Adults (dogName, dogId, breeder, birthday, eyeColor, isRetired, favoriteActivities, weight, energyLevel)
  VALUES
  ('Max', 1, 'Breeder A', '2018-05-12', 'Brown', 0, 'Playing fetch and running.', 25, 'High'),
  ('Bella', 2, 'Breeder B', '2019-02-28', 'Green', 1, 'Snuggling and sleeping.', 20, 'Medium'),
  ('Charlie', 3, 'Breeder A', '2017-11-15', 'Blue', 0, 'Chasing squirrels and swimming.', 30, 'High'),
  ('Lucy', 4, 'Breeder B', '2020-06-20', 'Brown', 0, 'Exploring and hiking.', 22, 'Medium-high');

/*}}}*/
-- Puppies Table{{{
INSERT INTO Puppies (collarColor, isAvailable, dogId, litterId)
  VALUES
  ('Red', 1, 1, 1),
  ('Blue', 1, 1, 2),
  ('Green', 0, 2, 1),
  ('Yellow', 1, 2, 2);

/*}}}*/
  -- Families Table{{{
  INSERT INTO Families (groupPhoto, mother, father, litterId)
    VALUES
    (1, 2, 1, 1),
    (2, 2, 1, 2),
    (3, 4, 3, 3),
    (4, 4, 3, 4);

/*}}}*/
-- Dog Group Photos Table{{{
INSERT INTO Dog_Group_Photos (groupPhotoId, dogId)
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
