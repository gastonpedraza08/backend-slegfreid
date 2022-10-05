const { Pharma } = require('../../../models-sequelize');

const getById = async id => {
	const result = await Pharma.findOne({
		where: { id }
	});
	return result;
};

const persist = async user => {
	const result = await Pharma.create(user);
	return result;
};

const deleteById = async id => {
	const result = await Pharma.destroy({
		where: {
			id
		},
		force: true
	});

	return result;
};

const getPharmas = async (params) => {

	const result = await Pharma.findAndCountAll({
		limit: params.limit,
		offset: params.from,
		order: [[params.orderBy, params.order]],
	});

	return result;
};


module.exports = {
	persist,
	getById,
	getPharmas,
	deleteById,
};