// Base URL for JSON bin hosting
const BASE_URL = 'https://api.jsonbin.io/v3/b/';

// Headers with the Master Key for authentication
const headers = {
    'X-Master-Key': '$2a$10$2AbKx7fc0Ror1AVItfO7Ru8sMufS/SIbH/U6qQHL.OsHPhU7/zWbK',
    'Content-Type': 'application/json'
};

// Function to load configuration (config.json)
async function loadConfig() {
    const loginURL = `${BASE_URL}66e331a2e41b4d34e42e3a07`; // Use bin ID from config

    try {
        const response = await fetch(loginURL, { headers });
        const data = await response.json();
        config = data.record;
    } catch (error) {
        return console.error('Error loading config.json:', error);
    }
}

// Login function that checks credentials using the hosted JSON
function login(userID, password) {
    loadConfig().then(() => {
        const loginURL = `${BASE_URL}${config.login}`; // Use bin ID from config

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
    });
}

// Logout function to clear the session and redirect to login page
function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';  // Redirect to login page after logout
}

// Fetch data for the dashboard dynamically
function fetchDashboardData() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';  // Redirect if not logged in
        return;
    }

    loadConfig().then(() => {
        const dashboardURL = `${BASE_URL}${config.dashboard}`; // Use bin ID from config

        fetch(dashboardURL, { headers })
            .then(response => response.json())
            .then(data => {
                const dashboardData = data.record;

                // Inject Coverage Summary Table Data
                let coverageHtml = `
                    <tr>
                        <td class="px-4 py-2">${dashboardData.planName}</td>
                        <td class="px-4 py-2">${dashboardData.effectiveDate}</td>
                        <td class="px-4 py-2">${dashboardData.status}</td>
                    </tr>
                `;
                document.getElementById('coverageSummaryData').innerHTML = coverageHtml;

                // Inject Recent Claims Table Data
                let claimsHtml = '';
                dashboardData.recentClaims.forEach(claim => {
                    claimsHtml += `
                        <tr>
                            <td class="px-4 py-2">${claim.provider}</td>
                            <td class="px-4 py-2">$${claim.amountPaid}</td>
                        </tr>
                    `;
                });
                document.getElementById('recentClaimsData').innerHTML = claimsHtml;

                // Initialize the hamburger menu 
                initializeHamburgerMenu();
            })
            .catch(error => console.error('Error fetching dashboard data:', error));
    });
}

// Fetch claims data dynamically and inject into the table
function fetchClaimsData() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';  // Redirect if not logged in
        return;
    }

    loadConfig().then(() => {
        const claimsURL = `${BASE_URL}${config.claims}`; // Use bin ID from config

        fetch(claimsURL, { headers })
            .then(response => response.json())
            .then(data => {
                const claimsData = data.record;
                let claimsHtml = '';
                claimsData.claims.forEach(claim => {
                    claimsHtml += `
                        <tr>
                            <td class="px-4 py-2">${claim.providerName}</td>
                            <td class="px-4 py-2">${claim.visitDate}</td>
                            <td class="px-4 py-2">$${claim.amountBilled}</td>
                            <td class="px-4 py-2">${claim.paymentStatus}</td>
                        </tr>
                    `;
                });
                document.getElementById('claimsData').innerHTML = claimsHtml;

                // Initialize the hamburger menu 
                initializeHamburgerMenu();
            })
            .catch(error => console.error('Error fetching claims data:', error));
    });
}

// Fetch spending data dynamically and inject into the cards
function fetchSpendingData() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';  // Redirect if not logged in
        return;
    }

    loadConfig().then(() => {
        const spendingURL = `${BASE_URL}${config.spending}`; // Use bin ID from config

        fetch(spendingURL, { headers })
            .then(response => response.json())
            .then(data => {
                const spendingData = data.record;

                // Deductible
                const deductibleSpent = spendingData.deductibleSpent;
                const deductibleLimit = spendingData.deductibleLimit;
                const deductiblePercentage = (deductibleSpent / deductibleLimit) * 100;

                document.getElementById('deductibleSpent').innerText = `$${deductibleSpent}`;
                document.getElementById('deductibleLimit').innerText = `$${deductibleLimit}`;
                document.getElementById('deductibleProgress').style.width = `${deductiblePercentage}%`;

                // Out-of-Pocket
                const outOfPocketSpent = spendingData.outOfPocketSpent;
                const outOfPocketLimit = spendingData.outOfPocketLimit;
                const outOfPocketPercentage = (outOfPocketSpent / outOfPocketLimit) * 100;

                document.getElementById('outOfPocketSpent').innerText = `$${outOfPocketSpent}`;
                document.getElementById('outOfPocketLimit').innerText = `$${outOfPocketLimit}`;
                document.getElementById('outOfPocketProgress').style.width = `${outOfPocketPercentage}%`;

                // Initialize the hamburger menu 
                initializeHamburgerMenu();
            })
            .catch(error => console.error('Error fetching spending data:', error));
    });
}

// Fetch coverage and benefits data dynamically and inject into the table
function fetchCoverageData() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';  // Redirect if not logged in
        return;
    }

    loadConfig().then(() => {
        const coverageURL = `${BASE_URL}${config.coverage}`; // Use bin ID from config

        fetch(coverageURL, { headers })
            .then(response => response.json())
            .then(data => {
                const coverageData = data.record;
                let coverageHtml = `
                    <tr>
                        <td class="px-4 py-2">${coverageData.planType}</td>
                        <td class="px-4 py-2">${coverageData.effectiveDate}</td>
                        <td class="px-4 py-2">${coverageData.endDate}</td>
                        <td class="px-4 py-2">${coverageData.idNumber}</td>
                    </tr>
                `;
                document.getElementById('coverageData').innerHTML = coverageHtml;

                // Initialize the hamburger menu 
                initializeHamburgerMenu();
            })
            .catch(error => console.error('Error fetching coverage data:', error));
    });
}

// Hamburger Menu Toggle (for dashboard only)
function initializeHamburgerMenu() {
    const hamburgerButton = document.getElementById('hamburgerButton');
    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', function () {
            const menu = document.getElementById('hamburgerMenu');
            menu.classList.toggle('-translate-x-full'); // Toggle slide-in and slide-out
        });
    }

}