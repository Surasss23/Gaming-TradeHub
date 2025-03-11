// DOM Elements
const authButton = document.getElementById('authButton');
const authModal = document.getElementById('authModal');
const closeBtn = document.querySelector('.close-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const listingGrid = document.getElementById('listingGrid');
const searchInput = document.querySelector('.search-bar input');

// Google Sheets Public CSV URL (Replace "YOUR_SHEET_ID" with actual Sheet ID)
const sheetUrl = "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:csv";

// Marketplace Listings
let listings = [];

// Fetch Listings from Google Sheets
async function fetchListings() {
    try {
        const response = await fetch(sheetUrl);
        const data = await response.text();
        const rows = data.split("\n").map(row => row.split(","));

        // CSV headers hatao (first row)
        listings = rows.slice(1).map(row => ({
            id: row[0].trim(),
            title: row[1].trim(),
            gameType: row[2].trim(),
            price: `₹${row[3].trim()}`, // INR Format
            description: row[4].trim(),
            imageUrl: row[5].trim() || "https://via.placeholder.com/200", // Default image
            sellerUrl: row[6].trim() || "#" // Seller URL (next page ya external link)
        }));

        renderListings();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Create Listing Card
function createListingCard(listing) {
    return `
        <div class="glass" style="padding: 1rem; overflow: hidden;">
            <div style="height: 200px; background: url(${listing.imageUrl}) center/cover; border-radius: var(--radius) var(--radius) 0 0;"></div>
            <div style="padding: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="font-weight: 600; margin-bottom: 0.5rem;">${listing.title}</h3>
                        <span class="btn btn-outline" style="font-size: 0.875rem; padding: 0.25rem 0.75rem;">${listing.gameType}</span>
                    </div>
                    <span class="btn btn-primary" style="font-size: 1.25rem;">${listing.price}</span>
                </div>
                <p style="color: var(--muted); margin-bottom: 1rem;">${listing.description}</p>
                <a href="${listing.sellerUrl}" class="btn btn-primary" style="width: 100%;" target="_blank">Contact Seller</a>
            </div>
        </div>
    `;
}

// Render Listings
function renderListings(filteredListings = listings) {
    listingGrid.innerHTML = filteredListings
        .map(listing => createListingCard(listing))
        .join('');
}

// Search Functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredListings = listings.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.gameType.toLowerCase().includes(searchTerm)
    );
    renderListings(filteredListings);
});

// Auth Modal
authButton.addEventListener('click', () => {
    authModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    authModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tabName = btn.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`${tabName}Tab`).classList.remove('hidden');
    });
});

// Form Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    
    console.log('Login:', { username, password });
    authModal.style.display = 'none';
    authButton.textContent = username;
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = registerForm.querySelector('input[type="text"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;
    
    console.log('Register:', { username, password });
    authModal.style.display = 'none';
    authButton.textContent = username;
});

// Fetch and Render Listings
fetchListings();
