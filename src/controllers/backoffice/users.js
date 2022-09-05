const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { requireAdminSignin } = require('./middlewares/auth');
const { errorHandler } = require('../../utils/errorHandler');
const handler = require('../../handlers/backoffice/users');
const { validate } = require('../../utils/commons');
const {
	validUser,
} = require('./middlewares/express-validator/user');

router.post('/', requireAdminSignin, validUser, validate, async (req, res) => {
	try {
		const { email, password, ...rest } = req.body;
		let user = await handler.getUserByEmail(email);

		if (user) {
			return res.status(400).json({
				ok: false,
				error: 'El email ya se encuentra en uso.'
			});
		}
		
		const hash = bcrypt.hashSync(password, 10);
		let newUser = {
			...rest,
			email,
			password: hash,
		};

		const result = await handler.createUser(newUser);

		let userToReturn = result;
		userToReturn.password = undefined;

		if (result) {
			return res.status(200).json({
				ok: true,
				user: userToReturn
			});
		} else {
			return res.status(400).json({
				ok: false,
				error: 'Error al crear el usuario.'
			});
		}
	} catch (error) {
		const errorToReturn = errorHandler(error);
		res.status(errorToReturn.status).json({
			ok: false,
			error: errorToReturn.message
		});
	}
});

router.get('/', requireAdminSignin, async (req, res) => {
	try {
		let { limit, order, orderBy, page } = req.query;
		const params = {
			limit: parseInt(limit) || undefined,
			order: order || 'DESC',
			orderBy: orderBy || 'createdAt',
		};

		if (!page) {
			page = 1;
		}

		if (parseInt(page) === 1) {
			params.from = 0;
		} else {
			params.from = (parseInt(page) - 1) * params.limit;
		}

		const result = await handler.getUsers(params);

		for (let i = 0; i < result.rows.length; i++) {
			result.rows[i].password = undefined;
		}

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