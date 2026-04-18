import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, Search, Clock, Users, ArrowRight, User, Building, LogIn, PlusCircle, Pencil, Trash2, X, Download } from 'lucide-react';
import './index.css';
import { About, Privacy, Terms, Contact, Footer } from './Pages';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AVAILABLE_STREAMS = ['All Streams', 'CSE', 'IT', 'Mech', 'Civil', 'BSc Physics', 'BSc Chemistry', 'BBA'];

const compressImage = (file: File, maxWidth = 900): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Export to JPEG with 0.6 quality for maximum server efficiency
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    };
  });
};

function Navbar({ role, currentClub }) {
  return (
    <header className="navbar glass-panel slide-down">
      <Link to="/" className="logo-section">
        <div className="logo-icon">DL</div>
        <div className="logo-text">DutyLeave Hub</div>
      </Link>
      <div className="nav-actions">
        {role === 'student' && (
          <>
            <Link to="/" className="nav-link font-medium hover:text-primary transition-colors">Events Dashboard</Link>
          </>
        )}
        {role === 'club' && currentClub && (
          <>
            <Link to="/club/create" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
              <PlusCircle size={16} /> Upload DL
            </Link>
            <div className="user-profile">
              <div className="avatar" style={{ background: 'var(--secondary)' }}>
                {currentClub.name.charAt(0)}
              </div>
              <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{currentClub.name}</span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}



function StudentDashboard({ events, approvedClubs }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [streamFilter, setStreamFilter] = useState('All Streams');
  const [clubFilter, setClubFilter] = useState('All Clubs');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const statusFilters = ['All', 'Open', 'Upcoming', 'Closed'];

  const filteredEvents = events.filter(event => {
    const matchStatus = statusFilter === 'All' ? true : event.status === statusFilter;
    const matchStream = streamFilter === 'All Streams'
      ? true
      : event.streams.includes('All Streams') || event.streams.includes(streamFilter);
    const matchClub = clubFilter === 'All Clubs' ? true : event.society === clubFilter;

    return matchStatus && matchStream && matchClub;
  });

  const recentEvents = events.filter(e => {
    const uploadTime = new Date(e.createdAt || Date.now()).getTime();
    return (Date.now() - uploadTime) <= 24 * 60 * 60 * 1000; // Last 24 hours
  });

  const renderEventCard = (event) => {
    return (
      <div className="event-card fade-in-up" key={event._id} onClick={() => setSelectedEvent(event)} style={{ cursor: 'pointer' }}>
        <div className="card-image-wrap">
          <span className="event-status">{event.status}</span>
          <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'} alt={event.title} />
        </div>
        <div className="event-content">
          <div className="event-society">{event.society}</div>
          <h3 className="event-title">{event.title}</h3>
          <div className="stream-tags">
            {event.streams.map(stream => (
              <span key={stream} className="stream-tag">{stream}</span>
            ))}
          </div>
          <p className="event-desc">{event.description}</p>
          <div className="event-meta">
            <div className="meta-item"><Calendar size={16} className="meta-icon" />{event.date} • {event.time}</div>
            <div className="meta-item"><MapPin size={16} className="meta-icon" />{event.location}</div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <main className="fade-in-up">
      <div className="dashboard-controls">
        <div className="page-title">
          <h1>Events Discover</h1>
          <p>Discover upcoming events and duty leaves.</p>
        </div>
      </div>


      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={20} className="text-primary" /> Discover All Duty Leaves
      </h2>
      <div className="filters-container glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        <div className="filters-row">
          <span className="filters-label">Status:</span>
          {statusFilters.map(f => (
            <button key={f} className={`filter-chip ${statusFilter === f ? 'active' : ''}`} onClick={() => setStatusFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div className="filters-row" style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className="filters-label">Target Stream:</span>
            <select className="select-input" value={streamFilter} onChange={(e) => setStreamFilter(e.target.value)}>
              {AVAILABLE_STREAMS.map(stream => (
                <option key={stream} value={stream}>{stream}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: 'auto' }}>
            <span className="filters-label">Organizing Society:</span>
            <select className="select-input" value={clubFilter} onChange={(e) => setClubFilter(e.target.value)}>
              <option value="All Clubs">All Clubs / Societies</option>
              {approvedClubs.map(club => (
                <option key={club._id} value={club.name}>{club.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="event-grid" style={{ marginTop: '1.5rem' }}>
        {filteredEvents.length === 0 && (
          <div className="empty-state glass-panel">
            No events match your current filters.
          </div>
        )}
        {filteredEvents.map(event => renderEventCard(event))}
      </div>

      {recentEvents.length > 0 && (
        <div className="recent-section" style={{ marginTop: '4rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <Clock size={20} className="text-secondary" /> Recently Uploaded DLs
          </h2>
          <div className="event-grid">
            {recentEvents.map(event => renderEventCard(event))}
          </div>
        </div>
      )}
      
      {selectedEvent && (
        <div className="modal-overlay fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--bg-color)', zIndex: 1000, overflowY: 'auto' }}>
          <div className="modal-content fade-in-up" style={{ minHeight: '100vh', width: '100%', position: 'relative', paddingBottom: '4rem' }}>
            <button onClick={() => setSelectedEvent(null)} style={{ position: 'fixed', top: '20px', right: '20px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: 'background 0.2s', backdropFilter: 'blur(4px)' }} onMouseOver={e => e.currentTarget.style.background='rgba(0,0,0,0.8)'} onMouseOut={e => e.currentTarget.style.background='rgba(0,0,0,0.6)'}>
              <X size={24} />
            </button>
            
            <img src={selectedEvent.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'} alt={selectedEvent.title} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
            
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 2rem 0' }}>
              <div style={{ display: 'inline-block', padding: '0.3rem 0.8rem', background: 'rgba(225, 29, 72,0.1)', color: '#e11d48', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.8rem' }}>
                {selectedEvent.status}
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text-main)' }}>{selectedEvent.title}</h2>
              <p className="text-primary font-medium" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', margin: 0 }}>
                <Building size={16} /> {selectedEvent.society}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', margin: '1.5rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <Calendar size={18} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date &amp; Time</div>
                    <div className="font-medium">{selectedEvent.date}</div>
                    <div style={{ fontSize: '0.9rem' }}>{selectedEvent.time}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <MapPin size={18} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Location</div>
                    <div className="font-medium">{selectedEvent.location}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <Users size={18} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Eligible Streams</div>
                    <div className="font-medium">{selectedEvent.streams.join(', ')}</div>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.8rem' }}>About this Event</h4>
                <p style={{ lineHeight: '1.7', color: 'var(--text-muted)' }}>{selectedEvent.description}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={async () => {
                    const imgUrl = selectedEvent.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87';
                    try {
                      const res = await fetch(imgUrl);
                      if (!res.ok) throw new Error('Network error');
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedEvent.title.replace(/\s+/g, '_')}_poster.png`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    } catch (err) {
                      window.open(imgUrl, '_blank');
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem' }}>
                  <Download size={18} /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}



function StudentApp({ events, approvedClubs }) {
  return (
    <>
      <Navbar role="student" />
      <Routes>
        <Route path="/" element={<StudentDashboard events={events} approvedClubs={approvedClubs} />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  )
}

function ClubAuth({ setCurrentClub }) {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const res = await fetch(`${API_BASE}/clubs/login`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await res.json();
        if (!res.ok) return alert(data.error);

        if (data.status === 'Pending') {
          alert("Your registration is pending Admin approval. Please check back later.");
        } else if (data.status === 'Rejected') {
          alert("Your registration was rejected by the Admin.");
        } else {
          setCurrentClub(data);
        }
      } catch (err) {
        console.error(err);
        alert("Error logging in");
      }
    } else {
      try {
        const res = await fetch(`${API_BASE}/clubs/register`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok) return alert(data.error);
        alert("Registration successful! Your society is pending Admin approval.");
        setIsLogin(true);
      } catch (err) {
        console.error(err);
        alert("Error registering");
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel fade-in-up">
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{isLogin ? 'Welcome Back' : 'Register Society'}</h2>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>
          {isLogin ? "Login to your club workspace." : "Create an account to start issuing DLs."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Club / Society Name</label>
              <input type="text" className="form-control" placeholder="e.g. Computer Science Club" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" placeholder="society@college.edu" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="••••••••" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
            {isLogin ? 'Login to Dashboard' : 'Register Society'}
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already registered? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
            {isLogin ? 'Register Here' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

function ClubDashboard({ events, currentClub, deleteEvent }) {
  const clubEvents = events.filter(e => e.society === currentClub.name);
  const navigate = useNavigate();

  const handleDelete = async (eventId, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/events/${eventId}`, { method: 'DELETE' });
      if (res.ok) deleteEvent(eventId);
      else alert('Failed to delete event.');
    } catch (err) {
      alert('Error deleting event.');
    }
  };

  const exportToCSV = () => {
    if (clubEvents.length === 0) return alert('No events to export.');
    const headers = ['Date', 'Venue', 'Short Description', 'Status'];
    const csvRows = [];
    csvRows.push(headers.join(','));

    clubEvents.forEach(event => {
      const desc = `"${(event.description || '').replace(/"/g, '""')}"`;
      const title = `"${(event.title || '').replace(/"/g, '""')}"`;
      const venue = `"${(event.location || '').replace(/"/g, '""')}"`;
      const status = `"${(event.status || 'Open').replace(/"/g, '""')}"`;
      
      csvRows.push([event.date, venue, desc, status].join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `History_${currentClub.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="fade-in">
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{currentClub.name} Portal</h1>
          <p className="text-muted">Manage your uploaded Duty Leaves and verify participants.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={exportToCSV} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)' }}>
            <Download size={20} /> Export History (Excel)
          </button>
          <Link to="/club/create" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={20} /> Upload New DL
          </Link>
        </div>
      </div>

      <h3 style={{ marginBottom: '1.5rem' }}>Events & Duty Leaves Issued</h3>
      <div className="event-grid">
        {clubEvents.length === 0 && (
          <div className="empty-state glass-panel" style={{ gridColumn: '1 / -1' }}>
            <Building size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>No Duty Leaves uploaded yet. Create an event to start issuing DLs.</p>
          </div>
        )}
        {clubEvents.map((event, index) => (
          <div className="event-card fade-in-up" key={event._id} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="card-image-wrap">
              <span className="event-status">{event.status}</span>
              <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'} alt={event.title} />
            </div>
            <div className="event-content">
              <h3 className="event-title">{event.title}</h3>
              <div className="event-meta">
                <span className="meta-item"><Calendar size={16} /> {event.date}</span>
                <span className="meta-item"><Users size={16} /> • {event.streams.join(', ')}</span>
              </div>
              <div className="card-actions" style={{ justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  className="btn btn-outline"
                  style={{ flex: 'none', padding: '0.45rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={() => navigate(`/club/edit/${event._id}`)}
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  className="btn"
                  style={{ flex: 'none', padding: '0.45rem 1rem', fontSize: '0.85rem', background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={() => handleDelete(event._id, event.title)}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

function CreateEvent({ addEvent, currentClub }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', date: '', eventDate: '', time: '', location: '', description: '', streams: [], image: '', status: 'Open'
  });

  const handleStreamChange = (stream) => {
    setFormData(prev => {
      const streams = prev.streams.includes(stream) ? prev.streams.filter(s => s !== stream) : [...prev.streams, stream];
      return { ...prev, streams };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setFormData({ ...formData, image: compressedBase64 });
      } catch (err) {
        console.error('Compression failed', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let streams = formData.streams;
    if (streams.length === 0) streams = ['All Streams'];

    const newEvent = {
      ...formData,
      streams,
      society: currentClub.name,
      status: formData.status || 'Open',
      image: formData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'
    };

    if (!newEvent.eventDate) {
      alert('Please select an event date.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      const data = await res.json();
      addEvent(data);
      navigate('/club');
    } catch (err) {
      console.error(err);
      alert("Error creating event");
    }
  };

  return (
    <main className="fade-in-up">
      <div className="dashboard-controls mb-4">
        <div className="page-title">
          <h1>Upload Duty Leave</h1>
          <p>Provide details for the event so students can claim their attendance and DL.</p>
        </div>
      </div>

      <div className="form-container glass-panel">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event / Activity Title</label>
            <input type="text" className="form-control" required
              value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" className="form-control" required
              value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Event Banner Image / Poster</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} style={{ padding: '0.6rem 1rem' }} />
            {formData.image && (
              <div style={{ marginTop: '1rem' }}>
                <img src={formData.image} alt="Preview" style={{ height: '140px', width: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border)' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Event Date</label>
              <input
                type="date"
                className="form-control"
                required
                value={formData.eventDate}
                onChange={e => {
                  const d = new Date(e.target.value);
                  const display = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
                  setFormData({ ...formData, eventDate: e.target.value, date: display });
                }}
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="text" placeholder="e.g., 09:00 AM - 12:00 PM" className="form-control" required
                value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="Open">Open</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Target Streams</label>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Leave blank for 'All Streams'</p>
            <div className="checkbox-grid">
              {AVAILABLE_STREAMS.filter(s => s !== 'All Streams').map(stream => (
                <div className="checkbox-item" key={stream}>
                  <input type="checkbox" id={`stream-${stream}`} checked={formData.streams.includes(stream)} onChange={() => handleStreamChange(stream)} />
                  <label htmlFor={`stream-${stream}`}>{stream}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Description & Scope</label>
            <textarea className="form-control" required placeholder="Describe the event and who is eligible for DL..."
              value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/club')}>Cancel</button>
            <button type="submit" className="btn btn-primary"><PlusCircle size={18} /> Publish DL</button>
          </div>
        </form>
      </div>
    </main>
  );
}

function EditEvent({ events, updateEvent, currentClub }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e._id === id);

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (event) {
      // Convert ISO eventDate back to yyyy-mm-dd for the date input
      const isoDate = event.eventDate
        ? new Date(event.eventDate).toISOString().slice(0, 10)
        : '';
      setFormData({
        title: event.title,
        date: event.date,
        eventDate: isoDate,
        time: event.time,
        location: event.location,
        description: event.description,
        streams: event.streams.filter(s => s !== 'All Streams'),
        image: event.image || '',
        status: event.status || 'Open',
      });
    }
  }, [event]);

  if (!event || !formData) return (
    <main className="fade-in-up" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <p className="text-muted">Event not found.</p>
    </main>
  );

  const handleStreamChange = (stream) => {
    setFormData(prev => {
      const streams = prev.streams.includes(stream)
        ? prev.streams.filter(s => s !== stream)
        : [...prev.streams, stream];
      return { ...prev, streams };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setFormData(prev => prev ? { ...prev, image: compressedBase64 } : null);
      } catch (err) {
        console.error('Compression failed', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let streams = formData.streams;
    if (streams.length === 0) streams = ['All Streams'];

    const payload = {
      ...formData,
      streams,
      society: currentClub.name,
      image: formData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'
    };

    try {
      const res = await fetch(`${API_BASE}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) { alert('Failed to update event.'); return; }
      const updated = await res.json();
      updateEvent(updated);
      navigate('/club');
    } catch (err) {
      console.error(err);
      alert('Error updating event.');
    }
  };

  return (
    <main className="fade-in-up">
      <div className="dashboard-controls mb-4">
        <div className="page-title">
          <h1>Edit Duty Leave</h1>
          <p>Update the details of this duty leave event.</p>
        </div>
      </div>

      <div className="form-container glass-panel">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event / Activity Title</label>
            <input type="text" className="form-control" required
              value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" className="form-control" required
              value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Event Banner Image / Poster</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} style={{ padding: '0.6rem 1rem' }} />
            {formData.image && (
              <div style={{ marginTop: '1rem' }}>
                <img src={formData.image} alt="Preview" style={{ height: '140px', width: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border)' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Event Date</label>
              <input
                type="date"
                className="form-control"
                required
                value={formData.eventDate}
                onChange={e => {
                  const d = new Date(e.target.value);
                  const display = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
                  setFormData({ ...formData, eventDate: e.target.value, date: display });
                }}
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="text" placeholder="e.g., 09:00 AM - 12:00 PM" className="form-control" required
                value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="Open">Open</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Target Streams</label>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Leave blank for 'All Streams'</p>
            <div className="checkbox-grid">
              {AVAILABLE_STREAMS.filter(s => s !== 'All Streams').map(stream => (
                <div className="checkbox-item" key={stream}>
                  <input type="checkbox" id={`edit-stream-${stream}`} checked={formData.streams.includes(stream)} onChange={() => handleStreamChange(stream)} />
                  <label htmlFor={`edit-stream-${stream}`}>{stream}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Description &amp; Scope</label>
            <textarea className="form-control" required placeholder="Describe the event and who is eligible for DL..."
              value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/club')}>Cancel</button>
            <button type="submit" className="btn btn-primary"><Pencil size={18} /> Save Changes</button>
          </div>
        </form>
      </div>
    </main>
  );
}

function ClubApp({ events, currentClub, setCurrentClub, addEvent, updateEvent, deleteEvent }) {
  return (
    <>
      {currentClub && <Navbar role="club" currentClub={currentClub} />}
      <div style={{ paddingTop: currentClub ? '0' : '2rem' }}>
        <Routes>
          <Route path="/" element={
            currentClub ? <ClubDashboard events={events} currentClub={currentClub} deleteEvent={deleteEvent} /> : <ClubAuth setCurrentClub={setCurrentClub} />
          } />
          <Route path="/create" element={
            currentClub ? <CreateEvent addEvent={addEvent} currentClub={currentClub} /> : <Navigate to="/club" />
          } />
          <Route path="/edit/:id" element={
            currentClub ? <EditEvent events={events} updateEvent={updateEvent} currentClub={currentClub} /> : <Navigate to="/club" />
          } />
        </Routes>
      </div>
    </>
  )
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [currentClub, setCurrentClub] = useState(null);
  const [approvedClubs, setApprovedClubs] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/events`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Error fetching events:", err));

    fetch(`${API_BASE}/clubs`)
      .then(res => res.json())
      .then(data => setApprovedClubs(data.filter(c => c.status === 'Approved')))
      .catch(err => console.error("Error fetching clubs:", err));
  }, []);

  const addEvent    = (newEvent)      => setEvents([newEvent, ...events]);
  const updateEvent = (updatedEvent)  => setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
  const deleteEvent = (deletedId)     => setEvents(events.filter(e => e._id !== deletedId));

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/club/*" element={<ClubApp events={events} currentClub={currentClub} setCurrentClub={setCurrentClub} addEvent={addEvent} updateEvent={updateEvent} deleteEvent={deleteEvent} />} />
          <Route path="/*" element={<StudentApp events={events} approvedClubs={approvedClubs} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
