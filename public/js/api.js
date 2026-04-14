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
  const alertEl = document.getElementById('alert');
  if (alertEl) {
    alertEl.textContent = message;
    alertEl.className = isError ? 'alert-error' : 'alert-success';
    alertEl.style.display = 'block';
    setTimeout(() => { alertEl.style.display = 'none'; }, 3000);
  } else {
    alert(message);
  }
}

function checkAuthAndRedirect() {
  const token = localStorage.getItem('mednexis_token');
  const role = localStorage.getItem('mednexis_role');
  
  const path = window.location.pathname;
  const isAuthPage = path.endsWith('index.html') || path.endsWith('register.html') || path === '/' || path === '';
  
  if (!token && !isAuthPage) {
    window.location.href = 'index.html';
  } else if (token) {
    if (isAuthPage) {
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
