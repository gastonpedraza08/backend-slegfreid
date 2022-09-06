const { check } = require('express-validator');
const { validLogin } = require('./auth.js');

const validBodyUser = [
    check('name')
		.notEmpty().withMessage('El nombre es obligatorio.'),
    check('roleId')
        .notEmpty().withMessage('El tipo de usuario es obligatorio.'),
    check('pharmaId')
        .notEmpty().withMessage('El tipo de pharma es obligatorio.'),
];

const validUser = [
	...validLogin,
    ...validBodyUser,
];

const validUpdateUser = [
	...validLogin.map(validItem => {
        return validItem.optional()
    }),
    ...validBodyUser.map(validItem => {
        return validItem.optional()
    }),
];


module.exports = {
	validUser,
    validUpdateUser,
};