/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('full_name').notNullable();
    table.string('email').notNullable().unique();
    table.string('phone').nullable();
    table.string('password_hash').notNullable();
    table
      .enum('role', ['customer', 'dresser', 'salon_owner', 'admin'], {
        useNative: true,
        enumName: 'user_role_enum',
      })
      .notNullable()
      .defaultTo('customer');
    table.string('avatar_url').nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users').then(() => {
    return knex.raw('DROP TYPE IF EXISTS user_role_enum');
  });
};
