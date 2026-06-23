-- Add an index on `nodes.props ->> 'path'
CREATE INDEX idx_node_path
ON raw.nodes((props ->> 'path'))
WHERE
	props ->> 'node_type'::TEXT = 'Device'::TEXT;