const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function fetchItems(canteen?: string) {
  let url = API_URL + '/api/items';
  if (canteen) {
    url += '?canteen=' + canteen;
  }
  console.log('[DEBUG] Fetching items from:', url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to fetch items');
    }
    return response.json();
  } catch (err) {
    console.error('[DEBUG] FetchItems Error:', err);
    throw err;
  }
}

export async function fetchRecentUpdates() {
  const url = API_URL + '/api/items/recent-updates';
  console.log('[DEBUG] Fetching updates from:', url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to fetch recent updates');
    }
    return response.json();
  } catch (err) {
    console.error('[DEBUG] FetchRecentUpdates Error:', err);
    throw err;
  }
}

export async function submitUpdate(itemId: string, status: string, readyInMinutes?: number, token?: string) {
  const url = API_URL + '/api/items/update';
  console.log('[DEBUG] Submitting update to:', url, { itemId, status, readyInMinutes });
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        item_id: itemId,
        reported_status: status,
        ready_in_minutes: readyInMinutes
      })
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message = error.detail || 'Failed to submit update';
      
      // Check for expired token message specifically
      if (message.includes('expired') || response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login?error=session_expired';
      }
      
      throw new Error(message);
    }
    return response.json();
  } catch (err) {
    console.error('[DEBUG] SubmitUpdate Error:', err);
    throw err;
  }
}
