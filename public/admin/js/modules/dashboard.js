// modules/dashboard.js
window.modules.dashboard = {
  render: () => {
    return `
      <div class="widget-grid" id="dashboard-widgets">
        <div class="widget"><h3>Daily Cash Flow</h3><p class="val" id="val-cash-flow">Loading...</p></div>
        <div class="widget"><h3>Live Machine Utilization</h3><p class="val" id="val-machine-util" style="color: var(--success)">Loading...</p></div>
        <div class="widget"><h3>Unresolved Complaints</h3><p class="val" id="val-complaints" style="color: var(--danger)">Loading...</p></div>
        <div class="widget"><h3>WIP Total Dollar Value</h3><p class="val" id="val-wip">Loading...</p></div>
      </div>
      <div style="margin-top: 40px; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 8px; height: 300px; display: flex; align-items:center; justify-content:center; color: var(--text-muted);">
        [Profitability Heatmap Visualization]
      </div>
    `;
  },
  init: async () => {
    try {
      const stats = await window.apiFetch('/api/admin/dashboard');
      document.getElementById('val-cash-flow').innerText = stats.cashFlow;
      document.getElementById('val-machine-util').innerText = stats.machineUtilization;
      document.getElementById('val-complaints').innerText = stats.unresolvedComplaints;
      document.getElementById('val-wip').innerText = stats.wipValue;
    } catch (e) {
      console.error("Failed to load dashboard stats", e);
    }
  }
};
