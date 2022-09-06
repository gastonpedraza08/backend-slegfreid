const repository = require('../../services/repositories/backoffice/pharmas');

const getPharmaById = async id => {
	const pharma = await repository.getById(id);
	return pharma;
};

const createPharma = async data => {
	const pharma = await repository.persist(data);
	return pharma;
};

const updatePharma = async data => {
	const result = await repository.update(data);
    return result;
}

const deletePharmaById = async id => {
	const result = await repository.deleteById(id);
	return result;
}

const getPharmas = async (params, search) => {
	const pharmas = await repository.getPharmas(params, search);
	return pharmas;
};

module.exports = {
	createPharma,
	updatePharma,
	getPharmaById,
	getPharmas,
	deletePharmaById,
};