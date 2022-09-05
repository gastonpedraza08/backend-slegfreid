'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Pharma extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	};
	Pharma.init({
		name: DataTypes.STRING,
		description: DataTypes.STRING,
		assets: DataTypes.JSON,
		createdAt: DataTypes.DATE(6),
	    updatedAt: DataTypes.DATE(6),
	    deletedAt: DataTypes.DATE(6),
	}, {
		sequelize,
		modelName: 'Pharma',
		timestamps: true,
		paranoid: true,
	});
	return Pharma;
};