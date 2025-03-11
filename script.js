// DOM Elements
const listingGrid = document.getElementById('listingGrid');
const searchInput = document.querySelector('.search-bar input');

// Google Sheets Public CSV URL (Replace "YOUR_SHEET_ID" with actual Sheet ID)
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGpnhHsb907pkEZOEqXMNibGS7zqXu2ftp4PHA-Ml5hp8jDLxODuQ97cQeT7RmDiS6rBFTKOxTQjwe/pub?output=csv";

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
            imageUrl: row[5].trim() || "https://via.placeholder.com/200" // Default image
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
                <button class="btn btn-primary contact-btn" data-id="${listing.id}" data-title="${listing.title}" data-price="${listing.price}" data-description="${listing.description}" style="width: 100%;">Contact Seller</button>
            </div>
        </div>
    `;
}

// Render Listings
function renderListings(filteredListings = listings) {
    listingGrid.innerHTML = filteredListings
        .map(listing => createListingCard(listing))
        .join('');

    // Add event listeners for Contact Seller buttons
    document.querySelectorAll(".contact-btn").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.dataset.id;
            const title = this.dataset.title;
            const price = this.dataset.price;
            const description = this.dataset.description;
            sendWhatsAppMessage(id, title, price, description);
        });
    });
}

// Send WhatsApp Message
function sendWhatsAppMessage(id, title, price, description) {
    const phoneNumber = "7989386499"; // Your WhatsApp Number
    const message = `📌 *Product Inquiry*\n\n🆔 ID: ${id}\n🎮 Title: ${title}\n💰 Price: ${price}\n📝 Description: ${description}\n\nI am interested in this item. Please provide more details.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, "_blank"); // Open WhatsApp
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

// Fetch and Render Listings
fetchListings();
