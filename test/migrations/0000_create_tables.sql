DROP TABLE IF EXISTS Dog_To_Group_Photos;

DROP TABLE IF EXISTS Families;

DROP TABLE IF EXISTS Puppies;

DROP TABLE IF EXISTS Adults;

DROP TABLE IF EXISTS Dogs;

DROP TABLE IF EXISTS Litters;

DROP TABLE IF EXISTS Headshots_Lg;

DROP TABLE IF EXISTS Headshots_Sm;

DROP TABLE IF EXISTS Group_Photos;

CREATE TABLE Group_Photos (
    transformUrl TEXT PRIMARY KEY CHECK (LENGTH(transformUrl) <= 2000),
    hash text NOT NULL
);

CREATE TABLE Headshots_Sm (
    transformUrl TEXT PRIMARY KEY CHECK (LENGTH(transformUrl) <= 2000),
    hash text NOT NULL
);

CREATE TABLE Headshots_Lg (
    transformUrl TEXT PRIMARY KEY CHECK (LENGTH(transformUrl) <= 2000),
    hash text NOT NULL
);

CREATE TABLE Litters (
    id integer PRIMARY KEY,
    dueDate date NOT NULL,
    birthday date,
    applicantsInQueue integer NOT NULL CHECK (applicantsInQueue <= 0) DEFAULT 0
);

CREATE TABLE Dogs (
    id integer PRIMARY KEY,
    gender text NOT NULL CHECK (gender IN ('M', 'F')),
    noseColor text NOT NULL CHECK (LENGTH(noseColor) <= 16),
    coatColor text NOT NULL CHECK (LENGTH(coatColor) <= 16),
    personality text CHECK (LENGTH(personality) <= 140),
    Headshots_Sm text UNIQUE,
    Headshots_Lg text UNIQUE,
    CONSTRAINT fk_dogs_headshot_small FOREIGN KEY (Headshots_Sm) REFERENCES Headshots_Sm (transformUrl) ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT fk_dogs_headshot_large FOREIGN KEY (Headshots_Lg) REFERENCES Headshots_Lg (transformUrl) ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE Adults (
    id integer PRIMARY KEY,
    adultName text NOT NULL CHECK (LENGTH(adultName) <= 16),
    breeder text NOT NULL CHECK (LENGTH(breeder) <= 50),
    birthday date NOT NULL,
    eyeColor text NOT NULL CHECK (LENGTH(eyeColor) <= 16),
    isRetired boolean NOT NULL CHECK (isRetired IN (0, 1)) DEFAULT 0,
    about text CHECK (LENGTH(about) <= 140),
    weight integer CHECK (weight > 0),
    energyLevel text CHECK (energyLevel IN ('Low', 'Medium-low', 'Medium', 'Medium-high', 'High')),
    dogId integer,
    CONSTRAINT fk_adults_dog_id FOREIGN KEY (dogId) REFERENCES Dogs (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Puppies (
    id integer PRIMARY KEY,
    puppyName text CHECK (LENGTH(puppyName) <= 16),
    collarColor text NOT NULL CHECK (LENGTH(collarColor) <= 16),
    isAvailable boolean CHECK (isAvailable IN (0, 1)) NOT NULL,
    dogId integer,
    litterId integer,
    CONSTRAINT fk_puppies_litter_id FOREIGN KEY (litterId) REFERENCES Litters (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_puppies_dog_id FOREIGN KEY (dogId) REFERENCES Dogs (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Families (
    id integer PRIMARY KEY,
    Group_Photos text,
    mother integer,
    father integer,
    litterId integer,
    CONSTRAINT fk_families_group_photo_id FOREIGN KEY (Group_Photos) REFERENCES Group_Photos (transformUrl) ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT fk_families_mom_id FOREIGN KEY (mother) REFERENCES Adults (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_families_dad_id FOREIGN KEY (father) REFERENCES Adults (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_families_litter_id FOREIGN KEY (litterId) REFERENCES Litters (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT unique_families UNIQUE (Group_Photos, mother, father, litterId)
);

CREATE TABLE Dog_To_Group_Photos (
    id integer PRIMARY KEY,
    Group_Photos text,
    dogId integer,
    CONSTRAINT fk_di_image_id FOREIGN KEY (Group_Photos) REFERENCES Group_Photos (transformUrl) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_di_dog_id FOREIGN KEY (dogId) REFERENCES Dogs (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT no_duplicates UNIQUE (Group_Photos, dogId)
);

CREATE INDEX idx_puppies ON Puppies (litterId);

CREATE INDEX idx_families ON Families (mother, father, litterId);

CREATE INDEX idx_adults ON Adults (adultName);

