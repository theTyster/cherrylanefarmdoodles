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
    transformUrl text PRIMARY KEY CHECK (LENGTH(transformUrl) <= 2000),
    hash text NOT NULL UNIQUE,
    alt text CHECK (LENGTH(alt) <= 140)
);

CREATE TABLE Headshots_Sm (
    transformUrl text PRIMARY KEY CHECK (LENGTH(transformUrl) <= 2000),
    hash text NOT NULL UNIQUE
);

CREATE TABLE Headshots_Lg (
    transformUrl text PRIMARY KEY CHECK (LENGTH(transformUrl) <= 2000),
    hash text NOT NULL UNIQUE
);

CREATE TABLE Litters (
    id integer PRIMARY KEY,
    dueDate date,
    litterBirthday date,
    applicantsInQueue integer NOT NULL CHECK (applicantsInQueue >= 0) DEFAULT 0,
    CONSTRAINT check_has_date CHECK ((litterBirthday IS NOT NULL AND dueDate IS NULL) OR (litterBirthday IS NULL AND dueDate IS NOT NULL) OR (litterBirthday IS NOT NULL AND dueDate IS NOT NULL AND UNIXEPOCH(dueDate) <= UNIXEPOCH(litterBirthday)))
);

CREATE TABLE Dogs (
    id integer PRIMARY KEY,
    gender text NOT NULL CHECK (gender IN ('M', 'F')),
    noseColor text CHECK (LENGTH(noseColor) <= 30),
    coat text CHECK (LENGTH(coat) <= 50),
    personality text CHECK (LENGTH(personality) <= 140),
    Headshots_Sm text,
    Headshots_Lg text,
    CONSTRAINT fk_dogs_headshot_small FOREIGN KEY (Headshots_Sm) REFERENCES Headshots_Sm (transformUrl) ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT fk_dogs_headshot_large FOREIGN KEY (Headshots_Lg) REFERENCES Headshots_Lg (transformUrl) ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE Adults (
    id integer PRIMARY KEY,
    dogId integer,
    adultName text NOT NULL CHECK (LENGTH(adultName) <= 16) DEFAULT 'Adult Doodle',
    breeder text NOT NULL CHECK (LENGTH(breeder) <= 50),
    adultBirthday date,
    eyeColor text CHECK (LENGTH(eyeColor) <= 16),
    activityStatus text NOT NULL CHECK (activityStatus IN ('Active', 'Retired', 'Break')) DEFAULT 'Active',
    favActivities text CHECK (LENGTH(favActivities) <= 140),
    weight integer CHECK (weight > 0),
    energyLevel text CHECK (energyLevel IN ('Low', 'Medium-low', 'Medium', 'Medium-high', 'High')),
    certifications text CHECK (certifications IN ('Embark', 'Embark-equivalent')),
    CONSTRAINT fk_adults_dog_id FOREIGN KEY (dogId) REFERENCES Dogs (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Puppies (
    id integer PRIMARY KEY,
    puppyName text CHECK (LENGTH(puppyName) <= 16),
    collarColor text CHECK (LENGTH(collarColor) <= 16),
    availability text NOT NULL CHECK (availability IN ('Available', 'Picked', 'Adopted', 'Held Back')) DEFAULT 'Available',
    dogId integer,
    litterId integer,
    CONSTRAINT fk_puppies_litter_id FOREIGN KEY (litterId) REFERENCES Litters (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_puppies_dog_id FOREIGN KEY (dogId) REFERENCES Dogs (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Families (
    id integer PRIMARY KEY,
    Group_Photos text,
    mother integer,
    father integer NOT NULL DEFAULT 4, -- Unrecorded Father
    litterId integer,
    CONSTRAINT fk_families_group_photo_id FOREIGN KEY (Group_Photos) REFERENCES Group_Photos (transformUrl) ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT fk_families_mom_id FOREIGN KEY (mother) REFERENCES Adults (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_families_dad_id FOREIGN KEY (father) REFERENCES Adults (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_families_litter_id FOREIGN KEY (litterId) REFERENCES Litters (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT unique_families UNIQUE (mother, father, litterId)
);

CREATE TABLE Dog_To_Group_Photos (
    id integer PRIMARY KEY,
    Group_Photos text,
    dogId integer,
    CONSTRAINT fk_di_image_id FOREIGN KEY (Group_Photos) REFERENCES Group_Photos (transformUrl) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_di_dog_id FOREIGN KEY (dogId) REFERENCES Dogs (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT no_duplicates UNIQUE (Group_Photos, dogId)
);

-- Commonly Queried
CREATE INDEX idx_dueDate ON Litters (dueDate);

CREATE INDEX idx_available_puppies ON Puppies (availability);

-- All Foreign Keys Except Images since they use a Natural Key.
CREATE INDEX idx_adults_dog_id ON Adults (dogId);

CREATE INDEX idx_puppies_litter_id ON Puppies (litterId);

CREATE INDEX idx_puppies_dog_id ON Puppies (dogId);

CREATE INDEX idx_families_mom_id ON Families (mother);

CREATE INDEX idx_families_dad_id ON Families (father);

CREATE INDEX idx_families_litter_id ON Families (litterId);

CREATE INDEX idx_di_dog_id ON Dog_To_Group_Photos (dogId);

