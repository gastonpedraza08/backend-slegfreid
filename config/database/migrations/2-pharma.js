'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Pharmas', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			description: {
				type: Sequelize.STRING,
			},
			assets: {
				type: Sequelize.JSON,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE(6),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE(6),
			},
			deletedAt: {
				type: Sequelize.DATE(6),
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Pharmas');
	},
};
