/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('slot_resale_transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('booking_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('bookings')
      .onDelete('CASCADE');
    table
      .uuid('seller_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .uuid('buyer_id')
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.decimal('listing_price', 10, 2).notNullable();
    table.decimal('original_price', 10, 2).notNullable();
    table
      .enum('status', ['listed', 'sold', 'expired', 'cancelled'], {
        useNative: true,
        enumName: 'resale_status_enum',
      })
      .notNullable()
      .defaultTo('listed');
    table.timestamp('expires_at').notNullable();
    table.timestamp('sold_at').nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('slot_resale_transactions');
  await knex.raw('DROP TYPE IF EXISTS resale_status_enum');
};
