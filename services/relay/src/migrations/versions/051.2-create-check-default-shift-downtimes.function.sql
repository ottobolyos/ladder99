CREATE OR REPLACE FUNCTION check_default_shift_downtimes() RETURNS trigger
	LANGUAGE plpgsql
AS
$$
DECLARE
	shift_start TIME;
	shift_end TIME;
	downtime_start TIME;
	downtime_end TIME;
	shift_start_timestamp TIMESTAMP;
	shift_end_timestamp TIMESTAMP;
	downtime_start_timestamp TIMESTAMP;
	downtime_end_timestamp TIMESTAMP;
	shift_date DATE := '2000-01-01'; -- An arbitrary date to avoid issues with timestamps
BEGIN
	-- Fetch time shift start and end times once
	SELECT start_time, end_time INTO shift_start, shift_end
	FROM setup.default_shifts
	WHERE id = NEW.shift_id;

	-- Initialize downtime start and end
	downtime_start := NEW.start_time;
	downtime_end := NEW.end_time;

	-- Convert times to timestamp for comparison
	shift_start_timestamp := shift_date + shift_start;
	shift_end_timestamp := shift_date + shift_end;
	downtime_start_timestamp := shift_date + downtime_start;
	downtime_end_timestamp := shift_date + downtime_end;

	IF shift_start > shift_end THEN
		-- Shift crosses midnight, adjust the end timestamps
		shift_end_timestamp := shift_end_timestamp + INTERVAL '1 day';

		IF downtime_start < shift_start THEN
			downtime_start_timestamp := downtime_start_timestamp + INTERVAL '1 day';
		END IF;

		IF downtime_end <= downtime_start THEN
			downtime_end_timestamp := downtime_end_timestamp + INTERVAL '1 day';
		END IF;
	END IF;

	-- Check that downtime_start is greater than shift_start
	IF downtime_start_timestamp < shift_start_timestamp THEN
		RAISE EXCEPTION 'start_time must be greater than the shift start_time';
	END IF;

	-- Check that downtime_end is less than shift_end
	IF downtime_end_timestamp > shift_end_timestamp THEN
		RAISE EXCEPTION 'end_time must be less than the shift end_time';
	END IF;

	RETURN NEW;
END;
$$;
