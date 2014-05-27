-- Created by certen on 29/04/2014.
ALTER TABLE properties DROP PRIMARY KEY, ADD PRIMARY KEY(id, price);

ALTER TABLE properties MODIFY price varchar(50) COLLATE utf8_unicode_ci NOT NULL;
ALTER TABLE properties MODIFY title varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL;

