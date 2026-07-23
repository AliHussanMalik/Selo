/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('reviews', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('booking_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('bookings')
      .onDelete('CASCADE');
    table
      .uuid('reviewer_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .uuid('salon_id')
      .notNullable()
      .references('id')
      .inTable('salons')
      .onDelete('CASCADE');
    table.integer('rating').notNullable();
    table.text('comment').nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('reviews');
};
