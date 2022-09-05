const { check } = require('express-validator');
const { validLogin } = require('./auth.js');

const validUser = [
	...validLogin,
    check('name')
		.notEmpty().withMessage('El nombre es obligatorio.'),
    check('roleId')
        .notEmpty().withMessage('El tipo de usuario es obligatorio.'),
    check('pharmaId')
        .notEmpty().withMessage('El tipo de pharma es obligatorio.'),
];


module.exports = {
	validUser,
};