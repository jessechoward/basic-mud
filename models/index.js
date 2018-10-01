const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(
{
	dialect: process.env.DB_DIALECT || 'sqlite',
	storage: process.env.DB_SQLITE_STORAGE || './mud.db',
	database: process.env.DB_NAME || 'mud',
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD
});

// the database object
const db = {Sequelize: sequelize, sequelize: sequelize, models: {}};

// load all models in this directory
fs.readdirSync(__dirname)
// make sure we don't include this file itself and only files with a .js extension
.filter((filename) =>
{
	return path.basename(__filename) !== filename && path.extname(filename) === '.js';
})
// actually import the models
.forEach((filename) =>
{
	db.models[path.basename(filename, '.js')] = sequelize.import(path.join(__dirname, filename));
});

sequelize.sync(
{
	force: process.env.DB_FORCE_SYNC || false,
	alter: process.env.DB_ALTER_TABLES || false
});

db.models.forEach((model) =>
{
	if (model.hasOwnProperty('associate')) model.associate(db.models);
});

// before using the db for the first time check
// db.sequelize.authenticate()
module.exports = db;
