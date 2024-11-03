const { mkdir } = require('fs/promises');
const { join } = require('path');
const Database = require('better-sqlite3');

async function setup() {
  // Create data directory if it doesn't exist
  const dataDir = join(process.cwd(), 'data');
  await mkdir(dataDir, { recursive: true });

  // Initialize database
  const db = new Database(join(dataDir, 'database.sqlite'));

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'USER' CHECK(role IN ('USER', 'ADMIN')),
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log('Database setup completed successfully!');
  process.exit(0);
}

setup().catch((error) => {
  console.error('Error setting up database:', error);
  process.exit(1);
});