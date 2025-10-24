// Get reference to the table body
const tbody = document.querySelector("#memberTable tbody");
const rowsPerPage = 10;
let members = [];

const API_BASE_URL = "https://gdg-statistics.onrender.com";

// ✅ Fetch members from backend instead of localStorage
async function loadMembers() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/members`);
    members = await res.json();
    displayMembers();
  } catch (error) {
    console.error("Error fetching members:", error);
  }
}

// --- Export as CSV ---
function exportToCSV() {
  if (members.length === 0) {
    alert("No data to export!");
    return;
  }

  const headers = ["Name", "Phone Number", "Track", "Date Registered"];
  const rows = members.map((m) => [m.name, m.phone, m.track, m.date]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "members_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function displayMembers(page = 1) {
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginated = members.slice(start, end);

  tbody.innerHTML = "";
  paginated.forEach((m) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${m.name}</td>
      <td>${m.phone}</td>
      <td>${m.track}</td>
      <td>${m.date}</td>
      <td><button class="delete-btn" data-id="${m._id}">Delete</button></td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const memberId = e.target.dataset.id;
      if (confirm("Are you sure you want to delete this member?")) {
        await deleteMember(memberId);
      }
    });
  });

  updateStats(members);
  updateCharts(members);
}

function updateStats(list) {
  document.getElementById("totalMembers").textContent = list.length;
}

function countBy(list, key) {
  const counts = {};
  list.forEach((item) => {
    counts[item[key]] = (counts[item[key]] || 0) + 1;
  });
  return counts;
}

const charts = {};
function makePieChart(canvasId, dataObj, colors) {
  const ctx = document.getElementById(canvasId)?.getContext("2d");
  if (!ctx) return;

  if (charts[canvasId]) charts[canvasId].destroy();

  charts[canvasId] = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(dataObj),
      datasets: [
        {
          data: Object.values(dataObj),
          backgroundColor: colors.slice(0, Object.keys(dataObj).length),
        },
      ],
    },
  });
}

function updateCharts(list) {
  const trackData = countBy(list, "track");
  makePieChart("trackChart", trackData, [
    "#36A2EB",
    "#FF6384",
    "#FFCD56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#00A86B",
    "#C71585",
    "#708090",
    "#8B4513",
  ]);
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("exportCSV").addEventListener("click", exportToCSV);

// ✅ Load members from backend
loadMembers();

async function deleteMember(id) {
  try {
    id = id.trim(); // ✅ remove hidden spaces/newlines
    const res = await fetch(`${API_BASE_URL}/api/members/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete member");

    const data = await res.json();
    alert(data.message);

    // Refresh table after deletion
    const index = members.findIndex((m) => m._id === id);
    if (index !== -1) {
      members.splice(index, 1);
      displayMembers();
    }
  } catch (err) {
    console.error("Error deleting member:", err);
    alert("❌ Error deleting member");
  }
}
