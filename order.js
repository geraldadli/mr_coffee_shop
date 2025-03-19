document.addEventListener("DOMContentLoaded", function () {
  // MOBILE MENU
  const mobileMenuBtn = document.getElementById("mobile-menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");
  mobileMenuBtn.addEventListener("click", function () {
    mobileMenu.classList.toggle("active");
  });

  // Initialize cart if needed
  if (!localStorage.getItem("mrCoffeeCart")) {
    localStorage.setItem("mrCoffeeCart", JSON.stringify([]));
  }

  displayCartItems();
  updateCartTotal();

  // Setup shipping type change event to recalc total
  const shippingSelect = document.getElementById("shippingType");
  shippingSelect.addEventListener("change", updateCartTotal);

  // Setup the checkout form validation
  const checkoutForm = document.getElementById("checkoutForm");
  checkoutForm.addEventListener("submit", function (event) {
    let isValid = true;

    // 1) Name >= 3 chars
    const nameInput = document.getElementById("name");
    const nameError = document.getElementById("nameError");
    nameError.textContent = "";
    if (nameInput.value.trim().length < 3) {
      nameError.textContent = "Name must be at least 3 characters.";
      isValid = false;
    }

    // 2) Email must contain "@" and "." and >= 5 length
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    emailError.textContent = "";
    if (
      !emailInput.value.includes("@") ||
      !emailInput.value.includes(".") ||
      emailInput.value.trim().length < 5
    ) {
      emailError.textContent = "Please enter a valid email.";
      isValid = false;
    }

    // 3) Address >= 10 chars
    const addressInput = document.getElementById("address");
    const addressError = document.getElementById("addressError");
    addressError.textContent = "";
    if (addressInput.value.trim().length < 10) {
      addressError.textContent = "Address must be at least 10 characters.";
      isValid = false;
    }

    // 4) Payment Method must be selected
    const paymentError = document.getElementById("paymentError");
    paymentError.textContent = "";
    const paymentRadios = document.querySelectorAll("input[name='paymentMethod']");
    let paymentSelected = false;
    paymentRadios.forEach(radio => {
      if (radio.checked) paymentSelected = true;
    });
    if (!paymentSelected) {
      paymentError.textContent = "Please select a payment method.";
      isValid = false;
    }

    // 5) Shipping Type must not be blank
    const shippingSelect = document.getElementById("shippingType");
    const shippingError = document.getElementById("shippingError");
    shippingError.textContent = "";
    if (shippingSelect.value === "") {
      shippingError.textContent = "Please choose a shipping option.";
      isValid = false;
    }

    // 6) Total price must be > 0
    const finalTotal = calculateFinalTotal();
    if (finalTotal <= 0) {
      alert("Cart is empty or total price is zero. Please add items.");
      isValid = false;
    }

    if (!isValid) {
      event.preventDefault();
    } else {
      alert("Order confirmed! Thank you.");
      // Clear the cart if you want:
      localStorage.removeItem("mrCoffeeCart");
    }
  });
});

// Add-on costs list
const addonCosts = {
  "Extra Shot": 1.0,
  "Whipped Cream": 0.5,
  "Chocolate Syrup": 0.75
};

// Shipping costs
const shippingCosts = {
  "Standard": 5,
  "Express": 10,
  "Overnight": 20
};

// Map item names to images
const itemImages = {
  "Cappuccino": "/assets/cappucino.jpg",
  "Mochalatte": "/assets/mochalatte.jpg",
  "Classic Espresso": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  "Double Espresso": "https://media.istockphoto.com/id/1455924833/photo/fresh-double-espresso-coffee-and-coffee-beans-on-wooden-table.jpg?s=612x612&w=0&k=20&c=STuLBo05aQ5nHZxU2NnWAlaADSLCnZxzLIkED9sMEUM=",
  "Americano": "https://media.istockphoto.com/id/1030018926/photo/coffee-americano-it-made-from-espresso-and-hot-water-uk.jpg?s=612x612&w=0&k=20&c=trsNtjalA6r9eGka845eO1nYOP0yogvLWqBAg-jsBlM=",
  "Chocolate Croissant": "/assets/chocolatecroissant.jpg",
  "Avocado Toast": "/assets/avocadotoast.jpg",
  "Iced Caramel Macchiato": "/assets/icedcaramelmacchiato.jpg",
  "Caramel Frappe": "https://www.allrecipes.com/thmb/cb1Zf7kTp5QkiMA0GBj8ppsrZx8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/235850-starbucks-caramel-frappuccino-copycat-recipe-DDMFS-4x3-227a1e47f46643dcb4708e775a250bca.jpg",
  "Mocha Frappe": "https://www.nescafe.com/ph/sites/default/files/2024-05/nescafe-gold-dark-mocha-frappe-recipe-banner_1066x1066.jpg",
  "Brewed Coffee": "https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  "Iced Coffee": "https://media.istockphoto.com/id/1353598939/photo/fresh-coffee.jpg?s=612x612&w=0&k=20&c=muFDk5viP4EakM4Za7LiNwhhTpxzEbaevznO_Nr7HBo=",
  "Freshly Baked Bread": "https://images.ctfassets.net/3s5io6mnxfqz/5rHDszmXO2kKZHFF2yIqva/e8801ea67aeef00f6f6dcaac2d531aae/AdobeStock_205724119.jpeg",
  "Chocolate Muffin": "https://media.istockphoto.com/id/537698587/photo/homemade-dark-chocolate-muffins.jpg?s=612x612&w=0&k=20&c=Ey6ImB29shcrNb-a1G_WmlcJmDa9bVVxLId_q1pZAWs="
};

function displayCartItems() {
  const cartItemsDiv = document.getElementById("cart-items");
  let cart = JSON.parse(localStorage.getItem("mrCoffeeCart")) || [];

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let html = `<div class="cart-list">`;
  cart.forEach((item, index) => {
    const imgUrl = itemImages[item.name] || "https://via.placeholder.com/150";
    html += `
      <div class="cart-item">
        <img src="${imgUrl}" alt="${item.name}" class="cart-item-image" />
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.name}</h3>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>

          <div class="cart-quantity-control">
            <button type="button" class="qty-btn" onclick="decrementQuantity(${index})">-</button>
            <span class="qty-display">${item.quantity}</span>
            <button type="button" class="qty-btn" onclick="incrementQuantity(${index})">+</button>
          </div>

          <div class="cart-item-addons">
            <p>Add-ons:</p>
            ${Object.keys(addonCosts)
              .map(
                (addon) => `
                  <label class="coffee-container">
                    <input
                      type="checkbox"
                      class="coffee-input"
                      onchange="toggleAddon(${index}, '${addon}', this.checked)"
                      ${item.addons.includes(addon) ? "checked" : ""}
                    />
                    <span class="coffee-cbx"></span>
                    <span class="coffee-lbl">${addon} (+$${addonCosts[addon].toFixed(2)})</span>
                  </label>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  });
  html += `</div>`;

  cartItemsDiv.innerHTML = html;
}

/** Increments item quantity by 1. */
function incrementQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("mrCoffeeCart")) || [];
  cart[index].quantity++;
  localStorage.setItem("mrCoffeeCart", JSON.stringify(cart));
  displayCartItems();
  updateCartTotal();
}

/** Decrements item quantity by 1, removing if it hits 0. */
function decrementQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("mrCoffeeCart")) || [];
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem("mrCoffeeCart", JSON.stringify(cart));
  displayCartItems();
  updateCartTotal();
}

/** Toggles an add-on for a specific item in the cart. */
function toggleAddon(index, addon, checked) {
  let cart = JSON.parse(localStorage.getItem("mrCoffeeCart")) || [];
  if (checked) {
    if (!cart[index].addons.includes(addon)) {
      cart[index].addons.push(addon);
    }
  } else {
    cart[index].addons = cart[index].addons.filter(a => a !== addon);
  }
  localStorage.setItem("mrCoffeeCart", JSON.stringify(cart));
  updateCartTotal();
}

/** Returns the base cart total (items + add-ons). */
function getCartTotal() {
  let cart = JSON.parse(localStorage.getItem("mrCoffeeCart")) || [];
  let total = 0;
  cart.forEach(item => {
    let itemTotal = item.price * item.quantity;
    item.addons.forEach(addon => {
      itemTotal += (addonCosts[addon] || 0) * item.quantity;
    });
    total += itemTotal;
  });
  return total;
}

/** Returns the final total including shipping. */
function calculateFinalTotal() {
  const baseTotal = getCartTotal();
  const shippingSelect = document.getElementById("shippingType");
  const shippingType = shippingSelect.value;
  let shippingCost = 0;
  if (shippingCosts[shippingType]) {
    shippingCost = shippingCosts[shippingType];
  }
  return baseTotal + shippingCost;
}

/** Updates the displayed total. Called after cart changes or shipping changes. */
function updateCartTotal() {
  const finalTotal = calculateFinalTotal();
  document.getElementById("cart-total").innerText = `Total: $${finalTotal.toFixed(2)}`;
}
