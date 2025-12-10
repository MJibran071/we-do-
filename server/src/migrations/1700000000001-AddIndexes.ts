import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexes1700000000001 implements MigrationInterface {
  name = 'AddIndexes1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Thread indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_threads_user_id ON threads(user_id);
      CREATE INDEX IF NOT EXISTS idx_threads_status ON threads(status);
      CREATE INDEX IF NOT EXISTS idx_threads_platform ON threads(platform);
      CREATE INDEX IF NOT EXISTS idx_threads_last_message_at ON threads(last_message_at DESC);
      CREATE INDEX IF NOT EXISTS idx_threads_apartment_id ON threads(apartment_id) WHERE apartment_id IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_threads_restaurant_id ON threads(restaurant_id) WHERE restaurant_id IS NOT NULL;
    `);

    // Message indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);
      CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
    `);

    // Booking indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in);
      CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON bookings(check_out);
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_apartment_id ON bookings(apartment_id) WHERE apartment_id IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_bookings_restaurant_id ON bookings(restaurant_id) WHERE restaurant_id IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings USING GIST (tstzrange(check_in, check_out));
    `);

    // Customer indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email) WHERE email IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
      CREATE INDEX IF NOT EXISTS idx_customers_churn_risk ON customers(churn_risk);
      CREATE INDEX IF NOT EXISTS idx_customers_last_visit ON customers(last_visit DESC);
    `);

    // Maintenance issue indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_issues(status);
      CREATE INDEX IF NOT EXISTS idx_maintenance_priority ON maintenance_issues(priority);
      CREATE INDEX IF NOT EXISTS idx_maintenance_reported_at ON maintenance_issues(reported_at DESC);
      CREATE INDEX IF NOT EXISTS idx_maintenance_apartment_id ON maintenance_issues(apartment_id) WHERE apartment_id IS NOT NULL;
    `);

    // AI Cache indexes (for vector similarity search)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_cache_embedding ON ai_cache USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_threads_user_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_threads_status;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_threads_platform;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_threads_last_message_at;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_threads_apartment_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_threads_restaurant_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_messages_thread_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_messages_timestamp;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_messages_sender_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_bookings_check_in;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_bookings_check_out;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_bookings_status;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_bookings_user_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_bookings_apartment_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_bookings_restaurant_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_bookings_dates;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_customers_email;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_customers_status;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_customers_churn_risk;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_customers_last_visit;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_maintenance_status;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_maintenance_priority;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_maintenance_reported_at;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_maintenance_apartment_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_ai_cache_embedding;`);
  }
}

