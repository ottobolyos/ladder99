/* eslint-disable */

import axios from 'axios'

module.exports = async function () {
	// Configure axios for tests to use.
	const host = process.env.L99_GW_HOST ?? '127.0.0.1'
	const port = process.env.L99_GW_PORT ?? 3333
	axios.defaults.baseURL = `http://${host}:${port}`
}
