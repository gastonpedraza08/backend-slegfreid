'use strict';
const bcrypt = require('bcrypt');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'Users', 
			[
				{
					id: 1,
					email: 'gaston.pedraza@raxar.com',
					name: 'gaston pedraza',
					password: bcrypt.hashSync("Abcd1234", 10),
					roleId: 1,
					pharmaId: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('Users', null, {});
	},
};
