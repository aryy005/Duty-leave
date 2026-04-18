import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Check, X, Building, AlertCircle, CalendarRange, LogOut, Lock, User, Eye, EyeOff, PlusCircle, Trash2, Calendar, Users, Download, List, Newspaper } from 'lucide-react';
import './index.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'dl_admin_token';

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        onLogin(data.token);
      }
    } catch {
      setError('Cannot reach server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="logo-icon-lg">
            <ShieldCheck size={36} />
          </div>
          <h1>DutyLeave Admin</h1>
          <p className="login-subtitle">Secure administrator access only</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="admin-username">
              <User size={15} /> Username
            </label>
            <input
              id="admin-username"
              type="text"
              className="form-control"
              placeholder="Enter admin username"
              required
              autoComplete="username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">
              <Lock size={15} /> Password
            </label>
            <div className="pw-wrap">
              <input
                id="admin-password"
                type={showPw ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw(p => !p)}
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating…' : 'Sign In'}
          </button>
        </form>

        <p className="login-footer">
          Session expires after 8 hours of inactivity.
        </p>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const compressImage = (file, maxWidth = 900) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
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
        ctx.drawImage(img, 0, 0, width, height);
        
        // Export to JPEG with 0.6 quality for maximum server efficiency
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    };
  });
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ token, onLogout }) {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [activeTab, setActiveTab] = useState('Clubs');
  const [filterClub, setFilterClub] = useState('All');
  const [formData, setFormData] = useState({
    title: '', date: '', eventDate: '', time: '', location: '', description: '', streams: [], image: '', society: '', status: 'Open'
  });

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const handleExpiry = useCallback(() => {
    alert('Your admin session has expired. Please log in again.');
    onLogout();
  }, [onLogout]);

  useEffect(() => {
    fetch(`${API_BASE}/clubs`, { headers: authHeaders })
      .then(res => {
        if (res.status === 403) { handleExpiry(); return null; }
        return res.json();
      })
      .then(data => { if (data) setClubs(data); })
      .catch(err => console.error('Error fetching clubs:', err));

    fetch(`${API_BASE}/events`)
      .then(res => res.json())
      .then(data => { if (data) setEvents(data); })
      .catch(err => console.error('Error fetching events:', err));

    fetch(`${API_BASE}/news`)
      .then(res => res.json())
      .then(data => { if (data) setNews(data); })
      .catch(err => console.error('Error fetching news:', err));
  }, []);

  const pendingClubs  = clubs.filter(c => c.status === 'Pending');
  const approvedClubs = clubs.filter(c => c.status === 'Approved');

  const handleAction = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/clubs/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.status === 403) { handleExpiry(); return; }
      if (res.ok) {
        setClubs(clubs.map(c => c._id === id ? { ...c, status: newStatus } : c));
      }
    } catch (err) {
      console.error('Action error:', err);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Force delete event "${title}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/events/${id}`, { method: 'DELETE', headers: authHeaders });
      if (res.status === 403) { handleExpiry(); return; }
      if (res.ok) setEvents(events.filter(e => e._id !== id));
      else alert('Failed to delete event');
    } catch (err) { console.error('Delete error', err); }
  };

  const exportToCSV = () => {
    let exportData = events;
    if (filterClub !== 'All') exportData = events.filter(e => e.society === filterClub);

    if (exportData.length === 0) return alert('No events to export.');

    const headers = ['Date', 'Venue', 'Short Description', 'Organizing Club Name', 'Status'];
    const csvRows = [];
    csvRows.push(headers.join(','));

    exportData.forEach(event => {
      const desc = `"${(event.description || '').replace(/"/g, '""')}"`;
      const title = `"${(event.title || '').replace(/"/g, '""')}"`;
      const venue = `"${(event.location || '').replace(/"/g, '""')}"`;
      const society = `"${(event.society || '').replace(/"/g, '""')}"`;
      const status = `"${(event.status || 'Open').replace(/"/g, '""')}"`;
      
      csvRows.push([event.date, venue, desc, society, status].join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DutyLeaves_History_${filterClub.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const AVAILABLE_STREAMS = ['All Streams', 'BCA', 'BBA', 'B.Tech', 'Degree'];

  const handleStreamChange = (stream) => {
    setFormData(prev => {
      const streams = prev.streams.includes(stream) ? prev.streams.filter(s => s !== stream) : [...prev.streams, stream];
      return { ...prev, streams };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setFormData({ ...formData, image: compressedBase64 });
      } catch (err) {
        console.error('Compression failed', err);
      }
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    let streams = formData.streams;
    if (streams.length === 0) streams = ['All Streams'];

    if (!formData.society) return alert('Please select a managing society from the dropdown.');
    if (!formData.eventDate) return alert('Please select an event date.');

    const newEvent = {
      ...formData,
      streams,
      status: formData.status || 'Open',
      image: formData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'
    };

    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST', headers: authHeaders, body: JSON.stringify(newEvent)
      });
      if (res.status === 403) { handleExpiry(); return; }
      const data = await res.json();
      setEvents([data, ...events]);
      setActiveTab('Events');
      setFormData({ title: '', date: '', eventDate: '', time: '', location: '', description: '', streams: [], image: '', society: '', status: 'Open' });
    } catch (err) { alert('Error uploading event'); }
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-icon"><ShieldCheck size={28} /></div>
          <h2>System Admin</h2>
        </div>
        <nav className="side-nav">
          <button onClick={() => setActiveTab('Clubs')} className={`nav-item ${activeTab === 'Clubs' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', color: 'inherit' }}><Building size={20} /> Club Verification</button>
          <button onClick={() => setActiveTab('Events')} className={`nav-item ${activeTab === 'Events' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', color: 'inherit' }}><CalendarRange size={20} /> Global Events</button>
          <button onClick={() => setActiveTab('News')} className={`nav-item ${activeTab === 'News' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', color: 'inherit' }}><Newspaper size={20} /> Manage News</button>
          <button onClick={() => setActiveTab('History')} className={`nav-item ${activeTab === 'History' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', color: 'inherit' }}><List size={20} /> DL History (Export)</button>
          <button onClick={() => setActiveTab('CreateEvent')} className={`nav-item ${activeTab === 'CreateEvent' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', color: 'inherit' }}><PlusCircle size={20} /> Upload DL</button>
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={onLogout} className="logout-btn" title="Sign out"><LogOut size={16} /> Sign Out</button>
          <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.75rem' }}>DutyLeave Admin Portal v1.0</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>{activeTab === 'Clubs' ? 'Verification Dashboard' : activeTab === 'Events' ? 'Global Events Manager' : activeTab === 'News' ? 'Broadcast Management' : activeTab === 'History' ? 'Platform DL History' : 'Upload Administrative DL'}</h1>
            <p>{activeTab === 'Clubs' ? 'Review and securely approve new club registrations.' : activeTab === 'Events' ? 'Force-manage and delete active Duty Leaves.' : activeTab === 'News' ? 'Post the latest university news and important alerts.' : activeTab === 'History' ? 'View tabular histories and export records to Excel.' : 'Create an event mapped to any approved society.'}</p>
          </div>
          <div className="admin-profile">
            <ShieldCheck size={16} /> Super Admin
          </div>
        </header>

        {activeTab === 'Clubs' && (
          <div className="fade-in">
            <section className="dashboard-section">
              <h2 className="section-title">Pending Approvals ({pendingClubs.length})</h2>
              {pendingClubs.length === 0 ? (
                <div className="empty-state">No pending registrations. You're all caught up!</div>
              ) : (
                <div className="cards-grid">
                  {pendingClubs.map((club, i) => (
                    <div className="admin-card fade-in" key={club._id} style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="card-header">
                        <h3>{club.name}</h3>
                        <span className="badge badge-warning">Pending</span>
                      </div>
                      <div className="card-body">
                        <p><strong>Email:</strong> {club.email}</p>
                        <p><strong>Requested:</strong> {new Date(club.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="card-actions">
                        <button onClick={() => handleAction(club._id, 'Rejected')} className="btn btn-outline btn-reject"><X size={16} /> Reject</button>
                        <button onClick={() => handleAction(club._id, 'Approved')} className="btn btn-primary btn-approve"><Check size={16} /> Approve</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="dashboard-section" style={{ marginTop: '4rem' }}>
              <h2 className="section-title">Verified Societies ({approvedClubs.length})</h2>
              <div className="table-container fade-in" style={{ animationDelay: '0.4s' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Society Name</th>
                      <th>Email Contact</th>
                      <th>Onboarded</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedClubs.map(club => (
                      <tr key={club._id}>
                        <td className="font-medium">{club.name}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{club.email}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{new Date(club.createdAt).toLocaleDateString()}</td>
                        <td><span className="badge badge-success">Active</span></td>
                        <td>
                          <button onClick={() => handleAction(club._id, 'Rejected')} className="btn-text" style={{ color: 'var(--danger, #ef4444)', cursor: 'pointer' }}>Revoke Access</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'Events' && (
          <section className="dashboard-section fade-in">
            <h2 className="section-title">All Platform Duty Leaves ({events.length})</h2>
            <div className="cards-grid">
              {events.map((event, i) => (
                <div className="admin-card fade-in-up" key={event._id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="card-header" style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', lineHeight: '1.4' }}>{event.title}</h3>
                    <span className="badge badge-primary">{event.status}</span>
                  </div>
                  <div className="card-body">
                    <p><strong>Society:</strong> {event.society}</p>
                    <p><strong>Date:</strong> {event.date} • {event.time}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                  </div>
                  <div className="card-actions" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                    <button onClick={() => handleDeleteEvent(event._id, event.title)} className="btn btn-outline" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', width: '100%', justifyContent: 'center' }}>
                      <Trash2 size={16} /> Force Delete Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {events.length === 0 && <div className="empty-state">No duty leaves have been posted on the platform yet.</div>}
          </section>
        )}

        {activeTab === 'News' && (
          <div className="fade-in">
            <section className="dashboard-section">
              <div className="admin-card" style={{ maxWidth: '600px', marginBottom: '3rem', padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PlusCircle size={20} className="text-primary"/> Post New Announcement</h2>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const newItem = {
                    title: form.title.value,
                    category: form.category.value,
                    content: form.content.value,
                    isPopup: form.isPopup.checked,
                    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                  };
                  try {
                    const res = await fetch(`${API_BASE}/news`, {
                      method: 'POST', headers: authHeaders, body: JSON.stringify(newItem)
                    });
                    if (res.ok) {
                      const data = await res.json();
                      setNews([data, ...news]);
                      form.reset();
                      alert('Broadcast successful! The latest news is now live for all students.');
                    } else {
                      const errData = await res.json();
                      alert(`Broadcast failed: ${errData.error || 'Server error'}`);
                    }
                  } catch (err) {
                    alert('Could not connect to the server. Please check your internet connection.');
                  }
                }}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label>Title</label>
                    <input name="title" type="text" className="form-control" required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label>Category</label>
                    <select name="category" className="form-control">
                      <option>Platform News</option>
                      <option>Tech Update</option>
                      <option>Important Alert</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Content Details</label>
                    <textarea name="content" className="form-control" style={{ minHeight: '100px' }} required></textarea>
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input name="isPopup" type="checkbox" id="news-is-popup" defaultChecked style={{ width: '18px', height: '18px' }} />
                    <label htmlFor="news-is-popup" style={{ margin: 0, fontWeight: 500, cursor: 'pointer' }}>Show as prominent popup for students</label>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Broadcast to Students</button>
                </form>
              </div>

              <h2 className="section-title">Active Announcements ({news.length})</h2>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Headline</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.map(item => (
                      <tr key={item._id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{item.date}</td>
                        <td><span className="badge badge-primary">{item.category}</span></td>
                        <td className="font-medium">{item.title}</td>
                        <td>
                          <button onClick={async () => {
                            if (!window.confirm('Delete this announcement?')) return;
                            const res = await fetch(`${API_BASE}/news/${item._id}`, { method: 'DELETE', headers: authHeaders });
                            if (res.ok) setNews(news.filter(n => n._id !== item._id));
                          }} className="btn-text" style={{ color: '#ef4444' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'History' && (
          <section className="dashboard-section fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>System History Log</h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <select className="form-control" style={{ width: '250px' }} value={filterClub} onChange={e => setFilterClub(e.target.value)}>
                  <option value="All">All Societies & Admin</option>
                  {approvedClubs.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  <option value="System Admin">System Admin</option>
                </select>
                <button onClick={exportToCSV} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Download size={18} /> Export to Excel
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Society / Club</th>
                    <th>Venue</th>
                    <th>Short Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {events.filter(e => filterClub === 'All' || e.society === filterClub).map((event, i) => (
                    <tr key={event._id} className="fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <td className="font-medium" style={{ whiteSpace: 'nowrap' }}>{event.date}</td>
                      <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{event.society}</td>
                      <td>{event.location}</td>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.description}</td>
                      <td><span className={`badge ${event.status === 'Closed' ? 'badge-danger' : event.status === 'Upcoming' ? 'badge-warning' : 'badge-success'}`}>{event.status}</span></td>
                    </tr>
                  ))}
                  {events.filter(e => filterClub === 'All' || e.society === filterClub).length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No duty leaves found for this filter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'CreateEvent' && (
          <section className="dashboard-section fade-in">
            <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
              <form onSubmit={handleCreateSubmit}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Map to Society <span style={{ color: '#ef4444' }}>*</span></label>
                  <select className="form-control" required value={formData.society} onChange={e => setFormData({ ...formData, society: e.target.value })}>
                    <option value="" disabled>-- Select Approved Club --</option>
                    {approvedClubs.map(club => (
                      <option key={club._id} value={club.name}>{club.name}</option>
                    ))}
                    <option value="System Admin">System Admin</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Event Title</label>
                  <input type="text" className="form-control" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Location</label>
                  <input type="text" className="form-control" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Event Banner Image</label>
                  <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} style={{ padding: '0.6rem 1rem' }} />
                  {formData.image && <div style={{ marginTop: '1rem' }}><img src={formData.image} alt="Preview" style={{ height: '140px', width: '100%', objectFit: 'cover', borderRadius: '12px' }} /></div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Event Date</label>
                    <input type="date" className="form-control" required value={formData.eventDate} onChange={e => {
                      const d = new Date(e.target.value);
                      const display = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
                      setFormData({ ...formData, eventDate: e.target.value, date: display });
                    }} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Time</label>
                    <input type="text" placeholder="e.g., 09:00 AM - 12:00 PM" className="form-control" required value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Status</label>
                    <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                      <option value="Open">Open</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Target Streams</label>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Leave blank for 'All Streams'</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                    {AVAILABLE_STREAMS.filter(s => s !== 'All Streams').map(stream => (
                      <div key={stream} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" id={`stream-${stream}`} checked={formData.streams.includes(stream)} onChange={() => handleStreamChange(stream)} />
                        <label htmlFor={`stream-${stream}`} style={{ margin: 0, fontWeight: 500, cursor: 'pointer' }}>{stream}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                  <textarea className="form-control" required style={{ minHeight: '120px' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setActiveTab('Events')}>Cancel</button>
                  <button type="submit" className="btn btn-primary"><PlusCircle size={18} /> Upload DL</button>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '');

  const handleLogin  = (t) => setToken(t);
  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken('');
  };

  if (!token) return <LoginScreen onLogin={handleLogin} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
