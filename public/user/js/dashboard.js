// C:\Projects\dp\public\user\js\dashboard.js

document.addEventListener('DOMContentLoaded', () => {
  // --- Pizza Tracker Logic ---
  const stages = document.querySelectorAll('.stage');
  const progressBar = document.querySelector('.stages-progress');
  let currentStageIndex = 0; // Starts at Pre-Press (0)

  function updateTracker() {
    // Determine progress bar width
    const totalStages = stages.length;
    const progressPercentage = (currentStageIndex / (totalStages - 1)) * 100;
    
    if (progressBar) {
      progressBar.style.width = `${progressPercentage}%`;
    }

    stages.forEach((stage, idx) => {
      // Clear classes
      stage.classList.remove('completed', 'active');
      
      const circle = stage.querySelector('.stage-circle');
      if (idx < currentStageIndex) {
        stage.classList.add('completed');
        if (circle) circle.textContent = '✓';
      } else if (idx === currentStageIndex) {
        stage.classList.add('active');
        if (circle) circle.textContent = idx + 1;
      } else {
        if (circle) circle.textContent = idx + 1;
      }
    });
  }

  // Auto-advance tracker every 10 seconds for demo
  setInterval(() => {
    currentStageIndex++;
    if (currentStageIndex >= stages.length) {
      currentStageIndex = 0;
    }
    updateTracker();
  }, 10000);

  // Initialize tracker
  updateTracker();

  // --- Smart Quoting Calculator Logic ---
  const lengthInput = document.getElementById('calc-length');
  const widthInput = document.getElementById('calc-width');
  const heightInput = document.getElementById('calc-height');
  const materialSelect = document.getElementById('calc-material');
  const quantityInput = document.getElementById('calc-qty');
  const resultValue = document.getElementById('calc-result-value');

  const MATERIAL_RATES = {
    kraft: 0.12,
    glossy: 0.25,
    matte: 0.28,
  };

  function calculateQuote() {
    if (!lengthInput || !widthInput || !heightInput || !materialSelect || !quantityInput || !resultValue) return;

    const l = parseFloat(lengthInput.value) || 0;
    const w = parseFloat(widthInput.value) || 0;
    const h = parseFloat(heightInput.value) || 0;
    const qty = parseFloat(quantityInput.value) || 0;
    const material = materialSelect.value;

    // Surface Area in square meters: 2(lw + lh + wh) / 1,000,000
    const areaSqM = (2 * ((l * w) + (l * h) + (w * h))) / 1000000;
    
    let basePrice = areaSqM * MATERIAL_RATES[material] * qty;
    
    // Volume discounts
    let discount = 1;
    if (qty >= 5000) discount = 0.9;  // 10% off
    if (qty >= 10000) discount = 0.8; // 20% off

    const total = (basePrice * discount).toFixed(2);
    resultValue.textContent = `AED ${total}`;
  }

  // Attach event listeners for real-time calculation
  const inputs = [lengthInput, widthInput, heightInput, materialSelect, quantityInput];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('input', calculateQuote);
      input.addEventListener('change', calculateQuote);
    }
  });

  // Initial calculation
  calculateQuote();
});
