const jwt = require('jsonwebtoken');

const repository = require('../../services/repositories/backoffice/users');

const getUserByEmail = async email => {
	const user = await repository.getByEmail(email);
	return user;
};

const getUserById = async id => {
	const user = await repository.getById(id);
	return user;
};

const getUserByResetPasswordLink = async resetPasswordLink => {
	const user = await repository.getByResetPasswordLink(resetPasswordLink);
	return user;
};

const getUserByEmailWithSoftdelete = async email => {
	const user = await repository.getByEmailWithSoftdelete(email);
	return user;
};

const createUser = async data => {
	const user = await repository.persist(data);
	return user;
};

const deleteUserByEmail = async email => {
	const result = await repository.deleteByEmail(email);
	return result;
}

const deleteUserById = async id => {
	const result = await repository.deleteById(id);
	return result;
}

const getUsers = async (params, search) => {
	const users = await repository.getUsers(params, search);
	return users;
};

module.exports = {
	getUserByEmailWithSoftdelete,
	getUserByEmail,
	getUserByResetPasswordLink,
	createUser,
	getUserById,
	deleteUserByEmail,
	getUsers,
	deleteUserById,
};