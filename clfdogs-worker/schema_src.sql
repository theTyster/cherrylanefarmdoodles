/*
 * Object Validation:
 * Whenever content is Created, Updated, or Deleted from the site's 'back-end'
 * a series of tests need to run to ensure the following:
 *   - All individual images should be square.
 *   - Duplicate photo checking.
 *   - A dog can not be simultaneously "expecting" and "delivered".
 *   - All dates except Birthdays should be in the future.
 *   - A dog's weight should be a positive integer.
 *
 * This could potentially be done client-side.
 * As many options as possible should be selected from a menu instead of
 * typed into an input box.
 * Keep in mind that this form will only be used by Jenny. It should be
 * attractive, but doesn't need to be perfectly accessible. Do consider that
 * Oma and a select few others may use it to help.
 *
 *
 * ⚠ADVISORY⚠
 * D1 SQLite schemas cannot contain comments. It jacks everything up.
 * To fix this, install pgformatter and use this alias to output a cleaned up
 * file:
 *   ´alias format='pg_format --nocomment --output schema.sql schema_src.sql'´
 */

DROP TABLE IF EXISTS Dogs;

DROP TABLE IF EXISTS MOMS;

DROP TABLE IF EXISTS Litters;

DROP TABLE IF EXISTS Images;

DROP TABLE IF EXISTS DIL;

-- Dogs Table: For Dad dogs and Puppies
CREATE TABLE Dogs (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,                                     -- All
  BIRTHDAY DATE NOT NULL,                                                   -- All
  BREEDER TEXT NOT NULL,                                                    -- All
  DOG_NAME TEXT,                                                            -- All
  EYE_COLOR TEXT,                                                           -- All
  IMAGE_CIRCLE TEXT NOT NULL,                                               -- All
  IMAGE_SQUARE TEXT,                                                        -- All
  LITTER_ID INTEGER NOT NULL,                                               -- All
  NOSE_COLOR TEXT NOT NULL,                                                 -- All

  COLLAR_COLOR TEXT,                                                        -- Puppies
  IS_AVAILABLE BOOLEAN CHECK (IS_AVAILABLE IN (0, 1)) NOT NULL,             -- Puppies

  FAVORITE_ACTIVITIES TEXT,                                                 -- Moms/Dads
  IS_RETIRED BOOLEAN CHECK (IS_RETIRED IN (0, 1)),                          -- Moms/Dads
  MATCHED_WITH INTEGER,                                                     -- Moms/Dads
  PAGE_LINK TEXT,                                                           -- Moms/Dads
  PERSONALITY TEXT,                                                         -- Moms/Dads
  WEIGHT INTEGER CHECK (WEIGHT > 0),                                        -- Moms/Dads
  ENERGY_LEVEL TEXT CHECK (ENERGY_LEVEL IN ('Low',
                                            'Medium-low',
                                            'Medium',
                                            'Medium-high',
                                            'High')),                       -- Moms/Dads
  CONSTRAINT unique_puppy_collars UNIQUE (LITTER_ID, COLLAR_COLOR),         -- Puppies
  CONSTRAINT check_is_retired CHECK (
    (IS_RETIRED = 1 AND IS_AVAILABLE = 0) OR
    (IS_RETIRED = 0)
  ),
  CONSTRAINT check_is_available CHECK (
    (IS_AVAILABLE = 1 AND COLLAR_COLOR IS NOT NULL AND DOG_NAME IS NULL) OR
    (IS_AVAILABLE = 0)                                                      --Puppies
  ),
  FOREIGN KEY (MATCHED_WITH) REFERENCES Dogs (ID),                          -- Moms/Dads
  FOREIGN KEY (LITTER_ID) REFERENCES Litters (ID) ON DELETE CASCADE         -- Puppies
);

-- Mom Dogs Table: Dedicated table for Mom dogs
CREATE TABLE Moms (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  MOM_NAME TEXT NOT NULL UNIQUE,
  HAS_DELIVERED BOOLEAN CHECK (HAS_DELIVERED IN (0, 1)) NOT NULL,
  IS_EXPECTING BOOLEAN CHECK (IS_EXPECTING IN (0, 1)) NOT NULL,
  FOREIGN KEY (MOM_NAME) REFERENCES Dogs(DOG_NAME),
  CONSTRAINT check_has_delivered CHECK (
    (HAS_DELIVERED = 1 AND IS_EXPECTING = 0) OR
    (HAS_DELIVERED = 0 AND IS_EXPECTING = 1)
  )
);

-- Index for Mom dogs to optimize queries
CREATE INDEX IF NOT EXISTS idx_moms_dog_id ON Moms(MOM_NAME);

-- Images Table
CREATE TABLE Images (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  URL TEXT UNIQUE NOT NULL,
  IS_GROUP_PHOTO BOOLEAN
);

-- Dog Image Links Table
CREATE TABLE DIL (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  IMAGE_ID INTEGER NOT NULL,
  DOG_ID INTEGER NOT NULL,
  LITTER_ID INTEGER NOT NULL,
  FOREIGN KEY (IMAGE_ID) REFERENCES Images(ID),
  FOREIGN KEY (DOG_ID) REFERENCES Dogs(ID),
  FOREIGN KEY (LITTER_ID) REFERENCES Litters(ID)
);
