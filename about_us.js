document.addEventListener("DOMContentLoaded", function () {
    // Mobile Menu Toggle for About Us page
    const mobileMenuBtn = document.getElementById("mobile-menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");
  
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");
    });
  });
  