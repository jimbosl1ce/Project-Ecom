DROP DATABASE if exists jimmy;
CREATE DATABASE jimmy;

CREATE DATABASE jimmy;
DROP TABLE IF EXISTS skus;
DROP TABLE IF EXISTS features;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS styles;
DROP TABLE IF EXISTS product;

-------table creation-------

CREATE TABLE product (
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100),
  slogan VARCHAR(300),
  description VARCHAR(500),
  category VARCHAR(150),
  default_price VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
);

CREATE TABLE styles (
  id INT GENERATED ALWAYS AS IDENTITY,
  productId INT,
  name VARCHAR(100),
  sale_price VARCHAR(10000),
  original_price VARCHAR(10),
  default_style BOOLEAN,
  PRIMARY KEY(id),
  CONSTRAINT fk_product
    FOREIGN KEY(productId) REFERENCES product(id)
);

CREATE TABLE photos (
  id INT GENERATED ALWAYS AS IDENTITY,
  styleId INT,
  url VARCHAR(300),
  thumbnail_url VARCHAR,
  CONSTRAINT fk_style
    FOREIGN KEY(styleId) REFERENCES styles(id)
);

CREATE TABLE features (
  id INT GENERATED ALWAYS AS IDENTITY,
  product_id INT,
  feature VARCHAR(100),
  value VARCHAR(100),
  CONSTRAINT fk_product
    FOREIGN KEY(product_id) REFERENCES product(id)
);

CREATE TABLE skus (
  id INT GENERATED ALWAYS AS IDENTITY,
  styleId INT,
  size VARCHAR (10),
  quantity INT,
  CONSTRAINT fk_style
    FOREIGN KEY(styleId) REFERENCES styles(id)
);

CREATE TABLE related (
  id SERIAL,
  current_product_id INT NOT NULL,
  related_product_id INT NOT NULL
);

-------csv upload-------

\set localpath `pwd`'/csv-data/product.csv'
COPY product(id, name, slogan, description, category, default_price)
FROM :'localpath'
DELIMITER ','
CSV HEADER;

\set localpath `pwd`'/csv-data/styles.csv'
COPY styles(id, productId, name, sale_price, original_price, default_style)
FROM :'localpath'
DELIMITER ','
CSV HEADER;

\set localpath `pwd`'/csv-data/photos.csv'
COPY photos(id, styleId, url, thumbnail_url)
FROM :'localpath'
DELIMITER ','
CSV HEADER;


\set localpath `pwd`'/csv-data/features.csv'
COPY features(id, product_id, feature, value)
FROM :'localpath'
DELIMITER ','
CSV HEADER;

\set localpath `pwd`'/csv-data/skus.csv'
COPY skus(id, styleId, size, quantity)
FROM :'localpath'
DELIMITER ','
CSV HEADER;

CREATE INDEX idx_styles_id ON styles(productId);
CREATE INDEX idx_photos_id ON photos(styleId);
CREATE INDEX idx_features_id ON features(product_id);
CREATE INDEX idx_skus_id ON skus(styleId);