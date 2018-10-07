const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) =>
{
	const Players = sequelize.define( 'player',
	{
		id:
		{
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: () => {return uuid().replace(/-/g, '');}
		},
		name:
		{
			type: DtaTypes.STRING,
			allowNull: false,
			unique: true
		},
		data:
		{
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		}
	});

	Players.associate = (models) =>
	{
		// NoOp
	};

	return Players;
};
