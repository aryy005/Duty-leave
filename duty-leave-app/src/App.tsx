import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { Calendar, MapPin, Search, CheckCircle, Clock, Users, ArrowRight, User, Building, LogIn, PlusCircle } from 'lucide-react';
import './index.css';
import { About, Privacy, Terms, Contact, Footer } from './Pages';

const API_BASE = 'http://localhost:5000/api';
const STUDENT_ID = 'student_test_user_id';

const AVAILABLE_STREAMS = ['All Streams', 'CSE', 'IT', 'Mech', 'Civil', 'BSc Physics', 'BSc Chemistry', 'BBA'];

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
               <div className="avatar" style={{background: 'var(--secondary)'}}>
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



function StudentDashboard({ events, participations, toggleParticipation, approvedClubs }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [streamFilter, setStreamFilter] = useState('All Streams');
  const [clubFilter, setClubFilter] = useState('All Clubs');
  
  const statusFilters = ['All', 'Open', 'Upcoming', 'Closed'];

  const filteredEvents = events.filter(event => {
    const matchStatus = statusFilter === 'All' ? true : event.status === statusFilter;
    const matchStream = streamFilter === 'All Streams' 
      ? true 
      : event.streams.includes('All Streams') || event.streams.includes(streamFilter);
    const matchClub = clubFilter === 'All Clubs' ? true : event.society === clubFilter;
    
    return matchStatus && matchStream && matchClub;
  });

  const recentEvents = events.slice(0, 3);

  const renderEventCard = (event) => {
    const isParticipating = participations.includes(event._id);
    return (
      <div className="event-card" key={event._id}>
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
          <div className="card-actions">
            <div className="leave-credits">
              <CheckCircle size={16} /> Provides {event.credits} Days DL
            </div>
            <button 
              onClick={() => toggleParticipation(event._id)}
              className={`btn ${isParticipating ? 'btn-outline' : 'btn-primary'}`} 
              disabled={event.status !== 'Open'}
            >
              {isParticipating ? 'Leave Event' : event.status === 'Open' ? 'Participate' : 'Closed'}
            </button>
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
          <p>Find events and participate.</p>
        </div>
      </div>

      {recentEvents.length > 0 && (
        <div className="recent-section" style={{marginBottom: '4rem'}}>
           <h2 style={{fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)'}}>
             <Clock size={20} className="text-secondary"/> Recently Uploaded DLs
           </h2>
           <div className="event-grid">
              {recentEvents.map(event => renderEventCard(event))}
           </div>
        </div>
      )}

      <h2 style={{fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
         <Calendar size={20} className="text-primary"/> Discover All Duty Leaves
      </h2>
      <div className="filters-container glass-panel" style={{padding: '1.5rem', borderRadius: '16px'}}>
        <div className="filters-row">
          <span className="filters-label">Status:</span>
          {statusFilters.map(f => (
            <button key={f} className={`filter-chip ${statusFilter === f ? 'active' : ''}`} onClick={() => setStatusFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div className="filters-row" style={{marginTop: '1rem'}}>
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
            <span className="filters-label">Target Stream:</span>
            <select className="select-input" value={streamFilter} onChange={(e) => setStreamFilter(e.target.value)}>
              {AVAILABLE_STREAMS.map(stream => (
                 <option key={stream} value={stream}>{stream}</option>
              ))}
            </select>
          </div>
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: 'auto'}}>
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

      <div className="event-grid">
        {filteredEvents.length === 0 && (
          <div className="empty-state glass-panel">
            No events match your current filters.
          </div>
        )}
        {filteredEvents.map(event => renderEventCard(event))}
      </div>
    </main>
  );
}



function StudentApp({ events, participations, toggleParticipation, approvedClubs }) {
  return (
    <>
      <Navbar role="student" />
      <Routes>
         <Route path="/" element={<StudentDashboard events={events} participations={participations} toggleParticipation={toggleParticipation} approvedClubs={approvedClubs} />} />
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
    if(isLogin) {
       try {
         const res = await fetch(`${API_BASE}/clubs/login`, {
           method: 'POST', headers: {'Content-Type': 'application/json'},
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
           method: 'POST', headers: {'Content-Type': 'application/json'},
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
           <h2 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>{isLogin ? 'Welcome Back' : 'Register Society'}</h2>
           <p className="text-muted" style={{marginBottom: '2rem'}}>
             {isLogin ? "Login to your club workspace." : "Create an account to start issuing DLs."}
           </p>
           
           <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label>Club / Society Name</label>
                  <input type="text" className="form-control" placeholder="e.g. Computer Science Club" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              )}
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" placeholder="society@college.edu" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="••••••••" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%', justifyContent: 'center', marginTop: '1rem'}}>
                 {isLogin ? 'Login to Dashboard' : 'Register Society'}
              </button>
           </form>
           
           <p style={{marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)'}}>
              {isLogin ? "Don't have an account? " : "Already registered? "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium" style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem'}}>
                 {isLogin ? 'Register Here' : 'Login'}
              </button>
           </p>
        </div>
     </div>
  );
}

function ClubDashboard({ events, currentClub }) {
  const clubEvents = events.filter(e => e.society === currentClub.name);
  
  return (
    <main className="fade-in">
       <div className="glass-panel" style={{padding: '2rem', borderRadius: '24px', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
             <h1 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>{currentClub.name} Portal</h1>
             <p className="text-muted">Manage your uploaded Duty Leaves and verify participants.</p>
          </div>
          <Link to="/club/create" className="btn btn-primary">
             <PlusCircle size={20}/> Upload New DL
          </Link>
       </div>
       
       <h3 style={{marginBottom: '1.5rem'}}>Events & Duty Leaves Issued</h3>
       <div className="event-grid">
         {clubEvents.length === 0 && (
           <div className="empty-state glass-panel" style={{gridColumn: '1 / -1'}}>
              <Building size={48} style={{opacity: 0.2, marginBottom: '1rem'}}/>
              <p>No Duty Leaves uploaded yet. Create an event to start issuing DLs.</p>
           </div>
         )}
         {clubEvents.map((event, index) => (
            <div className="event-card fade-in-up" key={event._id} style={{animationDelay: `${index * 0.1}s`}}>
               <div className="card-image-wrap">
                 <span className="event-status">{event.status}</span>
                 <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'} alt={event.title} />
               </div>
               <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-meta">
                     <span className="meta-item"><Calendar size={16}/> {event.date}</span>
                     <span className="meta-item"><Users size={16}/> • Participants</span>
                  </div>
                  <div className="card-actions">
                     <div className="leave-credits"><CheckCircle size={16}/> {event.credits} Days DL</div>
                     <span className="text-secondary font-medium" style={{fontSize: '0.9rem', cursor: 'pointer'}}>Edit Event</span>
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
    title: '', date: '', time: '', location: '', description: '', credits: 1, streams: [], image: ''
  });

  const handleStreamChange = (stream) => {
    setFormData(prev => {
      const streams = prev.streams.includes(stream) ? prev.streams.filter(s => s !== stream) : [...prev.streams, stream];
      return { ...prev, streams };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
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
        status: 'Open',
        image: formData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'
    };
    
    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
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
                   value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" className="form-control" required
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Event Banner Image / Poster</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} style={{padding: '0.6rem 1rem'}} />
            {formData.image && (
               <div style={{marginTop: '1rem'}}>
                 <img src={formData.image} alt="Preview" style={{height: '140px', width: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border)'}} />
               </div>
            )}
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem'}}>
            <div className="form-group">
              <label>Date</label>
              <input type="text" placeholder="e.g., May 10, 2026" className="form-control" required
                     value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="text" placeholder="e.g., 09:00 AM - 12:00 PM" className="form-control" required
                     value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
            <div className="form-group">
              <label>DL Provided (Days)</label>
              <input type="number" min="1" max="10" className="form-control" required
                     value={formData.credits} onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})} />
            </div>
          </div>

          <div className="form-group">
            <label>Target Streams</label>
            <p className="text-muted" style={{fontSize: '0.8rem', marginBottom: '0.5rem'}}>Leave blank for 'All Streams'</p>
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
                      value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem'}}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/club')}>Cancel</button>
            <button type="submit" className="btn btn-primary"><PlusCircle size={18}/> Publish DL</button>
          </div>
        </form>
      </div>
    </main>
  );
}

function ClubApp({ events, currentClub, setCurrentClub, addEvent }) {
  return (
    <>
      {currentClub && <Navbar role="club" currentClub={currentClub} />}
      <div style={{paddingTop: currentClub ? '0' : '2rem'}}>
        <Routes>
          <Route path="/" element={
             currentClub ? <ClubDashboard events={events} currentClub={currentClub} /> : <ClubAuth setCurrentClub={setCurrentClub} />
          } />
          <Route path="/create" element={
             currentClub ? <CreateEvent addEvent={addEvent} currentClub={currentClub} /> : <Navigate to="/club" />
          } />
        </Routes>
      </div>
    </>
  )
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [currentClub, setCurrentClub] = useState(null);
  const [approvedClubs, setApprovedClubs] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/events`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Error fetching events:", err));
      
    fetch(`${API_BASE}/participations/${STUDENT_ID}`)
      .then(res => res.json())
      .then(data => setParticipations(data.map(p => p.eventId)))
      .catch(err => console.error("Error fetching participations:", err));
      
    fetch(`${API_BASE}/clubs`)
      .then(res => res.json())
      .then(data => setApprovedClubs(data.filter(c => c.status === 'Approved')))
      .catch(err => console.error("Error fetching clubs:", err));
  }, []);

  const addEvent = (newEvent) => setEvents([newEvent, ...events]);

  const toggleParticipation = async (eventId) => {
    try {
      const res = await fetch(`${API_BASE}/participations`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ studentId: STUDENT_ID, eventId })
      });
      const data = await res.json();
      if (data.action === 'added') {
        setParticipations([...participations, eventId]);
      } else {
        setParticipations(participations.filter(id => id !== eventId));
      }
    } catch (err) {
      console.error("Error toggling participation:", err);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/club/*" element={<ClubApp events={events} currentClub={currentClub} setCurrentClub={setCurrentClub} addEvent={addEvent} />} />
          <Route path="/*" element={<StudentApp events={events} participations={participations} toggleParticipation={toggleParticipation} approvedClubs={approvedClubs} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
