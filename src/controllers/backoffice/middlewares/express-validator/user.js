const { check } = require('express-validator');
const { validLoginArr } = require('./auth.js');

const validBodyUserArr = `[
    check('name')
		.notEmpty().withMessage('El nombre es obligatorio.'),
    check('roleId')
        .notEmpty().withMessage('El tipo de usuario es obligatorio.'),
    check('pharmaId')
        .notEmpty().withMessage('El tipo de pharma es obligatorio.'),
]`;

const validUser = [
	...eval(validLoginArr),
    ...eval(validBodyUserArr),
];

const validUpdateUser = [
	...eval(validLoginArr).map(validItem => {
        return validItem.optional()
    }),
    ...eval(validBodyUserArr).map(validItem => {
        return validItem.optional()
    }),
];


module.exports = {
	validUser,
    validUpdateUser,
};