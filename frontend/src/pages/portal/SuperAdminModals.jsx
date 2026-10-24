import React, { useState, useEffect } from 'react';
import { downloadInvoicePDF } from '../../services/pdfDownloadUtil';

// 1. Campus Overview Modal (viewSchoolDetails)
export function CampusOverviewModal({ isOpen, school, onClose, onEdit, onEnterSchool }) {
  if (!isOpen || !school) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg">
        <div className="modal-header">
          <h3 id="modal-title">
            Campus Overview <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal', marginLeft: '8px' }}>({school.code})</span>
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div style={{ padding: '4px' }}>
          {/* Wizard Header Strip */}
          <div className="wizard-header-strip" style={{ marginBottom: '20px' }}>
            <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
              </svg>
            </div>
            <div className="wizard-header-titles" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>{school.name}</h4>
                <span className={`badge ${school.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{school.status}</span>
              </div>
              <p>
                Affiliation: <strong>{school.board || 'State Board'}</strong> | Academic Year: <strong>{school.academicYear || '2026-2027'}</strong> | City: <strong>{school.city || '—'}</strong>
              </p>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Students</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '2px' }}>{school.studentsCount || school.studentCount || 0}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Teachers</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>{school.teachersCount || school.teacherCount || 0}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Parents</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>{school.parentsCount || Math.round((school.studentsCount || 500) * 0.95)}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>License Tier</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#6366f1', marginTop: '6px' }}>{school.subscription || school.plan || 'Pro Plan'}</div>
            </div>
          </div>

          {/* Structured Review Grid */}
          <div className="review-grid" style={{ marginBottom: '22px' }}>
            <div className="review-card">
              <div className="review-card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
                </svg>
                Campus & Contact Information
              </div>
              <div className="review-row"><span className="review-label">School Code:</span><span className="review-value"><span className="badge badge-info">{school.code}</span></span></div>
              <div className="review-row"><span className="review-label">Principal / Head:</span><span className="review-value">{school.principal || school.principalName || '—'}</span></div>
              <div className="review-row"><span className="review-label">Official Email:</span><span className="review-value">{school.email || '—'}</span></div>
              <div className="review-row"><span className="review-label">Contact Phone:</span><span className="review-value">{school.phone || '—'}</span></div>
              <div className="review-row"><span className="review-label">City Location:</span><span className="review-value">{school.city || '—'}</span></div>
            </div>

            <div className="review-card">
              <div className="review-card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                Campus Administrator Profile
              </div>
              <div className="review-row"><span className="review-label">Administrator:</span><span className="review-value"><strong>{school.adminName || school.admin || 'Unassigned'}</strong></span></div>
              <div className="review-row"><span className="review-label">Login ID / Email:</span><span className="review-value"><code style={{ color: '#2563eb' }}>{school.admin || school.email || '—'}</code></span></div>
              <div className="review-row"><span className="review-label">Partition ID:</span><span className="review-value"><span className="badge badge-info">{school.id || school.schoolId}</span></span></div>
              <div className="review-row"><span className="review-label">Account Status:</span><span className="review-value"><span className={`badge ${school.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{school.status}</span></span></div>
              <div className="review-row"><span className="review-label">Onboarding Date:</span><span className="review-value">{school.createdDate || school.joinedDate || '2026-01-01'}</span></div>
            </div>

            <div className="review-card span-2">
              <div className="review-card-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                Platform Subscription & Modules
              </div>
              <div className="review-row"><span className="review-label">Active License Tier:</span><span className="review-value"><strong>{school.subscription || school.plan || 'Pro Plan'}</strong></span></div>
              <div className="review-row"><span className="review-label">Modules Included:</span><span className="review-value">Student Info System (SIS), Attendance, Fees & Invoicing, Exam Results, SMS/WhatsApp Gateway</span></div>
              <div className="review-row"><span className="review-label">Sync Status:</span><span className="review-value"><span className="badge badge-success">Active & Synchronized</span></span></div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Partition ID: <code>{school.id || school.schoolId}</code></span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => { onClose(); onEdit(school); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit School Details
              </button>
              {onEnterSchool && (
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ background: '#7c3aed', color: '#ffffff', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => { onClose(); onEnterSchool(school); }}
                >
                  🏫 Open School Dashboard &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Edit School Modal (editSchool)
export function EditSchoolModal({ isOpen, school, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    code: '',
    board: 'State Board',
    principal: '',
    email: '',
    phone: '',
    status: 'Active',
    subscription: 'Pro Plan',
  });

  useEffect(() => {
    if (school) {
      setForm({
        name: school.name || '',
        code: school.code || '',
        board: school.board || 'State Board',
        principal: school.principal || school.principalName || '',
        email: school.email || '',
        phone: school.phone || '',
        status: school.status || 'Active',
        subscription: school.subscription || school.plan || 'Pro Plan',
      });
    }
  }, [school]);

  if (!isOpen || !school) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...school, ...form });
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg">
        <div className="modal-header">
          <h3 id="modal-title">
            Edit Campus Details <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal', marginLeft: '8px' }}>({school.code})</span>
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="wizard-form-box">
            <div className="wizard-header-strip">
              <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <div className="wizard-header-titles">
                <h4>Update Institutional Profile</h4>
                <p>Modify campus parameters, affiliation board, and licensing configuration.</p>
              </div>
            </div>

            <div className="wizard-grid-2">
              <div className="wizard-field span-2">
                <label>School Name <span className="req">*</span></label>
                <input type="text" value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="wizard-field">
                <label>School Code <span className="req">*</span></label>
                <input type="text" value={form.code} required onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </div>
              <div className="wizard-field">
                <label>Affiliation / Board <span className="req">*</span></label>
                <select value={form.board} required onChange={(e) => setForm({ ...form, board: e.target.value })}>
                  <option value="State Board">State Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="Matriculation">Matriculation</option>
                  <option value="International">International</option>
                </select>
              </div>
              <div className="wizard-field">
                <label>Principal / Head Name <span className="req">*</span></label>
                <input type="text" value={form.principal} required onChange={(e) => setForm({ ...form, principal: e.target.value })} />
              </div>
              <div className="wizard-field">
                <label>Official Email <span className="req">*</span></label>
                <input type="email" value={form.email} required onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="wizard-field">
                <label>Contact Phone <span className="req">*</span></label>
                <input type="text" value={form.phone} required onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="wizard-field">
                <label>Operational Status <span className="req">*</span></label>
                <select value={form.status} required onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Save Campus Changes ✓</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. School Admin Profile Modal (viewSchoolAdmin / viewAdminProfile)
export function AdminProfileModal({ isOpen, admin, onClose }) {
  if (!isOpen || !admin) return null;

  const initial = (admin.name || 'A')[0].toUpperCase();

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg">
        <div className="modal-header">
          <h3 id="modal-title">Administrator Profile — {admin.name}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="wizard-form-box">
          <div className="wizard-header-strip">
            <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="wizard-header-titles">
              <h4>Campus Administrator Profile</h4>
              <p>Account identity, campus allocation, and security credentials status.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700 }}>
              {initial}
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-primary)' }}>{admin.name}</h4>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>
                Role: <span className="badge badge-info">{admin.role || 'SCHOOL_ADMIN'}</span>
              </div>
            </div>
          </div>

          <div className="review-grid" style={{ gridTemplateColumns: '1fr', gap: '10px', marginBottom: '15px' }}>
            <div className="review-row"><span>Login Username:</span><code>{admin.username || '—'}</code></div>
            <div className="review-row"><span>Official Email:</span><strong>{admin.email}</strong></div>
            <div className="review-row"><span>Assigned Campus:</span><strong>{admin.schoolName || 'All Campuses'}</strong></div>
            <div className="review-row"><span>Campus ID:</span><span className="badge badge-info">{admin.schoolId || 'None'}</span></div>
            <div className="review-row"><span>Account Status:</span><span className={`badge ${admin.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{admin.status || 'Active'}</span></div>
            <div className="review-row"><span>Created Date:</span><span>{admin.createdDate || '2026-01-01'}</span></div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// 4. Add Admin Modal (openAddAdminModal)
export function AddAdminModal({ isOpen, schools = [], onClose, onSave }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Admin@2026');
  const [schoolId, setSchoolId] = useState('');

  useEffect(() => {
    if (schools.length > 0 && !schoolId) {
      setSchoolId(schools[0].id || schools[0].schoolId);
    }
  }, [schools]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const target = schools.find((s) => (s.id || s.schoolId) === schoolId);
    const newAdmin = {
      id: 'USR0' + Math.floor(10 + Math.random() * 90),
      name,
      email,
      username,
      password,
      role: 'SCHOOL_ADMIN',
      schoolId,
      schoolName: target ? target.name : 'School Campus',
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
    };
    onSave(newAdmin);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg">
        <div className="modal-header">
          <h3 id="modal-title">Add School Administrator</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="wizard-form-box">
            <div className="wizard-header-strip">
              <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="wizard-header-titles">
                <h4>Provision Administrator Account</h4>
                <p>Generate login credentials and associate them with an institutional campus.</p>
              </div>
            </div>

            <div className="wizard-grid-2">
              <div className="wizard-field span-2">
                <label>Admin Full Name <span className="req">*</span></label>
                <input type="text" placeholder="e.g. K. Sundaram (Principal / IT Head)" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="wizard-field">
                <label>Official Email Address <span className="req">*</span></label>
                <input type="email" placeholder="e.g. admin@schoolname.edu" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="wizard-field">
                <label>Login Username <span className="req">*</span></label>
                <input type="text" placeholder="e.g. admin_sjm" required value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="wizard-field">
                <label>Initial Password <span className="req">*</span></label>
                <input type="text" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="wizard-field">
                <label>Assign to Campus <span className="req">*</span></label>
                <select value={schoolId} required onChange={(e) => setSchoolId(e.target.value)}>
                  {schools.map((s) => (
                    <option key={s.id || s.schoolId} value={s.id || s.schoolId}>
                      {s.name} ({s.code || s.id || s.schoolId})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Create School Admin ✓</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 5. Assign / Reassign Admin Modal (openAssignAdminModal)
export function AssignAdminModal({ isOpen, admins = [], schools = [], initialAdminId = null, onClose, onSave }) {
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');

  useEffect(() => {
    if (initialAdminId) setSelectedAdmin(initialAdminId);
    else if (admins.length > 0) setSelectedAdmin(admins[0].id || admins[0].userId);

    if (schools.length > 0 && !selectedSchool) {
      setSelectedSchool(schools[0].id || schools[0].schoolId);
    }
  }, [initialAdminId, admins, schools]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(selectedAdmin, selectedSchool);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg">
        <div className="modal-header">
          <h3 id="modal-title">Assign / Reassign Administrator</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="wizard-form-box">
            <div className="wizard-header-strip">
              <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <div className="wizard-header-titles">
                <h4>Link Administrator to Campus</h4>
                <p>Assign administrative authority for a school to a registered user.</p>
              </div>
            </div>

            <div className="wizard-grid-2">
              <div className="wizard-field span-2">
                <label>Select School Administrator <span className="req">*</span></label>
                <select value={selectedAdmin} required onChange={(e) => setSelectedAdmin(e.target.value)}>
                  {admins.map((a) => (
                    <option key={a.id || a.userId} value={a.id || a.userId}>
                      {a.name} ({a.email}) — Current: {a.schoolName || 'Unassigned'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="wizard-field span-2">
                <label>Select Target Campus <span className="req">*</span></label>
                <select value={selectedSchool} required onChange={(e) => setSelectedSchool(e.target.value)}>
                  {schools.map((s) => (
                    <option key={s.id || s.schoolId} value={s.id || s.schoolId}>
                      {s.name} ({s.code || s.id || s.schoolId})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Confirm Assignment ✓</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 6. Create Invoice Modal (openCreateInvoiceModal)
export function CreateInvoiceModal({ isOpen, schools = [], onClose, onSave }) {
  const [schoolId, setSchoolId] = useState('');
  const [plan, setPlan] = useState('Pro Plan');
  const [amount, setAmount] = useState('₹35,000');
  const [due, setDue] = useState(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);

  useEffect(() => {
    if (schools.length > 0 && !schoolId) {
      setSchoolId(schools[0].id || schools[0].schoolId);
    }
  }, [schools]);

  if (!isOpen) return null;

  const handlePlanChange = (val) => {
    setPlan(val);
    setAmount(val.includes('Enterprise') ? '₹75,000' : (val.includes('Basic') ? '₹15,000' : '₹35,000'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const target = schools.find((s) => (s.id || s.schoolId) === schoolId);
    const newBill = {
      invoiceNo: 'INV-2026-00' + Math.floor(10 + Math.random() * 90),
      schoolId,
      school: target ? target.name : 'School Campus',
      plan,
      amount: amount.startsWith('₹') ? amount : '₹' + amount,
      dueDate: due,
      paymentDate: null,
      status: 'PENDING',
    };
    onSave(newBill);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg">
        <div className="modal-header">
          <h3 id="modal-title">Generate Campus Invoice</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="wizard-form-box">
            <div className="wizard-header-strip">
              <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className="wizard-header-titles">
                <h4>Billing & Invoice Generation</h4>
                <p>Issue platform license subscription or customized service invoices.</p>
              </div>
            </div>

            <div className="wizard-grid-2">
              <div className="wizard-field span-2">
                <label>Select Target Campus / School <span className="req">*</span></label>
                <select value={schoolId} required onChange={(e) => setSchoolId(e.target.value)}>
                  {schools.map((s) => (
                    <option key={s.id || s.schoolId} value={s.id || s.schoolId}>
                      {s.name} ({s.code || s.id || s.schoolId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="wizard-field">
                <label>License Subscription Tier <span className="req">*</span></label>
                <select value={plan} required onChange={(e) => handlePlanChange(e.target.value)}>
                  <option value="Basic Plan">Basic Plan (₹15,000/yr)</option>
                  <option value="Pro Plan">Pro Plan (₹35,000/yr)</option>
                  <option value="Enterprise Plan">Enterprise Plan (₹75,000/yr)</option>
                </select>
              </div>
              <div className="wizard-field">
                <label>Invoice Amount (₹) <span className="req">*</span></label>
                <input type="text" value={amount} required onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="wizard-field span-2">
                <label>Payment Due Date <span className="req">*</span></label>
                <input type="date" value={due} required onChange={(e) => setDue(e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Generate & Issue Invoice ✓</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 7. General Feedback / Confirmation Modal (showFeedbackModal)
export function FeedbackModal({ isOpen, title, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: 'var(--color-success)', fontSize: '3rem', marginBottom: '15px' }}>✓</div>
          <p style={{ color: 'var(--color-text-dark)', marginBottom: '20px', whiteSpace: 'pre-line' }}>{message}</p>
          <button className="btn btn-primary btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// 7b. Action Confirmation Modal
export function ConfirmationModal({ isOpen, title, message, confirmText = 'Confirm', onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3 id="modal-title" style={{ color: '#b91c1c' }}>{title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div style={{ padding: '20px' }}>
          <p style={{ color: 'var(--color-text-dark)', marginBottom: '20px', lineHeight: 1.6 }}>{message}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary btn-sm"
              style={{ background: '#dc2626', borderColor: '#dc2626' }}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7c. Printable Official Invoice Modal
export function PrintableInvoiceModal({ isOpen, bill, onClose }) {
  if (!isOpen || !bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    const invoiceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice_${bill.invoiceNo}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background: #f1f5f9; padding: 40px 20px; color: #1e293b; }
    .invoice-card { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.06); padding: 36px 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 22px; margin-bottom: 24px; }
    .brand-title { color: #1e3a8a; font-size: 26px; font-weight: 800; margin-bottom: 4px; }
    .brand-sub { font-size: 13px; color: #64748b; line-height: 1.4; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .badge-paid { background: #dcfce7; color: #15803d; }
    .badge-unpaid { background: #fee2e2; color: #b91c1c; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 26px; }
    .info-box { background: #f8fafc; padding: 14px 18px; border-radius: 8px; border: 1px solid #e2e8f0; }
    .info-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .info-val { font-size: 15px; font-weight: 700; color: #0f172a; }
    .info-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    th { background: #f1f5f9; text-align: left; padding: 12px 14px; font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; border-bottom: 1px solid #cbd5e1; }
    td { padding: 16px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .total-bar { display: flex; justify-content: space-between; align-items: center; border-top: 2px dashed #cbd5e1; padding-top: 20px; }
    .footer-note { font-size: 12px; color: #94a3b8; }
    .total-amount { font-size: 26px; font-weight: 800; color: #047857; }
    @media print {
      body { background: white; padding: 0; }
      .invoice-card { box-shadow: none; border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="brand-title">ZenSchool ERP</div>
        <div class="brand-sub">Platform Central Multi-Tenant Cloud</div>
        <div class="brand-sub">support@zenschool.edu | +91 98401 11001</div>
      </div>
      <div style="text-align: right;">
        <span class="badge ${bill.status === 'PAID' ? 'badge-paid' : 'badge-unpaid'}">${bill.status}</span>
        <div style="margin-top: 10px; font-size: 14px; color: #475569;">
          Invoice: <strong>${bill.invoiceNo}</strong>
        </div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <div class="info-label">Billed To Campus</div>
        <div class="info-val">${bill.school}</div>
        <div class="info-sub">Campus ID: ${bill.schoolId || 'SCH001'}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Invoice Dates</div>
        <div class="info-sub" style="color: #334155; font-size: 13px;">Due Date: <strong>${bill.dueDate}</strong></div>
        <div class="info-sub" style="color: #334155; font-size: 13px; margin-top: 4px;">Paid Date: <strong>${bill.paymentDate || 'Pending payment'}</strong></div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description / Plan</th>
          <th style="text-align: center;">Duration</th>
          <th style="text-align: right;">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong style="color: #0f172a;">${bill.plan}</strong>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Annual Cloud ERP License & Multi-Campus Access</div>
          </td>
          <td style="text-align: center; color: #475569;">1 Year</td>
          <td style="text-align: right; font-weight: 700; font-size: 16px; color: #1e3a8a;">${bill.amount}</td>
        </tr>
      </tbody>
    </table>

    <div class="total-bar">
      <div class="footer-note">
        Digitally generated by ZenSchool Platform &bull; Valid without physical signature
      </div>
      <div style="text-align: right;">
        <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">Total Billed</div>
        <div class="total-amount">${bill.amount}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([invoiceHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${bill.invoiceNo}_${(bill.school || 'Campus').replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}>
        <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', padding: '16px 24px', background: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e3a8a' }}>
            Official Invoice & Receipt — {bill.invoiceNo}
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div style={{ padding: '28px 32px' }} id="printable-invoice-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: '0 0 6px 0', color: '#1e3a8a', fontSize: '1.4rem' }}>ZenSchool ERP</h2>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Platform Central Multi-Tenant Cloud</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>support@zenschool.edu | +91 98401 11001</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${bill.status === 'PAID' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.88rem', padding: '6px 14px' }}>
                {bill.status}
              </span>
              <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#475569' }}>
                Invoice: <strong>{bill.invoiceNo}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Billed To Campus</div>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{bill.school}</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>Campus ID: {bill.schoolId || 'SCH001'}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Invoice Dates</div>
              <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '4px' }}>
                Due Date: <strong>{bill.dueDate}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '2px' }}>
                Paid Date: <strong>{bill.paymentDate || 'Pending payment'}</strong>
              </div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.82rem' }}>Description / Plan</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: '0.82rem' }}>Duration</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '0.82rem' }}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '14px 12px' }}>
                  <strong>{bill.plan}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Annual Cloud ERP License & Multi-Campus Access</div>
                </td>
                <td style={{ textAlign: 'center', padding: '14px 12px', color: '#475569' }}>1 Year</td>
                <td style={{ textAlign: 'right', padding: '14px 12px', fontWeight: 700, fontSize: '1.05rem', color: '#1e3a8a' }}>
                  {bill.amount}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px dashed #cbd5e1', paddingTop: '16px' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Digitally generated by ZenSchool Platform &bull; Valid without physical signature
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Total Billed</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#047857' }}>{bill.amount}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
          <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => downloadInvoicePDF(bill)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e3a8a', borderColor: '#bfdbfe', background: '#eff6ff', fontWeight: 600 }}
            title="Download official PDF document"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="12" y2="18" />
              <line x1="15" y1="15" x2="12" y2="18" />
            </svg>
            Download PDF
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleDownloadInvoice}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857', borderColor: '#a7f3d0', background: '#ecfdf5' }}
            title="Download HTML invoice file"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download HTML
          </button>
          <button className="btn btn-primary btn-sm" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// 8. Dashboard Card Drill-down Modal (shows details when cards are clicked)
export function DashboardDetailModal({ isOpen, detailConfig, onClose, onNavigate }) {
  if (!isOpen || !detailConfig) return null;

  const { title, subtitle, badgeColor, count, items = [], type } = detailConfig;
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on active search query
  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    if (type === 'schools') {
      return (
        (item.name || '').toLowerCase().includes(q) ||
        (item.code || '').toLowerCase().includes(q) ||
        (item.city || '').toLowerCase().includes(q) ||
        (item.adminName || item.principal || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q)
      );
    }
    if (type === 'admins') {
      return (
        (item.name || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q) ||
        (item.username || '').toLowerCase().includes(q) ||
        (item.schoolName || '').toLowerCase().includes(q) ||
        (item.phone || '').toLowerCase().includes(q)
      );
    }
    if (type === 'subscriptions') {
      return (
        (item.id || '').toLowerCase().includes(q) ||
        (item.school || '').toLowerCase().includes(q) ||
        (item.plan || '').toLowerCase().includes(q) ||
        (item.status || '').toLowerCase().includes(q)
      );
    }
    if (type === 'bills') {
      return (
        (item.invoiceNo || '').toLowerCase().includes(q) ||
        (item.school || '').toLowerCase().includes(q) ||
        (item.plan || '').toLowerCase().includes(q) ||
        (item.status || '').toLowerCase().includes(q)
      );
    }
    if (type === 'people') {
      return (
        (item.name || '').toLowerCase().includes(q) ||
        (item.code || '').toLowerCase().includes(q) ||
        (item.adminName || item.principal || '').toLowerCase().includes(q)
      );
    }
    if (type === 'students') {
      return (
        (item.name || '').toLowerCase().includes(q) ||
        (item.roll || '').toLowerCase().includes(q) ||
        (item.class || '').toLowerCase().includes(q) ||
        (item.performance || '').toLowerCase().includes(q)
      );
    }
    if (type === 'teachers') {
      return (
        (item.name || '').toLowerCase().includes(q) ||
        (item.id || '').toLowerCase().includes(q) ||
        (item.subject || '').toLowerCase().includes(q) ||
        (item.class || '').toLowerCase().includes(q) ||
        (item.status || '').toLowerCase().includes(q)
      );
    }
    if (type === 'classes') {
      return (
        (item.name || '').toLowerCase().includes(q) ||
        (item.teacher || '').toLowerCase().includes(q) ||
        (item.room || '').toLowerCase().includes(q)
      );
    }
    if (type === 'fees') {
      return (
        (item.name || '').toLowerCase().includes(q) ||
        (item.roll || '').toLowerCase().includes(q) ||
        (item.class || '').toLowerCase().includes(q) ||
        (item.parent || '').toLowerCase().includes(q) ||
        (item.status || '').toLowerCase().includes(q)
      );
    }
    if (type === 'users') {
      return (
        (item.name || '').toLowerCase().includes(q) ||
        (item.role || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q) ||
        (item.username || '').toLowerCase().includes(q) ||
        (item.phone || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg" style={{ maxWidth: '950px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: badgeColor || '#2563eb' }}></div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>{title}</h3>
              <span className="badge" style={{ background: `${badgeColor || '#2563eb'}18`, color: badgeColor || '#2563eb', fontWeight: 700 }}>
                {filteredItems.length} of {count} {count === 1 ? 'Record' : 'Records'}
              </span>
            </div>
            {subtitle && <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 22px' }}>{subtitle}</p>}
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {/* Modal Search Toolbar */}
        <div style={{ padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder={`Search in ${title.toLowerCase()} (name, code, status, etc)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#1e293b', background: 'transparent' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem', padding: '0 4px' }}
                title="Clear search"
              >
                &times;
              </button>
            )}
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', borderRadius: '8px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Search
          </button>
        </div>

        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>No matching records found for "{searchQuery}".</p>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ marginTop: '10px' }}
                onClick={() => setSearchQuery('')}
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="table-responsive" style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <table className="portal-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    {type === 'schools' && (
                      <>
                        <th style={{ padding: '10px 14px' }}>School Name</th>
                        <th style={{ padding: '10px 14px' }}>Code</th>
                        <th style={{ padding: '10px 14px' }}>City</th>
                        <th style={{ padding: '10px 14px' }}>Admin / Principal</th>
                        <th style={{ padding: '10px 14px' }}>Students</th>
                        <th style={{ padding: '10px 14px' }}>Status</th>
                      </>
                    )}
                    {type === 'admins' && (
                      <>
                        <th style={{ padding: '10px 14px' }}>Admin Name</th>
                        <th style={{ padding: '10px 14px' }}>Email / Login</th>
                        <th style={{ padding: '10px 14px' }}>Assigned School</th>
                        <th style={{ padding: '10px 14px' }}>Contact Phone</th>
                        <th style={{ padding: '10px 14px' }}>Status</th>
                      </>
                    )}
                    {type === 'subscriptions' && (
                      <>
                        <th style={{ padding: '10px 14px' }}>Sub ID</th>
                        <th style={{ padding: '10px 14px' }}>School</th>
                        <th style={{ padding: '10px 14px' }}>Plan</th>
                        <th style={{ padding: '10px 14px' }}>Validity</th>
                        <th style={{ padding: '10px 14px' }}>Amount</th>
                        <th style={{ padding: '10px 14px' }}>Status</th>
                      </>
                    )}
                    {type === 'bills' && (
                      <>
                        <th style={{ padding: '10px 14px' }}>Invoice No</th>
                        <th style={{ padding: '10px 14px' }}>School</th>
                        <th style={{ padding: '10px 14px' }}>Plan</th>
                        <th style={{ padding: '10px 14px' }}>Due Date</th>
                        <th style={{ padding: '10px 14px' }}>Amount</th>
                        <th style={{ padding: '10px 14px' }}>Payment Status</th>
                      </>
                    )}
                    {type === 'people' && (
                      <>
                        <th style={{ padding: '10px 14px' }}>School Campus</th>
                        <th style={{ padding: '10px 14px' }}>Students</th>
                        <th style={{ padding: '10px 14px' }}>Teachers</th>
                        <th style={{ padding: '10px 14px' }}>Parents</th>
                        <th style={{ padding: '10px 14px' }}>Admin Lead</th>
                      </>
                    )}
                    {type === 'students' && (
                      <>
                        <th style={{ padding: '10px 14px' }}>Roll No</th>
                        <th style={{ padding: '10px 14px' }}>Student Name</th>
                        <th style={{ padding: '10px 14px' }}>Class</th>
                        <th style={{ padding: '10px 14px' }}>Attendance</th>
                        <th style={{ padding: '10px 14px' }}>Performance</th>
                      </>
                    )}
                    {type === 'teachers' && (
                      <>
                        <th style={{ padding: '10px 14px' }}>Faculty ID</th>
                        <th style={{ padding: '10px 14px' }}>Teacher Name</th>
                        <th style={{ padding: '10px 14px' }}>Subject</th>
                        <th style={{ padding: '10px 14px' }}>Assigned Class</th>
                        <th style={{ padding: '10px 14px' }}>Status</th>
                      </>
                    )}
                    {type === 'classes' && (
                      <>
                        <th style={{ padding: '10px 14px' }}>Class Name</th>
                        <th style={{ padding: '10px 14px' }}>Class Teacher</th>
                        <th style={{ padding: '10px 14px' }}>Classroom</th>
                        <th style={{ padding: '10px 14px' }}>Total Strength</th>
                      </>
                    )}
                    {type === 'fees' && (
                      <>
                        <th style={{ padding: '10px 14px' }}>Roll / ID</th>
                        <th style={{ padding: '10px 14px' }}>Student Name</th>
                        <th style={{ padding: '10px 14px' }}>Class</th>
                        <th style={{ padding: '10px 14px' }}>Total Fee</th>
                        <th style={{ padding: '10px 14px' }}>Paid</th>
                        <th style={{ padding: '10px 14px' }}>Due</th>
                        <th style={{ padding: '10px 14px' }}>Status</th>
                      </>
                    )}
                    {type === 'users' && (
                      <>
                        <th style={{ padding: '10px 14px' }}>Full Name</th>
                        <th style={{ padding: '10px 14px' }}>Role</th>
                        <th style={{ padding: '10px 14px' }}>Contact Phone</th>
                        <th style={{ padding: '10px 14px' }}>Email / Login</th>
                        <th style={{ padding: '10px 14px' }}>Status</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, idx) => (
                    <tr key={item.id || item.invoiceNo || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {type === 'schools' && (
                        <>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e3a8a' }}>{item.name}</td>
                          <td style={{ padding: '10px 14px' }}><span className="badge badge-info">{item.code || item.id}</span></td>
                          <td style={{ padding: '10px 14px' }}>{item.city || '—'}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <div>{item.adminName || item.principal || '—'}</div>
                            <small style={{ color: '#64748b' }}>{item.email || item.admin || ''}</small>
                          </td>
                          <td style={{ padding: '10px 14px', fontWeight: 700 }}>{item.studentsCount || 0}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span className={`badge ${item.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                              {item.status}
                            </span>
                          </td>
                        </>
                      )}
                      {type === 'admins' && (
                        <>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{item.name}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <div><code style={{ color: '#2563eb' }}>{item.email}</code></div>
                            <small style={{ color: '#64748b' }}>User: {item.username || '—'}</small>
                          </td>
                          <td style={{ padding: '10px 14px', color: '#0369a1', fontWeight: 500 }}>{item.schoolName || item.schoolId || 'Platform Central'}</td>
                          <td style={{ padding: '10px 14px' }}>{item.phone || '—'}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span className={`badge ${item.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                              {item.status}
                            </span>
                          </td>
                        </>
                      )}
                      {type === 'subscriptions' && (
                        <>
                          <td style={{ padding: '10px 14px' }}><span className="badge badge-info">{item.id}</span></td>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{item.school}</td>
                          <td style={{ padding: '10px 14px', color: '#6366f1', fontWeight: 600 }}>{item.plan}</td>
                          <td style={{ padding: '10px 14px', fontSize: '0.8rem', color: '#64748b' }}>
                            {item.startDate} &rarr; {item.endDate}
                          </td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#047857' }}>{item.amount}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span className={`badge ${item.status === 'ACTIVE' || item.status === 'Active' ? 'badge-success' : item.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}`}>
                              {item.status}
                            </span>
                          </td>
                        </>
                      )}
                      {type === 'bills' && (
                        <>
                          <td style={{ padding: '10px 14px' }}><span className="badge badge-info">{item.invoiceNo}</span></td>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{item.school}</td>
                          <td style={{ padding: '10px 14px', color: '#6366f1' }}>{item.plan}</td>
                          <td style={{ padding: '10px 14px', color: '#64748b' }}>{item.dueDate}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#047857' }}>{item.amount}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span className={`badge ${item.status === 'PAID' ? 'badge-success' : item.status === 'OVERDUE' ? 'badge-danger' : 'badge-warning'}`}>
                              {item.status}
                            </span>
                          </td>
                        </>
                      )}
                      {type === 'people' && (
                        <>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e3a8a' }}>{item.name}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1d4ed8' }}>{(item.studentsCount || 0).toLocaleString()}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#6d28d9' }}>{item.teachersCount || 0}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#be185d' }}>{(item.parentsCount || 0).toLocaleString()}</td>
                          <td style={{ padding: '10px 14px', color: '#475569' }}>{item.adminName || item.principal || '—'}</td>
                        </>
                      )}
                      {type === 'students' && (
                        <>
                          <td style={{ padding: '10px 14px' }}><span className="badge badge-info">{item.roll}</span></td>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e3a8a' }}>{item.name}</td>
                          <td style={{ padding: '10px 14px', color: '#475569', fontWeight: 500 }}>{item.class}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#047857' }}>{item.attendance || '95%'}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span className="badge badge-success">{item.performance || 'Good'}</span>
                          </td>
                        </>
                      )}
                      {type === 'teachers' && (
                        <>
                          <td style={{ padding: '10px 14px' }}><span className="badge badge-info">{item.id}</span></td>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{item.name}</td>
                          <td style={{ padding: '10px 14px', color: '#6366f1', fontWeight: 500 }}>{item.subject}</td>
                          <td style={{ padding: '10px 14px', color: '#475569' }}>{item.class}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span className="badge badge-success">{item.status || 'Active'}</span>
                          </td>
                        </>
                      )}
                      {type === 'classes' && (
                        <>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1e3a8a' }}>{item.name}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 500 }}>{item.teacher}</td>
                          <td style={{ padding: '10px 14px', color: '#64748b' }}>{item.room || '—'}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#2563eb' }}>{item.strength} Students</td>
                        </>
                      )}
                      {type === 'fees' && (
                        <>
                          <td style={{ padding: '10px 14px' }}><span className="badge badge-info">{item.roll || item.id}</span></td>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{item.name}</td>
                          <td style={{ padding: '10px 14px', color: '#475569' }}>{item.class}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{item.totalFee}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#047857' }}>{item.paid}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: item.due === '₹0' ? '#64748b' : '#dc2626' }}>{item.due}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span className={`badge ${item.status === 'PAID' ? 'badge-success' : item.status === 'PARTIAL' ? 'badge-warning' : 'badge-danger'}`}>
                              {item.status}
                            </span>
                          </td>
                        </>
                      )}
                      {type === 'users' && (
                        <>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{item.name}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span className={`badge ${item.role === 'SCHOOL_ADMIN' ? 'badge-primary' : item.role === 'PRINCIPAL' ? 'badge-indigo' : item.role === 'TEACHER' ? 'badge-success' : item.role === 'STUDENT' ? 'badge-warning' : 'badge-purple'}`}>
                              {item.role}
                            </span>
                          </td>
                          <td style={{ padding: '10px 14px', fontWeight: 500 }}>{item.phone || '—'}</td>
                          <td style={{ padding: '10px 14px', color: '#2563eb' }}>{item.email || item.username}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span className="badge badge-success">{item.status || 'Active'}</span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
          <div>
            {detailConfig.targetTab && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  if (onNavigate) onNavigate(detailConfig.targetTab);
                  onClose();
                }}
              >
                Go to full {detailConfig.targetTabLabel || 'Management view'} &rarr;
              </button>
            )}
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

