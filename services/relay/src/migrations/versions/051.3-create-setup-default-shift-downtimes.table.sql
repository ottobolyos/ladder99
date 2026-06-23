-- This migration creates the `setup.default_shift_downtimes` table used to store the default downtimes for each shift defined in `setup.default_shifts`. This way we can define multiple downtimes per shift in a many-to-one relationship.

-- Create the `setup.default_shift_downtimes`
-- 	drop table setup.default_shift_downtimes cascade;
CREATE TABLE IF NOT EXISTS setup.default_shift_downtimes (
	id SERIAL,
	shift_id INTEGER NOT NULL,
	start_time TIME(0) NOT NULL,
	end_time TIME(0) NOT NULL
);

-- Create a primary key
ALTER TABLE setup.default_shift_downtimes
	ADD CONSTRAINT default_shift_downtimes_pkey PRIMARY KEY (id);

-- Add a foreign key constraint for `device_id`
ALTER TABLE setup.default_shift_downtimes
	ADD CONSTRAINT default_shift_downtimes_shift_id_fkey
		FOREIGN KEY (shift_id) REFERENCES setup.default_shifts
			ON DELETE CASCADE;

-- Create constraints
ALTER TABLE setup.default_shift_downtimes
	ADD CONSTRAINT default_shift_start_before_end_check
		CHECK (start_time < end_time);

-- Create a unique index
CREATE UNIQUE INDEX IF NOT EXISTS unique_default_shift_downtimes_shift_start
	ON setup.default_shift_downtimes (shift_id, start_time);

-- Create indices
CREATE INDEX IF NOT EXISTS idx_default_shift_downtimes_shift_id
	ON setup.default_shift_downtimes (shift_id);

-- Allow `anon_user` to access `setup.default_shift_downtimes`
-- Note: This is required so that PostgREST can access and manage the table.
GRANT ALL ON setup.default_shift_downtimes TO anon_user;
GRANT ALL ON SEQUENCE setup.default_shift_downtimes_id_seq TO anon_user;

-- Create a constraint
ALTER TABLE setup.default_shift_downtimes
	ADD CONSTRAINT default_shift_downtimes_start_before_end_check
		CHECK (start_time < end_time);

-- Create a trigger to check whether downtimes are within of the shift
CREATE TRIGGER trigger_check_default_shift_downtimes
	BEFORE INSERT OR UPDATE
	ON setup.default_shift_downtimes
	FOR EACH ROW
EXECUTE PROCEDURE public.check_default_shift_downtimes();

COMMENT ON TABLE setup.default_shift_downtimes IS 'List of default shift downtimes';
COMMENT ON COLUMN setup.default_shift_downtimes.id IS 'Shift downtime ID';
COMMENT ON COLUMN setup.default_shift_downtimes.shift_id IS 'Shift ID to which the downtime is assigned';
COMMENT ON COLUMN setup.default_shift_downtimes.start_time IS 'Downtime start time in 24-hour format; it must be within the shift time';
COMMENT ON COLUMN setup.default_shift_downtimes.end_time IS 'Downtime end time in 24-hour format; it must be within the shift time and later than `downtime_start`';