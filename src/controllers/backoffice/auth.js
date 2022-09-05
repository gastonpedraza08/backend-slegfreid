const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const handler = require('../../handlers/backoffice/users');
const { validate } = require('../../utils/commons');
const {
	validLogin,
} = require('./middlewares/express-validator/auth');
const { errorHandler } = require('../../utils/errorHandler');
const { requireSignin } = require('./middlewares/auth');

const createAccessToken = (body) => {
	return jwt.sign(body, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/login', validLogin, validate, async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await handler.getUserByEmail(email);

		if (!user) {
			return res.status(400).json({
				ok: false,
				error: 'No existe un usuario con el email proporcionado.'
			});
		}

		let adminRoleId = 1;

		if (user.roleId !== adminRoleId) {
			return res.status(401).json({
				ok: false,
				error: 'El usuario proporcionado no es administrador.'
			});
		}

		const hashed_password = user.password;
		const isCorrectPassword = bcrypt.compareSync(password, hashed_password);

		if (!isCorrectPassword) {
			return res.status(400).json({
				ok: false,
				error: 'Credenciales Inválidas.'
			});
		}
		
		const { id, name, role } = user;
		const token = createAccessToken({
			id, 
			name, 
			email, 
			role: role.name
		});

		user.password = undefined;

		return res.status(200).json({
			ok: true,
			token,
			user,
		});

	} catch (error) {
		const errorToReturn = errorHandler(error);
		res.status(errorToReturn.status).json({
			ok: false,
			error: errorToReturn.message
		});
	}
});

router.post('/renewtoken', requireSignin, (req, res) => {
	try {
		const { id, name, email, role } = req.user;
		const token = createAccessToken({
			id, 
			name, 
			email, 
			role: role.name
		});
	
		return res.status(200).json({
			ok: true,
			token,
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