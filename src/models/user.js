'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			User.belongsTo(models.Role, {
				as: 'role',
				foreingKey: 'roleId',
			});
		}
	};
	User.init({
		email: DataTypes.STRING,
		name: DataTypes.STRING,
		password: DataTypes.STRING,
		salt: DataTypes.STRING,
		roleId: DataTypes.INTEGER,
		resetPasswordLink: DataTypes.STRING,
		createdAt: DataTypes.DATE(6),
    updatedAt: DataTypes.DATE(6),
    deletedAt: DataTypes.DATE(6),
	}, {
		sequelize,
		modelName: 'User',
		timestamps: true,
		paranoid: true,
	});
	return User;
};