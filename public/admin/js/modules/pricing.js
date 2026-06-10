window.modules.pricing = {
  render: () => {
    return `
      <div>
        <h2 style="color: var(--accent); margin-top: 0;">Dynamic Pricing Matrices</h2>
        <table style="width: 100%; border-collapse: collapse; text-align: left; margin-top: 20px;">
          <thead>
            <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted);">
              <th style="padding: 12px 0;">Category</th>
              <th style="padding: 12px 0;">Base Cost</th>
              <th style="padding: 12px 0;">Margin Multiplier</th>
              <th style="padding: 12px 0;">Loss Leader</th>
              <th style="padding: 12px 0;">Actions</th>
            </tr>
          </thead>
          <tbody id="pricing-table-body">
            <tr><td colspan="5" style="padding: 15px 0;">Loading pricing logic...</td></tr>
          </tbody>
        </table>
      </div>
    `;
  },
  init: async () => {
    try {
      const data = await window.apiFetch('/api/admin/pricing');
      const tbody = document.getElementById('pricing-table-body');
      
      if (!data.pricing || data.pricing.length === 0) {
        tbody.innerHTML = \`<tr><td colspan="5" style="padding: 15px 0;">No pricing categories found in DB.</td></tr>\`;
        return;
      }
      
      tbody.innerHTML = data.pricing.map(p => \`
        <tr style="border-bottom: 1px solid var(--border-color);">
          <td style="padding: 15px 0; font-weight: bold;">\${p.category}</td>
          <td>AED \${p.baseCost.toFixed(2)}</td>
          <td>
            <input type="number" step="0.01" value="\${p.marginMultiplier}" style="width: 80px; padding: 4px; background: #1a1a1a; color: #fff; border: 1px solid var(--border-color);" id="multiplier-\${p.id}">
          </td>
          <td><span style="color: \${p.isLossLeader ? 'var(--danger)' : 'var(--text-muted)'};">\${p.isLossLeader ? 'YES' : 'NO'}</span></td>
          <td><button class="btn" style="padding: 6px 12px; background: var(--accent); color: #000;" onclick="window.modules.pricing.updateMultiplier('\${p.id}')">Update</button></td>
        </tr>
      \`).join('');
    } catch (error) {
      console.error("Failed to load pricing", error);
    }
  },
  updateMultiplier: async (id) => {
    try {
      const val = document.getElementById(\`multiplier-\${id}\`).value;
      await window.apiFetch('/api/admin/pricing/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, marginMultiplier: val })
      });
      alert('Pricing multiplier updated successfully!');
    } catch (e) {
      alert('Failed to update pricing multiplier.');
    }
  }
};
