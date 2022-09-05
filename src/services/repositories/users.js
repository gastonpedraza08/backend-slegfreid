const { User, Role } = require('../../models');

const getByEmail = async email => {
	const result = await User.findOne({
		include: [{
			model: Role,
			required: true,
			as: 'role'
		}],
		where: { email }
	});
	return result;
};

const getById = async id => {
	const result = await User.findOne({
		include: [{
			model: Role,
			required: true,
			as: 'role'
		}],
		where: { id }
	});
	return result;
};

const getByResetPasswordLink = async resetPasswordLink => {
	const result = await User.findOne({
		where: { resetPasswordLink },
	});
	return result;
};

const getByEmailWithSoftdelete = async email => {
	const result = await User.findOne({
		include: [{
			model: Role,
			required: true,
			as: 'role'
		}],
		where: { email },
		paranoid: false
	});
	return result;
};

const persist = async user => {
	const result = await User.create(user);
	return result;
};

const deleteByEmail = async email => {
	await User.destroy({
		where: {
			email
		},
		force: true
	});
};


module.exports = {
	getByEmailWithSoftdelete,
	getByEmail,
	persist,
	getByResetPasswordLink,
	getById,
	deleteByEmail
};