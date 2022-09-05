const jwt = require('jsonwebtoken');

const repository = require('../services/repositories/users');

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

const updateUser = async data => {
	const result = await repository.update(data);
}

const deleteUserByEmail = async email => {
	const result = await repository.deleteByEmail(email);
}

module.exports = {
	getUserByEmailWithSoftdelete,
	getUserByEmail,
	getUserByResetPasswordLink,
	createUser,
	updateUser,
	getUserById,
	deleteUserByEmail
};