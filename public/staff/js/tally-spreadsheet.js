// Tally-Inspired Spreadsheet Core Engine
// Handles 100% Keyboard-first navigation and inline math calculation

class TallySpreadsheet {
  constructor(tableId) {
    this.table = document.getElementById(tableId);
    if (!this.table) return;
    
    this.inputs = Array.from(this.table.querySelectorAll('input.tally-cell'));
    this.currentRow = 0;
    this.currentCol = 0;
    this.grid = this.buildGrid();
    
    this.init();
  }

  buildGrid() {
    // Organizes inputs into a 2D array [row][col] based on their DOM position
    const rows = Array.from(this.table.querySelectorAll('tbody tr'));
    return rows.map(row => Array.from(row.querySelectorAll('input.tally-cell')));
  }

  init() {
    if (this.grid.length > 0 && this.grid[0].length > 0) {
      this.focusCell(0, 0);
    }

    // Attach event listeners to all cells
    this.inputs.forEach((input) => {
      // Store original value on focus for Esc cancellation
      input.addEventListener('focus', (e) => {
        e.target.dataset.originalValue = e.target.value;
        e.target.select(); // Auto-select text for fast overwriting like Tally
      });

      // Handle blur for inline calculations
      input.addEventListener('blur', (e) => {
        this.evaluateMath(e.target);
        this.updateTotals();
      });
    });

    // Global keyboard listener to intercept browser defaults and handle grid movement
    document.addEventListener('keydown', (e) => this.handleKeydown(e), { capture: true });
  }

  focusCell(row, col) {
    // Boundary checks
    if (row < 0) row = 0;
    if (row >= this.grid.length) row = this.grid.length - 1;
    if (col < 0) col = 0;
    if (col >= this.grid[row].length) col = this.grid[row].length - 1;

    this.currentRow = row;
    this.currentCol = col;
    
    const cell = this.grid[row][col];
    if (cell) {
      cell.focus();
    }
  }

  handleKeydown(e) {
    // Only process if we are focused inside a tally cell or if it's a global intercept
    const activeElement = document.activeElement;
    const isTallyCell = activeElement && activeElement.classList.contains('tally-cell');

    // 1. Global Intercepts (Prevent browser reload / print for safety during data entry)
    if ((e.ctrlKey && e.key.toLowerCase() === 'p') || e.key === 'F5' || (e.altKey && e.key.toLowerCase() === 's')) {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.altKey && e.key.toLowerCase() === 's') {
          console.log('Tally Command: Saving Voucher and Syncing to Google Sheets...');
          this.syncToBackend();
          return;
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'p') {
         alert('Tally Command: Printing Voucher...');
      }
      return;
    }

    if (!isTallyCell) return;

    // 2. Navigation
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        this.focusCell(this.currentRow - 1, this.currentCol);
        break;
        
      case 'ArrowDown':
      case 'Enter':
        e.preventDefault(); // Prevent form submission
        // Evaluate math on Enter immediately before moving
        this.evaluateMath(activeElement);
        this.updateTotals();
        this.focusCell(this.currentRow + 1, this.currentCol);
        break;
        
      case 'ArrowLeft':
        // Only jump cells if cursor is at the beginning of the text to allow normal text editing
        if (activeElement.selectionStart === 0 && activeElement.selectionEnd === 0) {
          e.preventDefault();
          this.focusCell(this.currentRow, this.currentCol - 1);
        }
        break;
        
      case 'ArrowRight':
        // Only jump cells if cursor is at the end of the text
        if (activeElement.selectionStart === activeElement.value.length) {
          e.preventDefault();
          this.focusCell(this.currentRow, this.currentCol + 1);
        }
        break;
        
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          if (this.currentCol === 0 && this.currentRow > 0) {
            this.focusCell(this.currentRow - 1, this.grid[0].length - 1);
          } else {
            this.focusCell(this.currentRow, this.currentCol - 1);
          }
        } else {
          if (this.currentCol === this.grid[this.currentRow].length - 1 && this.currentRow < this.grid.length - 1) {
            this.focusCell(this.currentRow + 1, 0);
          } else {
            this.focusCell(this.currentRow, this.currentCol + 1);
          }
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        // Revert to original value
        activeElement.value = activeElement.dataset.originalValue || '';
        break;
    }
  }

  evaluateMath(input) {
    // Only calculate if the input contains math operators and looks like a formula
    // E.g., "500 * 1.05"
    const val = input.value.trim();
    if (/^[\d\s\+\-\*\/\.\(\)]+$/.test(val) && /[\+\-\*\/]/.test(val)) {
      try {
        // Safe evaluation of simple math
        const result = new Function('return ' + val)();
        if (!isNaN(result)) {
          // Format to 2 decimal places if it's a float, otherwise integer
          input.value = Number.isInteger(result) ? result : result.toFixed(2);
        }
      } catch (err) {
        console.warn('Invalid math expression in cell:', val);
      }
    }
  }

  updateTotals() {
    let totalQty = 0;
    let totalAmount = 0;

    this.grid.forEach(row => {
      const qtyInput = row.find(cell => cell.dataset.col === 'qty');
      const amountInput = row.find(cell => cell.dataset.col === 'amount');
      
      if (qtyInput && qtyInput.value) {
        totalQty += parseFloat(qtyInput.value) || 0;
      }
      if (amountInput && amountInput.value) {
        totalAmount += parseFloat(amountInput.value) || 0;
      }
    });

    const qtyTotalEl = document.getElementById('total-qty');
    const amountTotalEl = document.getElementById('total-amount');
    
    if (qtyTotalEl) qtyTotalEl.textContent = totalQty;
    if (amountTotalEl) amountTotalEl.textContent = totalAmount.toFixed(2) + ' AED';
  }

  async syncToBackend() {
    // Collect the data from the grid
    const items = [];
    this.grid.forEach(row => {
      const name = row.find(cell => cell.dataset.col === 'name')?.value;
      if (!name) return; // Skip empty rows
      
      items.push({
        name: name,
        location: row.find(cell => cell.dataset.col === 'location')?.value || '',
        qty: row.find(cell => cell.dataset.col === 'qty')?.value || '0',
        rate: row.find(cell => cell.dataset.col === 'rate')?.value || '0',
        amount: row.find(cell => cell.dataset.col === 'amount')?.value || '0'
      });
    });

    if (items.length === 0) {
      alert("Cannot sync an empty voucher.");
      return;
    }

    const payload = {
      voucherData: {
        date: new Date().toISOString(),
        items: items
      }
    };

    try {
      const token = localStorage.getItem('dpAuthToken');
      // Hardcoded to port 3000 where our backend likely runs, adjust if needed
      const response = await fetch('http://localhost:3000/api/auth/protected/sync-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error("Sync failed");
      }
      
      alert("Successfully Synced to Google Sheets!");
    } catch (err) {
      alert("Error syncing to Google Sheets: " + err.message);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new TallySpreadsheet('tally-grid');
});
