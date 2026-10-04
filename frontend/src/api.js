const BASE = import.meta.env.VITE_API_BASE || '';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function login(username, password) {
  const resp = await fetch(`${BASE}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken') || '',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
  return resp.json();
}

export async function register(payload) {
  const resp = await fetch(`${BASE}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken') || '',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return resp.json();
}

export async function logout() {
  const resp = await fetch(`${BASE}/logout/`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
  return resp.json();
}
