class APIManager2 {
    constructor() {
        this.baseUrl = 'https://api.jsonsilo.com/';
        this.headers = {
            'X-SILO-KEY': 'QcJZoNlEKJsmOQTNvzR3OmrPZQuEndzI1rS48cMDh9',
            'Content-Type': 'application/json'
        };
        this.config = {
            familyMembers: '4541bc34-fe7a-4c97-be51-fca874d1fee9'
        };
    }

    // Method to determine the current page and fetch the appropriate data
    fetchDataForPage(ctaFrom) {
        const currentPath = window.location.pathname;

        // Dashboard Page
        if (currentPath.includes('dashboard.html')) {
            return this.fetchData(this.config.familyMembers);
        }

        // Claims Summary Page
        else if (currentPath.includes('claims-summary.html')) {
            return this.fetchData(this.config.familyMembers);
        }

        // Spending Summary Page
        else if (currentPath.includes('spending-summary.html')) {
            return this.fetchData(this.config.familyMembers);
        }

        // Coverage & Benefits Page
        else if (currentPath.includes('coverage-benefits.html')) {
            return this.fetchData(this.config.familyMembers);
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
const apiManager2 = new APIManager2();
