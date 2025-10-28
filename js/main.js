// js/main.js

// Display the current year automatically in the footer
const yearSpan = document.querySelector("#currentYear");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Highlight the active page link
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll("a.nav-link").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

// Example: fade-in animation when the page loads
window.addEventListener("load", () => {
  document.body.style.opacity = "1";
});
