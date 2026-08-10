import { getApiUrl } from './apiConfig';

const AUTH_API = getApiUrl('/api/auth');
const TOKEN_KEY = 'greenbuild_auth_token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function removeStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAuthHeaders() {
  const token = getStoredToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function registerUser({ name, email, password }) {
  const res = await fetch(`${AUTH_API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Registration failed.');
  }

  if (json.token) {
    setStoredToken(json.token);
  }
  return json;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${AUTH_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Invalid credentials.');
  }

  if (json.token) {
    setStoredToken(json.token);
  }
  return json;
}

export async function getCurrentUser() {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await fetch(`${AUTH_API}/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      removeStoredToken();
      return null;
    }

    const json = await res.json();
    return json.user;
  } catch (err) {
    console.error('Error fetching current user session:', err);
    return null;
  }
}

export async function logoutUser() {
  try {
    await fetch(`${AUTH_API}/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  } catch (err) {
    // Ignore error
  } finally {
    removeStoredToken();
  }
}
