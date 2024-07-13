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

CREATE TABLE Litters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dueDate DATE NOT NULL,
  birthday DATE,
  applicantsInQueue INTEGER NOT NULL CHECK (applicantsInQueue <= 0) DEFAULT 0
);

CREATE TABLE Dogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gender TEXT NOT NULL CHECK (gender IN ('M', 'F')),
  noseColor TEXT NOT NULL CHECK (LENGTH(noseColor) <= 16),
  coatColor TEXT NOT NULL CHECK (LENGTH(coatColor) <= 16),
  personality TEXT CHECK (LENGTH(personality) <= 140),
  headshotSmall INTEGER UNIQUE,
  headshotLarge INTEGER UNIQUE,
  CONSTRAINT fk_dogs_headshot_small FOREIGN KEY (headshotSmall) REFERENCES Headshots_Sm (id) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT fk_dogs_headshot_large FOREIGN KEY (headshotLarge) REFERENCES Headshots_Lg (id) ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE Adults (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  adultName TEXT NOT NULL CHECK (LENGTH(adultName) <= 16),
  breeder TEXT NOT NULL CHECK (LENGTH(breeder) <= 50),
  birthday DATE NOT NULL,
  eyeColor TEXT NOT NULL CHECK (LENGTH(eyeColor) <= 16),
  isRetired BOOLEAN NOT NULL CHECK (isRetired IN (0, 1)) DEFAULT 0,
  about TEXT CHECK (LENGTH(about) <= 140),
  weight INTEGER CHECK (weight > 0),
  energyLevel TEXT CHECK (energyLevel IN ('Low', 'Medium-low', 'Medium', 'Medium-high', 'High')),
  dogId INTEGER,
  CONSTRAINT fk_adults_dog_id FOREIGN KEY (dogId) REFERENCES Dogs (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Puppies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  puppyName TEXT CHECK (LENGTH(puppyName) <= 16),
  collarColor TEXT NOT NULL CHECK (LENGTH(collarColor) <= 16),
  isAvailable BOOLEAN CHECK (isAvailable IN (0, 1)) NOT NULL,
  dogId INTEGER,
  litterId INTEGER,
  CONSTRAINT fk_puppies_litter_id FOREIGN KEY (litterId) REFERENCES Litters (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_puppies_dog_id FOREIGN KEY (dogId) REFERENCES Dogs (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Families (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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

CREATE TABLE Dog_To_Group_Photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  groupPhotoId INTEGER,
  dogId INTEGER,
  CONSTRAINT fk_di_image_id FOREIGN KEY (groupPhotoId) REFERENCES Group_Photos (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_di_dog_id FOREIGN KEY (dogId) REFERENCES Dogs (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT no_duplicates UNIQUE (groupPhotoId, dogId)
);

CREATE INDEX idx_puppies ON Puppies (litterId);

CREATE INDEX idx_families ON Families (mother, litterId);

