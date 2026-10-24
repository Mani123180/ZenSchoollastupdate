const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'global_settings', unique: true },
    general: {
      platformName: { type: String, default: 'ZenSchool Multi-Campus Platform' },
      contactEmail: { type: String, default: 'superadmin@zenschool.com' },
      supportPhone: { type: String, default: '+91 98401 11001' },
      websiteUrl: { type: String, default: 'https://zenschool.edu' },
      defaultCurrency: { type: String, default: 'INR (₹)' },
      maintenanceMode: { type: Boolean, default: false }
    },
    security: {
      mfaRequiredRoles: { type: [String], default: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
      sessionTimeoutMinutes: { type: Number, default: 60 },
      maxFailedAttempts: { type: Number, default: 5 },
      passwordExpiryDays: { type: Number, default: 90 },
      ipWhitelist: { type: String, default: '10.0.0.0/8, 192.168.1.0/24' },
      emergencyLockdown: { type: Boolean, default: false }
    },
    permissions: {
      roles: {
        type: mongoose.Schema.Types.Mixed,
        default: {
          SUPER_ADMIN: { canCreateSchool: true, canDeleteSchool: true, canManageBilling: true, canConfigureSystem: true },
          SCHOOL_ADMIN: { canManageStudents: true, canManageTeachers: true, canManageTimetable: true, canManageServices: true },
          PRINCIPAL: { canViewReports: true, canApproveLeaves: true, canBroadcastNotices: true },
          TEACHER: { canMarkAttendance: true, canEnterMarks: true, canCreateAssignments: true },
          STUDENT: { canViewMarks: true, canSubmitAssignments: true, canViewTimetable: true },
          PARENT: { canViewFeeReceipts: true, canViewAttendance: true, canChatWithTeacher: true }
        }
      }
    },
    notifications: {
      emailAlerts: { type: Boolean, default: true },
      smsGateway: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      slackWebhookUrl: { type: String, default: '' },
      billingAlertThresholdDays: { type: Number, default: 7 }
    },
    subscription: {
      billingCycle: { type: String, default: 'Annual' },
      currencySymbol: { type: String, default: '₹' },
      defaultAmount: { type: String, default: '0/yr' },
      paymentGateway: { type: String, default: 'Razorpay' },
      autoInvoiceGeneration: { type: Boolean, default: true }
    },
    schoolConfig: {
      defaultBoard: { type: String, default: 'CBSE' },
      academicYear: { type: String, default: '2026-2027' },
      termType: { type: String, default: 'Trimester' },
      workingDaysPerWeek: { type: Number, default: 5 },
      gradingScale: { type: String, default: 'GPA 10.0' }
    },
    dataBackup: {
      autoBackupDaily: { type: Boolean, default: true },
      backupRetentionDays: { type: Number, default: 30 },
      lastBackupTime: { type: String, default: () => new Date().toISOString() },
      cloudStorageProvider: { type: String, default: 'AWS S3 (Encrypted)' }
    },
    auditLogs: {
      type: Array,
      default: [
        { id: 'LOG-001', event: 'SYSTEM_BOOT', user: 'system', timestamp: new Date().toISOString(), details: 'All platform services initial state verified' },
        { id: 'LOG-002', event: 'SETTINGS_INITIALIZED', user: 'superadmin', timestamp: new Date().toISOString(), details: 'Global tenant configuration loaded' }
      ]
    },
    localization: {
      timeZone: { type: String, default: 'Asia/Kolkata (IST +5:30)' },
      dateFormat: { type: String, default: 'DD/MM/YYYY' },
      primaryLanguage: { type: String, default: 'English (India)' },
      fallbackLanguage: { type: String, default: 'Tamil' }
    },
    system: {
      apiRateLimitPerMin: { type: Number, default: 300 },
      debugLogging: { type: Boolean, default: false },
      cdnCaching: { type: Boolean, default: true },
      workerThreads: { type: Number, default: 4 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
