CREATE DATABASE "collimator-integration-test";
\c "collimator-integration-test";

CREATE TABLE tasks
(
  id serial,
  title character varying(255) NOT NULL,
  description character varying(255),
  status text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  owner integer NOT NULL,
  PRIMARY KEY (id),

  CONSTRAINT status_is_valid CHECK (
    status = any(
      array['new', 'started', 'complete']
    )
  ),

  CONSTRAINT updated_at_in_future CHECK (
    updated_at > NOW()
  )
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

CREATE TABLE task_watchers
(
  user_id integer NOT NULL,
  task_id integer NOT NULL,
  PRIMARY key (user_id, task_id)
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
  tasks.status = 'complete'
GROUP BY
  users.id;

ALTER TABLE tasks ADD FOREIGN KEY (owner) REFERENCES users;
ALTER TABLE task_watchers ADD FOREIGN KEY (user_id) REFERENCES users;
ALTER TABLE task_watchers ADD FOREIGN KEY (task_id) REFERENCES tasks;
