import React from 'react';
import { Mail, MapPin, Phone, ShieldCenter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="glass-panel fade-in-up" style={{padding: '3rem', borderRadius: '16px', maxWidth: '900px', margin: '2rem auto', lineHeight: '1.8'}}>
      <h1 style={{fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary)'}}>About DutyLeave Hub</h1>
      <p style={{marginBottom: '1rem', fontSize: '1.1rem'}}>
        Welcome to DutyLeave Hub, the premier digital infrastructure dedicated to bridging the logistical gaps between academic institutions, student-led societies, and thousands of participating students. We recognized that extracurricular engagement forms the bedrock of a holistic education, yet the administrative burden of tracking attendance and approving duty leaves remained trapped in outdated, manual, and often disorganized paper-based procedures.
      </p>
      <p style={{marginBottom: '1rem', fontSize: '1.1rem'}}>
        Our mission is to empower universities by digitizing their ecosystem. By providing a secure portal where registered, faculty-approved clubs can publish verifiable events, we eliminate schedule conflicts and foster a rich, active campus culture. Every event hosted on our platform is specifically targeted to corresponding academic streams, guaranteeing that students are discovering opportunities that directly complement their future careers, be it in Computer Science, Applied Physics, or Cultural Arts.
      </p>
      <h3 style={{fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem'}}>Why Digital Duty Leaves Matter</h3>
      <p style={{marginBottom: '1rem'}}>
        Transparency and accountability are paramont. When a student attends an immersive 4-day technical hackathon, their academic attendance shouldn't suffer without verifiable cause. DutyLeave Hub creates an immutable digital record of participation. Authorized club administrators digitally sanction these attendances, passing them directly onto the academic faculty dashboard for final review, circumventing lost paperwork and ensuring students are rightfully awarded their academic safety nets.
      </p>
      <p>
        As we continue to grow, DutyLeave Hub relies on continuous feedback from our incredibly active community of organizers and learners. If you have suggestions or represent a college board looking to integrate our platform, please reach out via our Contact portal. 
      </p>
    </div>
  );
}

export function Privacy() {
  return (
    <div className="glass-panel fade-in-up" style={{padding: '3rem', borderRadius: '16px', maxWidth: '900px', margin: '2rem auto', lineHeight: '1.8'}}>
      <h1 style={{fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary)'}}>Privacy Policy</h1>
      <p style={{marginBottom: '1rem'}}><em>Last Updated: April 11, 2026</em></p>
      <p style={{marginBottom: '1rem'}}>
        Your privacy is critically important to us. At DutyLeave Hub, we have a few fundamental principles: We don't ask you for personal information unless we truly need it. We don't share your personal information with anyone except to comply with the law, develop our products, or protect our rights.
      </p>
      <h3 style={{marginTop: '2rem', marginBottom: '0.5rem'}}>Information We Automatically Collect & Third-Party Advertising</h3>
      <p style={{marginBottom: '1rem'}}>
        Like most website operators, DutyLeave Hub collects non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request. Our purpose in collecting non-personally identifying information is to better understand how DutyLeave Hub visitors use its website.
      </p>
      <p style={{marginBottom: '1rem'}}>
        <strong>Google AdSense and Cookies:</strong> We use third-party advertising companies, specifically Google, to serve ads when you visit our Website. Google uses cookies (such as the DoubleClick cookie) to help serve the ads it displays on the websites of its partners. When users visit a partner's website and either view or click on an ad, a cookie may be dropped on that end user's browser. Third party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting Google Ads Settings.
      </p>
      <h3 style={{marginTop: '2rem', marginBottom: '0.5rem'}}>Gathering of Personally-Identifying Information</h3>
      <p>
        Certain visitors to DutyLeave Hub's websites choose to interact with DutyLeave Hub in ways that require us to gather personally-identifying information (such as logging into a club account or registering a student ID). The amount and type of information that we gather depends on the nature of the interaction. 
      </p>
    </div>
  );
}

export function Terms() {
  return (
    <div className="glass-panel fade-in-up" style={{padding: '3rem', borderRadius: '16px', maxWidth: '900px', margin: '2rem auto', lineHeight: '1.8'}}>
      <h1 style={{fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary)'}}>Terms of Service</h1>
      <p style={{marginBottom: '1rem'}}>
        By accessing the website at DutyLeave Hub, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
      </p>
      <h3 style={{marginTop: '2rem', marginBottom: '0.5rem'}}>Use License</h3>
      <p style={{marginBottom: '1rem'}}>
        Permission is granted to temporarily view the materials (information or software) on DutyLeave Hub's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title. Under this license you may not attempt to reverse engineer any software contained on DutyLeave Hub's website, or remove any copyright or other proprietary notations from the materials.
      </p>
      <h3 style={{marginTop: '2rem', marginBottom: '0.5rem'}}>Platform Integrity</h3>
      <p>
        Clubs and societies agree to strictly publish true and accurate event information. Fraudulent generation of Duty Leave credits or deceptive manipulation of event attendance logs will result in an immediate, permanent ban by system administrators and swift reporting to the affiliated academic institution.
      </p>
    </div>
  );
}

export function Contact() {
  return (
    <div className="glass-panel fade-in-up" style={{padding: '3rem', borderRadius: '16px', maxWidth: '900px', margin: '2rem auto'}}>
      <h1 style={{fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary)'}}>Contact Us</h1>
      <p style={{marginBottom: '2rem', color: 'var(--text-muted)'}}>We typically respond to support queries and partnership requests within 24-48 business hours.</p>
      
      <div style={{display: 'flex', gap: '3rem', flexWrap: 'wrap'}}>
         <div style={{flex: 1, minWidth: '300px'}}>
           <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
              <div style={{background: 'rgba(99,102,241,0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)'}}><MapPin size={24}/></div>
              <div>
                 <h4 style={{margin: 0, fontSize: '1.1rem'}}>Corporate Office</h4>
                 <p style={{margin: 0, color: 'var(--text-muted)'}}>123 Tech Campus Drive, Silicon Lane, CA 94000</p>
              </div>
           </div>
           <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
              <div style={{background: 'rgba(99,102,241,0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)'}}><Phone size={24}/></div>
              <div>
                 <h4 style={{margin: 0, fontSize: '1.1rem'}}>Phone Line</h4>
                 <p style={{margin: 0, color: 'var(--text-muted)'}}>+1 (555) 123-4567</p>
              </div>
           </div>
           <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{background: 'rgba(99,102,241,0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)'}}><Mail size={24}/></div>
              <div>
                 <h4 style={{margin: 0, fontSize: '1.1rem'}}>Email Support</h4>
                 <p style={{margin: 0, color: 'var(--text-muted)'}}>support@dutyleavehub.com</p>
              </div>
           </div>
         </div>

         <div style={{flex: 1, minWidth: '300px'}}>
           <form className="auth-form" onSubmit={(e) => { e.preventDefault(); alert('Message sent effectively to support team.'); }}>
              <div className="form-group"><input type="text" className="form-control" placeholder="Your Name" required/></div>
              <div className="form-group"><input type="email" className="form-control" placeholder="Your Email Address" required/></div>
              <div className="form-group"><textarea className="form-control" style={{minHeight: '120px'}} placeholder="How can we help you?" required></textarea></div>
              <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Send Message</button>
           </form>
         </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{borderTop: '1px solid var(--border)', marginTop: '4rem', padding: '3rem 0', textAlign: 'center'}}>
      <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem'}}>
         <Link to="/about" className="nav-link">About Us</Link>
         <Link to="/contact" className="nav-link">Contact Us</Link>
         <Link to="/privacy" className="nav-link">Privacy Policy</Link>
         <Link to="/terms" className="nav-link">Terms of Service</Link>
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
         <ShieldCenter size={16}/> &copy; {new Date().getFullYear()} DutyLeave Hub. All rights reserved.
      </div>
    </footer>
  );
}
