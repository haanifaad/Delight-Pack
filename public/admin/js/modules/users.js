// modules/users.js
window.modules.users = {
  render: () => {
    return `
      <div>
        <div style="display:flex; justify-content:space-between; margin-bottom: 20px;">
          <input type="text" placeholder="Search by email..." style="padding: 10px; width: 300px; background: var(--bg-dark); border: 1px solid var(--border-color); color: #fff;">
          <button class="btn" style="background: var(--accent);" onclick="window.modules.users.inviteUser()">+ Invite New User</button>
        </div>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted);">
              <th style="padding: 12px 0;">Email</th>
              <th style="padding: 12px 0;">Role Level</th>
              <th style="padding: 12px 0;">Actions</th>
            </tr>
          </thead>
          <tbody id="users-table-body">
            <tr><td colspan="3" style="padding: 15px 0;">Loading users from database...</td></tr>
          </tbody>
        </table>
      </div>
    `;
  },
  init: async () => {
    try {
      const data = await window.apiFetch('/api/admin/users');
      const tbody = document.getElementById('users-table-body');
      
      if (!data.users || data.users.length === 0) {
        tbody.innerHTML = \`<tr><td colspan="3" style="padding: 15px 0;">No users found in database.</td></tr>\`;
        return;
      }
      
      tbody.innerHTML = data.users.map(u => \`
        <tr style="border-bottom: 1px solid var(--border-color);">
          <td style="padding: 15px 0;">\${u.email}</td>
          <td><span class="badge" style="background: \${u.role_level >= 4 ? 'var(--accent)' : '#555'}; color: \${u.role_level >= 4 ? '#000' : '#fff'};">L\${u.role_level}</span></td>
          <td><button class="btn" style="padding: 6px 12px; background: #333; color: #fff;">Manage</button></td>
        </tr>
      \`).join('');
    } catch (e) {
      console.error("Failed to load users", e);
    }
  },
  inviteUser: async () => {
    try {
      const res = await window.apiFetch('/api/admin/users/invite', { method: 'POST' });
      alert(res.message);
    } catch(e) {
      alert('Failed to invite user');
    }
  }
};
