const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const databasePath = process.env.DATABASE_PATH || path.join(__dirname, "data", "careercompass.sqlite");
if (databasePath !== ":memory:") fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
db.pragma("foreign_keys = ON");
if (databasePath !== ":memory:") db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    display_name TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    password_hash TEXT NOT NULL,
    degree TEXT NOT NULL DEFAULT '',
    academic_year TEXT NOT NULL DEFAULT '',
    interests TEXT NOT NULL DEFAULT '',
    technical_skills TEXT NOT NULL DEFAULT '',
    experience_level TEXT NOT NULL DEFAULT '',
    career_goals TEXT NOT NULL DEFAULT '',
    current_class TEXT NOT NULL DEFAULT '',
    favorite_subject TEXT NOT NULL DEFAULT '',
    course TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);
`);

// Keep existing local databases compatible as the student profile grows.
const userColumns = new Set(db.prepare("PRAGMA table_info(users)").all().map((column) => column.name));
for (const [column, definition] of [
  ["current_class", "TEXT NOT NULL DEFAULT ''"],
  ["favorite_subject", "TEXT NOT NULL DEFAULT ''"],
  ["course", "TEXT NOT NULL DEFAULT ''"],
]) {
  if (!userColumns.has(column)) db.exec(`ALTER TABLE users ADD COLUMN ${column} ${definition}`);
}

module.exports = db;
