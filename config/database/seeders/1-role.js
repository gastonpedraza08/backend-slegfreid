'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'Roles', 
			[
				{
					name: 'admin',
					description: 'administator',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: 'subscriber',
					description: 'subscriber',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
