const { check } = require('express-validator');

const validRoleArr = `
    [
        check('name')
            .notEmpty().withMessage('El nombre es obligatorio.'),
        check('description')
            .notEmpty().withMessage('La descripción es obligatoria.')
    ]
`;

const validRole = eval(validRoleArr);

const validUpdateRole = [
    ...eval(validRoleArr).map(checkItem => checkItem.optional())
];


module.exports = {
	validRole,
    validUpdateRole,
};