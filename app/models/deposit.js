const Sequelize = require('sequelize');

module.exports = (sequelize) => {
	return sequelize.define('Deposit', {
		amount_cents: {
			allowNull: false,
			type: Sequelize.INTEGER,
		},
		created_at: {
			allowNull: false,
			type: Sequelize.DATE,
		},
		date: {
			allowNull: false,
			type: Sequelize.DATEONLY,
		},
		deleted_at: {
			allowNull: true,
			type: Sequelize.DATE,
		},
		fund_uuid: {
			allowNull: false,
			type: Sequelize.UUID,
		},
		updated_at: {
			allowNull: false,
			type: Sequelize.DATE,
		},
		uuid: {
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			type: Sequelize.UUID,
		},
	}, {
		paranoid: true,
		tableName: 'deposits',
		timestamps: true,
	});
};
