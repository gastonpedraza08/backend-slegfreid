const { check } = require('express-validator');

const validLogin = [
	check('email')
		.notEmpty().withMessage('El email es obligatorio.'),
	check('email')
		.isEmail().withMessage('Debe ser una dirección de correo electrónico válida.'),
	check('password')
		.notEmpty().withMessage('La contraseña es obligatoria.'),
	check('password')
		.isLength({
			min: 6
		}).withMessage('La contraseña debe poseer al menos 6 caracteres.')
		.matches(/\d/).withMessage('La contraseña debe poseer al menos un número.')
		.matches(/[a-zA-Z]/).withMessage('La contraseña debe poseer al menos una letra.')
];


module.exports = {
	validLogin,
};