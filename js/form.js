// Handles registration form submission
const form = document.getElementById("memberForm");

const API_BASE_URL = "https://gdg-statistics-backend-production.up.railway.app";

let phone = form.phone.value.trim();
phone = phone.replace(/\D/g, "");

if (!/^\d{11}$/.test(phone)) {
  const msg = document.createElement("p");
  msg.textContent = data.message || "Phone number must be 11 digitds longs.";
  msg.style.color = "red";
  form.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const track = form.track.value;

  const requiredFields = [form.name, form.phone, form.track];
  if (requiredFields.some((f) => !f.value.trim())) {
    return alert("Please fill in all required fields!");
  }

  const newMember = {
    name,
    phone,
    track,
    date: new Date().toLocaleDateString(),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember),
    });

    const data = await res.json(); // parse response before checking

    const msg = document.createElement("p");
    msg.textContent = data.message || "✅ Registration successful!";
    msg.style.color = res.ok ? "green" : "red"; // color based on success/failure
    form.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);

    if (!res.ok) return; // stop further execution if error

    form.reset();
  } catch (error) {
    console.error("Error:", error);
    const msg = document.createElement("p");
    msg.textContent = "❌ Network error. Please try again.";
    msg.style.color = "red";
    form.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  }
});
