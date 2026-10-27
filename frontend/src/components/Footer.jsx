import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="logo footer-logo" style={{ display: 'inline-block', marginBottom: '16px' }}>
            <img
              src="/images/zenschool_logo.jpg"
              alt="ZenSkool Logo"
              style={{ height: '70px', width: 'auto', objectFit: 'contain', background: '#ffffff', borderRadius: '8px', padding: '4px' }}
            />
          </Link>
          <p className="footer-desc">
            Smart School Management Platform empowering schools with seamless digital administration and real-time communication.
          </p>
        </div>

        <div>
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/academics">Academics</Link></li>
            <li><Link to="/student-life">Student Life</Link></li>
            <li><Link to="/admissions">Admissions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Resources</h4>
          <ul className="footer-links">
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/admissions">Scholarships</Link></li>
            <li><Link to="/about">Campus Safety</Link></li>
            <li><Link to="/login">ERP Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Contact</h4>
          <ul className="footer-contact">
            <li>
              <span className="footer-contact-icon">📞</span>
              <span>+91 98765 43210</span>
            </li>
            <li>
              <span className="footer-contact-icon">✉️</span>
              <span>info@zenskooll.com</span>
            </li>
            <li>
              <span className="footer-contact-icon">🌐</span>
              <span>www.zenskooll.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} ZenSkooll. All rights reserved.</p>
        <p>Designed & Powered by <strong>Zen4Tech Solutions</strong></p>
      </div>
    </footer>
  );
}
