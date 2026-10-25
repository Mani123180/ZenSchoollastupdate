import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="header public-header">
      <div className="container nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img
            src="/images/zenschool_logo.jpg"
            alt="ZenSkool Logo"
            style={{ height: '48px', width: 'auto', borderRadius: '10px', objectFit: 'contain', boxShadow: '0 2px 8px rgba(124, 58, 237, 0.15)' }}
          />
          <div className="zenskool-brand-wrap">
            <div className="zenskool-brand-text">
              <span className="brand-zen">ZEN</span>
              <span className="brand-skool">SKOOLL</span>
            </div>
          </div>
        </Link>

        <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <a
            href="/#home"
            className="nav-link"
            onClick={(e) => {
              closeMenu();
              if (window.location.pathname === '/') {
                e.preventDefault();
                document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Home
          </a>
          <a
            href="/#features-section"
            className="nav-link"
            onClick={(e) => {
              closeMenu();
              if (window.location.pathname === '/') {
                e.preventDefault();
                document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Features
          </a>
          <a
            href="/#pricing-section"
            className="nav-link"
            onClick={(e) => {
              closeMenu();
              if (window.location.pathname === '/') {
                e.preventDefault();
                document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Pricing
          </a>
          <a
            href="/#about-section"
            className="nav-link"
            onClick={(e) => {
              closeMenu();
              if (window.location.pathname === '/') {
                e.preventDefault();
                document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            About Us
          </a>
          <NavLink
            to="/contact"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Contact Us
          </NavLink>

          {user ? (
            <NavLink to="/portal" className="nav-link mobile-portal-login" onClick={closeMenu}>
              ERP Portal ({user.role})
            </NavLink>
          ) : (
            <NavLink to="/login" className="nav-link mobile-portal-login" onClick={closeMenu}>
              Portal Login
            </NavLink>
          )}
        </nav>

        <div className="nav-cta">
          {user ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link
                to="/portal"
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                ERP Portal
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="btn btn-outline"
                style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.85rem' }}
            >
              Portal Login
            </Link>
          )}
        </div>

        <button
          className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          aria-label="Toggle Navigation"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
