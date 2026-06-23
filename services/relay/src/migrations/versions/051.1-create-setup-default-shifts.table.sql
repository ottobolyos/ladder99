-- This migration creates the `setup.default_shifts` table used to store the default schedule (shifts) for each day of the work per machine

-- Create the `setup.default_shifts`
-- 	drop table setup.shifts cascade;
CREATE TABLE IF NOT EXISTS setup.default_shifts (
	id SERIAL,
	device_id INT NOT NULL,
	name VARCHAR(50) NOT NULL,
	dow INTEGER NOT NULL,
	start_time TIME(0) NOT NULL,
	end_time TIME(0) NOT NULL
);

-- Create a primary key
ALTER TABLE setup.default_shifts
	ADD CONSTRAINT default_shifts_pkey PRIMARY KEY (id);

-- Add a foreign key constraint for `device_id`
ALTER TABLE setup.default_shifts
ADD CONSTRAINT fk_device_id FOREIGN KEY (device_id)
	REFERENCES raw.nodes (node_id) MATCH SIMPLE
	ON UPDATE CASCADE
	ON DELETE CASCADE;

-- Create constraints
ALTER TABLE setup.default_shifts
	ADD CONSTRAINT shifts_dow_check
		CHECK ((dow >= 0) AND (dow <= 6));

-- Create a unique index
CREATE UNIQUE INDEX IF NOT EXISTS unique_setup_default_shifts_device_dow_start
	ON setup.default_shifts (device_id, dow, start_time);

-- Create indices
CREATE INDEX idx_setup_default_shifts_ts_device
	ON setup.default_shifts (id, device_id, dow, start_time, end_time);
CREATE INDEX idx_setup_default_shifts_device_ts
	ON setup.default_shifts (device_id, dow, start_time, end_time, id);

-- Allow `anon_user` to access `setup.default_shifts` and `setup.default_shifts_id_seq`
-- Note: This is required so that PostgREST can access and manage the table.
GRANT ALL ON setup.default_shifts TO anon_user;
GRANT ALL ON SEQUENCE setup.default_shifts_id_seq TO anon_user;

-- Create the trigger to call the function before insert or update
CREATE TRIGGER check_setup_default_shifts_device_id_trigger
BEFORE INSERT OR UPDATE ON setup.default_shifts
FOR EACH ROW EXECUTE FUNCTION is_device_id_valid();

-- Define table and column comments
COMMENT ON TABLE setup.default_shifts IS 'List of default shifts scheduled for machines per day of week';
COMMENT ON COLUMN setup.default_shifts.id IS 'Shift ID';
COMMENT ON COLUMN setup.default_shifts.device_id IS 'Machine ID';
COMMENT ON COLUMN setup.default_shifts.name IS 'Shift name for display';
COMMENT ON COLUMN setup.default_shifts.dow IS 'Day of the week (`0` for Sunday, `6` for Saturday)';
COMMENT ON COLUMN setup.default_shifts.start_time IS 'Shift start time';
COMMENT ON COLUMN setup.default_shifts.end_time IS 'Shift end time';