-- Add an index on `nodes.props ->> 'node_type'
CREATE INDEX idx_node_device_type
ON raw.nodes((props ->> 'node_type'))
WHERE
	props ->> 'node_type'::TEXT = 'Device'::TEXT;