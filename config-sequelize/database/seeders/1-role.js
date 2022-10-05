'use strict';
const constants = require('../../constants');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'Roles', 
			[
				{
					id: constants.roles.ADMIN_ID,
					name: 'admin',
					description: 'administator',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: constants.roles.STANDARD_USER_ID,
					name: 'standard',
					description: 'standard',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('Roles', null, {});
	},
};
