// In-memory store for demo mode. Persists during the session only.
import {
  demoUsers,
  demoUnits,
  demoDues,
  demoPayments,
  demoMaintenanceRequests,
  demoAnnouncements,
} from './demoData';

const STORAGE_KEY = 'homelink-demo-state';
const SESSION_KEY = 'homelink-demo-session';

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    // ignore parse errors
  }
  return {
    users: demoUsers.map((u) => ({ ...u })),
    units: demoUnits.map((u) => ({ ...u })),
    dues: demoDues.map((d) => ({ ...d })),
    payments: demoPayments.map((p) => ({ ...p })),
    maintenance: demoMaintenanceRequests.map((m) => ({ ...m })),
    announcements: demoAnnouncements.map((a) => ({ ...a })),
  };
}

let state = loadInitialState();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // storage quota or disabled
  }
  listeners.forEach((cb) => cb());
}

export function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getState() {
  return state;
}

export function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  state = loadInitialState();
  persist();
}

export function genId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

// --- Auth ---
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(user) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

export function login(email, password) {
  const user = state.users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password');
  setSession(user);
  return user;
}

export function signup({ email, password, fullName, role }) {
  if (state.users.some((u) => u.email === email)) {
    throw new Error('This email is already in use');
  }
  const newUser = {
    id: genId('u'),
    email,
    password,
    fullName,
    role,
    unitId: null,
  };
  state.users.push(newUser);
  if (role === 'resident') {
    const freeUnit = state.units.find((u) => !u.residentId);
    if (freeUnit) {
      freeUnit.residentId = newUser.id;
      newUser.unitId = freeUnit.id;
    }
  }
  persist();
  setSession(newUser);
  return newUser;
}

export function logout() {
  setSession(null);
}

// --- Mutations ---
export function createDues({ amount, month }) {
  const newRecords = state.units.map((unit) => ({
    id: genId('dues'),
    unitId: unit.id,
    amount,
    month,
    createdAt: new Date().toISOString(),
  }));
  state.dues.push(...newRecords);
  state.units.forEach((u) => {
    u.currentBalance += amount;
  });
  persist();
  return newRecords;
}

export function notifyPayment({ unitId, residentId, amount, month, method = 'bank' }) {
  const newPayment = {
    id: genId('pay'),
    unitId,
    residentId,
    amount,
    paymentDate: new Date().toISOString().slice(0, 10),
    month,
    status: 'pending',
    method,
  };
  state.payments.push(newPayment);
  persist();
  return newPayment;
}

export function updatePaymentStatus(paymentId, status) {
  const payment = state.payments.find((p) => p.id === paymentId);
  if (!payment) throw new Error('Payment not found');
  const previousStatus = payment.status;
  payment.status = status;
  if (status === 'confirmed' && previousStatus !== 'confirmed') {
    const unit = state.units.find((u) => u.id === payment.unitId);
    if (unit) unit.currentBalance = Math.max(0, unit.currentBalance - payment.amount);
  }
  if (status !== 'confirmed' && previousStatus === 'confirmed') {
    const unit = state.units.find((u) => u.id === payment.unitId);
    if (unit) unit.currentBalance += payment.amount;
  }
  persist();
  return payment;
}

export function submitMaintenance({ unitId, residentId, description }) {
  const newReq = {
    id: genId('mr'),
    unitId,
    residentId,
    description,
    status: 'pending',
    createdAt: new Date().toISOString(),
    resolvedAt: null,
  };
  state.maintenance.push(newReq);
  persist();
  return newReq;
}

export function updateMaintenanceStatus(id, status) {
  const req = state.maintenance.find((m) => m.id === id);
  if (!req) throw new Error('Request not found');
  req.status = status;
  if (status === 'resolved') {
    req.resolvedAt = new Date().toISOString();
  } else {
    req.resolvedAt = null;
  }
  persist();
  return req;
}

export function deleteAnnouncement(id) {
  const idx = state.announcements.findIndex((a) => a.id === id);
  if (idx >= 0) {
    state.announcements.splice(idx, 1);
    persist();
  }
}

export function deleteDues(id) {
  const due = state.dues.find((d) => d.id === id);
  if (!due) return;
  const unit = state.units.find((u) => u.id === due.unitId);
  if (unit) unit.currentBalance = Math.max(0, unit.currentBalance - due.amount);
  state.dues = state.dues.filter((d) => d.id !== id);
  persist();
}

export function updateDues(id, { amount, month }) {
  const due = state.dues.find((d) => d.id === id);
  if (!due) return;
  const unit = state.units.find((u) => u.id === due.unitId);
  if (typeof amount === 'number' && amount !== due.amount) {
    const diff = amount - due.amount;
    if (unit) unit.currentBalance = Math.max(0, unit.currentBalance + diff);
    due.amount = amount;
  }
  if (typeof month === 'string' && month !== due.month) {
    due.month = month;
  }
  persist();
  return due;
}

export function deletePayment(id) {
  const payment = state.payments.find((p) => p.id === id);
  if (!payment) return;
  if (payment.status === 'confirmed') {
    const unit = state.units.find((u) => u.id === payment.unitId);
    if (unit) unit.currentBalance += payment.amount;
  }
  state.payments = state.payments.filter((p) => p.id !== id);
  persist();
}

export function postAnnouncement({ title, content, createdBy }) {
  const newAnn = {
    id: genId('ann'),
    title,
    content,
    createdAt: new Date().toISOString(),
    createdBy,
  };
  state.announcements.unshift(newAnn);
  persist();
  return newAnn;
}
