const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Club = require('./models/Club');
const Event = require('./models/Event');
const Participation = require('./models/Participation');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/', (req, res) => res.json({ status: 'Duty Leave API is running 🚀' }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/duty-leave-hub';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB successfully connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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

app.patch('/api/clubs/:id/status', async (req, res) => {
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

// --- Participation Endpoints ---

app.get('/api/participations/:studentId', async (req, res) => {
  try {
    const participations = await Participation.find({ studentId: req.params.studentId });
    res.json(participations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/participations', async (req, res) => {
  try {
    const { studentId, eventId } = req.body;
    
    // Toggle logic: If exists, remove it. If not, add it.
    const existing = await Participation.findOne({ studentId, eventId });
    if (existing) {
      await Participation.findByIdAndDelete(existing._id);
      return res.json({ action: 'removed', eventId });
    } else {
      const newPart = new Participation({ studentId, eventId });
      await newPart.save();
      return res.status(201).json({ action: 'added', eventId });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Duty Leave API running on http://localhost:${PORT}`);
});
