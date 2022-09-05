const express = require('express');
const router = express.Router();
const { requireAdminSignin } = require('./middlewares/auth');
const { errorHandler } = require('../../utils/errorHandler');
const handler = require('../../handlers/backoffice/users');

router.get('/', requireAdminSignin, async (req, res) => {
	try {
		const { limit, order, orderBy, from, page } = req.query;
		const params = {
			limit: parseInt(limit) || undefined,
			order: order || 'DESC',
			orderBy: orderBy || 'createdAt',
			from: parseInt(from) - 1 || 0
		};

		if (page) {
			if (page === 1) {
				params.from = 0;
			} else {
				params.from = page * params.limit;
			}
		}

		const result = await handler.getUsers(params);
		res.json({
			ok: true,
			count: result.count,
			users: result.rows,
		});

	} catch (error) {
		const errorToReturn = errorHandler(error);
		res.status(errorToReturn.status).json({
			ok: false,
			error: errorToReturn.message
		});
	}
});

module.exports = router;