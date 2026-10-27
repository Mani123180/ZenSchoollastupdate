import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const highlights = [
    { title: 'Academic Timetables', desc: 'Interactive period scheduling with auto-matching faculty and room allocation.', icon: '📅' },
    { title: 'Batch Examination Dates', desc: 'Schedule 5+ subjects in one table format and publish dates directly to students and parents.', icon: '🎯' },
    { title: 'Student Fee & Billing', desc: 'Transparent fee collections, automated receipts, due tracking, and ledger records.', icon: '💳' },
    { title: 'Faculty & Staff Payroll', desc: 'Complete teaching and non-teaching salary calculations with allowance breakdowns.', icon: '💼' },
    { title: 'Live Parent Updates', desc: 'Parents receive immediate updates on attendance, exam schedules, and term results.', icon: '👨‍👩‍👧' },
    { title: 'Secure Multi-Role Portals', desc: 'Independent dashboard access for Super Admin, School Admin, Principals, Teachers, Students & Parents.', icon: '🔒' }
  ];

  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <section className="landing-hero" style={{ background: '#ffffff', padding: '80px 20px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <span style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '6px 18px', borderRadius: '30px', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.5px' }}>
            ★ ALL-IN-ONE SMART ZENSKOOLL MANAGEMENT SYSTEM
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', margin: '22px 0 16px', lineHeight: '1.2' }}>
            Transform Your Campus with <span style={{ color: '#d97706', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ZenSkooll</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#64748b', lineHeight: '1.6', margin: '0 0 32px' }}>
            A modern, digital ERP platform built to streamline attendance, examination schedules, fee billing, staff payroll, and real-time parent communication.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              to="/login"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#0f172a',
                padding: '14px 32px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.45)',
                border: '1px solid rgba(217, 119, 6, 0.3)'
              }}
            >
              Open ERP Portal &rarr;
            </Link>
            <Link
              to="/features"
              style={{
                background: '#f8fafc',
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none'
              }}
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>Why Institutions Choose ZenSkooll</h2>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '6px' }}>Built from the ground up for streamlined Indian school workflows</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {highlights.map((h, i) => (
            <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{h.icon}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>{h.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Quick Nav Links Grid */}
        <div style={{ marginTop: '60px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Full Feature Suite</h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '12px' }}>See detailed comparison matrix across Basic, Standard & Premium.</p>
            <Link to="/features" style={{ color: '#d97706', fontWeight: 700, fontSize: '0.9rem' }}>View All Features &rarr;</Link>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Transparent Pricing</h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '12px' }}>Clear monthly plans tailored to your active student count.</p>
            <Link to="/pricing" style={{ color: '#d97706', fontWeight: 700, fontSize: '0.9rem' }}>Check Pricing Plans &rarr;</Link>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>About Our Mission</h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '12px' }}>Learn more about our educational technology vision and team.</p>
            <Link to="/about" style={{ color: '#d97706', fontWeight: 700, fontSize: '0.9rem' }}>About Us &rarr;</Link>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Contact & Demos</h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '12px' }}>Get in touch with our team for personalized campus onboarding.</p>
            <Link to="/contact" style={{ color: '#d97706', fontWeight: 700, fontSize: '0.9rem' }}>Contact Us &rarr;</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
