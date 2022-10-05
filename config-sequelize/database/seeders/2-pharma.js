'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'Pharmas', 
			[
				{
					id: 1,
					name: 'pharma 1',
					description: 'description pharma 1',
					assets: JSON.stringify({
						mainImage: "url.com"
					}),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 2,
					name: 'pharma 2',
					description: 'description pharma 2',
					assets: JSON.stringify({
						mainImage: "url.com"
					}),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('Pharmas', null, {});
	},
};
