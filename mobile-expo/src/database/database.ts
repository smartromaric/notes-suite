import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'NotesApp.db';

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await this.createTables();
      console.log('✅ Database initialized successfully for offline support');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      // Continue without database for now
    }
  }

  private async createTables() {
    if (!this.db) return;

    const queries = [
      // Table Users
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id INTEGER UNIQUE,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        access_token TEXT,
        refresh_token TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Table Notes
      `CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id INTEGER UNIQUE,
        owner_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content_md TEXT,
        visibility TEXT DEFAULT 'PRIVATE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_synced BOOLEAN DEFAULT 0,
        FOREIGN KEY (owner_id) REFERENCES users (id)
      )`,
      
      // Table Tags
      `CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id INTEGER UNIQUE,
        label TEXT UNIQUE NOT NULL
      )`,
      
      // Table NoteTags
      `CREATE TABLE IF NOT EXISTS note_tags (
        note_id INTEGER,
        tag_id INTEGER,
        PRIMARY KEY (note_id, tag_id),
        FOREIGN KEY (note_id) REFERENCES notes (id),
        FOREIGN KEY (tag_id) REFERENCES tags (id)
      )`,
      
      // Table Sync Queue
      `CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        table_name TEXT NOT NULL,
        record_id INTEGER,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    ];

    for (const query of queries) {
      await this.db.execAsync(query);
    }
  }

  getDatabase() {
    return this.db;
  }

  async executeQuery(query: string, params: any[] = []) {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAllAsync(query, params);
  }

  async executeUpdate(query: string, params: any[] = []) {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.runAsync(query, params);
  }
}

export default new Database();
