const { check } = require('express-validator');

const validSign = [
	check('name', 'name is required').notEmpty()
		.isLength({
			min: 4,
			max: 32
		}).withMessage('name must be between 3 to 32 characters'),
	check('email')
		.isEmail().withMessage('must be a valid email address'),
	check('password', 'password is required')
		.notEmpty(),
	check('password')
		.isLength({
			min: 6
		}).withMessage('password must contain at least 6 characters')
		.matches(/\d/).withMessage('password must contain a number')
];

const updateUser = [
	check('name', 'name is required').notEmpty()
		.isLength({
			min: 4,
			max: 32
		}).withMessage('name must be between 3 to 32 characters'),
	check('email')
		.isEmail().withMessage('must be a valid email address'),
];

const validLogin = [
	check('email')
		.isEmail().withMessage('must be a valid email address'),
	check('password', 'password is required')
		.notEmpty(),
	check('password')
		.isLength({
			min: 6
		}).withMessage('password must contain at least 6 characters')
		.matches(/\d/).withMessage('password must contain a number')
];


const forgotPasswordValidator = [
	check('email')
		.not()
		.isEmpty()
		.isEmail().withMessage('must be a valid email address')
];

const resetPasswordValidator = [
	check('newPassword', 'password is required')
		.notEmpty(),
	check('newPassword')
		.isLength({
			min: 6
		}).withMessage('password must contain at least 6 characters')
		.matches(/\d/).withMessage('password must contain a number')
];


module.exports = {
	validSign,
	validLogin,
	forgotPasswordValidator,
	resetPasswordValidator,
	updateUser
};