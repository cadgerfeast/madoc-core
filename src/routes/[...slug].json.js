import { request } from './_madoc.js';

const lookup = new Map();

export function get(req, res) {
	const slug = req.params.slug[0];

	if (process.env.NODE_ENV !== 'production' || !lookup.has(slug)) {
		const res = request(req.params.slug[0], req.headers['x-madoc-path']);
		if (res) {
			lookup.set(slug, res);
		}
	}

	const data = lookup.get(slug);

	if (data) {
		res.json(data);
	} else {
		res.status(404).json({
			message: 'Not found.'
		});
	}
}
