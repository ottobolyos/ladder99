CREATE OR REPLACE FUNCTION check_actual_shift_downtimes()
	RETURNS TRIGGER AS
$$
DECLARE
	shift_type  VARCHAR(7);
	shift_start TIMESTAMPTZ;
	shift_end   TIMESTAMPTZ;
BEGIN
	-- Fetch the shift type, start, and end times
	SELECT type, start_time, end_time
	INTO shift_type, shift_start, shift_end
	FROM setup.actual_shifts
	WHERE id = NEW.shift_id;

	-- Forbid adding downtimes if the shift `type` is 'holiday'
	IF shift_type = 'holiday' THEN
		RAISE EXCEPTION 'Cannot add downtime for a holiday shift.';
	END IF;

	-- Additional checks for non-holiday shifts

	-- Ensure `NEW.start_time` is less than `NEW.end_time`
	IF NEW.start_time >= NEW.end_time THEN
		RAISE EXCEPTION 'start_time must be less than end_time.';
	END IF;

	-- Ensure `NEW.start_time` is within the shift but not equal to shift start or end
	IF NEW.start_time <= shift_start OR NEW.start_time >= shift_end THEN
		RAISE EXCEPTION 'start_time must be within the shift and not equal to shift start_time.';
	END IF;

	-- Ensure `NEW.end_time` is within the shift but not equal to shift start or end
	IF NEW.end_time <= shift_start OR NEW.end_time >= shift_end THEN
		RAISE EXCEPTION 'end_time must be within the shift and not equal to shift end_time.';
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;
