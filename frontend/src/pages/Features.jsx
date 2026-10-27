import React from 'react';
import { Link } from 'react-router-dom';

export default function Features() {
  const comparisonData = [
    { name: 'Super Admin & Multi-School Oversight', basic: true, standard: true, premium: true },
    { name: 'School Admin Institutional Portal', basic: true, standard: true, premium: true },
    { name: 'Teacher Classroom & Marks Portal', basic: true, standard: true, premium: true },
    { name: 'Student Academic Portal', basic: true, standard: true, premium: true },
    { name: 'Parent Real-Time Monitoring Portal', basic: true, standard: true, premium: true },
    { name: 'Principal Supervision Dashboard', basic: false, standard: true, premium: true },
    { name: 'Daily Attendance Management & Roll Call', basic: true, standard: true, premium: true },
    { name: 'Homework & Assignment Publishing', basic: true, standard: true, premium: true },
    { name: 'Digital Study Materials Library', basic: false, standard: true, premium: true },
    { name: 'Interactive Class Timetable Grid', basic: false, standard: true, premium: true },
    { name: 'Batch Exam Scheduling & Date Sheet Table', basic: false, standard: true, premium: true },
    { name: 'Real-Time Exam Result & Report Card', basic: false, standard: true, premium: true },
    { name: 'Finance Manage & Student Fee Billing', basic: false, standard: true, premium: true },
    { name: 'Staff Salary Payroll & Slips', basic: false, standard: true, premium: true },
    { name: 'School Operating Expenses Ledger', basic: false, standard: true, premium: true },
    { name: 'Excel Bulk Import & Export', basic: false, standard: true, premium: true },
    { name: 'Instant Multi-Role Notification Sync', basic: false, standard: false, premium: true },
    { name: 'Live School Bus GPS Tracking', basic: false, standard: false, premium: true },
    { name: 'Multi-Branch & Campus Integration', basic: false, standard: false, premium: true },
    { name: '24/7 Dedicated Support & Cloud Backup', basic: false, standard: false, premium: true },
  ];

  const featurePillars = [
    {
      title: 'Smart Academic Administration',
      desc: 'Centralized control for class timetables, batch subject examination schedules, syllabus dissemination, and faculty allocations.',
      icon: '🎓'
    },
    {
      title: 'Finance Manage & Payroll',
      desc: 'End-to-end fee invoices, automated dues calculation, staff salary disbursement with slip downloads, and institutional expense registers.',
      icon: '💼'
    },
    {
      title: 'Instant Parent-Student Sync',
      desc: 'Live examination schedules, term marks report cards, digital homework submissions, and real-time attendance rate tracking.',
      icon: '⚡'
    },
    {
      title: 'Faculty & Leave Workflow',
      desc: 'Teachers submit leave applications with substitute faculty tagging; principals review and approve requests with one click.',
      icon: '📝'
    },
    {
      title: 'Bulk Data Imports & Analytics',
      desc: 'Seamless Excel import for hundreds of students and staff payroll records with instant validation and ledger reconciliation.',
      icon: '📊'
    },
    {
      title: 'Multi-Role Secure Access',
      desc: 'Role-based authorization and dashboard view customization for Super Admin, School Admin, Principals, Teachers, Students, and Parents.',
      icon: '🛡️'
    }
  ];

  return (
    <div className="landing-wrapper">
      {/* Header Banner */}
      <section className="landing-hero" style={{ background: '#ffffff', padding: '60px 20px 40px', textAlign: 'center' }}>
        <span className="badge-pricing-title" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '6px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem' }}>
          Platform Features
        </span>
        <h1 style={{ color: '#0f172a', fontSize: '2.5rem', fontWeight: 900, marginTop: '16px' }}>
          POWERFUL FEATURES BUILT FOR <span style={{ color: '#d97706', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ZENSKOOLL</span>
        </h1>
        <p style={{ color: '#64748b', maxWidth: '680px', margin: '12px auto 0', fontSize: '1.05rem' }}>
          Explore all the modules and tools included in ZenSkooll to automate campus administration, academic scheduling, and parent communication.
        </p>
      </section>

      {/* Feature Pillars Grid */}
      <section className="landing-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '50px' }}>
          {featurePillars.map((p, i) => (
            <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '28px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>{p.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>{p.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table Section */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>DETAILED MODULE & FEATURE COMPARISON</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Check which plan matches your school's student strength and operational requirements</p>
        </div>
        <div className="comparison-table-wrapper" style={{ overflowX: 'auto', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
          <table className="comparison-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '16px 20px', color: '#1e3a8a', fontWeight: 800 }}>Core Features & Modules</th>
                <th className="header-basic" style={{ padding: '16px 20px', textAlign: 'center', fontWeight: 800, color: '#475569' }}>Basic Plan</th>
                <th className="header-standard" style={{ padding: '16px 20px', textAlign: 'center', fontWeight: 800, color: '#d97706' }}>Standard Plan</th>
                <th className="header-premium" style={{ padding: '16px 20px', textAlign: 'center', fontWeight: 800, color: '#b45309' }}>Premium Plan</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                  <td className="feature-category-name" style={{ padding: '14px 20px', fontWeight: 600, color: '#1e293b' }}>{row.name}</td>
                  <td className="basic-val" style={{ padding: '14px 20px', textAlign: 'center', color: row.basic ? '#10b981' : '#cbd5e1', fontWeight: 700 }}>
                    {row.basic ? '✓ Included' : '—'}
                  </td>
                  <td className="standard-val" style={{ padding: '14px 20px', textAlign: 'center', color: row.standard ? '#10b981' : '#cbd5e1', fontWeight: 700 }}>
                    {row.standard ? '✓ Included' : '—'}
                  </td>
                  <td className="premium-val" style={{ padding: '14px 20px', textAlign: 'center', color: row.premium ? '#10b981' : '#cbd5e1', fontWeight: 700 }}>
                    {row.premium ? '✓ Included' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA Strip */}
        <div style={{ marginTop: '50px', background: 'linear-gradient(135deg, #0a1e3f 0%, #1e3a8a 100%)', borderRadius: '16px', padding: '36px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.4rem', fontWeight: 800 }}>Need a custom setup or module demo?</h3>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>Our team can tailor ZenSkooll specifically to your institution's size and workflows.</p>
          </div>
          <Link
            to="/contact"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#0f172a',
              fontWeight: 800,
              padding: '12px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.45)'
            }}
          >
            Get in Touch →
          </Link>
        </div>
      </section>
    </div>
  );
}
