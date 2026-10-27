import React from 'react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const plans = [
    {
      name: 'Basic Starter',
      price: '₹2,999',
      period: '/ month',
      students: 'Up to 250 Students',
      badge: 'Small Schools',
      features: [
        'Super Admin & School Admin Portals',
        'Teacher Classroom & Attendance Roll Call',
        'Student & Parent Direct Portals',
        'Homework & Notices Board',
        'Standard Email Notification Support',
        'Community Support'
      ],
      buttonText: 'Get Started with Basic',
      buttonLink: '/contact',
      highlight: false
    },
    {
      name: 'Standard Pro',
      price: '₹6,499',
      period: '/ month',
      students: 'Up to 800 Students',
      badge: 'Most Popular',
      features: [
        'Everything in Basic Starter',
        'Academic Timetable Interactive Matrix',
        'Batch 5-Subject Exam Scheduling Table',
        'Finance Manage: Student Fees & Receipts',
        'Staff Salary Payroll & Slips Generation',
        'Principal Supervision Dashboard',
        'Excel Bulk Data Imports'
      ],
      buttonText: 'Choose Standard Plan',
      buttonLink: '/contact',
      highlight: true
    },
    {
      name: 'Institutional Enterprise',
      price: '₹12,999',
      period: '/ month',
      students: 'Unlimited Students',
      badge: 'Large Campuses',
      features: [
        'Everything in Standard Pro',
        'Multi-Branch & Campus Aggregation',
        'Bus GPS Fleet Live Tracking',
        'Custom Fee Structures & Tax Invoices',
        'Automated WhatsApp Dues Reminders',
        'Dedicated 24/7 Account Manager',
        'Priority SLA & Instant Cloud Backups'
      ],
      buttonText: 'Contact Enterprise Sales',
      buttonLink: '/contact',
      highlight: false
    }
  ];

  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <section className="landing-hero" style={{ background: '#ffffff', padding: '60px 20px 40px', textAlign: 'center' }}>
        <span className="badge-pricing-title" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '6px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem' }}>
          Pricing Plans
        </span>
        <h1 style={{ color: '#0f172a', fontSize: '2.5rem', fontWeight: 900, marginTop: '16px' }}>
          TRANSPARENT & AFFORDABLE <span style={{ color: '#d97706', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ZENSKOOLL PRICING</span>
        </h1>
        <p style={{ color: '#64748b', maxWidth: '640px', margin: '12px auto 0', fontSize: '1.05rem' }}>
          Choose a plan that fits your campus student strength. No hidden fees or unexpected implementation charges.
        </p>
      </section>

      {/* Pricing Cards Grid */}
      <section className="landing-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'stretch' }}>
          {plans.map((p, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: p.highlight ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: p.highlight ? '0 12px 30px rgba(245,158,11,0.2)' : '0 4px 15px rgba(0,0,0,0.04)',
                transform: p.highlight ? 'scale(1.02)' : 'none'
              }}
            >
              {p.highlight && (
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#0f172a', padding: '4px 18px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.5px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)' }}>
                  ★ MOST POPULAR
                </div>
              )}
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: p.highlight ? '#d97706' : '#64748b', letterSpacing: '0.5px' }}>
                  {p.badge}
                </span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 12px' }}>
                  {p.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a' }}>{p.price}</span>
                  <span style={{ color: '#64748b', fontSize: '0.92rem', fontWeight: 600 }}>{p.period}</span>
                </div>
                <div style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'inline-block', marginBottom: '24px' }}>
                  👥 {p.students}
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.5px', marginBottom: '14px' }}>
                    What's included:
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {p.features.map((feat, fIdx) => (
                      <li key={fIdx} style={{ fontSize: '0.9rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '32px' }}>
                <Link
                  to={p.buttonLink}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '13px 20px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    background: p.highlight ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#0f172a',
                    color: p.highlight ? '#0f172a' : '#ffffff',
                    transition: 'all 0.2s ease',
                    boxShadow: p.highlight ? '0 4px 14px rgba(245,158,11,0.45)' : 'none',
                    border: p.highlight ? '1px solid rgba(217, 119, 6, 0.3)' : 'none'
                  }}
                >
                  {p.buttonText} &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section inside Pricing */}
        <div style={{ marginTop: '70px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '40px 32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px', textAlign: 'center' }}>
            Frequently Asked Billing Questions
          </h2>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.95rem', marginBottom: '32px' }}>
            Everything you need to know about subscriptions, renewals, and student tier scaling.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px' }}>
              <h4 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Can we upgrade our tier mid-session?</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>Yes! As your student strength grows, you can seamlessly transition to the higher tier with pro-rated billing.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px' }}>
              <h4 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Are there server or setup fees?</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>Zero setup fees. Data migration support and Excel bulk onboarding templates are included in all active plans.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px' }}>
              <h4 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Is student and fee data backed up?</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>All school databases receive daily automated cloud snapshots with 256-bit institutional encryption.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px' }}>
              <h4 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Do parents pay extra for the app?</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>No. Students and parents access their dashboards at no cost under your school's master subscription.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
