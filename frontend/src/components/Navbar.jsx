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
        <Link to="/" className="logo" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/images/zenschool_logo.png"
            alt="ZenSkool Logo"
            style={{ height: '70px', maxWidth: '240px', width: 'auto', objectFit: 'contain', display: 'block' }}
          />
        </Link>

        <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/features"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Features
          </NavLink>
          <NavLink
            to="/pricing"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Pricing
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            About Us
          </NavLink>
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

        <div className="nav-actions">
          {user ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  closeMenu();
                  navigate('/portal');
                }}
                style={{ padding: '8px 18px', fontSize: '0.9rem' }}
              >
                ERP Portal
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  closeMenu();
                  logout();
                  navigate('/');
                }}
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" onClick={closeMenu} style={{ padding: '10px 22px' }}>
              Portal Login
            </Link>
          )}
        </div>

        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle Navigation"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
