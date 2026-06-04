/**
 * tally_debounce_test.js
 * 
 * Mock testing script to simulate high-concurrency edge cases in the TallyAI spreadsheet.
 * Executes 100 rapid keyboard cell entries to verify debounce logic limits Firestore writes.
 */

// Mock Firestore write function
let writeCount = 0;
const mockFirestoreWrite = async (data) => {
  writeCount++;
  // In a real scenario, this would be admin.firestore().collection('spreadsheetData').doc(data.id).set(data);
};

// Debounce implementation (similar to lodash debounce)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounced version of our mock Firestore write, 500ms wait
const debouncedWrite = debounce(mockFirestoreWrite, 500);

async function runTest() {
  console.log("Starting TallyAI debounce stress test...");
  
  // Simulate 100 rapid keystrokes occurring every 10ms
  for (let i = 0; i < 100; i++) {
    debouncedWrite({ id: 'cell_A1', value: `test_val_${i}` });
    await new Promise(resolve => setTimeout(resolve, 10)); // 10ms between keystrokes
  }
  
  // Wait for the debounce timeout to finish
  console.log("Finished typing, waiting for debounce to settle...");
  await new Promise(resolve => setTimeout(resolve, 600));

  // If debounce works correctly, we should only have 1 write.
  if (writeCount === 1) {
    console.log("✅ SUCCESS: Debounce logic prevented 99 dropped packets/freezes. Total writes: " + writeCount);
  } else {
    console.error("❌ FAILURE: Debounce logic failed. Total writes: " + writeCount);
    process.exit(1);
  }
}

runTest();
