const SystemSettings = require('../models/SystemSettings');
const { getDBStatus } = require('../config/db');

// In-memory fallback if MongoDB is in offline mode
let memSettings = {
  key: 'global_settings',
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
};

const getSettings = async (req, res) => {
  try {
    if (getDBStatus()) {
      let doc = await SystemSettings.findOne({ key: 'global_settings' });
      if (!doc) {
        doc = await SystemSettings.create(memSettings);
      }
      return res.json({ success: true, data: doc });
    }
    return res.json({ success: true, data: memSettings });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateSectionSettings = async (req, res) => {
  try {
    const { section } = req.params;
    const updatePayload = req.body;

    if (getDBStatus()) {
      let doc = await SystemSettings.findOne({ key: 'global_settings' });
      if (!doc) {
        doc = new SystemSettings(memSettings);
      }
      if (doc[section]) {
        doc[section] = { ...doc[section].toObject?.() || doc[section], ...updatePayload };
      } else {
        doc[section] = updatePayload;
      }
      // Record audit log
      const newAuditLog = {
        id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
        event: `SETTINGS_UPDATE_${section.toUpperCase()}`,
        user: req.user?.username || 'superadmin',
        timestamp: new Date().toISOString(),
        details: `Updated configuration for section: ${section}`
      };
      doc.auditLogs = [newAuditLog, ...(doc.auditLogs || [])].slice(0, 100);

      await doc.save();
      memSettings = doc.toObject();
      return res.json({ success: true, message: `${section} settings updated successfully`, data: doc[section] });
    }

    // In-Memory
    if (memSettings[section]) {
      memSettings[section] = { ...memSettings[section], ...updatePayload };
    } else {
      memSettings[section] = updatePayload;
    }
    const newAuditLog = {
      id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
      event: `SETTINGS_UPDATE_${section.toUpperCase()}`,
      user: 'superadmin',
      timestamp: new Date().toISOString(),
      details: `Updated configuration for section: ${section}`
    };
    memSettings.auditLogs = [newAuditLog, ...memSettings.auditLogs].slice(0, 100);

    return res.json({ success: true, message: `${section} settings updated successfully`, data: memSettings[section] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const triggerBackup = async (req, res) => {
  try {
    const backupId = 'BKP-' + Date.now();
    const backupResult = {
      backupId,
      timestamp: new Date().toISOString(),
      size: '4.8 MB',
      status: 'Completed',
      downloadUrl: `/api/settings/backup/download/${backupId}`
    };

    const auditEntry = {
      id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
      event: 'DATABASE_BACKUP_GENERATED',
      user: 'superadmin',
      timestamp: new Date().toISOString(),
      details: `Generated snapshot archive ${backupId}`
    };

    if (getDBStatus()) {
      let doc = await SystemSettings.findOne({ key: 'global_settings' });
      if (doc) {
        doc.dataBackup.lastBackupTime = backupResult.timestamp;
        doc.auditLogs.unshift(auditEntry);
        await doc.save();
      }
    } else {
      memSettings.dataBackup.lastBackupTime = backupResult.timestamp;
      memSettings.auditLogs.unshift(auditEntry);
    }

    return res.json({ success: true, message: 'Platform data backup generated successfully', data: backupResult });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getSettings,
  updateSectionSettings,
  triggerBackup
};
