import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Check, X, Building, AlertCircle, CalendarRange, LogOut, Lock, User, Eye, EyeOff } from 'lucide-react';
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

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ token, onLogout }) {
  const [clubs, setClubs] = useState([]);

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // Auto-logout on token expiry (403 from any request)
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

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-icon"><ShieldCheck size={28} /></div>
          <h2>System Admin</h2>
        </div>
        <nav className="side-nav">
          <a href="#" className="nav-item active"><Building size={20} /> Club Verification</a>
          <a href="#" className="nav-item"><CalendarRange size={20} /> Global Events</a>
          <a href="#" className="nav-item"><AlertCircle size={20} /> System Logs</a>
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={onLogout}
            className="logout-btn"
            title="Sign out"
          >
            <LogOut size={16} /> Sign Out
          </button>
          <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.75rem' }}>
            DutyLeave Admin Portal v1.0
          </p>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>Verification Dashboard</h1>
            <p>Review and securely approve new club registrations.</p>
          </div>
          <div className="admin-profile">
            <ShieldCheck size={16} /> Super Admin
          </div>
        </header>

        {/* Pending */}
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
                    <button onClick={() => handleAction(club._id, 'Rejected')} className="btn btn-outline btn-reject">
                      <X size={16} /> Reject
                    </button>
                    <button onClick={() => handleAction(club._id, 'Approved')} className="btn btn-primary btn-approve">
                      <Check size={16} /> Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Approved */}
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
                      <button
                        onClick={() => handleAction(club._id, 'Rejected')}
                        className="btn-text"
                        style={{ color: 'var(--danger, #ef4444)', cursor: 'pointer' }}
                      >
                        Revoke Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
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
