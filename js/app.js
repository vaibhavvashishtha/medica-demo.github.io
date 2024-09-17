// app.js

// Function to include external HTML files (header, head, left nav)
// Function to include external HTML files (header, head, left nav) and then initialize the hamburger menu
function includeHTML(callback) {
    const elements = document.querySelectorAll('[include-html]');
    let promises = [];

    elements.forEach(el => {
        const file = el.getAttribute('include-html');
        if (file) {
            // Fetch the external HTML file and load it into the element
            let promise = fetch(file)
                .then(response => response.text())
                .then(data => {
                    el.innerHTML = data;
                    el.removeAttribute('include-html');
                })
                .catch(error => console.error('Error loading HTML file:', error));

            promises.push(promise);
        }
    });

    // Wait until all HTML files are loaded, then execute the callback (initializeHamburgerMenu)
    Promise.all(promises).then(() => {
        if (callback) callback();
    });
}

// Hamburger Menu Toggle
function initializeHamburgerMenu() {
    const hamburgerButton = document.getElementById('hamburgerButton');
    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', function () {
            const menu = document.getElementById('hamburgerMenu');
            menu.classList.toggle('-translate-x-full'); // Toggle slide-in and slide-out
        });
    } else {
        console.error("Hamburger button not found.");
    }
}

// Function to dynamically set the page title
function setPageTitle() {
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('pageTitle').textContent = document.title;
    });
}

// Handle data fetching for each page and dynamically inject data
function handlePageData(ctaFrom) {
    // Use the central API manager to fetch data based on the current page
    apiManager.fetchDataForPage(ctaFrom)
        .then(data => {
            const currentPath = window.location.pathname;

            // Dashboard Page Data
            if (currentPath.includes('dashboard.html')) {
                // Populate Coverage Summary
                const coverageHtml = `
                    <tr>
                        <td class="px-4 py-2">${data.planName}</td>
                        <td class="px-4 py-2">${data.effectiveDate}</td>
                        <td class="px-4 py-2">${data.status}</td>
                    </tr>
                `;
                document.getElementById('coverageSummaryData').innerHTML = coverageHtml;

                // Populate Recent Claims
                let claimsHtml = '';
                data.recentClaims.forEach(claim => {
                    claimsHtml += `
                        <tr>
                            <td class="px-4 py-2">${claim.provider}</td>
                            <td class="px-4 py-2">$${claim.amountPaid}</td>
                        </tr>
                    `;
                });
                document.getElementById('recentClaimsData').innerHTML = claimsHtml;
            }

            else if (currentPath.includes('coverage-benefits.html')) {
                // Populate Coverage Summary
                const coverageHtml = `
                    <tr>
                            <td class="px-4 py-2">${data.planType}</td>
                            <td class="px-4 py-2">${data.effectiveDate}</td>
                            <td class="px-4 py-2">$${data.endDate}</td>
                            <td class="px-4 py-2">${data.idNumber}</td>
                        </tr>
                `;
                document.getElementById('coverageData').innerHTML = coverageHtml;

            }

            // Claims Summary Page Data
            else if (currentPath.includes('claims-summary.html')) {
                let claimsHtml = '';
                data.claims.forEach(claim => {
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
            }

            // Spending Summary Page Data
            else if (currentPath.includes('spending-summary.html')) {
                const deductibleSpent = data.deductibleSpent;
                const deductibleLimit = data.deductibleLimit;
                const deductiblePercentage = (deductibleSpent / deductibleLimit) * 100;
                document.getElementById('deductibleSpent').innerText = `$${deductibleSpent}`;
                document.getElementById('deductibleLimit').innerText = `$${deductibleLimit}`;
                document.getElementById('deductibleProgress').style.width = `${deductiblePercentage}%`;

                const outOfPocketSpent = data.outOfPocketSpent;
                const outOfPocketLimit = data.outOfPocketLimit;
                const outOfPocketPercentage = (outOfPocketSpent / outOfPocketLimit) * 100;
                document.getElementById('outOfPocketSpent').innerText = `$${outOfPocketSpent}`;
                document.getElementById('outOfPocketLimit').innerText = `$${outOfPocketLimit}`;
                document.getElementById('outOfPocketProgress').style.width = `${outOfPocketPercentage}%`;
            }

        })
        .catch(error => console.error('Error loading page data:', error));
}

// Login function that checks credentials using the hosted JSON
function login(userID, password) {

    apiManager.fetchDataForPage('login')
        .then(data => {
            const loginData = data;
            if (userID === loginData.username && password === loginData.password) {
                sessionStorage.setItem('token', loginData.token);
                window.location.href = 'dashboard.html';  // Redirect to dashboard on successful login
            } else {
                alert('Invalid credentials, please try again.');
            }
        }
        )

}

// Logout function to clear the session and redirect to login page
function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';  // Redirect to login page after logout
}

// Initialize the application on page load
document.addEventListener('DOMContentLoaded', function () {
    includeHTML(() => {
        initializeHamburgerMenu();  // Initialize hamburger menu functionality after HTML is included
        handlePageData();           // Fetch data and inject into the page
    });
    setPageTitle();

});

// Fetch family members data dynamically and inject into cards
function fetchFamilyMembersData(data) {
    // const token = sessionStorage.getItem('token');
    // if (!token) {
    //     window.location.href = 'index.html';  // Redirect if not logged in
    //     return;
    // }

    
                const familyMembersData = data.familyMembers;
                let familyHtml = '';

                // Loop through each family member and create a card for them
                familyMembersData.forEach((member, index) => {
                    familyHtml += `
                        <div class="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto transition-transform transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
                            <div class="flex items-center space-x-4">
                                <div class="w-16 h-16 rounded-full bg-blue-100 flex-shrink-0">
                                    <img class="rounded-full object-cover w-full h-full" src="https://via.placeholder.com/150" alt="Family member image">
                                </div>
                                <div>
                                    <h2 class="text-xl font-semibold text-gray-800">${member.name}</h2>
                                    <p class="text-sm text-gray-500">Date of Birth: <span class="font-medium">${member.dob}</span></p>
                                </div>
                            </div>
                            <div class="mt-4 text-gray-700">
                                <p><strong>Plan Type:</strong> ${member.planType}</p>
                                <p><strong>Effective Start Date:</strong> ${member.startDate}</p>
                                <p><strong>End Date:</strong> ${member.endDate}</p>
                                <p><strong>Group Name:</strong> ${member.groupName}</p>
                            </div>
                            <div class="mt-4">
                                <a href="member-detail.html?id=${index}" class="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">View Profile</a>
                            </div>
                        </div>
                    `;
                });

                // Insert the generated HTML into the page
                document.getElementById('familyMembersData').innerHTML = familyHtml;
           
}

