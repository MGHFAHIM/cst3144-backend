// backend-express/db.js
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI; // set in .env
if (!uri) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

const client = new MongoClient(uri);
let db;

async function connect() {
  if (db) return db;
  await client.connect();
  db = client.db(); // default DB from connection string
  console.log('Connected to MongoDB');
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Call connect() before getDb()');
  }
  return db;
}

module.exports = {
  connect,
  getDb,
  ObjectId
};
