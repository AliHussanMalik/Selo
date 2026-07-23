const knex = require('knex');
const knexConfig = require('../../knexfile');
const config = require('./env');

const environment = config.env || 'development';
const db = knex(knexConfig[environment]);

module.exports = db;
