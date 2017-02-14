CREATE DATABASE "collimator-integration-test";
\c "collimator-integration-test";

CREATE TABLE tasks
(
  id serial,
  title character varying(255) NOT NULL,
  description character varying(255),
  complete boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  owner integer NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE users
(
  id serial,
  username character varying(255) NOT NULL,
  password character varying(255) NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE VIEW completed_tasks AS
SELECT
  users.id,
  users.username,
  COUNT(tasks.*) AS completed
FROM tasks
INNER JOIN users
  ON users.id = tasks.owner
WHERE
  tasks.complete = true
GROUP BY
  users.id;

ALTER TABLE tasks ADD FOREIGN KEY (owner) REFERENCES users;
