const { User, Role, Pharma } = require('../../../models-sequelize');

let modelsToJoin = [
	{
		model: Role,
		required: true,
		as: 'role'
	},
	{
		model: Pharma,
		required: true,
		as: 'pharma'
	}
];

const getByEmail = async email => {
	const result = await User.findOne({
		include: modelsToJoin,
		where: { email }
	});
	return result;
};

const getById = async id => {
	const result = await User.findOne({
		include: modelsToJoin,
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

const deleteById = async id => {
	const result = await User.destroy({
		where: {
			id
		},
		force: true
	});

	return result;
};

const getUsers = async (params) => {

	const result = await User.findAndCountAll({
		limit: params.limit,
		offset: params.from,
		order: [[params.orderBy, params.order]],
		include: modelsToJoin,
	});

	return result;
};


module.exports = {
	getByEmailWithSoftdelete,
	getByEmail,
	persist,
	getByResetPasswordLink,
	getById,
	deleteByEmail,
	getUsers,
	deleteById,
};