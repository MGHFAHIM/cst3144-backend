// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connect, getDb, ObjectId } = require('./db');

const app = express();

// ---------- middleware ----------
app.use(cors());
app.use(express.json());

// simple logger middleware (for coursework requirement)
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  if (Object.keys(req.body || {}).length > 0) {
    console.log('Body:', JSON.stringify(req.body));
  }
  next();
});

// static images middleware (if you have images folder)
app.use('/images', (req, res) => {
  const filePath = path.join(__dirname, 'images', req.path);
  fs.access(filePath, fs.constants.F_OK, err => {
    if (err) {
      return res.status(404).json({ error: 'Image file does not exist' });
    }
    res.sendFile(filePath);
  });
});

// connect to MongoDB once on startup
connect()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// ---------- routes ----------

// GET /lessons – return all lessons
app.get('/lessons', async (req, res) => {
  try {
    const db = getDb();
    const lessons = await db.collection('lessons').find({}).toArray();
    res.json(lessons);
  } catch (err) {
    console.error('Error fetching lessons:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /search?q=term – backend search (Approach 2)
app.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const db = getDb();

    if (!q) {
      const all = await db.collection('lessons').find({}).toArray();
      return res.json(all);
    }

    const regex = new RegExp(q, 'i');

    const results = await db.collection('lessons').find({
      $or: [
        { subject: { $regex: regex } },
        { location: { $regex: regex } },
        { priceString: { $regex: regex } },
        { spacesString: { $regex: regex } }
      ]
    }).toArray();

    res.json(results);
  } catch (err) {
    console.error('Error searching lessons:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /orders – save order
app.post('/orders', async (req, res) => {
  try {
    const { name, phone, items } = req.body;

    if (!name || !phone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order payload' });
    }

    const db = getDb();

    const orderDoc = {
      name,
      phone,
      items: items.map(i => ({
        lessonId: new ObjectId(i.lessonId),
        quantity: i.quantity
      })),
      createdAt: new Date()
    };

    const result = await db.collection('orders').insertOne(orderDoc);
    res.status(201).json({ message: 'Order saved', orderId: result.insertedId });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /lessons/:id – update lesson (spaces, etc.)
app.put('/lessons/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body || {};

    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // keep string fields in sync
    if (typeof updates.price === 'number') {
      updates.priceString = String(updates.price);
    }
    if (typeof updates.spaces === 'number') {
      updates.spacesString = String(updates.spaces);
    }

    const db = getDb();
    const result = await db.collection('lessons').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json({ message: 'Lesson updated' });
  } catch (err) {
    console.error('Error updating lesson:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------- start server (ONLY HERE) ----------
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
