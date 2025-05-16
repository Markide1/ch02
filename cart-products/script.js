// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const app = new DessertApp();
});

// Classes for the Desssert site.

class DessertApp {
  constructor() {
    this.desserts = [];
    this.cart = new Cart();
    this.init();
  }

  init() {
    this.loadData();
    this.setupResponsiveImageHandling();
    this.renderCart();
  }

  // Load dessert data from JSON file

  loadData() {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          // Add unique IDs to each dessert
          this.desserts = data.map((dessert, index) => ({
            ...dessert,
            id: `dessert-${index + 1}`,
          }));
          this.renderDesserts();
        } else {
          console.error("No dessert data found");
        }
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  }

  // Handle responsive images on different screen sizes

  setupResponsiveImageHandling() {
    // Handle responsive image display
    const checkResponsiveImages = () => {
      const width = window.innerWidth;
      let imageType = "desktop";

      if (width <= 576) {
        imageType = "mobile";
      } else if (width <= 768) {
        imageType = "tablet";
      }

      // Update all images with appropriate source
      document.querySelectorAll(".card .cardImage img").forEach((img) => {
        const itemId = img.closest(".card").getAttribute("data-id");
        const dessert = this.desserts.find((d) => d.id === itemId);

        if (dessert) {
          img.src = dessert.image[imageType];
        }
      });
    };

    // Run on initial load and when resizing
    window.addEventListener("resize", checkResponsiveImages);
    // Initial check will be done after rendering
  }

  renderDesserts() {
    const container = document.querySelector(".container");
    container.innerHTML = "";

    this.desserts.forEach((dessert) => {
      const card = this.createDessertCard(dessert);
      container.appendChild(card);
    });

    // Check responsive images after cards are created
    setTimeout(() => {
      this.setupResponsiveImageHandling();
      // Trigger initial check
      window.dispatchEvent(new Event("resize"));
    }, 0);
  }

  // Create a dessert cards for each dessert

  createDessertCard(dessert) {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-id", dessert.id);

    // Default to thumbnail image **
    card.innerHTML = `
      <div class="cardImage">
        <img src="${dessert.image.thumbnail}" alt="${dessert.name} image">
        
      </div>
      <button class="addToCartBtn" data-id="${dessert.id}">        
          <img src="assets/images/icon-add-to-cart.svg" alt="cart icon" class="cartIcon">
          Add to Cart
        </button>   
        
      <div class="cardContent">
        <p class="category">${dessert.category}</p>
        <h3>${dessert.name}</h3>
        <p class="price">$${dessert.price.toFixed(2)}</p>
        
      </div>
    `;

    // Event listener to the Add to Cart button
    card.querySelector(".addToCartBtn").addEventListener("click", () => {
      this.cart.addItem(dessert);
      this.renderCart();
    });

    return card;
  }

  // Render the cart with items and total price

  renderCart() {
    const cartElement = document.querySelector(".cart");
    const cartItems = document.querySelector(".cart-items");
    const cartCount = this.cart.getTotalItems();

    // Update cart title
    document.querySelector(".cart h2").textContent = `Your Cart (${cartCount})`;

    if (cartCount === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <img src="assets/images/illustration-empty-cart.svg" alt="Empty cart" class="emptyCartIcon">
          <p>Your added items will appear here</p>
        </div>
      `;
      return;
    }

    cartItems.innerHTML = "";

    // Add cart items
    this.cart.items.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <img src="${item.image.thumbnail}" alt="${
        item.name
      }" class="cart-item-img">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p class="item-price">${item.quantity}x @ $${item.price.toFixed(
        2
      )} <span class="item-total">$${(item.quantity * item.price).toFixed(
        2
      )}</span></p>
          </div>
          <button class="remove-item" data-id="${item.id}">
            <img src="assets/images/icon-remove-item.svg" alt="Remove" class="removeIcon">
          </button>
        </div>
        <div class="quantity-selector">
          <button class="decrease-qty" data-id="${item.id}">-</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="increase-qty" data-id="${item.id}">+</button>
        </div>
      `;

      cartItems.appendChild(cartItem);
    });

    // Add order total and confirm button if cart has items
    const totalElement = document.createElement("div");
    totalElement.className = "cart-total";
    totalElement.innerHTML = `
      <div class="total-row">
        <span>Order Total</span>
        <span class="total-amount">$${this.cart
          .getTotalPrice()
          .toFixed(2)}</span>
      </div>
      <button class="confirm-order">Confirm Order</button>
    `;
    cartItems.appendChild(totalElement);

    // Event listeners for quantity buttons and remove buttons
    cartItems.querySelectorAll(".decrease-qty").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.cart.decreaseQuantity(id);
        this.renderCart();
      });
    });

    // Event listeners for increase buttons

    cartItems.querySelectorAll(".increase-qty").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.cart.increaseQuantity(id);
        this.renderCart();
      });
    });

    // Event listeners for remove buttons

    cartItems.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.cart.removeItem(id);
        this.renderCart();
      });
    });

    // Event listener for confirm order button
    cartItems.querySelector(".confirm-order").addEventListener("click", () => {
      this.showOrderConfirmation();
    });
  }

  showOrderConfirmation() {
    // Create modal overlay
    const modal = document.createElement("div");
    modal.className = "order-modal";

    modal.innerHTML = `
      <div class="modal-content">
        <div class="confirmation-icon">
          <img src="assets/images/icon-order-confirmed.svg" alt="Confirmed" class="checkIcon">
        </div>
        <h2>Order Confirmed</h2>
        <p>We hope you enjoy your food!</p>
        <div class="order-summary">
          ${this.cart.items
            .map(
              (item) => `
            <div class="order-item">
              <img src="${item.image.thumbnail}" alt="${
                item.name
              }" class="order-item-img">
              <div class="order-item-info">
                <h4>${item.name}</h4>
                <p>${item.quantity}x @ $${item.price.toFixed(2)}</p>
              </div>
              <div class="order-item-price">$${(
                item.quantity * item.price
              ).toFixed(2)}</div>
            </div>
          `
            )
            .join("")}
          <div class="order-total-row">
            <span>Order Total</span>
            <span class="total-amount">$${this.cart
              .getTotalPrice()
              .toFixed(2)}</span>
          </div>
        </div>
        <button class="new-order">Start New Order</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listener to new order button
    modal.querySelector(".new-order").addEventListener("click", () => {
      this.cart.clearCart();
      this.renderCart();
      document.body.removeChild(modal);
    });
  }
}

// Class to manage the cart functionality
class Cart {
  constructor() {
    this.items = [];
  }

  // Add item to the cart
  addItem(item) {
    const existingItem = this.items.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...item, quantity: 1 });
    }
  }

  // Remove item from the cart

  removeItem(id) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  // Increase item quantity
  increaseQuantity(id) {
    const item = this.items.find((item) => item.id === id);
    if (item) {
      item.quantity += 1;
    }
  }
  // Decrease item quantity
  decreaseQuantity(id) {
    const item = this.items.find((item) => item.id === id);
    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        this.removeItem(id);
      }
    }
  }

  // Get total items

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Get total price of items in the cart
  getTotalPrice() {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // Clear the cart

  clearCart() {
    this.items = [];
  }
}
