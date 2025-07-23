CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
                          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                          name varchar(100) not null ,
                          price int not null
);
