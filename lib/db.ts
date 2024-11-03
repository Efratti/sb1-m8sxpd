import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'data', 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export interface User {
  id: string;
  email: string;
  name: string | null;
  password: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Initialize database tables
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

// Prepared statements for users
const createUser = db.prepare(`
  INSERT INTO users (id, email, name, password, role)
  VALUES (?, ?, ?, ?, ?)
`);

const getUserByEmail = db.prepare(`
  SELECT * FROM users WHERE email = ?
`);

const getUserById = db.prepare(`
  SELECT * FROM users WHERE id = ?
`);

// Prepared statements for events
const createEvent = db.prepare(`
  INSERT INTO events (id, title, description, startDate, endDate, latitude, longitude, userId)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const getAllEvents = db.prepare(`
  SELECT events.*, users.name as creatorName, users.email as creatorEmail
  FROM events
  JOIN users ON events.userId = users.id
  ORDER BY startDate DESC
`);

const getEventById = db.prepare(`
  SELECT events.*, users.name as creatorName, users.email as creatorEmail
  FROM events
  JOIN users ON events.userId = users.id
  WHERE events.id = ?
`);

export const queries = {
  createUser: (user: Omit<User, 'createdAt' | 'updatedAt'>) => {
    return createUser.run(
      user.id,
      user.email,
      user.name,
      user.password,
      user.role
    );
  },
  getUserByEmail: (email: string) => {
    return getUserByEmail.get(email) as User | undefined;
  },
  getUserById: (id: string) => {
    return getUserById.get(id) as User | undefined;
  },
  createEvent: (event: Omit<Event, 'createdAt' | 'updatedAt'>) => {
    return createEvent.run(
      event.id,
      event.title,
      event.description,
      event.startDate,
      event.endDate,
      event.latitude,
      event.longitude,
      event.userId
    );
  },
  getAllEvents: () => {
    return getAllEvents.all() as (Event & {
      creatorName: string | null;
      creatorEmail: string;
    })[];
  },
  getEventById: (id: string) => {
    return getEventById.get(id) as (Event & {
      creatorName: string | null;
      creatorEmail: string;
    }) | undefined;
  },
};