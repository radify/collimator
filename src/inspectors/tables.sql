SELECT
  t.table_name AS name,
  ccu.column_name AS "primaryKey"

FROM information_schema.tables AS t

JOIN information_schema.table_constraints AS tc
ON tc.table_name = t.table_name AND tc.constraint_type = 'PRIMARY KEY'

JOIN information_schema.constraint_column_usage AS ccu
ON ccu.constraint_name = tc.constraint_name

WHERE t.table_schema = 'public';
