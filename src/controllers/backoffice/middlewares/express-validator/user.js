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

const validUpdateUser = [
	...validLogin.map(validItem => {
        return validItem.optional()
    }),
    check('name')
		.notEmpty().withMessage('El nombre es obligatorio.').optional(),
    check('roleId')
        .notEmpty().withMessage('El tipo de usuario es obligatorio.').optional(),
    check('pharmaId')
        .notEmpty().withMessage('El tipo de pharma es obligatorio.').optional(),
];


module.exports = {
	validUser,
    validUpdateUser,
};