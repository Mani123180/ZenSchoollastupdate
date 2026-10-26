const Message = require('../models/Message');
const User = require('../models/User');
const { initialMessages, initialUsers } = require('../seed/seedData');
const { getDBStatus } = require('../config/db');

// Exact 6 Active Portal Users matching the 6 Login Buttons
const realPortalUsers = [
  {
    userId: 'USR001',
    username: 'superadmin',
    name: 'Super Administrator',
    role: 'superadmin',
    schoolId: 'ALL',
    schoolName: 'Zenith Central Trust',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    status: 'online',
  },
  {
    userId: 'USR002',
    username: 'admin_ssv',
    name: 'School Administrator',
    role: 'schooladmin',
    schoolId: 'SCHOOL002',
    schoolName: 'Sri Sankara Vidhyasala Girls High School',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: 'online',
  },
  {
    userId: 'USR003',
    username: 'principal',
    name: 'Dr. Savithri Raman',
    role: 'principal',
    schoolId: 'SCHOOL002',
    schoolName: 'Sri Sankara Vidhyasala Girls High School',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    status: 'online',
  },
  {
    userId: 'USR004',
    username: 'teacher',
    name: 'Mrs. Priya Krishnan',
    role: 'teacher',
    schoolId: 'SCHOOL002',
    schoolName: 'Sri Sankara Vidhyasala Girls High School',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    status: 'online',
  },
  {
    userId: 'USR006',
    username: 'student',
    name: 'Aishwarya Kumar',
    role: 'student',
    schoolId: 'SCHOOL002',
    schoolName: 'Sri Sankara Vidhyasala Girls High School',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    status: 'online',
  },
  {
    userId: 'USR008',
    username: 'parent',
    name: 'Ramesh Kumar',
    role: 'parent',
    schoolId: 'SCHOOL002',
    schoolName: 'Sri Sankara Vidhyasala Girls High School',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    status: 'online',
  },
];

let memMessages = [...initialMessages];

// Helper to normalize user identifiers (e.g. USR-ADM -> USR002, USR-TCH -> USR004)
const normalizeId = (id) => {
  if (!id) return id;
  const map = {
    'USR-SA': 'USR001',
    'USR-ADM': 'USR002',
    'USR-PRIN': 'USR003',
    'USR-TCH': 'USR004',
    'USR-STD': 'USR006',
    'USR-PAR': 'USR008',
  };
  return map[id] || id;
};

const { memUsers } = require('./userController');

// In-memory active presence tracker: userId -> timestamp of last heartbeat
const activeUserPresence = new Map();

// Helper to check if a user is online (heartbeat received within last 12 seconds)
const isUserOnline = (userId) => {
  const norm = normalizeId(userId);
  const lastSeen = activeUserPresence.get(norm);
  if (!lastSeen) return false;
  return Date.now() - lastSeen < 12000;
};

// Heartbeat endpoint called by logged-in users
const heartbeat = async (req, res) => {
  try {
    const rawUserId = req.user ? (req.user.userId || req.user.id) : null;
    const currentUserId = normalizeId(rawUserId);
    if (currentUserId) {
      activeUserPresence.set(currentUserId, Date.now());

      // If user is online, mark messages sent TO this user as delivered
      memMessages.forEach((m) => {
        if (normalizeId(m.receiverId) === currentUserId && !m.delivered) {
          m.delivered = true;
        }
      });

      if (getDBStatus()) {
        try {
          await Message.updateMany(
            { receiverId: { $in: [currentUserId, rawUserId] }, delivered: false },
            { $set: { delivered: true } }
          );
          await User.findOneAndUpdate(
            { $or: [{ userId: currentUserId }, { userId: rawUserId }] },
            { $set: { lastActiveAt: new Date() } }
          );
        } catch (e) {
          // ignore
        }
      }
    }
    return res.json({ success: true, online: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const rawUserId = req.user ? (req.user.userId || req.user.id) : null;
    const currentUserId = normalizeId(rawUserId);
    if (currentUserId) {
      activeUserPresence.set(currentUserId, Date.now());
    }

    // Strict list: Only include users who actually have an active portal dashboard
    const portalUserIds = new Set(realPortalUsers.map((u) => u.userId));

    // Combine predefined real portal users and dynamic memUsers (avoiding duplicate IDs)
    const userMap = new Map();
    realPortalUsers.forEach((u) => {
      const uid = normalizeId(u.userId);
      const online = isUserOnline(uid);
      userMap.set(uid, {
        id: uid,
        name: u.name,
        role: u.role,
        schoolId: u.schoolId,
        schoolName: u.schoolName,
        status: online ? 'online' : 'offline',
        avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      });
    });

    // Also include any new users created via Admin dashboard
    if (Array.isArray(memUsers)) {
      memUsers.forEach((u) => {
        const uId = normalizeId(u.userId || u.id);
        if (uId && !userMap.has(uId)) {
          const online = isUserOnline(uId);
          userMap.set(uId, {
            id: uId,
            name: u.name,
            role: u.role,
            schoolId: u.schoolId,
            schoolName: u.schoolName,
            status: online ? 'online' : 'offline',
            avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          });
        }
      });
    }

    allUsers = Array.from(userMap.values());

    // Helper to count unread incoming messages from contact to current logged-in user
    const getUnreadCount = (contactId) => {
      const cId = normalizeId(contactId);
      return memMessages.filter(
        (m) => normalizeId(m.senderId) === cId && normalizeId(m.receiverId) === currentUserId && !m.read
      ).length;
    };

    // Helper to get last message snippet
    const getLastMsg = (contactId) => {
      const cId = normalizeId(contactId);
      const matched = memMessages.filter(
        (m) =>
          (normalizeId(m.senderId) === cId && normalizeId(m.receiverId) === currentUserId) ||
          (normalizeId(m.senderId) === currentUserId && normalizeId(m.receiverId) === cId)
      );
      if (matched.length > 0) {
        return matched[matched.length - 1];
      }
      return null;
    };

    // Filter out the logged-in user so they don't chat with themselves and attach unread count
    const filteredContacts = allUsers
      .filter((c) => c.id !== currentUserId && c.id !== rawUserId)
      .map((c) => {
        const lastMsg = getLastMsg(c.id);
        return {
          ...c,
          unreadCount: getUnreadCount(c.id),
          lastMessageText: lastMsg ? lastMsg.text : '',
          lastMessageTime: lastMsg ? lastMsg.timestamp : '',
        };
      });

    return res.json({ success: true, data: filteredContacts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const rawContactId = req.query.contactId;
    const rawUserId = req.user ? (req.user.userId || req.user.id) : null;
    const currentUserId = normalizeId(rawUserId);
    const contactId = normalizeId(rawContactId);

    if (currentUserId) {
      activeUserPresence.set(currentUserId, Date.now());
    }

    // When the logged in user opens the chat with contactId, mark incoming messages from contactId as delivered AND read!
    if (contactId && currentUserId) {
      memMessages.forEach((m) => {
        const mSender = normalizeId(m.senderId);
        const mReceiver = normalizeId(m.receiverId);
        if (mSender === contactId && mReceiver === currentUserId) {
          m.delivered = true;
          m.read = true;
        }
      });

      if (getDBStatus()) {
        try {
          await Message.updateMany(
            {
              senderId: { $in: [contactId, rawContactId] },
              receiverId: { $in: [currentUserId, rawUserId] },
            },
            { $set: { delivered: true, read: true } }
          );
        } catch (e) {
          // ignore
        }
      }
    }

    if (getDBStatus()) {
      let query = {};
      if (contactId && currentUserId) {
        query = {
          $or: [
            { senderId: { $in: [currentUserId, rawUserId] }, receiverId: { $in: [contactId, rawContactId] } },
            { senderId: { $in: [contactId, rawContactId] }, receiverId: { $in: [currentUserId, rawUserId] } },
          ],
        };
      } else if (currentUserId) {
        query = {
          $or: [
            { senderId: { $in: [currentUserId, rawUserId] } },
            { receiverId: { $in: [currentUserId, rawUserId] } },
          ],
        };
      }
      const msgs = await Message.find(query).sort({ createdAt: 1 });
      if (msgs && msgs.length > 0) return res.json({ success: true, data: msgs });
    }

    let filtered = [...memMessages];
    if (contactId && currentUserId) {
      filtered = filtered.filter((m) => {
        const mSender = normalizeId(m.senderId);
        const mReceiver = normalizeId(m.receiverId);
        return (
          (mSender === currentUserId && mReceiver === contactId) ||
          (mSender === contactId && mReceiver === currentUserId)
        );
      });
    } else if (currentUserId) {
      filtered = filtered.filter((m) => {
        const mSender = normalizeId(m.senderId);
        const mReceiver = normalizeId(m.receiverId);
        return mSender === currentUserId || mReceiver === currentUserId;
      });
    }

    return res.json({ success: true, data: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, receiverName, receiverRole, text } = req.body;
    if (!receiverId || !text) {
      return res.status(400).json({ success: false, message: 'Receiver and message text are required' });
    }

    const rawUserId = req.user ? (req.user.userId || req.user.id) : 'USR002';
    const currentUserId = normalizeId(rawUserId);
    const currentUserName = req.user ? req.user.name : 'School Admin';
    const currentUserRole = req.user ? req.user.role : 'schooladmin';
    const normalizedReceiverId = normalizeId(receiverId);

    // Keep sender active
    activeUserPresence.set(currentUserId, Date.now());

    // Check if receiver is online right now
    const receiverOnline = isUserOnline(normalizedReceiverId);

    const msgId = 'MSG' + String(Date.now()).slice(-4);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Single tick if receiver offline (delivered: false, read: false)
    // Double grey tick if receiver is online (delivered: true, read: false)
    // Double blue tick only when receiver reads the conversation (read: true)
    const newMsg = {
      messageId: msgId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      receiverId: normalizedReceiverId,
      receiverName: receiverName || 'User',
      receiverRole: receiverRole || 'staff',
      schoolId: req.user ? req.user.schoolId : 'SCH001',
      text: text.trim(),
      timestamp: timeStr,
      delivered: receiverOnline,
      read: false,
    };

    if (getDBStatus()) {
      try {
        await Message.create(newMsg);
      } catch (dbErr) {
        console.warn('DB message save failed:', dbErr.message);
      }
    }
    memMessages.push(newMsg);

    return res.status(201).json({ success: true, data: newMsg });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getContacts, getMessages, sendMessage, heartbeat, activeUserPresence };
