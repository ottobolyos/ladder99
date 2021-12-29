
-- tables, views, and functions to support metrics like utilization


---------------------------------------------------------------------
-- bins table
---------------------------------------------------------------------
-- store data for metrics

create table if not exists bins (
  device_id integer references nodes, -- node_id of a device
  resolution interval, -- 1min, 1hr, 1day, 1week, 1month, 1quarter, 1year
  time timestamptz, -- rounded down to previous minute, hour, day, etc
  active int, -- number of minutes device was active during time resolution
  available int, -- number of minutes device was available during time resolution
  primary key (device_id, resolution, time)
);
--. what's advantage of hypertable here?
-- make hypertable and add compression/retention schedules
-- select create_hypertable('bins', 'time', if_not_exists => true);
-- select add_compression_policy('bins', interval '1d', if_not_exists => true);
-- select add_retention_policy('bins', interval '1 year', if_not_exists => true);


---------------------------------------------------------------------
-- metrics view
---------------------------------------------------------------------
-- a view on the bins table - adds name, calculates uptime
--. make a materialized view for more speed?

drop view if exists metrics;

create or replace view metrics as
select 
  devices.props->>'name' as device,
  bins.resolution,
  bins.time,
  bins.active,
  bins.available,
  -- note: coalesce returns the first non-null value (works like an or operator),
  -- and nullif returns the first value, unless it equals 0.0, when it returns null -
  -- then the whole expression is null. avoids div by zero error.
  coalesce(bins.active::real,0) / nullif(bins.available::real,0.0) as utilization
--  bins.values as "values", -- a jsonb object
--  coalesce((values->>'time_active')::real,0) / 
--    nullif((values->>'time_available')::real,0.0) as utilization
from bins
join nodes as devices on bins.device_id = devices.node_id;



---------------------------------------------------------------------
-- update_metrics procedure / job
---------------------------------------------------------------------
-- this will be called every minute by timescaledb's job scheduler.
-- it calls increment_bin for the different fields and bin resolutions.

drop procedure update_metrics;

create or replace procedure update_metrics(job_id int, config jsonb)
language plpgsql
as
$body$
declare
  v_device_id int;
  v_interval interval := config->'interval';
  v_stop timestamptz := date_trunc('minute', now());
  v_start timestamptz := v_stop + interval '1 minute';
  -- v_time timestamptz := config->>'time' OR now();
--  v_time timestamptz := now(); --. round down to nearest min, hr, day, week, etc?
  v_is_time_in_schedule boolean;
  v_are_enough_people_logged_in boolean;
  v_was_machine_active boolean;
begin
  -- is_time_in_schedule := if schedule passed in config, check if time is within the time windows.
  v_is_time_in_schedule := true;
  -- are_enough_people_logged_in := lookup latest value of a dataitem set by facebook login info.
  -- loop over relevant devices, as passed through config.
  for v_device_id in select * from jsonb_array_elements(config->'device_ids') loop
    if v_is_time_in_schedule or v_are_enough_people_logged_in then
      -- was_machine_active := if any part_count events within previous time interval.
      v_was_machine_active := true;
      if v_was_machine_active then
        call increment_bin(11, '1 minute', v_stop, 'active');
      end if;
      call increment_bin(11, '1 minute', v_stop, 'available');
    end if;
  end loop;
end;
$body$;


call update_metrics(null, '{"interval":"1 min"}');

-- add a scheduled job
select add_job(
  'update_metrics', -- function/procedure to call 
  '1 min', -- interval
  config => '{"device_ids":[11], "interval":"1 min"}', -- config json
  initial_start => date_trunc('minute', now()) + interval '1 minute' -- start at top of next minute
);

-- https://docs.timescale.com/api/latest/informational-views/job_stats
select job_id, total_runs, total_failures, total_successes from timescaledb_information.job_stats;

--select delete_job(1010);


---------------------------------------------------------------------
-- increment_bin procedure
---------------------------------------------------------------------
-- increment a value in the bins table

create or replace procedure increment_bin(
  in p_device_id int,
  in p_resolution interval,
  in p_time timestamptz,
  in p_field text,
  in p_delta int = 1
)
language plpgsql
as $body$
declare
  v_field text := quote_ident(p_field); -- eg 'active', 'available'
begin
  -- upsert/increment the given field by delta
  execute format(
    'insert into bins (device_id, resolution, time, %s) 
      values ($1, $2, $3, $4)
    on conflict (device_id, resolution, time) do 
      update set %s = coalesce(bins.%s, 0) + $5;',
    v_field, v_field, v_field
  ) using p_device_id, p_resolution, p_time, p_delta, p_delta;
end
$body$;


call increment_bin(11, '1 minute', '2021-12-27 09:00:00', 'available');
