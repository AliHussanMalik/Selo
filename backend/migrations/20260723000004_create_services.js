/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('services', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('salon_id')
      .notNullable()
      .references('id')
      .inTable('salons')
      .onDelete('CASCADE');
    table.string('name').notNullable();
    table.text('description').nullable();
    table.integer('duration_minutes').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table
      .enum(
        'category',
        ['haircut', 'color', 'treatment', 'nails', 'makeup', 'beard'],
        {
          useNative: true,
          enumName: 'service_category_enum',
        }
      )
      .notNullable()
      .defaultTo('haircut');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('services').then(() => {
    return knex.raw('DROP TYPE IF EXISTS service_category_enum');
  });
};
