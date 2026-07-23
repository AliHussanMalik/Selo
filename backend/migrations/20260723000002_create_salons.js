/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  const isPg = knex.client.config.client === 'pg';
  return knex.schema.createTable('salons', (table) => {
    const col = table.uuid('id').primary();
    if (isPg) col.defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('owner_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('name').notNullable();
    table.text('description').nullable();
    table.string('address').notNullable();
    table.string('city').notNullable();
    table.decimal('latitude', 10, 8).nullable();
    table.decimal('longitude', 11, 8).nullable();
    table.string('cover_image_url').nullable();
    table.boolean('is_verified').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('salons');
};
