import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activePreset, setActivePreset] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  
  const demoCredentials = {
    superadmin: {
      label: 'Super Admin',
      user: 'superadmin@zenschool.com',
      pass: 'SuperAdmin@123',
    },
    schooladmin_ssv: {
      label: 'School Admin',
      user: 'admin@ssvschool.com',
      pass: 'admin123',
    },
    principal: {
      label: 'Principal',
      user: 'principal@ssvschool.com',
      pass: 'principal123',
    },
    teacher: {
      label: 'Teacher',
      user: 'teacher@ssvschool.com',
      pass: 'teacher123',
    },
    student: {
      label: 'Student',
      user: 'student@ssvschool.com',
      pass: 'student123',
    },
    parent: {
      label: 'Parent',
      user: 'parent@ssvschool.com',
      pass: 'parent123',
    },
  };

  const handleFillDemo = async (key) => {
    const cred = demoCredentials[key];
    if (!cred) return;
    setActivePreset(key);
    setUsername(cred.user);
    setPassword(cred.pass);
    setError('');
    setSubmitting(true);
    const res = await login(cred.user, cred.pass);
    setSubmitting(false);
    if (res.success) {
      navigate('/portal');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Invalid username/email or password.');
      return;
    }

    setError('');
    setSubmitting(true);
    const res = await login(username.trim(), password);
    setSubmitting(false);
    if (res.success) {
      navigate('/portal');
    } else {
      setError(res.message || 'Invalid username/email or password.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        
        <div className="login-header" style={{ background: '#ffffff', borderBottom: '2px solid #e2e8f0', padding: '18px 16px', display: 'flex', justifyContent: 'center' }}>
          <img
            src="/images/zenschool_logo.png"
            alt="ZenSkool Logo"
            className="login-logo-img"
            style={{ height: '80px', maxWidth: '260px', width: 'auto', objectFit: 'contain', margin: '0 auto', display: 'block' }}
          />
        </div>

        
        <div className="login-body">
          {error && (
            <div className="error-msg" style={{ display: 'block', padding: '8px 12px', fontSize: '0.82rem', marginBottom: '10px' }}>
              {error}
            </div>
          )}

          
          <div
            className="demo-login-box"
            style={{
              background: 'rgba(30, 58, 138, 0.04)',
              border: '1px dashed rgba(30, 58, 138, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 10px',
              marginBottom: '14px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '6px' }}>
              Quick Demo Login Presets:
            </p>
            <div className="role-quick-links">
              {Object.entries(demoCredentials).map(([key, cred]) => (
                <button
                  key={key}
                  type="button"
                  className={`role-btn ${activePreset === key ? 'active' : ''}`}
                  onClick={() => handleFillDemo(key)}
                >
                  {cred.label}
                </button>
              ))}
            </div>
          </div>

          <form id="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Email / Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="e.g. superadmin@zenschool.com"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setActivePreset('');
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setActivePreset('');
                }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={submitting}
            >
              {submitting ? 'Verifying Credentials...' : 'Log In to Portal'}
            </button>

            <Link
              to="/"
              className="btn btn-outline"
              style={{
                width: '100%',
                display: 'block',
                textAlign: 'center',
                marginTop: '10px',
                textDecoration: 'none',
                padding: '9px 12px',
                borderRadius: '50px',
                fontSize: '0.88rem',
                boxSizing: 'border-box',
              }}
            >
              Go Back to Home
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
