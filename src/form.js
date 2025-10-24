// Handles registration form submission
const form = document.getElementById("memberForm");

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
    // ✅ Send data to backend (instead of saving to localStorage)
    const res = await fetch(
      "https://friendly-inspiration.up.railway.app/api/members",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      }
    );

    if (!res.ok) throw new Error("Failed to register member");

    const data = await res.json();

    const msg = document.createElement("p");
    msg.textContent = data.message || "✅ Registration successful!";
    msg.style.color = "green";
    form.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);

    form.reset();
  } catch (error) {
    console.error("Error:", error);
    const msg = document.createElement("p");
    msg.textContent = "❌ Registration failed. Try again.";
    msg.style.color = "red";
    form.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  }
});
