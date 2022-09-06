const jwt = require('jsonwebtoken');

const repository = require('../../services/repositories/backoffice/roles');

const getRoleById = async id => {
	const user = await repository.getById(id);
	return user;
};

const createRole = async data => {
	const user = await repository.persist(data);
	return user;
};

const updateRole = async data => {
	const result = await repository.update(data);
    return result;
}

const deleteRoleById = async id => {
	const result = await repository.deleteById(id);
	return result;
}

const getRoles = async (params, search) => {
	const users = await repository.getRoles(params, search);
	return users;
};

module.exports = {
	createRole,
	updateRole,
	getRoleById,
	getRoles,
	deleteRoleById,
};