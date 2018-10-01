const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

const errorHandler = (error) =>
{
	console.log('[ERROR] Sequelize: ', error);
};

const encryptPassword = (instance) =>
{
	return bcrypt.hash(instance.password, 10)
	.then((hash) =>
	{
		instance.password = hash;
	})
	.catch((error) =>
	{
		console.log('[ERROR] bcrypt: ', error);
	});
};

module.exports = (sequelize, DataTypes) =>
{
	const Accounts = sequelize.define( 'account',
	{
		id:
		{
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: () => {return uuid().replace(/-/g, '');}
		},
		email:
		{
			type: DtaTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {isEmail: true}
		},
		password:
		{
			type: DtaTypes.STRING,
			allowNull: false,
			unique: true
		},
		permissions:
		{
			type: DtaTypes.STRING,
			allowNull: false,
			unique: true
		}
	},
	{
		hooks:
		{
			beforeCreate: (instance, options) =>
			{
				return encryptPassword(instance);
			},
			beforeBulkCreate: (instances, options) =>
			{
				const promises = instances.map(encryptPassword);
				return Promise.all(promises);
			},
			beforeUpdate: (instance, options) =>
			{
				if (instance.changed('password'))
				{
					return encryptPassword(instance);
				}
			}
		}
	});

	Accounts.authenticate = function(email, password)
	{
		return this.findOne({where: {email: email}})
		.then((account) =>
		{
			if (account)
			{
				if (bcrypt.compareSync(password, account.password))
				{
					return {id: account.id, permissions: permissions};
				}
			}

			return {error: 'account not found or password invalid'};
		})
		.catch(errorHandler);
	};

	Accounts.associate = (models) =>
	{
		Accounts.hasMany(models.player, {as: 'Players'});
	};

	return Accounts;
};
