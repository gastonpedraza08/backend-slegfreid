const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

const { getUserById } = require('../../handlers/users');

const requireSignin = async (req, res, next) => {
	const authorization = req.get('Authorization');
	if (!authorization) {
		return res.status(400).json({
			ok: false,
			error: 'missing token'
		});
	}
	const token = authorization.split(' ')[1];
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json({
				ok: false,
				error: 'invalid token'
			});
		} else {
			req.user = decoded;
			next();
		}
	});
}

const adminMiddleware = async (req, res, next) => {
	const user = await getById(req.user.id);
	if (!user) {
		return res.status(400).json({
			ok: false,
			error: 'user not found'
		});
	}
	if (user.roleId !== 1) {
		return res.status(400).json({
			ok: false,
			error: 'admin resource, access denied'
		});
	}
	req.profile = user;
	next();
};


module.exports = {
	requireSignin,
	adminMiddleware
}