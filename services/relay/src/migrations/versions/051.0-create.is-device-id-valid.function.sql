-- Create the trigger function to check whether device ID is defined in `nodes`
CREATE OR REPLACE FUNCTION is_device_id_valid()
RETURNS TRIGGER AS $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM setup.nodes
		WHERE
			device_id = NEW.device_id
	) THEN
		RAISE EXCEPTION 'device_id % does not exist in raw.nodes table with node_type Device', NEW.device_id;
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;