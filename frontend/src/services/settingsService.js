const API_BASE = '/api';


export async function getSystemSettings() {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (err) {
    console.warn('Backend settings fetch failed, falling back to local sync:', err);
  }
  return null;
}


export async function updateSystemSettingsSection(section, payload) {
  try {
    const res = await fetch(`${API_BASE}/settings/${section}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const json = await res.json();
      return json;
    }
  } catch (err) {
    console.warn(`Settings update API failed for ${section}:`, err);
  }
  return { success: false, message: 'API connection offline' };
}


export async function triggerSystemBackup() {
  try {
    const res = await fetch(`${API_BASE}/settings/backup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      const json = await res.json();
      return json;
    }
  } catch (err) {
    console.warn('Backup trigger API failed:', err);
  }
  return { success: false, message: 'API connection offline' };
}
