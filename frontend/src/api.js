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

export async function fetchDealers(state = '') {
  try {
    const url = state ? `${BASE}/dealers/?state=${encodeURIComponent(state)}` : `${BASE}/dealers/`;
    const resp = await fetch(url, {
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (resp.ok) {
      const contentType = resp.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return resp.json();
      }
    }
    // Direct API fallback if Django returns HTML
    const directUrl = state ? `http://localhost:3030/fetchDealers/${encodeURIComponent(state)}` : `http://localhost:3030/fetchDealers`;
    const directResp = await fetch(directUrl);
    return directResp.json();
  } catch (err) {
    console.error('Error fetching dealers:', err);
    return [];
  }
}

export async function fetchDealer(id) {
  try {
    const resp = await fetch(`http://localhost:3030/fetchDealer/${id}`);
    return resp.json();
  } catch (err) {
    console.error(`Error fetching dealer ${id}:`, err);
    return null;
  }
}

export async function fetchReviews(dealerId) {
  try {
    const resp = await fetch(`http://localhost:3030/fetchReviews/dealer/${dealerId}`);
    return resp.json();
  } catch (err) {
    console.error(`Error fetching reviews for dealer ${dealerId}:`, err);
    return [];
  }
}

export async function submitReview(dealerId, reviewData) {
  const resp = await fetch(`${BASE}/dealers/${dealerId}/review/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken') || '',
    },
    credentials: 'include',
    body: JSON.stringify(reviewData),
  });
  return resp.json();
}
