// Initialize tooltips
document.addEventListener("DOMContentLoaded", function () {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Handles sidebar navigation
document.addEventListener("DOMContentLoaded", function () {
  const sidebarLinks = document.querySelectorAll(
    '.sidebar .nav-link[href^="#"]'
  );
  const sections = document.querySelectorAll(
    ".content-section, .dashboard-section"
  );

  function hideAllSections() {
    sections.forEach((section) => {
      section.style.display = "none";
    });
  }

  hideAllSections();

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      sidebarLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
      const targetId = this.getAttribute("href").replace("#", "");
      hideAllSections();
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.style.display = "";
    });
  });
});

// Handle image modal
document.addEventListener("DOMContentLoaded", function () {
  var imageModal = document.getElementById("imageModal");
  imageModal.addEventListener("show.bs.modal", function (event) {
    var button = event.relatedTarget;
    var imgSrc = button.getAttribute("src");
    var modalImage = document.getElementById("modalImage");
    modalImage.src = imgSrc;
  });
});

// Add this script for the knowledge base functionality
document.addEventListener("DOMContentLoaded", function () {
  const knowledgeBaseLinks = document.querySelectorAll(".knowledge-base-link");
  knowledgeBaseLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const articleId = this.getAttribute("data-article-id");
      // Load the article content dynamically
      fetch(`/knowledge-base/article/${articleId}`)
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("knowledgeBaseContent").innerHTML = data;
        })
        .catch((error) => console.error("Error loading article:", error));
    });
  });
});

// Initialize Map
var map = L.map("map").setView([-1.286389, 36.817223], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Add farmer locations (approximate coordinates for Kenyan locations)
L.marker([-1.286389, 36.817223])
  .addTo(map)
  .bindPopup("<b>John's Farm</b><br>Tomatoes - Leaf spots");

L.marker([-1.247195, 36.679944])
  .addTo(map)
  .bindPopup("<b>Green Valley Co-op</b><br>Corn - Rust suspected");

L.marker([-1.042108, 37.083375])
  .addTo(map)
  .bindPopup("<b>Maria Garcia</b><br>Wheat - Yellowing");

// Initialize Farmer Map
var farmerMap = L.map("farmerMap").setView([-1.286389, 36.817223], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(farmerMap);

// Add farmer locations to farmerMap (same as above)
L.marker([-1.286389, 36.817223])
  .addTo(farmerMap)
  .bindPopup("<b>John Kamau</b><br>Nairobi West");

L.marker([-1.247195, 36.679944])
  .addTo(farmerMap)
  .bindPopup("<b>Mary Wanjiku</b><br>Kiambu");

L.marker([-1.042108, 37.083375])
  .addTo(farmerMap)
  .bindPopup("<b>Peter Mwangi</b><br>Thika");

// Initialize Chart
const ctx = document.getElementById("diseaseChart").getContext("2d");
const diseaseChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Tomato Late Blight",
        data: [2, 3, 5, 4, 6, 8, 10, 12],
        borderColor: "#d32f2f",
        backgroundColor: "rgba(211, 47, 47, 0.1)",
        fill: true,
      },
      {
        label: "Corn Rust",
        data: [1, 2, 3, 3, 4, 5, 6, 8],
        borderColor: "#ffa000",
        backgroundColor: "rgba(255, 160, 0, 0.1)",
        fill: true,
      },
      {
        label: "Wheat Powdery Mildew",
        data: [0, 1, 1, 2, 2, 3, 4, 5],
        borderColor: "#0288d1",
        backgroundColor: "rgba(2, 136, 209, 0.1)",
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

//Beginning of Status Chart for Field Reports
const statusCtx = document.getElementById("statusChart").getContext("2d");
const statusChart = new Chart(statusCtx, {
  type: "doughnut",
  data: {
    labels: ["Pending", "In Progress", "Resolved", "Urgent"],
    datasets: [
      {
        data: [14, 10, 98, 5],
        backgroundColor: ["#ffc107", "#0dcaf0", "#198754", "#dc3545"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
    },
  },
});

// Issues Chart
const issuesCtx = document.getElementById("issuesChart").getContext("2d");
const issuesChart = new Chart(issuesCtx, {
  type: "bar",
  data: {
    labels: [
      "Late Blight",
      "Fall Armyworm",
      "Rust",
      "Aphids",
      "Powdery Mildew",
      "Other",
    ],
    datasets: [
      {
        label: "Report Count",
        data: [32, 28, 19, 15, 12, 21],
        backgroundColor: "#2e7d32",
        borderWidth: 1,
        thickness: 2,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Disease Trends Chart
const trendsCtx = document
  .getElementById("diseaseTrendsChart")
  .getContext("2d");
const trendsChart = new Chart(trendsCtx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Tomato Late Blight",
        data: [5, 8, 12, 15, 18, 22, 25],
        borderColor: "#dc3545",
        backgroundColor: "rgba(220, 53, 69, 0.1)",
        fill: true,
      },
      {
        label: "Maize Rust",
        data: [3, 5, 8, 10, 7, 5, 4],
        borderColor: "#fd7e14",
        backgroundColor: "rgba(253, 126, 20, 0.1)",
        fill: true,
      },
      {
        label: "Coffee Berry Disease",
        data: [2, 3, 4, 6, 8, 10, 12],
        borderColor: "#6f42c1",
        backgroundColor: "rgba(111, 66, 193, 0.1)",
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Reported Cases",
        },
      },
    },
  },
});

// Symptom Checker Wizard
document.addEventListener("DOMContentLoaded", function () {
  let currentStep = 1;
  const totalSteps = 3;

  document.getElementById("nextBtn").addEventListener("click", function () {
    if (currentStep < totalSteps) {
      document.getElementById(`step${currentStep}`).style.display = "none";
      currentStep++;
      document.getElementById(`step${currentStep}`).style.display = "block";

      if (currentStep > 1) {
        document.getElementById("prevBtn").style.display = "block";
      }

      if (currentStep === totalSteps) {
        this.innerHTML = '<i class="fas fa-search me-1"></i> Diagnose';
      }
    } else {
      // Submit diagnosis
      $("#symptomCheckerModal").modal("hide");
      // Process diagnosis here
    }
  });

  document.getElementById("prevBtn").addEventListener("click", function () {
    if (currentStep > 1) {
      document.getElementById(`step${currentStep}`).style.display = "none";
      currentStep--;
      document.getElementById(`step${currentStep}`).style.display = "block";

      if (currentStep === 1) {
        this.style.display = "none";
      }

      document.getElementById("nextBtn").innerHTML =
        'Next <i class="fas fa-arrow-right ms-1"></i>';
    }
  });
});

// Dark Mode Toggle
document.addEventListener("DOMContentLoaded", function () {
  const themeSwitch = document.getElementById("themeSwitch");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Check for saved theme preference or use the system preference
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark" || (!currentTheme && prefersDarkScheme.matches)) {
    document.body.classList.add("dark-mode");
    themeSwitch.checked = true;
  }

  // Theme switcher
  themeSwitch.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  });

  // Listen for system theme changes
  prefersDarkScheme.addListener((e) => {
    if (!localStorage.getItem("theme")) {
      if (e.matches) {
        document.body.classList.add("dark-mode");
        themeSwitch.checked = true;
      } else {
        document.body.classList.remove("dark-mode");
        themeSwitch.checked = false;
      }
    }
  });
});
