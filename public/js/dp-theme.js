(function () {
  const BLUE_SENS = 520;
  const RED_SENS = 440;

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme-mode', theme);
    updateSwitcherUI(theme);
  }

  function updateSwitcherUI(theme) {
    document.querySelectorAll('#dp-theme-switcher [data-theme-btn]').forEach((btn) => {
      const isActive = btn.getAttribute('data-theme-btn') === theme;
      btn.classList.toggle('active', isActive);
    });
    if (window.lucide) window.lucide.createIcons();
  }

  function injectThemeSwitcher() {
    if (document.getElementById('dp-theme-switcher')) return;

    const wrap = document.createElement('div');
    wrap.id = 'dp-theme-switcher';
    wrap.innerHTML = `
      <div class="dp-switcher-inner">
        <button type="button" data-theme-btn="dp" onclick="window.dpSetTheme('dp')">
          <span class="dp-dot"></span> DP Mode
        </button>
        <button type="button" data-theme-btn="light" onclick="window.dpSetTheme('light')">
          ☀ Light
        </button>
        <button type="button" data-theme-btn="dark" onclick="window.dpSetTheme('dark')">
          ☾ Dark
        </button>
      </div>`;
    document.body.appendChild(wrap);
  }

  function initDpPointer() {
    document.addEventListener('mousemove', (e) => {
      if (document.documentElement.getAttribute('data-theme') !== 'dp') return;
      const blue = document.getElementById('dp-orb-blue');
      const red = document.getElementById('dp-orb-red');
      if (!blue || !red) return;

      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      blue.style.transform = `translate(${x * BLUE_SENS}px, ${y * BLUE_SENS}px)`;
      red.style.transform = `translate(${x * RED_SENS}px, ${y * RED_SENS}px)`;
    });
  }

  function ensureAura() {
    if (document.getElementById('dp-aura')) return;
    const aura = document.createElement('div');
    aura.id = 'dp-aura';
    aura.innerHTML =
      '<div id="dp-orb-blue"></div><div id="dp-orb-red"></div>';
    document.body.prepend(aura);
  }

  window.dpSetTheme = setTheme;

  const saved = localStorage.getItem('theme-mode') || 'dp';
  document.documentElement.setAttribute('data-theme', saved);

  function boot() {
    ensureAura();
    injectThemeSwitcher();
    initDpPointer();
    updateSwitcherUI(saved);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
