// 🔗 Google Sheet Public CSV Link (Replace with your sheet link)
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReOHDMyYZmvNvY4o4Db2TpPKB5KRwxoJMFkW51YNpajefkb5Y5iPxLhpKtXlQb5NP-4k74sDeZZr5_/pub?output=csv";

const listingGrid = document.getElementById("listingGrid");
const searchInput = document.querySelector(".search-bar input");

// 📂 Fetch Data from Google Sheets CSV
async function fetchListings() {
    try {
        const response = await fetch(sheetURL);
        const data = await response.text();
        const listings = parseCSV(data);
        renderListings(listings);
    } catch (error) {
        console.error("Error fetching listings:", error);
    }
}

// 🔍 Parse CSV Data into JSON Format
function parseCSV(csv) {
    const rows = csv.split("\n").map(row => row.split(","));
    const headers = rows[0].map(header => header.trim());
    return rows.slice(1).map(row => {
        let obj = {};
        row.forEach((value, index) => {
            obj[headers[index]] = value.trim();
        });
        return obj;
    });
}

// 🎮 Create Listing Card
function createListingCard(listing) {
    return `
        <div class="glass">
            <div style="height: 200px; background: url(${listing.imageUrl}) center/cover; border-radius: 10px 10px 0 0;"></div>
            <div style="padding: 1rem;">
                <h3>${listing.title}</h3>
                <span class="btn btn-outline">${listing.gameType}</span>
                <p>💰 Price: $${listing.price}</p>
                <p>${listing.description}</p>
                <button class="btn btn-primary contact-seller" 
                    data-id="${listing.id}" 
                    data-title="${listing.title}" 
                    data-price="${listing.price}" 
                    data-description="${listing.description}">
                    Contact Seller
                </button>
            </div>
        </div>
    `;
}

// 🖥️ Render Listings
function renderListings(listings) {
    listingGrid.innerHTML = listings.map(createListingCard).join("");
}

// 🔍 Search Functionality
searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredListings = listings.filter((listing) =>
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.gameType.toLowerCase().includes(searchTerm)
    );
    renderListings(filteredListings);
});

// 📲 WhatsApp Contact
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("contact-seller")) {
        const id = e.target.dataset.id;
        const title = e.target.dataset.title;
        const price = e.target.dataset.price;
        const description = e.target.dataset.description;

        const whatsappMessage = `Hey! I'm interested in this listing:
        🔹 *ID:* ${id}
        🔹 *Title:* ${title}
        🔹 *Price:* $${price}
        🔹 *Description:* ${description}
        
        Can you provide more details?`;

        const whatsappURL = `https://wa.me/7989386499?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappURL, "_blank");
    }
});

// 🚀 Fetch Data on Load
fetchListings();
