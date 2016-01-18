#!/bin/sh -e

trap 'psql -f teardown.sql' EXIT

psql -f setup.sql
npm install pg-promise deep-diff
node index.js
