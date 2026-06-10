window.modules.finance = {
  render: () => {
    return `
      <div>
        <div style="display:flex; justify-content:space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="color: var(--accent); margin: 0;">Financial Ledger (Tally Sync)</h2>
          <button class="btn" style="background: var(--success); color: #fff;" onclick="alert('Generating Tally Prime XML Export...')">Export to Tally Prime</button>
        </div>
        <table style="width: 100%; border-collapse: collapse; text-align: left; background: var(--bg-panel); border-radius: 8px; overflow: hidden;">
          <thead style="background: #111;">
            <tr style="color: var(--text-muted);">
              <th style="padding: 12px 20px;">Date</th>
              <th style="padding: 12px 20px;">Description</th>
              <th style="padding: 12px 20px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody id="finance-table-body">
            <tr><td colspan="3" style="padding: 15px 20px;">Loading ledger...</td></tr>
          </tbody>
        </table>
      </div>
    `;
  },
  init: async () => {
    try {
      const data = await window.apiFetch('/api/admin/finance/ledger');
      const tbody = document.getElementById('finance-table-body');
      
      if (!data.ledger || data.ledger.length === 0) {
        tbody.innerHTML = \`<tr><td colspan="3" style="padding: 15px 20px;">Ledger is empty.</td></tr>\`;
        return;
      }
      
      tbody.innerHTML = data.ledger.map(tx => \`
        <tr style="border-bottom: 1px solid var(--border-color);">
          <td style="padding: 15px 20px; color: var(--text-muted);">\${new Date(tx.timestamp).toLocaleString()}</td>
          <td style="padding: 15px 20px;">\${tx.description}</td>
          <td style="padding: 15px 20px; text-align: right; color: \${tx.transactionType === 'INCOME' ? 'var(--success)' : 'var(--danger)'}; font-weight: bold;">
            \${tx.transactionType === 'INCOME' ? '+' : '-'} AED \${tx.amount.toLocaleString()}
          </td>
        </tr>
      \`).join('');
    } catch (error) {
      console.error("Failed to load ledger", error);
    }
  }
};
