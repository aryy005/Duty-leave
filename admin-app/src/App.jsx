import React, { useState } from 'react';
import { ShieldCheck, Check, X, Building, AlertCircle, CalendarRange } from 'lucide-react';
import './index.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [clubs, setClubs] = useState([]);

  React.useEffect(() => {
    fetch(`${API_BASE}/clubs`)
      .then(res => res.json())
      .then(data => setClubs(data))
      .catch(err => console.error("Error fetching clubs:", err));
  }, []);

  const pendingClubs = clubs.filter(c => c.status === 'Pending');
  const approvedClubs = clubs.filter(c => c.status === 'Approved');

  const handleAction = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/clubs/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setClubs(clubs.map(club => club._id === id ? { ...club, status: newStatus } : club));
      }
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  return (
    <div className="admin-layout">
       <aside className="sidebar">
          <div className="logo-section">
             <div className="logo-icon"><ShieldCheck size={28}/></div>
             <h2>System Admin</h2>
          </div>
          <nav className="side-nav">
             <a href="#" className="nav-item active"><Building size={20}/> Club Verification</a>
             <a href="#" className="nav-item"><CalendarRange size={20}/> Global Events</a>
             <a href="#" className="nav-item"><AlertCircle size={20}/> System Logs</a>
          </nav>
          
          <div style={{marginTop: 'auto', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '0.85rem'}}>
             DutyLeave Admin Portal v1.0
          </div>
       </aside>

       <main className="main-content">
          <header className="page-header">
             <div>
               <h1>Verification Dashboard</h1>
               <p>Review and securely approve new club combinations.</p>
             </div>
             <div className="admin-profile">Super Admin</div>
          </header>

          <section className="dashboard-section">
             <h2 className="section-title">Pending Approvals ({pendingClubs.length})</h2>
             {pendingClubs.length === 0 ? (
                <div className="empty-state">No pending registrations. You're all caught up!</div>
             ) : (
                <div className="cards-grid">
                   {pendingClubs.map((club, i) => (
                      <div className="admin-card fade-in" key={club._id} style={{animationDelay: `${i * 0.1}s`}}>
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
                               <X size={16}/> Reject
                            </button>
                            <button onClick={() => handleAction(club._id, 'Approved')} className="btn btn-primary btn-approve">
                               <Check size={16}/> Approve
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </section>

          <section className="dashboard-section" style={{marginTop: '4rem'}}>
             <h2 className="section-title">Verified Societies ({approvedClubs.length})</h2>
             <div className="table-container fade-in" style={{animationDelay: '0.4s'}}>
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
                            <td style={{color: 'var(--text-muted)'}}>{club.email}</td>
                            <td style={{color: 'var(--text-muted)'}}>{new Date(club.createdAt).toLocaleDateString()}</td>
                            <td><span className="badge badge-success">Active</span></td>
                            <td>
                               <button disabled className="btn-text">Revoke Access</button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </section>
       </main>
    </div>
  )
}
