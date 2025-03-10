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
    updateCartCount();
  
    // Make "Order Now" buttons add items to the cart
    const orderButtons = document.querySelectorAll(".order-btn");
    orderButtons.forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation(); // Just in case there's a parent click
        const parentItem = btn.closest(".menu-item");
        const name = parentItem.getAttribute("data-name");
        const price = parseFloat(parentItem.getAttribute("data-price"));
        addToCart(name, price);
      });
    });
  
    // FILTERING FUNCTIONALITY
    const filterButtons = document.querySelectorAll(".filter-btn");
    const menuItems = document.querySelectorAll(".menu-item");
  
    filterButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
  
        const category = btn.getAttribute("data-category");
  
        menuItems.forEach(item => {
          if (category === "all") {
            item.style.display = "block";
          } else {
            if (item.getAttribute("data-category") === category) {
              item.style.display = "block";
            } else {
              item.style.display = "none";
            }
          }
        });
      });
    });
  });
  
  /** Adds an item to the cart in localStorage or increments if it exists. */
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
    animateCartIcon(); // trigger the gradient + star animation
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
  
  /** Go to the order page. */
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
  
    // We start star in center of cart icon
    // We'll animate it outward using custom properties for transform
    // So it can move in random directions
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
  