import { Mail, MapPin, Phone, ShieldCheck, Newspaper, Award, Globe, Heart, Shield, Terminal, Zap, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="glass-panel fade-in-up" style={{padding: '3.5rem', borderRadius: '24px', maxWidth: '1000px', margin: '2rem auto', lineHeight: '1.9'}}>
      <h1 style={{fontSize: '3rem', marginBottom: '1.8rem', color: 'var(--primary)', fontWeight: 800}}>About DutyLeave HUB</h1>
      
      <section style={{marginBottom: '3rem'}}>
        <h2 style={{display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', marginBottom: '1rem'}}><Globe className="text-primary"/> Our Global Vision</h2>
        <p style={{fontSize: '1.15rem', color: 'var(--text-muted)'}}>
          Founded in 2024, DutyLeave Hub was born from a simple yet powerful observation: the most transformative learning happens outside the classroom. Whether it's a 48-hour hackathon, a national sports meet, or a cultural symphony, these moments define the university experience. Yet, students often find themselves penalized academically for pursuing these very opportunities due to outdated, paper-reliant attendance systems.
        </p>
      </section>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem'}}>
        <div className="glass-panel" style={{padding: '2rem', background: 'rgba(255,255,255,0.03)'}}>
          <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}><Award size={20} className="text-primary"/> The Mission</h3>
          <p style={{fontSize: '0.95rem'}}>To provide a transparent, immutable, and high-performance digital ledger for academic extracurricular exemptions, empowering 100,000+ students globally by 2027.</p>
        </div>
        <div className="glass-panel" style={{padding: '2rem', background: 'rgba(255,255,255,0.03)'}}>
          <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}><Shield size={20} className="text-primary"/> Our Core Values</h3>
          <p style={{fontSize: '0.95rem'}}>Accountability, Transparency, and Digital First. We believe every student's effort should be verifiable, recognizable, and integrated into their academic profile.</p>
        </div>
      </div>

      <section style={{marginBottom: '3rem'}}>
        <h2 style={{display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', marginBottom: '1rem'}}><Terminal size={24} className="text-primary"/> Technical Innovation</h2>
        <p style={{marginBottom: '1rem'}}>
          Our proprietary "Duty Leave Ledger" architecture ensures that every event is cryptographically linked to a verified university society. We implemented advanced **Canvas-based Client-side Compression** to handle high-resolution event posters, ensuring that our infrastructure remains lightning-fast even during peak campus seasons.
        </p>
        <p>
          By digitizing the workflow from Club Creation to Faculty Approval, we have reduced the administrative turnaround time for duty leaves by 85%, allowing students to focus on what matters: **Learning by Doing.**
        </p>
      </section>

      <section className="glass-panel" style={{padding: '2.5rem', border: '1px solid rgba(225,29,72,0.2)', background: 'rgba(225,29,72,0.02)'}}>
        <h2 style={{display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', marginBottom: '1rem'}}><Zap className="text-primary"/> The Future Roadmap</h2>
        <p>We are currently exploring integrations with major University Management Systems (LMS) and developing a mobile-first QR-code verification system for instantaneous on-ground event attendance tracking.</p>
      </section>
    </div>
  );
}

export function Privacy() {
  return (
    <div className="glass-panel fade-in-up" style={{padding: '3rem', borderRadius: '16px', maxWidth: '950px', margin: '2rem auto', lineHeight: '1.8'}}>
      <h1 style={{fontSize: '2.8rem', marginBottom: '1.5rem', color: 'var(--primary)', fontWeight: 800}}>Privacy Policy</h1>
      <p style={{marginBottom: '1.5rem', color: 'var(--text-muted)'}}><em>Last Updated: April 18, 2026</em></p>
      
      <p style={{marginBottom: '1.5rem'}}>
        At DutyLeave Hub, accessible from our primary web portal, the privacy of our visitors is one of our main priorities. This Privacy Policy document contains types of information that is collected and recorded by DutyLeave Hub and how we use it.
      </p>

      <h3 style={{fontSize: '1.6rem', marginTop: '2.5rem', marginBottom: '1rem'}}>Log Files and Analytical Data</h3>
      <p style={{marginBottom: '1rem'}}>
        DutyLeave Hub follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, and tracking users' movement on the website.
      </p>

      <h3 style={{fontSize: '1.6rem', marginTop: '2.5rem', marginBottom: '1rem'}}>Cookies and Web Beacons</h3>
      <p style={{marginBottom: '1rem'}}>
        Like any other website, DutyLeave Hub uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
      </p>

      <h3 style={{fontSize: '1.6rem', marginTop: '2.5rem', marginBottom: '1rem'}}>Google AdSense and DART Cookies</h3>
      <p style={{marginBottom: '1rem'}}>
        Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our portal and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" className="text-primary" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>
      </p>

      <h3 style={{fontSize: '1.6rem', marginTop: '2.5rem', marginBottom: '1rem'}}>Third Party Privacy Policies</h3>
      <p style={{marginBottom: '1.5rem'}}>
        DutyLeave Hub's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
      </p>

      <h3 style={{fontSize: '1.6rem', marginTop: '2.5rem', marginBottom: '1rem'}}>Children's Information (Compliance)</h3>
      <p style={{marginBottom: '1rem'}}>
        Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. DutyLeave Hub does not knowingly collect any Personal Identifiable Information from children under the age of 13.
      </p>

      <h3 style={{fontSize: '1.6rem', marginTop: '2.5rem', marginBottom: '1rem'}}>Data Consent</h3>
      <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
    </div>
  );
}

export function Terms() {
  return (
    <div className="glass-panel fade-in-up" style={{padding: '3rem', borderRadius: '16px', maxWidth: '950px', margin: '2rem auto', lineHeight: '1.8'}}>
      <h1 style={{fontSize: '2.8rem', marginBottom: '1.5rem', color: 'var(--primary)', fontWeight: 800}}>Terms of Service</h1>
      
      <h3 style={{fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem'}}>1. Acceptance of Terms</h3>
      <p style={{marginBottom: '1rem'}}>
        By accessing the website at DutyLeave Hub, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
      </p>

      <h3 style={{fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem'}}>2. Platform Use License</h3>
      <p style={{marginBottom: '1rem'}}>
        Permission is granted to temporarily view the materials (information or software) on DutyLeave Hub's website for internal university use only. This is the grant of a license, not a transfer of title. Under this license you may not:
      </p>
      <ul style={{paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc'}}>
        <li>Modify or copy the materials for commercial purposes.</li>
        <li>Attempt to decompile or reverse engineer any software contained on the platform.</li>
        <li>Remove any copyright or other proprietary notations from the materials.</li>
        <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
      </ul>

      <h3 style={{fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem'}}>3. Platform Integrity & Accountability</h3>
      <p style={{marginBottom: '1rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1.5rem', fontStyle: 'italic', background: 'rgba(225,29,72,0.05)', padding: '1.5rem'}}>
        Clubs and societies agree to strictly publish true and accurate event information. Fraudulent generation of Duty Leave credits or deceptive manipulation of event attendance logs will result in an immediate, permanent ban by system administrators and swift reporting to the affiliated academic institution's disciplinary board.
      </p>

      <h3 style={{fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem'}}>4. Disclaimer & Liability</h3>
      <p style={{marginBottom: '1rem'}}>
        The materials on DutyLeave Hub's website are provided on an 'as is' basis. DutyLeave Hub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
      </p>
    </div>
  );
}

export function News({ initialNews = [] }) {
  const [news, setNews] = useState(initialNews);
  const [loading, setLoading] = useState(news.length === 0);

  useEffect(() => {
    if (initialNews.length === 0) {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      fetch(`${API_BASE}/news`)
        .then(res => res.json())
        .then(data => {
          setNews(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [initialNews]);

  return (
    <div className="fade-in" style={{maxWidth: '1000px', margin: '2rem auto', padding: '0 1.5rem'}}>
      <div className="glass-panel" style={{padding: '3rem', borderRadius: '24px', marginBottom: '3rem', textAlign: 'center'}}>
        <h1 style={{fontSize: '3rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '1rem'}}>Platform Insights</h1>
        <p className="text-muted" style={{fontSize: '1.2rem'}}>Stay updated with the latest in university events, tech updates, and policy shifts.</p>
      </div>

      <div style={{display: 'grid', gap: '2rem'}}>
        {loading && <div className="glass-panel" style={{padding: '3rem', textAlign: 'center'}}>Syncing latest news...</div>}
        {!loading && news.length === 0 && <div className="glass-panel" style={{padding: '3rem', textAlign: 'center'}}>No announcements found. Stay tuned!</div>}
        
        {news.map((article, i) => (
          <article key={article._id || i} className="glass-panel fade-in-up" style={{padding: '2.5rem', borderRadius: '20px', transition: 'transform 0.3s ease', animationDelay: `${i * 0.1}s`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem'}}>
              <div>
                <span style={{background: 'rgba(225,29,72,0.1)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                  {article.category}
                </span>
                <h2 style={{fontSize: '1.8rem', marginTop: '1rem', lineHeight: '1.3'}}>{article.title}</h2>
              </div>
              <time style={{color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500}}>{article.date}</time>
            </div>
            <p style={{fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.7'}}>
              {article.content}
            </p>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer'}}>
              Read Full Article <ExternalLink size={16}/>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <div className="glass-panel fade-in-up" style={{padding: '3rem', borderRadius: '16px', maxWidth: '900px', margin: '2rem auto'}}>
      <h1 style={{fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary)', fontWeight: 800}}>Contact Us</h1>
      <p style={{marginBottom: '2rem', color: 'var(--text-muted)'}}>We typically respond to support queries and partnership requests within 24-48 business hours.</p>
      
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem', padding: '3rem 0'}}>
         <div style={{background: 'rgba(225,29,72,0.1)', padding: '2rem', borderRadius: '50%', color: 'var(--primary)', width: 'fit-content', boxShadow: '0 0 30px rgba(225,29,72,0.2)'}}>
            <Mail size={56}/>
         </div>
         <div style={{maxWidth: '500px'}}>
            <h4 style={{margin: '0 0 0.75rem 0', fontSize: '1.4rem', fontWeight: 700}}>Technical Support & Inquiries</h4>
            <a href="mailto:findyourdlhere@gmail.com" style={{fontSize: '2rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 800, letterSpacing: '-0.02em'}}>
               findyourdlhere@gmail.com
            </a>
            <p style={{marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.6'}}>
              For university collaborations, technical glitches, or society verification requests, please reach out directly at the email above.
            </p>
         </div>
         <div style={{marginTop: '2rem', display: 'flex', gap: '1rem'}}>
           <div className="glass-panel" style={{padding: '1rem 2rem', borderRadius: '50px', fontSize: '0.9rem'}}>Verified Infrastructure</div>
           <div className="glass-panel" style={{padding: '1rem 2rem', borderRadius: '50px', fontSize: '0.9rem'}}>Enterprise Response</div>
         </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{borderTop: '1px solid var(--border)', marginTop: '4rem', padding: '4rem 0', textAlign: 'center'}}>
      <div style={{display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '2rem'}}>
         <Link to="/about" className="nav-link" style={{fontWeight: 500}}>About Us</Link>
         <Link to="/news" className="nav-link" style={{fontWeight: 500}}>Platform News</Link>
         <Link to="/contact" className="nav-link" style={{fontWeight: 500}}>Contact Us</Link>
         <Link to="/privacy" className="nav-link" style={{fontWeight: 500}}>Privacy Policy</Link>
         <Link to="/terms" className="nav-link" style={{fontWeight: 500}}>Terms of Service</Link>
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem'}}>
         <ShieldCheck size={18} className="text-primary"/> &copy; {new Date().getFullYear()} DutyLeave HUB. All rights reserved.
      </div>
      <p style={{marginTop: '1rem', color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem'}}>Digitally Verified Extracurricular Framework v2.4.0</p>
    </footer>
  );
}
