import React, { useState, useEffect } from 'react';
import { getSystemSettings, updateSystemSettingsSection, triggerSystemBackup } from '../../services/settingsService';

export default function SuperAdminSettingsHub({ showFeedback }) {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      platformName: 'ZenSchool Multi-Campus Platform',
      contactEmail: 'superadmin@zenschool.com',
      supportPhone: '+91 98401 11001',
      websiteUrl: 'https://zenschool.edu',
      defaultCurrency: 'INR (₹)',
      maintenanceMode: false
    },
    security: {
      mfaRequiredRoles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
      sessionTimeoutMinutes: 60,
      maxFailedAttempts: 5,
      passwordExpiryDays: 90,
      ipWhitelist: '10.0.0.0/8, 192.168.1.0/24',
      emergencyLockdown: false
    },
    permissions: {
      roles: {
        SUPER_ADMIN: { canCreateSchool: true, canDeleteSchool: true, canManageBilling: true, canConfigureSystem: true },
        SCHOOL_ADMIN: { canManageStudents: true, canManageTeachers: true, canManageTimetable: true, canManageServices: true },
        PRINCIPAL: { canViewReports: true, canApproveLeaves: true, canBroadcastNotices: true },
        TEACHER: { canMarkAttendance: true, canEnterMarks: true, canCreateAssignments: true },
        STUDENT: { canViewMarks: true, canSubmitAssignments: true, canViewTimetable: true },
        PARENT: { canViewFeeReceipts: true, canViewAttendance: true, canChatWithTeacher: true }
      }
    },
    notifications: {
      emailAlerts: true,
      smsGateway: true,
      pushNotifications: true,
      slackWebhookUrl: '',
      billingAlertThresholdDays: 7
    },
    subscription: {
      billingCycle: 'Annual',
      currencySymbol: '₹',
      defaultAmount: '0/yr',
      paymentGateway: 'Razorpay',
      autoInvoiceGeneration: true
    },
    schoolConfig: {
      defaultBoard: 'CBSE',
      academicYear: '2026-2027',
      termType: 'Trimester',
      workingDaysPerWeek: 5,
      gradingScale: 'GPA 10.0'
    },
    dataBackup: {
      autoBackupDaily: true,
      backupRetentionDays: 30,
      lastBackupTime: new Date().toISOString(),
      cloudStorageProvider: 'AWS S3 (Encrypted)'
    },
    auditLogs: [
      { id: 'LOG-001', event: 'SYSTEM_BOOT', user: 'system', timestamp: new Date().toISOString(), details: 'All platform services operational' },
      { id: 'LOG-002', event: 'SETTINGS_INITIALIZED', user: 'superadmin', timestamp: new Date().toISOString(), details: 'Global tenant configuration loaded' }
    ],
    localization: {
      timeZone: 'Asia/Kolkata (IST +5:30)',
      dateFormat: 'DD/MM/YYYY',
      primaryLanguage: 'English (India)',
      fallbackLanguage: 'Tamil'
    },
    system: {
      apiRateLimitPerMin: 300,
      debugLogging: false,
      cdnCaching: true,
      workerThreads: 4
    }
  });

  const [auditSearch, setAuditSearch] = useState('');

  // Load live settings from backend/database on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getSystemSettings();
      if (data) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSaveSection = async (sectionName, sectionData) => {
    const updatedSettings = { ...settings, [sectionName]: sectionData };
    setSettings(updatedSettings);
    await updateSystemSettingsSection(sectionName, sectionData);
  };

  const handleTriggerBackup = async () => {
    const res = await triggerSystemBackup();
    if (res.success && res.data) {
      setSettings((prev) => ({
        ...prev,
        dataBackup: {
          ...prev.dataBackup,
          lastBackupTime: res.data.timestamp
        },
        auditLogs: [
          {
            id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
            event: 'DATABASE_BACKUP_GENERATED',
            user: 'superadmin',
            timestamp: res.data.timestamp,
            details: `Snapshot archive ${res.data.backupId} created`
          },
          ...(prev.auditLogs || [])
        ]
      }));
    }
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Security' },
    { id: 'permissions', label: 'User & Role Permissions' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'subscription', label: 'Subscription & Payment' },
    { id: 'schoolConfig', label: 'School Configuration' },
    { id: 'dataBackup', label: 'Data & Backup' },
    { id: 'auditLogs', label: 'Audit Logs' },
    { id: 'localization', label: 'Localization' },
    { id: 'system', label: 'System Settings' }
  ];

  return (
    <div style={{ marginTop: '10px' }}>
      {/* 10 Setting Tabs Navigation */}
      <div className="sa-schools-header-bar" style={{ marginBottom: '22px', flexWrap: 'wrap', gap: '8px' }}>
        <div className="sa-filter-segment" style={{ flexWrap: 'wrap', gap: '6px' }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`sa-filter-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
              style={{ fontSize: '0.82rem', padding: '7px 14px' }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '860px' }}>
        {/* 1. GENERAL */}
        {activeTab === 'general' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSection('general', settings.general);
            }}
          >
            <div className="wizard-form-box" style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div className="wizard-header-strip" style={{ marginBottom: '20px' }}>
                <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>⚙️</div>
                <div className="wizard-header-titles">
                  <h4>General Platform Settings</h4>
                  <p>Central institutional identity, platform naming, primary contact endpoints, and maintenance toggles.</p>
                </div>
              </div>

              <div className="wizard-grid-2">
                <div className="wizard-field">
                  <label>Platform Name <span className="req">*</span></label>
                  <input
                    type="text"
                    value={settings.general.platformName}
                    required
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, platformName: e.target.value } })}
                  />
                </div>
                <div className="wizard-field">
                  <label>Super Admin Contact Email <span className="req">*</span></label>
                  <input
                    type="email"
                    value={settings.general.contactEmail}
                    required
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, contactEmail: e.target.value } })}
                  />
                </div>
                <div className="wizard-field">
                  <label>Support Phone Line <span className="req">*</span></label>
                  <input
                    type="text"
                    value={settings.general.supportPhone}
                    required
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, supportPhone: e.target.value } })}
                  />
                </div>
                <div className="wizard-field">
                  <label>Platform Website URL <span className="req">*</span></label>
                  <input
                    type="text"
                    value={settings.general.websiteUrl}
                    required
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, websiteUrl: e.target.value } })}
                  />
                </div>
                <div className="wizard-field">
                  <label>Default Currency Standard</label>
                  <input
                    type="text"
                    value={settings.general.defaultCurrency}
                    required
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, defaultCurrency: e.target.value } })}
                  />
                </div>
                <div className="wizard-field">
                  <label>Maintenance Mode Toggle</label>
                  <select
                    value={settings.general.maintenanceMode ? 'Enabled' : 'Disabled'}
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, maintenanceMode: e.target.value === 'Enabled' } })}
                  >
                    <option value="Disabled">Disabled (Platform Online)</option>
                    <option value="Enabled">Enabled (Maintenance Mode)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Save General Settings ✓</button>
              </div>
            </div>
          </form>
        )}

        {/* 2. SECURITY */}
        {activeTab === 'security' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSection('security', settings.security);
            }}
          >
            <div className="wizard-form-box" style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div className="wizard-header-strip" style={{ marginBottom: '20px' }}>
                <div className="wizard-header-icon" style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#dc2626' }}>🔒</div>
                <div className="wizard-header-titles">
                  <h4>Security & Authentication Controls</h4>
                  <p>MFA policies, session lifespans, brute force lockouts, IP whitelists, and platform lockdown.</p>
                </div>
              </div>

              <div className="wizard-grid-2">
                <div className="wizard-field">
                  <label>Session Timeout (Minutes) <span className="req">*</span></label>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.security.sessionTimeoutMinutes}
                    required
                    onChange={(e) => setSettings({ ...settings, security: { ...settings.security, sessionTimeoutMinutes: Number(e.target.value) } })}
                  />
                </div>
                <div className="wizard-field">
                  <label>Max Failed Login Attempts Before Lockout <span className="req">*</span></label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={settings.security.maxFailedAttempts}
                    required
                    onChange={(e) => setSettings({ ...settings, security: { ...settings.security, maxFailedAttempts: Number(e.target.value) } })}
                  />
                </div>
                <div className="wizard-field">
                  <label>Password Expiry Cycle (Days)</label>
                  <input
                    type="number"
                    value={settings.security.passwordExpiryDays}
                    required
                    onChange={(e) => setSettings({ ...settings, security: { ...settings.security, passwordExpiryDays: Number(e.target.value) } })}
                  />
                </div>
                <div className="wizard-field">
                  <label>Emergency Platform Lockdown</label>
                  <select
                    value={settings.security.emergencyLockdown ? 'Active' : 'Inactive'}
                    onChange={(e) => setSettings({ ...settings, security: { ...settings.security, emergencyLockdown: e.target.value === 'Active' } })}
                  >
                    <option value="Inactive">Normal Operations (Unlocked)</option>
                    <option value="Active">🚨 Engaged (Only Super Admin Allowed)</option>
                  </select>
                </div>
                <div className="wizard-field span-2">
                  <label>Trusted CIDR IP Whitelist</label>
                  <input
                    type="text"
                    value={settings.security.ipWhitelist}
                    onChange={(e) => setSettings({ ...settings, security: { ...settings.security, ipWhitelist: e.target.value } })}
                  />
                  <span className="input-hint">Comma separated list of permitted IP address blocks.</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Save Security Settings ✓</button>
              </div>
            </div>
          </form>
        )}

        {/* 3. USER & ROLE PERMISSIONS */}
        {activeTab === 'permissions' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSection('permissions', settings.permissions);
            }}
          >
            <div className="wizard-form-box" style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div className="wizard-header-strip" style={{ marginBottom: '20px' }}>
                <div className="wizard-header-icon" style={{ background: 'rgba(59, 130, 246, 0.08)', color: '#2563eb' }}>👥</div>
                <div className="wizard-header-titles">
                  <h4>Role-Based Access Control (RBAC) Permissions</h4>
                  <p>Configure permission gates and actionable abilities across each institutional portal role.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {Object.entries(settings.permissions.roles || {}).map(([role, perms]) => (
                  <div key={role} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <strong style={{ color: '#1e3a8a', fontSize: '0.9rem' }}>{role}</strong>
                      <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>Portal Access</span>
                    </div>
                    {Object.entries(perms).map(([permKey, isEnabled]) => (
                      <label key={permKey} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', margin: '6px 0', cursor: 'pointer', color: '#334155' }}>
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) => {
                            const updatedRoles = {
                              ...settings.permissions.roles,
                              [role]: {
                                ...settings.permissions.roles[role],
                                [permKey]: e.target.checked
                              }
                            };
                            setSettings({ ...settings, permissions: { ...settings.permissions, roles: updatedRoles } });
                          }}
                        />
                        <span>{permKey.replace(/([A-Z])/g, ' $1').replace(/^can /, 'Can ')}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Save Role Permissions ✓</button>
              </div>
            </div>
          </form>
        )}

        {/* 4. NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSection('notifications', settings.notifications);
            }}
          >
            <div className="wizard-form-box" style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div className="wizard-header-strip" style={{ marginBottom: '20px' }}>
                <div className="wizard-header-icon" style={{ background: 'rgba(234, 179, 8, 0.08)', color: '#ca8a04' }}>🔔</div>
                <div className="wizard-header-titles">
                  <h4>Notification Channels & Alert Rules</h4>
                  <p>Enable/disable automated alerts, SMS gateways, email dispatches, and webhook integrations.</p>
                </div>
              </div>

              <div className="wizard-grid-2">
                <div className="wizard-field" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px' }}>
                  <input
                    type="checkbox"
                    id="emailAlerts"
                    checked={settings.notifications.emailAlerts}
                    onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, emailAlerts: e.target.checked } })}
                  />
                  <label htmlFor="emailAlerts" style={{ margin: 0, cursor: 'pointer' }}>Transactional Email Alerts Enabled</label>
                </div>
                <div className="wizard-field" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px' }}>
                  <input
                    type="checkbox"
                    id="smsGateway"
                    checked={settings.notifications.smsGateway}
                    onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, smsGateway: e.target.checked } })}
                  />
                  <label htmlFor="smsGateway" style={{ margin: 0, cursor: 'pointer' }}>SMS Notification Gateway Active</label>
                </div>
                <div className="wizard-field" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px' }}>
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, pushNotifications: e.target.checked } })}
                  />
                  <label htmlFor="pushNotifications" style={{ margin: 0, cursor: 'pointer' }}>Mobile Web Push Notifications</label>
                </div>
                <div className="wizard-field">
                  <label>Billing Expiry Advance Notice (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.notifications.billingAlertThresholdDays}
                    required
                    onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, billingAlertThresholdDays: Number(e.target.value) } })}
                  />
                </div>
                <div className="wizard-field span-2">
                  <label>Slack / Webhook Notification URL</label>
                  <input
                    type="text"
                    placeholder="https://hooks.slack.com/services/..."
                    value={settings.notifications.slackWebhookUrl}
                    onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, slackWebhookUrl: e.target.value } })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Save Notification Settings ✓</button>
              </div>
            </div>
          </form>
        )}

        {/* 5. SUBSCRIPTION & PAYMENT */}
        {activeTab === 'subscription' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSection('subscription', settings.subscription);
            }}
          >
            <div className="wizard-form-box" style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div className="wizard-header-strip" style={{ marginBottom: '20px' }}>
                <div className="wizard-header-icon" style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#059669' }}>💳</div>
                <div className="wizard-header-titles">
                  <h4>Subscription & Payment Gateway Configuration</h4>
                  <p>Global billing cadence, default licensing rate (0/yr), payment processor, and invoice automation.</p>
                </div>
              </div>

              <div className="wizard-grid-2">
                <div className="wizard-field">
                  <label>Standard Billing Cadence <span className="req">*</span></label>
                  <select
                    value={settings.subscription.billingCycle}
                    onChange={(e) => setSettings({ ...settings, subscription: { ...settings.subscription, billingCycle: e.target.value } })}
                  >
                    <option value="Annual">Annual License (Standard)</option>
                    <option value="Monthly">Monthly License</option>
                    <option value="Term">Term Based (Per Academic Term)</option>
                  </select>
                </div>
                <div className="wizard-field">
                  <label>Platform Default Pricing Rate</label>
                  <input
                    type="text"
                    value={settings.subscription.defaultAmount}
                    required
                    onChange={(e) => setSettings({ ...settings, subscription: { ...settings.subscription, defaultAmount: e.target.value } })}
                  />
                </div>
                <div className="wizard-field">
                  <label>Primary Payment Gateway</label>
                  <select
                    value={settings.subscription.paymentGateway}
                    onChange={(e) => setSettings({ ...settings, subscription: { ...settings.subscription, paymentGateway: e.target.value } })}
                  >
                    <option value="Razorpay">Razorpay Enterprise Gateway</option>
                    <option value="Stripe">Stripe Cloud Payments</option>
                    <option value="DirectBanking">Direct Institutional RTGS / NEFT</option>
                  </select>
                </div>
                <div className="wizard-field" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '22px' }}>
                  <input
                    type="checkbox"
                    id="autoInvoice"
                    checked={settings.subscription.autoInvoiceGeneration}
                    onChange={(e) => setSettings({ ...settings, subscription: { ...settings.subscription, autoInvoiceGeneration: e.target.checked } })}
                  />
                  <label htmlFor="autoInvoice" style={{ margin: 0, cursor: 'pointer' }}>Automatic Invoice Generation on Renewal</label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Save Subscription Settings ✓</button>
              </div>
            </div>
          </form>
        )}

        {/* 6. SCHOOL CONFIGURATION */}
        {activeTab === 'schoolConfig' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSection('schoolConfig', settings.schoolConfig);
            }}
          >
            <div className="wizard-form-box" style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div className="wizard-header-strip" style={{ marginBottom: '20px' }}>
                <div className="wizard-header-icon" style={{ background: 'rgba(99, 102, 241, 0.08)', color: '#4f46e5' }}>🏫</div>
                <div className="wizard-header-titles">
                  <h4>Default Campus & School Configuration</h4>
                  <p>Standard educational defaults applied automatically whenever a new campus is onboarded.</p>
                </div>
              </div>

              <div className="wizard-grid-2">
                <div className="wizard-field">
                  <label>Default Education Board</label>
                  <select
                    value={settings.schoolConfig.defaultBoard}
                    onChange={(e) => setSettings({ ...settings, schoolConfig: { ...settings.schoolConfig, defaultBoard: e.target.value } })}
                  >
                    <option value="CBSE">CBSE (Central Board of Secondary Education)</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Matriculation Board</option>
                    <option value="IB">International Baccalaureate (IB)</option>
                    <option value="Cambridge">Cambridge International (IGCSE)</option>
                  </select>
                </div>
                <div className="wizard-field">
                  <label>Active Academic Year</label>
                  <input
                    type="text"
                    value={settings.schoolConfig.academicYear}
                    required
                    onChange={(e) => setSettings({ ...settings, schoolConfig: { ...settings.schoolConfig, academicYear: e.target.value } })}
                  />
                </div>
                <div className="wizard-field">
                  <label>Default Term System</label>
                  <select
                    value={settings.schoolConfig.termType}
                    onChange={(e) => setSettings({ ...settings, schoolConfig: { ...settings.schoolConfig, termType: e.target.value } })}
                  >
                    <option value="Trimester">Trimester (Term 1, Term 2, Term 3)</option>
                    <option value="Semester">Semester (2 Semesters)</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
                <div className="wizard-field">
                  <label>Instructional Days Per Week</label>
                  <select
                    value={settings.schoolConfig.workingDaysPerWeek}
                    onChange={(e) => setSettings({ ...settings, schoolConfig: { ...settings.schoolConfig, workingDaysPerWeek: Number(e.target.value) } })}
                  >
                    <option value={5}>5 Days (Monday to Friday)</option>
                    <option value={6}>6 Days (Monday to Saturday)</option>
                  </select>
                </div>
                <div className="wizard-field span-2">
                  <label>Institutional Grading Standard</label>
                  <select
                    value={settings.schoolConfig.gradingScale}
                    onChange={(e) => setSettings({ ...settings, schoolConfig: { ...settings.schoolConfig, gradingScale: e.target.value } })}
                  >
                    <option value="GPA 10.0">10-Point Scale (CBSE GPA Standard)</option>
                    <option value="Percentage">Percentage Marks (0 - 100%)</option>
                    <option value="Letter Grade">Letter Grades (A+, A, B, C, D, F)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Save Campus Defaults ✓</button>
              </div>
            </div>
          </form>
        )}

        {/* 7. DATA & BACKUP */}
        {activeTab === 'dataBackup' && (
          <div className="wizard-form-box" style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div className="wizard-header-strip" style={{ marginBottom: '20px' }}>
              <div className="wizard-header-icon" style={{ background: 'rgba(14, 165, 233, 0.08)', color: '#0284c7' }}>💾</div>
              <div className="wizard-header-titles">
                <h4>Database Backup & Recovery Services</h4>
                <p>Scheduled cloud automated snapshots, retention terms, and instant manual database archives.</p>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>Trigger Manual Snapshot Backup</strong>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                    Creates a point-in-time full snapshot of all campus, subscription, bill, and user data.
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleTriggerBackup}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  ⚡ Start Backup Now
                </button>
              </div>
              <div style={{ marginTop: '12px', fontSize: '0.82rem', color: '#475569' }}>
                Last Successful Snapshot: <strong>{new Date(settings.dataBackup.lastBackupTime).toLocaleString()}</strong>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSection('dataBackup', settings.dataBackup);
              }}
            >
              <div className="wizard-grid-2">
                <div className="wizard-field" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px' }}>
                  <input
                    type="checkbox"
                    id="autoBackup"
                    checked={settings.dataBackup.autoBackupDaily}
                    onChange={(e) => setSettings({ ...settings, dataBackup: { ...settings.dataBackup, autoBackupDaily: e.target.checked } })}
                  />
                  <label htmlFor="autoBackup" style={{ margin: 0, cursor: 'pointer' }}>Daily Automated Midnight Snapshot</label>
                </div>
                <div className="wizard-field">
                  <label>Retention Duration (Days)</label>
                  <input
                    type="number"
                    min="7"
                    max="365"
                    value={settings.dataBackup.backupRetentionDays}
                    required
                    onChange={(e) => setSettings({ ...settings, dataBackup: { ...settings.dataBackup, backupRetentionDays: Number(e.target.value) } })}
                  />
                </div>
                <div className="wizard-field span-2">
                  <label>Encrypted Cloud Storage Location</label>
                  <input
                    type="text"
                    value={settings.dataBackup.cloudStorageProvider}
                    required
                    onChange={(e) => setSettings({ ...settings, dataBackup: { ...settings.dataBackup, cloudStorageProvider: e.target.value } })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Save Backup Rules ✓</button>
              </div>
            </form>
          </div>
        )}

        {/* 8. AUDIT LOGS */}
        {activeTab === 'auditLogs' && (
          <div className="wizard-form-box" style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div className="wizard-header-strip" style={{ marginBottom: '16px' }}>
              <div className="wizard-header-icon" style={{ background: 'rgba(100, 116, 139, 0.08)', color: '#475569' }}>📋</div>
              <div className="wizard-header-titles">
                <h4>System Audit & Forensic Activity Logs</h4>
                <p>Immutable record of configuration updates, administrative events, and authentication changes.</p>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Search audit logs by event, user, or details..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>

            <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table className="sa-schools-table" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th style={{ width: '90px' }}>Log ID</th>
                    <th style={{ width: '160px' }}>Timestamp</th>
                    <th style={{ width: '140px' }}>User</th>
                    <th style={{ width: '180px' }}>Event Name</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {(settings.auditLogs || [])
                    .filter((log) => {
                      if (!auditSearch.trim()) return true;
                      const q = auditSearch.toLowerCase();
                      return (
                        (log.id || '').toLowerCase().includes(q) ||
                        (log.user || '').toLowerCase().includes(q) ||
                        (log.event || '').toLowerCase().includes(q) ||
                        (log.details || '').toLowerCase().includes(q)
                      );
                    })
                    .map((log, idx) => (
                      <tr key={log.id || idx}>
                        <td><code>{log.id || `LOG-${idx + 1}`}</code></td>
                        <td style={{ color: '#64748b' }}>{new Date(log.timestamp || Date.now()).toLocaleString()}</td>
                        <td><strong>{log.user || 'superadmin'}</strong></td>
                        <td><span className="badge badge-info">{log.event}</span></td>
                        <td>{log.details || 'System event triggered'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. LOCALIZATION */}
        {activeTab === 'localization' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSection('localization', settings.localization);
            }}
          >
            <div className="wizard-form-box" style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div className="wizard-header-strip" style={{ marginBottom: '20px' }}>
                <div className="wizard-header-icon" style={{ background: 'rgba(236, 72, 153, 0.08)', color: '#db2777' }}>🌐</div>
                <div className="wizard-header-titles">
                  <h4>Localization, Regional & Language Settings</h4>
                  <p>Configure time zones, date formats, primary institutional languages, and translation fallbacks.</p>
                </div>
              </div>

              <div className="wizard-grid-2">
                <div className="wizard-field">
                  <label>Standard Time Zone</label>
                  <select
                    value={settings.localization.timeZone}
                    onChange={(e) => setSettings({ ...settings, localization: { ...settings.localization, timeZone: e.target.value } })}
                  >
                    <option value="Asia/Kolkata (IST +5:30)">Asia/Kolkata (India Standard Time +5:30)</option>
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                  </select>
                </div>
                <div className="wizard-field">
                  <label>Preferred Date Display Format</label>
                  <select
                    value={settings.localization.dateFormat}
                    onChange={(e) => setSettings({ ...settings, localization: { ...settings.localization, dateFormat: e.target.value } })}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (Standard Indian / British)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Standard)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
                  </select>
                </div>
                <div className="wizard-field">
                  <label>Primary Language</label>
                  <select
                    value={settings.localization.primaryLanguage}
                    onChange={(e) => setSettings({ ...settings, localization: { ...settings.localization, primaryLanguage: e.target.value } })}
                  >
                    <option value="English (India)">English (India)</option>
                    <option value="English (US)">English (US)</option>
                    <option value="English (UK)">English (UK)</option>
                  </select>
                </div>
                <div className="wizard-field">
                  <label>Fallback / Regional Language</label>
                  <select
                    value={settings.localization.fallbackLanguage}
                    onChange={(e) => setSettings({ ...settings, localization: { ...settings.localization, fallbackLanguage: e.target.value } })}
                  >
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Telugu">Telugu (తెలుగు)</option>
                    <option value="Malayalam">Malayalam (മലയാളം)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Save Localization Settings ✓</button>
              </div>
            </div>
          </form>
        )}

        {/* 10. SYSTEM SETTINGS */}
        {activeTab === 'system' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSection('system', settings.system);
            }}
          >
            <div className="wizard-form-box" style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div className="wizard-header-strip" style={{ marginBottom: '20px' }}>
                <div className="wizard-header-icon" style={{ background: 'rgba(79, 70, 229, 0.08)', color: '#4338ca' }}>🖥️</div>
                <div className="wizard-header-titles">
                  <h4>Core Engine & System Architecture Settings</h4>
                  <p>Fine-tune API rate limits, worker threads, CDN caches, and developer debug tracing.</p>
                </div>
              </div>

              <div className="wizard-grid-2">
                <div className="wizard-field">
                  <label>API Rate Limit (Requests / Minute) <span className="req">*</span></label>
                  <input
                    type="number"
                    min="50"
                    max="2000"
                    value={settings.system.apiRateLimitPerMin}
                    required
                    onChange={(e) => setSettings({ ...settings, system: { ...settings.system, apiRateLimitPerMin: Number(e.target.value) } })}
                  />
                </div>
                <div className="wizard-field">
                  <label>Background Worker Threads</label>
                  <input
                    type="number"
                    min="1"
                    max="32"
                    value={settings.system.workerThreads}
                    required
                    onChange={(e) => setSettings({ ...settings, system: { ...settings.system, workerThreads: Number(e.target.value) } })}
                  />
                </div>
                <div className="wizard-field" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px' }}>
                  <input
                    type="checkbox"
                    id="cdnCache"
                    checked={settings.system.cdnCaching}
                    onChange={(e) => setSettings({ ...settings, system: { ...settings.system, cdnCaching: e.target.checked } })}
                  />
                  <label htmlFor="cdnCache" style={{ margin: 0, cursor: 'pointer' }}>Global Edge CDN Caching Active</label>
                </div>
                <div className="wizard-field" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px' }}>
                  <input
                    type="checkbox"
                    id="debugLogs"
                    checked={settings.system.debugLogging}
                    onChange={(e) => setSettings({ ...settings, system: { ...settings.system, debugLogging: e.target.checked } })}
                  />
                  <label htmlFor="debugLogs" style={{ margin: 0, cursor: 'pointer' }}>Developer Verbose Debug Logging</label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Save System Settings ✓</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
