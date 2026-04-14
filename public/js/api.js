const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocal ? 'http://localhost:5000/api' : '/api';

async function fetchAPI(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('mednexis_token');
  const headers = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    let data;
    try {
      data = await response.json();
    } catch(err) {
      if(!response.ok) throw new Error('Server encountered an issue. (Status: ' + response.status + ')');
      throw new Error('Unexpected response from server');
    }
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (error) {
    throw error;
  }
}

function showAlert(message, isError = true) {
  // Check if toast-container exists
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'toast-error' : 'toast-success'}`;
  
  const icon = isError ? '⚠️' : '✅';
  toast.innerHTML = `<span style="font-size: 20px">${icon}</span> <span>${message}</span>`;
  
  container.appendChild(toast);

  // Auto-remove after 3.5 seconds
  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => toast.remove(), 400); // Wait for transition
  }, 3500);
}

function checkAuthAndRedirect() {
  const token = localStorage.getItem('mednexis_token');
  const role = localStorage.getItem('mednexis_role');
  
  const path = window.location.pathname;
  const isAuthPage = path.endsWith('login.html') || path.endsWith('register.html');
  
  if (!token && isAuthPage) {
    // Normal, let them login
  } else if (!token && !path.endsWith('index.html') && path !== '/' && path !== '') {
    // Guest accessing protected dash -> redirect to login
    window.location.href = 'login.html';
  } else if (token) {
    if (isAuthPage || path.endsWith('index.html') || path === '/' || path === '') {
      if (role === 'Admin') window.location.href = 'admin-dashboard.html';
      else if (role === 'Doctor') window.location.href = 'doctor-dashboard.html';
      else window.location.href = 'patient-dashboard.html';
    } else {
      if (role === 'Patient' && (path.includes('doctor') || path.includes('admin'))) {
        window.location.href = 'patient-dashboard.html';
      }
      if (role === 'Doctor' && (path.includes('patient-dashboard') || path.includes('admin'))) {
        window.location.href = 'doctor-dashboard.html';
      }
      if (role === 'Admin' && (!path.includes('admin'))) {
        window.location.href = 'admin-dashboard.html';
      }
    }
  }
}

function logout() {
  localStorage.removeItem('mednexis_token');
  localStorage.removeItem('mednexis_role');
  localStorage.removeItem('mednexis_name');
  window.location.href = 'index.html';
}
