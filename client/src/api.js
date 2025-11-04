import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function signup(data) {
  const res = await axios.post(`${API_BASE}/auth/signup`, data);
  return res.data;
}

export async function login(data) {
  const res = await axios.post(`${API_BASE}/auth/login`, data);
  return res.data;
}

export async function fetchMyEvents() {
  const res = await axios.get(`${API_BASE}/events`, { headers: getAuthHeaders() });
  return res.data;
}

export async function createEvent(payload) {
  const res = await axios.post(`${API_BASE}/events`, payload, { headers: getAuthHeaders() });
  return res.data;
}

export async function updateEvent(id, payload) {
  const res = await axios.put(`${API_BASE}/events/${id}`, payload, { headers: getAuthHeaders() });
  return res.data;
}

export async function deleteEvent(id) {
  const res = await axios.delete(`${API_BASE}/events/${id}`, { headers: getAuthHeaders() });
  return res.data;
}

export async function getSwappableSlots() {
  const res = await axios.get(`${API_BASE}/swappable-slots`, { headers: getAuthHeaders() });
  return res.data;
}

export async function postSwapRequest(body) {
  const res = await axios.post(`${API_BASE}/swap-request`, body, { headers: getAuthHeaders() });
  return res.data;
}

export async function postSwapResponse(id, body) {
  const res = await axios.post(`${API_BASE}/swap-response/${id}`, body, { headers: getAuthHeaders() });
  return res.data;
}

export async function fetchMySwapRequests() {
  const res = await axios.get(`${API_BASE}/swap-requests/me`, { headers: getAuthHeaders() });
  return res.data;
}
