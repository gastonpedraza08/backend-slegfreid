const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { getUserById } = require('../handlers/users');
const { requireSignin, adminMiddleware } = require('./middlewares/auth');
const { validate } = require('../utils/commons');

router.get('/:id', requireSignin, async (req, res) => {
	const userId = req.params.id;
	const user = await getUserById(userId);
	if (!user) {
		return res.status(400).json({
			ok: false,
			error: 'user not found'
		});
	}
	res.status(200).json({
		ok: true,
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role.name,
		}
	});
});

router.put('/update/:id', requireSignin, async (req, res) => {
	const { name, email, password } = req.body;
	const user = await getUserById(req.params.id);
	if (!user) {
		return res.status(400).json({
			ok: false,
			error: 'user not found'
		});
	}
	const hashed_password = user.password;
	const isAuthenticated = bcrypt.compareSync(password, hashed_password);
	if (!isAuthenticated) {
		return res.status(400).json({
			ok: false,
			error: 'invalid credentials'
		});
	}
	user.name = name;
	user.email = email;
	await user.save();
	res.status(200).json({
		ok: true,
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role.name,
		}
	});
});

router.put('/admin/update', requireSignin, adminMiddleware, async (req, res) => {
	console.log("pasa")
	res.json({
		ok: 'si llego hasta aca'
	})
});

module.exports = router;