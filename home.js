document.addEventListener("DOMContentLoaded", function () {
    // MOBILE MENU
    const mobileMenuBtn = document.getElementById("mobile-menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");
    });
  
    // Initialize cart
    if (!localStorage.getItem("mrCoffeeCart")) {
      localStorage.setItem("mrCoffeeCart", JSON.stringify([]));
    }
    updateCartCount();
  
    // Make "Order Now" buttons add items to the cart
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach(card => {
      const btn = card.querySelector(".product-button");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const name = card.getAttribute("data-name");
        const price = parseFloat(card.getAttribute("data-price"));
        addToCart(name, price);
      });
    });
  });
  
  /** Adds an item to localStorage cart, or increments quantity if it exists. */
  function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("mrCoffeeCart")) || [];
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        name: name,
        price: price,
        quantity: 1,
        addons: []
      });
    }
    localStorage.setItem("mrCoffeeCart", JSON.stringify(cart));
    updateCartCount();
    animateCartIcon();
  }
  
  /** Sums up all item quantities for the cart icon. */
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("mrCoffeeCart")) || [];
    let totalQty = 0;
    cart.forEach(item => {
      totalQty += item.quantity;
    });
    document.getElementById("cart-count").innerText = totalQty;
  }
  
  /** Navigates to the order page. */
  function goToOrderPage() {
    window.location.href = "order.html";
  }
  
  /** Animate the cart icon with a gradient & star sparkles. */
  function animateCartIcon() {
    const cartIcon = document.getElementById("cart-icon");
    // Add the class for gradient color animation
    cartIcon.classList.add("cart-subscribe-animate");
  
    // Listen for animation end to remove the class
    cartIcon.addEventListener(
      "animationend",
      function () {
        cartIcon.classList.remove("cart-subscribe-animate");
      },
      { once: true }
    );
  
    // Create multiple stars
    for (let i = 0; i < 6; i++) {
      createStar(cartIcon);
    }
  }
  
  /** Creates a star element that animates outward & fades. */
  function createStar(cartIcon) {
    const star = document.createElement("div");
    star.classList.add("star");
  
    // random angle + distance for movement
    const angle = Math.random() * 360;
    const distance1 = 20 + Math.random() * 10; // half-way
    const distance2 = 40 + Math.random() * 20; // final
    const x1 = distance1 * Math.cos((angle * Math.PI) / 180);
    const y1 = distance1 * Math.sin((angle * Math.PI) / 180);
    const x2 = distance2 * Math.cos((angle * Math.PI) / 180);
    const y2 = distance2 * Math.sin((angle * Math.PI) / 180);
  
    star.style.setProperty("--x-move", `${x1}px`);
    star.style.setProperty("--y-move", `${y1}px`);
    star.style.setProperty("--x-move2", `${x2}px`);
    star.style.setProperty("--y-move2", `${y2}px`);
  
    cartIcon.appendChild(star);
  
    // Remove star after animation
    star.addEventListener("animationend", () => {
      star.remove();
    });
  }
  