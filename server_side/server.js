// サーバーサイドコード
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 8000;
const db = new Database('app18.db');

// サーバー起動
app.listen(port, () => console.log(`Server running!!! at http://localhost:${port}`));

// データベース初期化エンドポイント
app.post('/app18/init_db', (req, res) => {
  try {
    db.exec(`CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL,
      completed INTEGER DEFAULT 0
    )`);
    res.json({ message: 'Database initialized' });
  } catch (error) {
    console.error('Error initializing database:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API エンドポイント
app.get('/app18/read_todos', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM todos').all();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching todos:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/app18/todos/toggle/:id', (req, res) => {
  try {
    const { id } = req.params;
    const info = db.prepare('UPDATE todos SET completed = NOT completed WHERE id = ?').run(id);
    if (info.changes === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json({ id, updated: info.changes });
  } catch (error) {
    console.error('Error toggling todo:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/app18/todos/delete/:id', (req, res) => {
  try {
    const { id } = req.params;
    const info = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    if (info.changes === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json({ id, deleted: info.changes });
  } catch (error) {
    console.error('Error deleting todo:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/app18/add_todos', (req, res) => {
  try {
    const { task } = req.body;
    if (!task) return res.status(400).json({ error: 'Task is required' });
    const info = db.prepare('INSERT INTO todos (task) VALUES (?)').run(task);
    res.json({ id: info.lastInsertRowid, task, completed: 0 });
  } catch (error) {
    console.error('Error adding todo:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});