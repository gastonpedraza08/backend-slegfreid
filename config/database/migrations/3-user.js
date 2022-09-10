'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			roleId: {
				type: Sequelize.INTEGER,
				defaultValue: 2,
				references: {
					model: 'Roles',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
			pharmaId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Pharmas',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
			characterName: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE(),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE(),
			},
			deletedAt: {
				type: Sequelize.DATE(),
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Users');
	},
};
