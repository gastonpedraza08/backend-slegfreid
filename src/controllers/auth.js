const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const moment = require('moment');

const handler = require('../handlers/users');
const {
	sendEmailAccountActivation,
	sendEmailResetPassword
} = require('../services/external/emailSender');
const { validate } = require('../utils/commons');
const {
	validSign,
	validLogin,
	forgotPasswordValidator,
	resetPasswordValidator
} = require('./middlewares/express-validator/auth');
const { errorHandler } = require('../utils/errorHandler');
const { requireSignin } = require('./middlewares/auth');

const fnSendEmailAccountActivation = (res, email, token) => {
	sendEmailAccountActivation(email, token)
		.then(response => {
			res.status(200).json({
				ok: true,
				message: `email has been sent to ${email}`,
				//delete
				token
			});
		})
		.catch(async error => {
			await handler.deleteUserByEmail(email);
			res.status(401).json({
				ok: false,
				message: 'error while creating user'
			});
		});
};

const createTokenAccountActivation = (data) => {
	return jwt.sign({ ...data },
		process.env.JWT_ACCOUNT_ACTIVATION,
		{ expiresIn: '7d' }
	);
};

const updateUser = async (user, updatedFields) => {
	user = _.extend(user, updatedFields);
	return user.save();
};

router.post('/register', validSign, validate, async (req, res) => {
	const { name, email, password } = req.body;
	try {
		let user = await handler.getUserByEmailWithSoftdelete(email);
		if (user) {
			if (!user.deletedAt) {
				return res.status(400).json({
					ok: false,
					error: 'email is taken'
				});
			} else {
				const hash = bcrypt.hashSync(password, 10);
				await updateUser(user, { name, password: hash })
				const token = createTokenAccountActivation({ name, email });
				fnSendEmailAccountActivation(res, email, token);
				return;
			}
		}
		const currentDateFormatted = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
		const token = createTokenAccountActivation({ name, email });
		const hash = bcrypt.hashSync(password, 10);
		const result = await handler.createUser({
			name,
			email,
			password: hash,
			deletedAt: currentDateFormatted
		});
		fnSendEmailAccountActivation(res, email, token);
	} catch (error) {
		const errorToReturn = errorHandler(error);
		res.status(errorToReturn.status).json({
			ok: false,
			error: errorToReturn.message
		});
	}
});

const createAccessToken = (id, name, email, role) => {
	return jwt.sign({ id, name, email, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/activation', async (req, res) => {
	try {
		const authorization = req.get('Authorization');
		if (!authorization) {
			return res.status(400).json({
				ok: false,
				error: 'missing token'
			});
		}
		const token = authorization.split(' ')[1];
		jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async (err, decoded) => {
			if (err) {
				console.log(err)
				return res.status(401).json({
					ok: false,
					error: 'expired link'
				});
			} else {
				const { email } = decoded;
				let user = await handler.getUserByEmailWithSoftdelete(email);
				if (!user) {
					return res.status(400).json({
						ok: false,
						error: 'user with that email does not exist'
					});
				}
				await user.restore();
				const token = createAccessToken(user.id, user.name, email, user.role.name);
				res.status(200).json({
					ok: true,
					message: 'activation success',
					token,
					user: {
						id: user.id,
						name: user.name,
						email: user.email,
						role: user.role.name
					}
				});
			}
		});
	} catch (error) {
		const errorToReturn = errorHandler(error);
		res.status(errorToReturn.status).json({
			ok: false,
			error: errorToReturn.message
		});
	}
});


router.post('/login', validLogin, validate, async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await handler.getUserByEmail(email);
		if (!user) {
			return res.status(400).json({
				ok: false,
				error: 'user with that email does not exist'
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
		const { id, name, role } = user;
		const token = createAccessToken(id, name, email, role.name);
		return res.status(200).json({
			ok: true,
			token,
			user: {
				id,
				name,
				email,
				role: role.name
			}
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
	const { id, name, email, role } = req.user;
	const token = createAccessToken(id, name, email, role);
	return res.status(200).json({
		ok: true,
		token,
		user: {
			id: req.user.id,
			name: req.user.name,
			email: req.user.email,
			role: req.user.role
		}
	});
});


router.put('/forgotpassword', forgotPasswordValidator, validate, async (req, res) => {
	try {
		const { email } = req.body;
		const user = await handler.getUserByEmail(email);
		if (!user) {
			return res.status(404).json({
				ok: false,
				error: 'user with that email does not exist'
			});
		}
		const token = jwt.sign({ id: user.id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '15m' });
		user.resetPasswordLink = token;
		const result = await user.save();
		if (!result) {
			return res.status(400).json({
				ok: false,
				error: 'database error on user password forgot request'
			});
		}
		sendEmailResetPassword(email, token);
		return res.status(200).json({
			ok: true,
			message: `email has been sent to ${email}`
		});
	} catch (error) {
		const errorToReturn = errorHandler(error);
		res.status(errorToReturn.status).json({
			ok: false,
			error: errorToReturn.message
		});
	}
});


router.put('/resetpassword', resetPasswordValidator, validate, async (req, res) => {
	try {
		const { resetPasswordToken, newPassword } = req.body;
		if (!resetPasswordToken) {
			return res.status(200).json({
				ok: false,
				error: 'invalid token'
			});
		}
		jwt.verify(resetPasswordToken, process.env.JWT_RESET_PASSWORD, async (err, decoded) => {
			if (err) {
				return res.status(400).json({
					error: 'expired link'
				});
			}
			let user = await handler.getUserByResetPasswordLink(resetPasswordToken);
			if (!user) {
				return res.status(400).json({
					ok: false,
					error: 'user does not exist'
				});
			}
			const hash = bcrypt.hashSync(newPassword, 10);
			const updatedFields = {
				password: hash,
				resetPasswordLink: ''
			};
			user = _.extend(user, updatedFields);
			await user.save();
			return res.status(200).json({
				ok: true,
				message: 'you can login with your new password'
			});
		});
	} catch (error) {
		const errorToReturn = errorHandler(error);
		res.status(errorToReturn.status).json({
			ok: false,
			error: errorToReturn.message
		});
	}
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
// Google Login
router.post('/googlelogin', async (req, res) => {
	try {
		const { idToken } = req.body;
		const response = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT });
		const { email_verified, name: googleName, email: googleEmail } = response.payload;
		if (!email_verified) {
			return res.status(400).json({
				error: 'google login failed'
			});
		}
		const user = await handler.getUserByEmail(googleEmail);
		if (user) {
			const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
				expiresIn: '7d'
			});
			const { id, email, name, roleId } = user;
			return res.status(200).json({
				ok: true,
				token,
				user: { id, email, name, roleId }
			});
		} else {
			const password = bcrypt.hashSync(googleEmail + process.env.JWT_SECRET, 10);
			const userToPersist = {
				name: googleName,
				email: googleEmail,
				password
			};
			const user = await handler.createUser(userToPersist);
			if (!user) {
				return res.status(400).json({
					ok: false,
					error: 'failed signup user with google'
				});
			}
			const token = jwt.sign(
				{ id: user.id },
				process.env.JWT_SECRET,
				{ expiresIn: '7d' }
			);
			const { id, email, name, roleId } = user;
			return res.status(200).json({
				ok: true,
				token,
				user: { id, email, name, roleId }
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

router.post('/facebooklogin', async (req, res) => {
	try {
		const { userID, accessToken } = req.body;
		const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;
		const response = await axios.get(url);
		const { email, name } = response.data;
		const user = await handler.getUserByEmail(email);
		if (user) {
			const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
				expiresIn: '7d'
			});
			const { id, roleId } = user;
			res.status(200).json({
				ok: true,
				token,
				user: { id, email, name, roleId }
			});
		} else {
			const password = bcrypt.hashSync(email + process.env.JWT_SECRET, 10);
			const user = await handler.createUser({ name, email, password });
			if (!user) {
				return res.status(400).json({
					ok: false,
					error: 'failed signup user with google'
				});
			}
			const token = jwt.sign(
				{ id: user.id },
				process.env.JWT_SECRET,
				{ expiresIn: '7d' }
			);
			const { id, roleId } = user;
			res.status(200).json({
				ok: true,
				token,
				user: { id, email, name, roleId }
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


module.exports = router;