import { request } from './_madoc.js';

export function get(req, res) {
	res.json(request('_sitemap'));
}
