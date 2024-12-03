document.addEventListener('DOMContentLoaded', function() {
            let clothingData;
            let cartItems = [];
            const clothingContainer = document.getElementById('clothingContainer');
            const searchInput = document.getElementById('searchInput');
            const categoryButtons = document.querySelectorAll('.filter-buttons button');

            // Fetch clothing data
            fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
                .then(response => response.json())
                .then(data => {
                    clothingData = data.categories;
                    renderClothingItems(clothingData);
                })
                .catch(error => console.error('Error fetching data:', error));

            // Render clothing items
            function renderClothingItems(data) {
                clothingContainer.innerHTML = '';
                data.forEach(category => {
                    category.category_products.forEach(product => {
                        const searchTerm = searchInput.value.trim().toLowerCase();
                        const matchesSearch = (
                            product.title.toLowerCase().includes(searchTerm) ||
                            product.vendor.toLowerCase().includes(searchTerm) ||
                            category.category_name.toLowerCase().includes(searchTerm)
                        );

                        if (!searchTerm || matchesSearch) {
                            const card = createClothingCard(product);
                            clothingContainer.appendChild(card);
                            // Add line break after each card
                            clothingContainer.appendChild(document.createElement('br'));
                        }
                    });
                });
                // Add event listeners to Add to Cart buttons
                document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                    btn.addEventListener('click', addToCart);
                });
            }

            // Create clothing card
            function createClothingCard(product) {
                const card = document.createElement('div');
                card.classList.add('clothing-card');
                card.innerHTML = `
    <img src="${product.image}" alt="${product.title}">
    <h3>${product.title}</h3>
    <p>Price: $${product.price}</p>
    <h2>${product.vendor}</h2>
    ${product.badge_text ? `<span class="badge">${product.badge_text}</span>` : ''}
    <button class="add-to-cart-btn" data-id="${product.id}" data-price="${product.price}">Add to Cart</button>
`;
return card;
}

// Add item to cart
function addToCart(event) {
const productId = event.target.dataset.id;
const productPrice = parseFloat(event.target.dataset.price);

// Find the product in clothingData
const product = clothingData.flatMap(category => category.category_products).find(p => p.id === productId);

// Add product to cartItems
cartItems.push(product);

// Visual feedback: Change button text and style
event.target.textContent = 'Added to Cart';
event.target.disabled = true;
event.target.style.backgroundColor = '#28a745'; // Green color for success
event.target.style.color = '#fff';
}

// Filter clothing items
function filterClothing(event) {
const categoryName = event.target.innerText;
const filteredData = clothingData.filter(cat => cat.category_name === categoryName);
renderClothingItems(filteredData);

categoryButtons.forEach(btn => btn.classList.remove('active'));
event.target.classList.add('active');
}

// Search clothing items
searchInput.addEventListener('input', function() {
renderClothingItems(clothingData);
});

// Add event listener for category buttons
categoryButtons.forEach(btn => btn.addEventListener('click', filterClothing));

// View Cart button event listener
document.getElementById('viewCartBtn').addEventListener('click', function() {
// Store cart items in local storage
localStorage.setItem('cartItems', JSON.stringify(cartItems));
// Redirect to cart page
window.location.href = 'cart.html';
});
});