// Staff Authentication Checker
// Ensures the user has an active session with role >= 3 (Staff, Admin, Developer)
(function() {
    // We check localStorage for simplicity. In a real app, we'd also verify the JWT on the backend.
    const authLevelStr = localStorage.getItem('dpAuthLevel');
    const token = localStorage.getItem('dpAuthToken');

    if (!token || !authLevelStr) {
        // Not logged in at all, redirect to dedicated staff login smoothly
        const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = '/staff/login.html?redirect=' + redirectUrl;
        return;
    }

    const level = parseInt(authLevelStr, 10);
    if (isNaN(level) || level < 3) {
        // Level too low (L1 User or L2 Member)
        alert('Unauthorized. Your account does not have Staff clearance (L3+).');
        window.location.href = '/';
        return;
    }

    // Authorization successful, continue loading page
    console.log('Staff Authorization Successful. Level:', level);
})();
