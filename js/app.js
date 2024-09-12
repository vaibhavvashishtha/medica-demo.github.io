// Base URL for JSON bin hosting
const BASE_URL = 'https://api.jsonbin.io/v3/b/';

// Headers with the Master Key for authentication
const headers = {
    'X-Master-Key': '$2a$10$2AbKx7fc0Ror1AVItfO7Ru8sMufS/SIbH/U6qQHL.OsHPhU7/zWbK',
    'Content-Type': 'application/json'
};

// Login function that checks credentials using the hosted JSON
function login(userID, password) {
    const loginURL = `${BASE_URL}66e32170acd3cb34a8826c15`; // Example bin ID for login data

    fetch(loginURL, { headers })
        .then(response => response.json())
        .then(data => {
            const loginData = data.record; // Access the 'record' key in the JSON response
            if (userID === loginData.username && password === loginData.password) {
                sessionStorage.setItem('token', loginData.token);
                window.location.href = 'dashboard.html';  // Redirect to dashboard on successful login
            } else {
                alert('Invalid credentials, please try again.');
            }
        })
        .catch(error => console.error('Error fetching login.json:', error));
}

// Fetch data for the dashboard dynamically
function fetchDashboardData() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';  // Redirect if not logged in
        return;
    }

    const dashboardURL = `${BASE_URL}66e321c1acd3cb34a8826c3c`; // Example bin ID for dashboard data

    fetch(dashboardURL, { headers })
        .then(response => response.json())
        .then(data => {
            const dashboardData = data.record;
            document.getElementById('welcomeMessage').innerText = `Welcome, ${dashboardData.firstName}`;
            document.getElementById('coverageSummary').innerHTML = `
                <h2>Coverage Summary</h2>
                <p>Plan: ${dashboardData.planName}</p>
                <p>Status: ${dashboardData.status}</p>
                <p>Effective Date: ${dashboardData.effectiveDate}</p>
            `;
            let claimsHtml = '<h2>Recent Claims</h2><ul>';
            dashboardData.recentClaims.forEach(claim => {
                claimsHtml += `<li>${claim.provider}: $${claim.amountPaid}</li>`;
            });
            claimsHtml += '</ul>';
            document.getElementById('recentClaims').innerHTML = claimsHtml;
        })
        .catch(error => console.error('Error fetching dashboard data:', error));
}

// Fetch claims data dynamically
function fetchClaimsData() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';  // Redirect if not logged in
        return;
    }

    const claimsURL = `${BASE_URL}66e321a8acd3cb34a8826c35`; // Example bin ID for claims data

    fetch(claimsURL, { headers })
        .then(response => response.json())
        .then(data => {
            const claimsData = data.record;
            let claimsHtml = '<h2>Claims Summary</h2><table><tr><th>Provider</th><th>Date</th><th>Total</th><th>Status</th></tr>';
            claimsData.claims.forEach(claim => {
                claimsHtml += `
                    <tr>
                        <td>${claim.providerName}</td>
                        <td>${claim.visitDate}</td>
                        <td>${claim.amountBilled}</td>
                        <td>${claim.paymentStatus}</td>
                    </tr>
                `;
            });
            claimsHtml += '</table>';
            document.getElementById('claimsSummary').innerHTML = claimsHtml;
        })
        .catch(error => console.error('Error fetching claims data:', error));
}

// Fetch spending data dynamically
function fetchSpendingData() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';  // Redirect if not logged in
        return;
    }

    const spendingURL = `${BASE_URL}66e321d1ad19ca34f8a3f405`; // Example bin ID for spending data

    fetch(spendingURL, { headers })
        .then(response => response.json())
        .then(data => {
            const spendingData = data.record;
            document.getElementById('spendingSummary').innerHTML = `
                <h2>Spending Summary</h2>
                <p>Deductible Spent: $${spendingData.deductibleSpent} / ${spendingData.deductibleLimit}</p>
                <p>Out-of-Pocket Spent: $${spendingData.outOfPocketSpent} / ${spendingData.outOfPocketLimit}</p>
            `;
        })
        .catch(error => console.error('Error fetching spending data:', error));
}

// Fetch coverage and benefits data dynamically
function fetchCoverageData() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';  // Redirect if not logged in
        return;
    }

    const coverageURL = `${BASE_URL}66e321b5ad19ca34f8a3f3fd`; // Example bin ID for coverage data

    fetch(coverageURL, { headers })
        .then(response => response.json())
        .then(data => {
            const coverageData = data.record;
            document.getElementById('coverageDetails').innerHTML = `
                <h2>Coverage & Benefits</h2>
                <p>Plan Type: ${coverageData.planType}</p>
                <p>Effective Date: ${coverageData.effectiveDate}</p>
                <p>End Date: ${coverageData.endDate}</p>
                <p>ID Number: ${coverageData.idNumber}</p>
            `;
        })
        .catch(error => console.error('Error fetching coverage data:', error));
}
