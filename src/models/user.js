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
			User.belongsTo(models.Pharma, {
				as: 'pharma',
				foreingKey: 'pharmaId',
			});
		}
	};
	User.init({
		email: DataTypes.STRING,
		name: DataTypes.STRING,
		password: DataTypes.STRING,
		roleId: DataTypes.INTEGER,
		pharmaId: DataTypes.INTEGER,
		createdAt: DataTypes.DATE(),
	    updatedAt: DataTypes.DATE(),
	    deletedAt: DataTypes.DATE(),
	}, {
		sequelize,
		modelName: 'User',
		timestamps: true,
		paranoid: true,
	});
	return User;
};