-- This migration creates the `setup.actual_shifts` table used to store the actual schedule (shifts) and holidays for a specific day per machine. These shifts/holidays are created at midnight from the default schedule unless it is overridden by the user and a shift/holiday is created by the user manually before the particular day started.

-- Create the `setup.actual_shifts`
CREATE TABLE IF NOT EXISTS setup.actual_shifts (
	id SERIAL,
	device_id INT NOT NULL,
	type VARCHAR(7) NOT NULL CHECK (type IN ('shift', 'holiday')) DEFAULT 'holiday',
	name VARCHAR(50) NOT NULL,
	start_time TIMESTAMPTZ(3) NOT NULL,
	end_time TIMESTAMPTZ(3)
);

-- Create a primary key
ALTER TABLE setup.actual_shifts
	ADD CONSTRAINT actual_shifts_pkey PRIMARY KEY (id);

-- Add a foreign key constraint for `device_id`
ALTER TABLE setup.actual_shifts
ADD CONSTRAINT fk_device_id FOREIGN KEY (device_id)
	REFERENCES raw.nodes (node_id) MATCH SIMPLE
	ON UPDATE CASCADE
	ON DELETE CASCADE;

-- Create constraints
ALTER TABLE setup.actual_shifts
	ADD CONSTRAINT actual_shifts_start_end_check
		CHECK (
			(type = 'holiday' AND end_time IS NULL)
			OR (type = 'shift' AND end_time IS NOT NULL AND start_time < end_time)
		);

-- Create a unique index
CREATE UNIQUE INDEX IF NOT EXISTS unique_setup_actual_shifts_device_start
	ON setup.actual_shifts (device_id, start_time);

-- Create indices
CREATE INDEX idx_setup_actual_shifts_ts_device
	ON setup.actual_shifts (id, device_id, start_time, end_time);
CREATE INDEX idx_setup_actual_shifts_device_ts
	ON setup.actual_shifts (device_id, start_time, end_time, id);

-- Allow `anon_user` to access `setup.actual_shifts`
-- Note: This is required so that PostgREST can access and manage the table.
GRANT ALL ON setup.actual_shifts TO anon_user;
GRANT ALL ON SEQUENCE setup.actual_shifts_id_seq TO anon_user;

truncate setup.default_shifts;
truncate setup.default_shift_downtimes;
select * from setup.actual_shift_downtimes;
select * from setup.actual_shift_downtimes_id_seq;
alter SEQUENCE setup.actual_shift_downtimes_id_seq RESTART WITH 6;

-- Create triggers
CREATE TRIGGER check_setup_actual_shifts_device_id_trigger
BEFORE INSERT OR UPDATE ON setup.actual_shifts
FOR EACH ROW EXECUTE FUNCTION is_device_id_valid();

CREATE TRIGGER check_actual_shift_rules_trigger
BEFORE INSERT OR UPDATE ON setup.actual_shifts
FOR EACH ROW
EXECUTE FUNCTION check_actual_shift_rules();

-- Define table and column comments
COMMENT ON TABLE setup.actual_shifts IS 'List of actual shifts and holidays scheduled for machines';
COMMENT ON COLUMN setup.actual_shifts.device_id IS 'Machine ID';
COMMENT ON COLUMN setup.actual_shifts.end_time IS 'Shift end time; it must be `null` for holidays and `not null` for shifts';
COMMENT ON COLUMN setup.actual_shifts.id IS 'Shift ID';
COMMENT ON COLUMN setup.actual_shifts.name IS 'Shift name for display';
COMMENT ON COLUMN setup.actual_shifts.start_time IS 'Shift start time; for holidays, it is used to get the holiday date';
COMMENT ON COLUMN setup.actual_shifts.type IS 'Shift type; either `shift` (default) or `holiday`';