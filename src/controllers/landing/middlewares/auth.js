const jwt = require('jsonwebtoken');

const requireSignin = async (req, res, next) => {
	const authorization = req.get('Authorization');
	
	if (!authorization) {
		return res.status(401).json({
			ok: false,
			error: 'missing token'
		});
	}

	const token = authorization;

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

module.exports = {
	requireSignin,
}