/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  const isPg = knex.client.config.client === 'pg';
  return knex.schema.createTable('salon_amenities', (table) => {
    const col = table.uuid('id').primary();
    if (isPg) col.defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('salon_id')
      .notNullable()
      .references('id')
      .inTable('salons')
      .onDelete('CASCADE');
    table
      .enum(
        'amenity',
        [
          'wifi',
          'parking',
          'ac',
          'kids_area',
          'refreshments',
          'prayer_room',
          'female_only',
        ],
        {
          useNative: isPg,
          enumName: 'amenity_enum',
        }
      )
      .notNullable();
    table.unique(['salon_id', 'amenity']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('salon_amenities').then(() => {
    return knex.raw('DROP TYPE IF EXISTS amenity_enum');
  });
};
