require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const usePg = Boolean(process.env.DATABASE_URL || process.env.DB_PASSWORD);
const dbClient = process.env.DB_CLIENT || (usePg ? 'pg' : 'sqlite3');

module.exports = {
  development: {
    client: dbClient,
    connection: dbClient === 'sqlite3'
      ? { filename: './dev.sqlite3' }
      : (process.env.DATABASE_URL || {
          host: process.env.DB_HOST || '127.0.0.1',
          port: process.env.DB_PORT || 5432,
          database: process.env.DB_NAME || 'selo_db',
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
        }),
    useNullAsDefault: true,
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL || {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      database: process.env.TEST_DB_NAME || 'selo_test_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations',
    },
  },
};
