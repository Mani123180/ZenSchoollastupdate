import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ChatBox() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [searchContact, setSearchContact] = useState('');
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef(null);

  // Load contacts list
  const loadContacts = async () => {
    try {
      const res = await api.getContacts();
      if (res.success && res.data.length > 0) {
        setContacts(res.data);
        setActiveContact((prev) => {
          if (prev) {
            const found = res.data.find((c) => c.id === prev.id);
            return found || prev;
          }
          return res.data[0];
        });
      }
    } catch (err) {
      console.warn('Contacts load error:', err);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [user]);

  // Load and refresh messages for active contact
  const loadMessages = async (contactId) => {
    if (!contactId) return;
    try {
      const res = await api.getMessages(contactId);
      if (res.success) {
        setMessages(res.data);
      }
    } catch (err) {
      console.warn('Messages load error:', err);
    }
  };

  useEffect(() => {
    if (activeContact?.id) {
      loadMessages(activeContact.id);
    }
  }, [activeContact?.id]);

  // Periodic live polling to synchronize real-time messages & contacts across portals
  useEffect(() => {
    const contactInterval = setInterval(() => {
      loadContacts();
    }, 4000);
    return () => clearInterval(contactInterval);
  }, []);

  useEffect(() => {
    if (!activeContact?.id) return;
    const interval = setInterval(() => {
      loadMessages(activeContact.id);
    }, 1500);
    return () => clearInterval(interval);
  }, [activeContact?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact) return;

    const textToSend = inputText.trim();
    setInputText('');

    const currentUserId = user?.userId || user?.id || 'USR002';
    const currentUserName = user?.name || 'User';
    const currentUserRole = user?.role || 'schooladmin';

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const localMsg = {
      messageId: 'TEMP-' + Date.now(),
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      receiverId: activeContact.id,
      receiverName: activeContact.name,
      text: textToSend,
      timestamp: timeNow,
    };

    setMessages((prev) => [...prev, localMsg]);

    try {
      const res = await api.sendMessage({
        receiverId: activeContact.id,
        receiverName: activeContact.name,
        receiverRole: activeContact.role,
        text: textToSend,
      });

      if (res.success && res.data) {
        setMessages((prev) =>
          prev.map((m) => (m.messageId === localMsg.messageId ? res.data : m))
        );
      }
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    if (!searchContact.trim()) return true;
    const term = searchContact.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.role && c.role.toLowerCase().includes(term)) ||
      (c.schoolName && c.schoolName.toLowerCase().includes(term))
    );
  });

  return (
    <div className={`messaging-layout ${showMobileChat ? 'show-mobile-chat' : 'show-mobile-sidebar'}`}>
      {/* Contacts sidebar */}
      <div className="messaging-sidebar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
            Active Conversations
          </h4>
          <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
            {filteredContacts.length} Contacts
          </span>
        </div>

        {/* Search Contacts filter input */}
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search contacts by name, role..."
            value={searchContact}
            onChange={(e) => setSearchContact(e.target.value)}
            style={{ fontSize: '0.82rem', padding: '6px 12px', margin: 0, height: '34px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '420px' }}>
          {filteredContacts.length === 0 ? (
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center', padding: '16px 0' }}>
              No contacts found
            </div>
          ) : (
            filteredContacts.map((c) => {
              const hasUnread = c.unreadCount > 0 && activeContact?.id !== c.id;
              return (
                <button
                  key={c.id}
                  className={`contact-item-btn ${activeContact?.id === c.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveContact(c);
                    setShowMobileChat(true);
                  }}
                  style={{
                    backgroundColor: hasUnread ? '#f0fdf4' : undefined,
                    borderLeft: hasUnread ? '3px solid #16a34a' : undefined,
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={c.name}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: c.status === 'online' ? '#22c55e' : c.status === 'away' ? '#eab308' : '#94a3b8',
                        border: '2px solid #fff',
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'left', overflow: 'hidden', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.84rem', color: hasUnread ? '#15803d' : '#1e293b', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {c.name}
                      </strong>
                      {hasUnread && (
                        <span
                          style={{
                            backgroundColor: '#22c55e',
                            color: '#ffffff',
                            borderRadius: '12px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            minWidth: '18px',
                            textAlign: 'center',
                            boxShadow: '0 1px 4px rgba(34, 197, 94, 0.4)'
                          }}
                        >
                          {c.unreadCount} NEW
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {c.role ? c.role.toUpperCase() : 'USER'} {c.schoolName ? `• ${c.schoolName.slice(0, 16)}...` : ''}
                    </span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="mobile-chevron">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat pane */}
      <div className="messaging-chat-pane" style={{ display: 'flex', flexDirection: 'column', height: '520px' }}>
        {/* Chat header */}
        {activeContact && (
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc',
              borderRadius: '8px 8px 0 0',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm mobile-chat-back-btn"
                onClick={() => setShowMobileChat(false)}
                style={{ padding: '6px 10px', display: 'none', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                title="Back to Contacts list"
              >
                &larr; Contacts
              </button>
              <img
                src={activeContact.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={activeContact.name}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-primary)', display: 'block' }}>{activeContact.name}</strong>
                <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>{activeContact.role ? activeContact.role.toUpperCase() : 'USER'}</span>
                  <span>•</span>
                  {activeContact.status === 'online' ? (
                    <span style={{ color: '#16a34a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
                      Online
                    </span>
                  ) : (
                    <span style={{ color: '#94a3b8', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#94a3b8', display: 'inline-block' }}></span>
                      Offline
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm mobile-close-chat-btn"
              onClick={() => setShowMobileChat(false)}
              style={{ display: 'none', padding: '4px 10px', fontSize: '0.78rem' }}
            >
              List &larr;
            </button>
          </div>
        )}

        {/* Message feed */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {messages.map((m, idx) => {
            const rawMyId = user?.userId || user?.id || 'USR002';
            const normalize = (id) => {
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
            const currentMyId = normalize(rawMyId);
            const msgSender = normalize(m.senderId);
            const isMe = msgSender === currentMyId || m.senderId === rawMyId;
            return (
              <div key={idx} className={`chat-bubble ${isMe ? 'outgoing' : 'incoming'}`}>
                <div style={{ fontWeight: 600, fontSize: '0.74rem', marginBottom: '3px', opacity: 0.85 }}>
                  {isMe ? 'You' : m.senderName}
                </div>
                <div>{m.text}</div>
                <div className="chat-meta">
                  <span>{m.timestamp}</span>
                  {isMe && (
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>
                      {m.read ? (
                        <span style={{ color: '#38bdf8' }} title="Read">✓✓</span>
                      ) : m.delivered ? (
                        <span style={{ color: 'rgba(255, 255, 255, 0.75)' }} title="Delivered">✓✓</span>
                      ) : (
                        <span style={{ color: 'rgba(255, 255, 255, 0.65)' }} title="Sent">✓</span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <form
          onSubmit={handleSend}
          style={{
            padding: '12px 14px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '10px',
            backgroundColor: '#f8fafc',
            borderRadius: '0 0 8px 8px',
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder={`Type message to ${activeContact ? activeContact.name : 'contact'}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ margin: 0, padding: '10px 14px', fontSize: '0.9rem' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', whiteSpace: 'nowrap' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
