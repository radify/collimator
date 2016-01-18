CREATE DATABASE "collimator-integration-test";
\c "collimator-integration-test";

CREATE TABLE tasks
(
  id serial,
  title character varying(255) NOT NULL,
  description character varying(255),
  complete boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  owner integer NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE users
(
  id serial,
  username character varying(255) NOT NULL,
  password character varying(255) NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  PRIMARY KEY (id)
);

ALTER TABLE tasks ADD FOREIGN KEY (owner) REFERENCES users;
