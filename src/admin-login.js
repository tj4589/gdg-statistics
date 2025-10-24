let incoPass = document.querySelector(".incorrect-pass");
document.getElementById("adminLoginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const password = document.getElementById("password").value.trim();

  if (password === "admin123") {
    // Redirect to admin dashboard
    window.location.href = "admin.html";
  } else {
    incoPass.innerHTML = "Incorrect Password Please try again.";
  }
});
