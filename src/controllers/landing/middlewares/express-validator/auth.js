const { check } = require('express-validator');

const validSign = [
	check('name', 'El nombre es requerido.').notEmpty(),
	check('email')
		.isEmail().withMessage('Debe ingresar un correo electrónico válido.'),
	check('password', 'La contraseña es obligatoria.')
		.notEmpty(),
	check('password')
		.isLength({
			min: 6
		}).withMessage('La contraseña debe contener al menos 6 caracteres.')
		.matches(/\d/).withMessage('La contraseña debe contener al menos un número.')
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


module.exports = {
	validSign,
	validLogin,
};