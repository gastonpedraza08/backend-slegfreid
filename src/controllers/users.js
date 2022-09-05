const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.MAIL_KEY);

const { getUserById } = require('../handlers/users');
const { requireSignin, adminMiddleware } = require('./middlewares/auth');
const { updateUser } = require('./middlewares/express-validator/auth');
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

router.put('/update/:id', updateUser, validate, requireSignin, async (req, res) => {
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

router.post('/send-email', async (req, res) => {
	const { name, email, message } = req.body.mail;
	const emailData = {
		from: process.env.EMAIL_FROM,
		to: process.env.EMAIL_TO,
		subject: name,
		html: `
				<h1>Contacto por el portafolio</h1>
				<p>${message}</p>
				<p>Email de contacto: ${email}</p>
			`
	};
	try {
		await sgMail.send(emailData);
		res.json({
			ok: true,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			error: 'No se pudo enviar el email'
		});
	}
});

module.exports = router;