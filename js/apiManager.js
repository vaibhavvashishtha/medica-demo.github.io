class APIManager {
    constructor() {
        this.baseUrl = 'https://api.jsonbin.io/v3/b/';
        this.headers = {
            'X-Master-Key': '$2a$10$2AbKx7fc0Ror1AVItfO7Ru8sMufS/SIbH/U6qQHL.OsHPhU7/zWbK',
            'Content-Type': 'application/json'
        };
        this.config = {
            login: '66e32170acd3cb34a8826c15',
            dashboard: '66e321c1acd3cb34a8826c3c',
            claims: '66e321a8acd3cb34a8826c35',
            spending: '66e321d1ad19ca34f8a3f405',
            coverage: '66e321b5ad19ca34f8a3f3fd',
            familyMembers: '66e7f20aad19ca34f8a6e077'
        };
    }

    // Method to determine the current page and fetch the appropriate data
    fetchDataForPage(ctaFrom) {
        const currentPath = window.location.pathname;

        // Dashboard Page
        if (currentPath.includes('dashboard.html')) {
            return this.fetchData(this.config.dashboard);
        }

        // Claims Summary Page
        else if (currentPath.includes('claims-summary.html')) {
            return this.fetchData(this.config.claims);
        }

        // Spending Summary Page
        else if (currentPath.includes('spending-summary.html')) {
            return this.fetchData(this.config.spending);
        }

        // Coverage & Benefits Page
        else if (currentPath.includes('coverage-benefits.html')) {
            return this.fetchData(this.config.coverage);
        }

        // Family Members Page
        else if (currentPath.includes('family-members.html')) {
            return this.fetchData(this.config.familyMembers);
        }

        else if (ctaFrom === 'login') {
            return this.fetchData(this.config.login)
        }

        return Promise.reject('No API for this page.');
    }

    // General method to fetch data from the API
    fetchData(apiId) {
        const url = `${this.baseUrl}${apiId}`;
        return fetch(url, {
            method: 'GET',
            headers: this.headers
        })
        .then(response => response.json())
        .then(data => data.record)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
    }
}

// Initialize API Manager
const apiManager = new APIManager();
