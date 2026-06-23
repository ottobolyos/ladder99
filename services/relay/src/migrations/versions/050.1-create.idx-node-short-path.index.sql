-- Add an index on `nodes.props ->> 'shortPath'
CREATE INDEX idx_node_short_path
ON raw.nodes((props ->> 'shortPath'))
WHERE
	props ->> 'node_type'::TEXT = 'Device'::TEXT;