/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const isPg = knex.client.config.client === 'pg';
  await knex.schema.createTable('bookings', (table) => {
    const col = table.uuid('id').primary();
    if (isPg) col.defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('customer_id')
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
    table
      .uuid('service_id')
      .notNullable()
      .references('id')
      .inTable('services')
      .onDelete('RESTRICT');
    table
      .uuid('dresser_id')
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.date('scheduled_date').notNullable();
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
    table
      .enum(
        'status',
        [
          'pending',
          'confirmed',
          'in_progress',
          'completed',
          'cancelled',
          'resold',
        ],
        {
          useNative: isPg,
          enumName: 'booking_status_enum',
        }
      )
      .notNullable()
      .defaultTo('confirmed');
    table.decimal('total_price', 10, 2).notNullable();
    table.text('notes').nullable();
    table.timestamps(true, true);
  });

  // DB-level conflict prevention index: prevent active overlapping start times for same salon & date
  await knex.raw(`
    CREATE INDEX idx_bookings_lookup ON bookings (salon_id, scheduled_date, status);
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('bookings');
  await knex.raw('DROP TYPE IF EXISTS booking_status_enum');
};
