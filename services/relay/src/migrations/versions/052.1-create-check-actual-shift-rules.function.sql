CREATE OR REPLACE FUNCTION check_actual_shift_rules()
	RETURNS TRIGGER AS
$$
BEGIN
	-- Ensure only one holiday exists per `device_id` and `start_time::date`
	IF NEW.type = 'holiday' THEN
		-- Check for existing holidays on the same date
		IF EXISTS (
			SELECT 1
			FROM setup.actual_shifts
			WHERE
				device_id = NEW.device_id
				AND start_time::DATE = NEW.start_time::DATE
				AND type = 'holiday'
				AND id <> COALESCE(NEW.id, -1)
		) THEN
			RAISE EXCEPTION 'Only one holiday is allowed per device_id and start_time::date.';
		END IF;

		-- Check for existing shifts on the same date
		IF EXISTS (
			SELECT 1
			FROM setup.actual_shifts
			WHERE
				device_id = NEW.device_id
				AND start_time::DATE = NEW.start_time::DATE
				AND type = 'shift'
		) THEN
			RAISE EXCEPTION 'Cannot insert a holiday for a date that already has shifts.';
		END IF;
	END IF;

	-- Ensure no shifts are added if a holiday exists for the same date
	-- Note: We ignore the current row (`NEW`), otherwise we cannot update a holiday to shift.
	IF NEW.type = 'shift' THEN
		-- Check for existing holidays on the same date
		IF EXISTS (
			SELECT 1
			FROM setup.actual_shifts
			WHERE
				device_id = NEW.device_id
				AND start_time::DATE = NEW.start_time::DATE
				AND type = 'holiday'
				-- Exclude the current row being updated
				AND id <> COALESCE(NEW.id, -1)
		) THEN
			RAISE EXCEPTION 'Cannot insert a shift for a date that already has a holiday.';
		END IF;
	END IF;

	-- Ensure `end_time` is `NULL` for holidays and `NOT NULL` for shifts
	IF NEW.type = 'holiday' AND NEW.end_time IS NOT NULL THEN
		RAISE EXCEPTION 'end_time must be NULL for holidays.';
	END IF;

	IF NEW.type = 'shift' AND NEW.end_time IS NULL THEN
		RAISE EXCEPTION 'end_time must NOT be NULL for shifts.';
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;