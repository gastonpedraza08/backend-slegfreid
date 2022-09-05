const jwt = require('jsonwebtoken');

const requireAdminSignin = async (req, res, next) => {
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

			let adminRoleId = 1;

			if (decoded.roleId !== adminRoleId) {
				return res.status(401).json({
					ok: false,
					error: 'El usuario proporcionado no es administrador.'
				});
			}

			req.user = decoded;
			next();
		}
	});
}

module.exports = {
	requireAdminSignin,
}