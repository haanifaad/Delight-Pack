/**
 * gemini_network_interceptor_react.js
 * 
 * Instructions: Import this file in your React app's entry point (e.g., App.js or index.js)
 * strictly for testing/staging environments to audit the Gemini assistant API endpoints.
 * 
 * It monkey-patches the global fetch API to randomly inject network failures and timeouts
 * when requests are made to the Gemini API, ensuring error boundaries and local caching states
 * handle the failures gracefully.
 */

const originalFetch = window.fetch;

window.fetch = async function (resource, config) {
  const url = typeof resource === 'string' ? resource : resource.url;
  
  // Target Gemini API endpoints
  if (url && url.includes('gemini') || url.includes('generativelanguage.googleapis.com')) {
    console.warn(`[Audit Interceptor] Intercepted Gemini API call to: ${url}`);
    
    // Simulate a 30% chance of network failure
    if (Math.random() < 0.3) {
      console.error('[Audit Interceptor] Injecting deliberate 503 Service Unavailable error.');
      return new Response(JSON.stringify({ error: "Service Unavailable injected by audit interceptor" }), {
        status: 503,
        statusText: "Service Unavailable",
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Simulate a 20% chance of timeout
    if (Math.random() < 0.2) {
      console.error('[Audit Interceptor] Injecting deliberate network timeout payload.');
      await new Promise(resolve => setTimeout(resolve, 15000)); // 15-second delay
      throw new TypeError("Failed to fetch (simulated network timeout)");
    }
    
    console.log('[Audit Interceptor] Allowing request to pass through normally.');
  }
  
  return originalFetch(resource, config);
};

console.log('Gemini Network Error Interceptor injected successfully for React Audit.');
