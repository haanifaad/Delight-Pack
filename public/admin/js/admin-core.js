// admin-core.js

// Global api helper
window.apiFetch = async (url, options = {}) => {
  options.credentials = 'include'; // Ensures HTTP-only cookies are sent
  const res = await fetch(`http://localhost:5000${url}`, options);
  if (res.status === 401 || res.status === 403) {
    window.location.href = 'http://localhost:3000/login'; // Redirect to main app login
    throw new Error('Unauthorized');
  }
  return res.json();
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1. Real DP-Auth Guard Validation against the Node.js Backend
    const authRes = await window.apiFetch('/api/auth/me');
    if (!authRes.user || authRes.user.role_level < 4) {
      window.location.href = 'http://localhost:3000/login';
      return;
    }
    
    // Auth successful
    document.getElementById('auth-guard-overlay').classList.remove('active');
    document.getElementById('main-layout').style.display = 'flex';
    
    // 2. Load initial module
    loadModule('dashboard');
  } catch (e) {
    console.error("Auth failed:", e);
  }

  // Navigation Logic
  const navItems = document.querySelectorAll('#nav-list li[data-module]');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      navItems.forEach(nav => nav.classList.remove('active'));
      e.target.classList.add('active');
      
      const moduleName = e.target.getAttribute('data-module');
      document.getElementById('page-title').innerText = e.target.innerText;
      loadModule(moduleName);
    });
  });

  document.getElementById('logout-btn').addEventListener('click', async () => {
    await window.apiFetch('/api/auth/logout', { method: 'POST' });
    alert("Emergency Logout triggered. Tokens invalidated.");
    window.location.href = 'http://localhost:3000/login';
  });
});

// Module Loader
window.modules = {};

function loadModule(name) {
  const container = document.getElementById('module-container');
  if (window.modules[name]) {
    container.innerHTML = window.modules[name].render();
    if (window.modules[name].init) {
      window.modules[name].init();
    }
  } else {
    container.innerHTML = `<p style="color:var(--text-muted)">Module '${name}' is under construction.</p>`;
  }
}
