// backend-express/seed-lessons.js
require('dotenv').config();
const { connect, getDb } = require('./db');

async function seed() {
  await connect();
  const db = getDb();

  const lessons = [
    {
      subject: 'Math Tutoring',
      location: 'Hendon',
      price: 100,
      spaces: 5,
      icon: 'fas fa-calculator',
      image: 'math.png'
    },
    {
      subject: 'Science Club',
      location: 'Colindale',
      price: 80,
      spaces: 5,
      icon: 'fas fa-flask',
      image: 'science.png'
    },
    {
      subject: 'English Writing',
      location: 'Golders Green',
      price: 90,
      spaces: 5,
      icon: 'fas fa-book',
      image: 'english.png'
    },
    {
      subject: 'Football Training',
      location: 'Brent Cross',
      price: 70,
      spaces: 5,
      icon: 'fas fa-futbol',
      image: 'football.png'
    },
    {
      subject: 'Art Workshop',
      location: 'Hendon',
      price: 60,
      spaces: 5,
      icon: 'fas fa-paint-brush',
      image: 'art.png'
    },
    {
      subject: 'Coding for Beginners',
      location: 'Online',
      price: 120,
      spaces: 5,
      icon: 'fas fa-laptop-code',
      image: 'fas coding.png'
    },
    {
      subject: 'Music Lessons',
      location: 'fas Hendon',
      price: 110,
      spaces: 5,
      icon: 'fas fa-music',
      image: 'music.png'
    },
    {
      subject: 'Drama Club',
      location: 'Colindale',
      price: 75,
      spaces: 5,
      icon: 'fas fa-theater-masks',
      image: 'drama.png'
    },
    {
      subject: 'Robotics Lab',
      location: 'Brent Cross',
      price: 130,
      spaces: 5,
      icon: 'fas fa-robot',
      image: 'robotics.png'
    },
    {
      subject: 'Chess Coaching',
      location: 'Golders Green',
      price: 65,
      spaces: 5,
      icon: 'fas fa-chess-knight',
      image: 'chess.png'
    }
  ].map(l => ({
    ...l,
    priceString: String(l.price),
    spacesString: String(l.spaces)
  }));

  await db.collection('lessons').deleteMany({});
  await db.collection('lessons').insertMany(lessons);
  console.log('Seeded lessons collection');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
