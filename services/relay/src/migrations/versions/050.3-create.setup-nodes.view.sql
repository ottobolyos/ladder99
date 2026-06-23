-- This migration creates a view named `setup.nodes` from the `nodes` hypertable, so that the `anon_user` user is able to select (thus read) the device metadata which is required so that we can get device names via PostgREST

CREATE OR REPLACE VIEW setup.nodes AS
SELECT
	node_id as device_id,
	-- Convert PascalCase to Capitalized Each Word Case
	trim(initcap(regexp_replace(props ->> 'shortPath'::TEXT, '([A-Z])', ' \1', 'g'))) AS device_name,
	props
FROM raw.nodes
WHERE
	props ->> 'node_type'::TEXT = 'Device'::TEXT
	AND props ->> 'shortPath' != 'Host';

GRANT SELECT ON setup.nodes TO anon_user;