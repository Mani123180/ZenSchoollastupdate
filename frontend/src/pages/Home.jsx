import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);
  const comparisonData = [
    { name: 'Admin Portal', basic: true, standard: true, premium: true },
    { name: 'Teacher Portal', basic: true, standard: true, premium: true },
    { name: 'Student Portal', basic: true, standard: true, premium: true },
    { name: 'Parent Portal', basic: true, standard: true, premium: true },
    { name: 'Principal Portal', basic: false, standard: true, premium: true },
    { name: 'Attendance Management', basic: true, standard: true, premium: true },
    { name: 'Homework Management', basic: true, standard: true, premium: true },
    { name: 'Assignments Management', basic: false, standard: true, premium: true },
    { name: 'Study Materials', basic: false, standard: true, premium: true },
    { name: 'Secure Messaging', basic: false, standard: true, premium: true },
    { name: 'Timetable Scheduling', basic: false, standard: true, premium: true },
    { name: 'Exam Results & Report Card', basic: false, standard: true, premium: true },
    { name: 'Fee Management', basic: false, standard: true, premium: true },
    { name: 'Reports & Analytics', basic: false, standard: true, premium: true },
    { name: 'Online Fee Payment', basic: false, false: true, premium: true },
    { name: 'SMS & Email Alerts', basic: false, false: true, premium: true },
    { name: 'AI Analytics Dashboard', basic: false, false: true, premium: true },
    { name: 'Multi-Branch School Support', basic: false, false: true, premium: true },
    { name: 'Cloud Backup & Restore', basic: false, false: true, premium: true },
    { name: '24/7 Dedicated Support', basic: false, false: true, premium: true },
  ];

  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <section id="home" className="landing-hero">
        <span className="badge-pricing-title">Pricing</span>
        <h1>
          CHOOSE THE PERFECT PLAN FOR <span className="highlight-blue">YOUR SCHOOL</span>
        </h1>
        <p>Simple, transparent pricing with all the features you need to manage your school efficiently.</p>
      </section>

      {/* Pricing Cards Section */}
      <section id="pricing-section" className="landing-section">
        <div className="pricing-grid">
          {/* Basic Plan */}
          <div className="pricing-card basic">
            <div className="pricing-card-header">
              <span className="pricing-plan-badge">Basic Plan</span>
              <i className="fa-solid fa-graduation-cap pricing-plan-icon"></i>
              <div className="pricing-price">
                ₹1,999<span className="pricing-period"> / Month</span>
              </div>
              <span className="student-limit-badge">Up to 300 Students</span>
            </div>
            <ul className="pricing-features-list">
              <li><i className="fa-solid fa-circle-check"></i> Admin Portal</li>
              <li><i className="fa-solid fa-circle-check"></i> Teacher Portal</li>
              <li><i className="fa-solid fa-circle-check"></i> Student Portal</li>
              <li><i className="fa-solid fa-circle-check"></i> Parent Portal</li>
              <li><i className="fa-solid fa-circle-check"></i> Attendance Management</li>
              <li><i className="fa-solid fa-circle-check"></i> Homework Management</li>
              <li><i className="fa-solid fa-circle-check"></i> School Announcements</li>
              <li><i className="fa-solid fa-circle-check"></i> Basic Dashboard</li>
              <li><i className="fa-solid fa-circle-check"></i> Email Support</li>
            </ul>
            <Link to="/login" className="pricing-action-btn">
              Choose Basic
            </Link>
          </div>

          {/* Standard Plan */}
          <div className="pricing-card standard">
            <div className="popular-banner">
              <i className="fa-solid fa-star"></i> Most Popular
            </div>
            <div className="pricing-card-header">
              <span className="pricing-plan-badge">Standard Plan</span>
              <i className="fa-solid fa-star pricing-plan-icon"></i>
              <div className="pricing-price">
                ₹4,999<span className="pricing-period"> / Month</span>
              </div>
              <span className="student-limit-badge">Up to 1000 Students</span>
            </div>
            <ul className="pricing-features-list">
              <li><i className="fa-solid fa-circle-check"></i> Everything in Basic</li>
              <li><i className="fa-solid fa-circle-check"></i> Principal Portal</li>
              <li><i className="fa-solid fa-circle-check"></i> Fee Management</li>
              <li><i className="fa-solid fa-circle-check"></i> Exam Results</li>
              <li><i className="fa-solid fa-circle-check"></i> Secure Messaging</li>
              <li><i className="fa-solid fa-circle-check"></i> Timetable Management</li>
              <li><i className="fa-solid fa-circle-check"></i> Reports & Analytics</li>
              <li><i className="fa-solid fa-circle-check"></i> Study Materials</li>
              <li><i className="fa-solid fa-circle-check"></i> Assignment Management</li>
              <li><i className="fa-solid fa-circle-check"></i> Priority Support</li>
            </ul>
            <Link to="/login" className="pricing-action-btn">
              Choose Standard
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="pricing-card premium">
            <div className="pricing-card-header">
              <span className="pricing-plan-badge">Premium Plan</span>
              <i className="fa-solid fa-crown pricing-plan-icon"></i>
              <div className="pricing-price">Contact Us</div>
              <span className="student-limit-badge">Unlimited Students</span>
            </div>
            <ul className="pricing-features-list">
              <li><i className="fa-solid fa-circle-check"></i> Everything in Standard</li>
              <li><i className="fa-solid fa-circle-check"></i> Multi-Branch School Support</li>
              <li><i className="fa-solid fa-circle-check"></i> Online Fee Payment</li>
              <li><i className="fa-solid fa-circle-check"></i> AI Analytics Dashboard</li>
              <li><i className="fa-solid fa-circle-check"></i> SMS & Email Notifications</li>
              <li><i className="fa-solid fa-circle-check"></i> Custom School Branding</li>
              <li><i className="fa-solid fa-circle-check"></i> Cloud Backup & Restore</li>
              <li><i className="fa-solid fa-circle-check"></i> Advanced Reports</li>
              <li><i className="fa-solid fa-circle-check"></i> API Integration</li>
              <li><i className="fa-solid fa-circle-check"></i> Mobile App Support</li>
              <li><i className="fa-solid fa-circle-check"></i> 24/7 Premium Support</li>
            </ul>
            <Link to="/contact" className="pricing-action-btn">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table Section */}
      <section id="features-section" className="landing-section">
        <div className="section-header">
          <h2>FEATURE COMPARISON</h2>
        </div>
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="header-basic">Basic</th>
                <th className="header-standard">Standard</th>
                <th className="header-premium">Premium</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr key={idx}>
                  <td className="feature-category-name">{row.name}</td>
                  <td className="basic-val">
                    {row.basic ? (
                      <i className="fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="fa-solid fa-circle-xmark"></i>
                    )}
                  </td>
                  <td className="standard-val">
                    {row.standard ? (
                      <i className="fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="fa-solid fa-circle-xmark"></i>
                    )}
                  </td>
                  <td className="premium-val">
                    {row.premium ? (
                      <i className="fa-solid fa-circle-check"></i>
                    ) : (
                      <i className="fa-solid fa-circle-xmark"></i>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-section" className="landing-section">
        <div className="section-header">
          <h2>ABOUT ZENSKOOLL</h2>
          <p>Empowering Schools with Smart Digital Management</p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <h3>Who We Are</h3>
            <p style={{ marginTop: '1rem' }}>
              ZenSchool is a modern School Management Platform developed by Zen4Tech Solutions to simplify day-to-day school operations. Our goal is to help educational institutions reduce paperwork, improve communication, and manage academic activities efficiently through a secure cloud-based platform.
            </p>
            <p style={{ marginTop: '1rem' }}>
              Whether it's managing attendance, homework, announcements, or communication between teachers and parents, ZenSchool provides an easy-to-use solution designed for schools of all sizes.
            </p>

            <div className="mission-box">
              <h4>
                <i className="fa-solid fa-bullseye"></i> Our Mission
              </h4>
              <p>To make school management simple, digital, and accessible for every educational institution.</p>
            </div>
          </div>

          <div className="about-card">
            <h3>Why Choose ZenSchool?</h3>
            <ul className="pricing-features-list" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
              <li><i className="fa-solid fa-circle-check"></i> Modern & Easy-to-Use Interface</li>
              <li><i className="fa-solid fa-circle-check"></i> Secure Cloud-Based Platform</li>
              <li><i className="fa-solid fa-circle-check"></i> Dedicated Portals for Every User</li>
              <li><i className="fa-solid fa-circle-check"></i> Real-Time Communication</li>
              <li><i className="fa-solid fa-circle-check"></i> Scalable for Growing Schools</li>
              <li><i className="fa-solid fa-circle-check"></i> Reliable Technical Support</li>
            </ul>

            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Built by Zen4Tech Solutions</h4>
              <p style={{ fontSize: '0.9rem' }}>
                ZenSchool is proudly developed by Zen4Tech Solutions, a software company focused on building innovative web applications, SaaS products, and AI-powered solutions for businesses and educational institutions.
              </p>
            </div>
          </div>
        </div>

        <div className="custom-solution-banner">
          <div>
            <h3>Ready to modernize your school?</h3>
            <p>Schedule a free product demonstration and discover how ZenSchool can simplify school management.</p>
          </div>
          <Link to="/login" className="btn btn-primary" style={{ whiteSpace: 'nowrap', padding: '12px 24px' }}>
            Schedule Demo
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="landing-section">
        <div className="section-header">
          <h2>FREQUENTLY ASKED QUESTIONS</h2>
        </div>
        <div className="faq-grid">
          <div className="faq-card">
            <div className="faq-icon-box">
              <i className="fa-solid fa-question"></i>
            </div>
            <div>
              <h4 className="faq-question">Can I upgrade my plan later?</h4>
              <p className="faq-answer">Yes, you can upgrade your plan or change features at any time dynamically.</p>
            </div>
          </div>
          <div className="faq-card">
            <div className="faq-icon-box">
              <i className="fa-solid fa-question"></i>
            </div>
            <div>
              <h4 className="faq-question">Is there a student limit?</h4>
              <p className="faq-answer">Yes. Basic supports up to 300 students, Standard up to 1000 students, and Premium supports unlimited students.</p>
            </div>
          </div>
          <div className="faq-card">
            <div className="faq-icon-box">
              <i className="fa-solid fa-question"></i>
            </div>
            <div>
              <h4 className="faq-question">Do all plans include support?</h4>
              <p className="faq-answer">Yes. Basic includes email support, Standard includes priority support, and Premium includes 24/7 premium support.</p>
            </div>
          </div>
        </div>

        {/* Custom Solution Banner */}
        <div className="custom-solution-banner">
          <div>
            <h3>Need a custom solution for your school?</h3>
            <p>Contact our support team to get a tailormade school configuration.</p>
          </div>
          <Link to="/contact" className="btn btn-primary" style={{ whiteSpace: 'nowrap', padding: '12px 24px' }}>
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
