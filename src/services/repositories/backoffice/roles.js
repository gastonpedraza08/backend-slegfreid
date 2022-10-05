const { Role } = require('../../../models-sequelize');

const getById = async id => {
	const result = await Role.findOne({
		where: { id }
	});
	return result;
};

const persist = async user => {
	const result = await Role.create(user);
	return result;
};

const deleteById = async id => {
	const result = await Role.destroy({
		where: {
			id
		},
		force: true
	});

	return result;
};

const getRoles = async (params) => {

	const result = await Role.findAndCountAll({
		limit: params.limit,
		offset: params.from,
		order: [[params.orderBy, params.order]],
	});

	return result;
};


module.exports = {
	persist,
	getById,
	getRoles,
	deleteById,
};