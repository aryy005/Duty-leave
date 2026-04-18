const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Club = require('./models/Club');
const Event = require('./models/Event');
const News = require('./models/News');
const cron = require('node-cron');
const jwt = require('jsonwebtoken');


const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/', (req, res) => res.json({ status: 'Duty Leave API is running 🚀' }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/duty-leave-hub';

// --- Improved MongoDB Connection ---
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ MongoDB successfully connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Database Health Check
app.get('/api/status', (req, res) => {
  const status = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    readyState: mongoose.connection.readyState
  };
  res.json(status);
});

// --- Auto-delete Cron ---
cron.schedule('0 0 * * *', async () => {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 4);
    const result = await Event.deleteMany({ eventDate: { $lte: cutoff } });
    if (result.deletedCount > 0) {
      console.log(`[Cron] Auto-deleted ${result.deletedCount} expired event(s).`);
    }
  } catch (err) {
    console.error('[Cron] Error:', err);
  }
});

// --- Admin Auth Middleware ---

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

function requireAdmin(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  const token = auth.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
  }
}

// --- Admin Login ---

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// --- Auth Endpoints ---

app.post('/api/clubs/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Club.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Club already registered with this email.' });

    const newClub = new Club({ name, email, password, status: 'Pending' });
    await newClub.save();
    res.status(201).json(newClub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clubs/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const club = await Club.findOne({ email });
    if (!club || club.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(club);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Admin Endpoints ---

app.get('/api/clubs', async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/clubs/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const club = await Club.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(club);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Event Endpoints ---

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// --- News Endpoints ---

app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/news', requireAdmin, async (req, res) => {
  try {
    const newNews = new News(req.body);
    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/news/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'News item not found' });
    res.json({ message: 'News item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Duty Leave API running on http://localhost:${PORT}`);
});
