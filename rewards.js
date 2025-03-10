document.addEventListener("DOMContentLoaded", function () {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");
  
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");
    });
  
    // Modal Functionality for Reward Download Buttons
    const modal = document.getElementById("downloadModal");
    const modalClose = document.querySelector(".modal-close");
    const rewardDownloadBtns = document.querySelectorAll(".reward-download-btn");
  
    rewardDownloadBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        modal.style.display = "block";
      });
    });
  
    modalClose.addEventListener("click", function () {
      modal.style.display = "none";
    });
  
    // Close modal when clicking outside the modal content
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });
  