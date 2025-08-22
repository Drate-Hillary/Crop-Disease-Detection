// Script for API key copy functionality
document.getElementById("copyApiKey").addEventListener("click", function () {
  const apiKeyInput = document.querySelector(
    'input[value="sk_live_xyz123..."]'
  );
  apiKeyInput.select();
  document.execCommand("copy");

  // Show tooltip feedback
  const tooltip = new bootstrap.Tooltip(this, {
    title: "Copied!",
    trigger: "manual",
  });
  tooltip.show();

  setTimeout(() => {
    tooltip.hide();
  }, 1000);
});

// Simple script to handle tab persistence and sidebar toggle
document.addEventListener("DOMContentLoaded", function () {
  // Enable Bootstrap tooltips
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Tab persistence
  if (location.hash) {
    const tab = new bootstrap.Tab(
      document.querySelector(`a[href="${location.hash}"]`)
    );
    tab.show();
  }

  const navLinks = document.querySelectorAll('.nav-link[data-bs-toggle="tab"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const tab = new bootstrap.Tab(this);
      tab.show();
      history.pushState(null, null, this.href);
    });
  });

  // Sidebar toggle
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const overlay = document.getElementById("sidebarOverlay");

  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("show");
    overlay.classList.toggle("show");
    mainContent.classList.toggle("expanded");
  });

  overlay.addEventListener("click", function () {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
    mainContent.classList.remove("expanded");
  });

  // Close sidebar on tab click in mobile
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 992) {
        sidebar.classList.remove("show");
        overlay.classList.remove("show");
        mainContent.classList.remove("expanded");
      }
    });
  });

  // Initialize Usage Trends Chart
  const usageCtx = document.getElementById("usageChart").getContext("2d");
  let usageChart = new Chart(usageCtx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Usage",
          data: [65, 59, 80, 81, 56, 55, 40],
          borderColor: "rgba(75, 192, 192, 0.8)",
          backgroundColor: "rgba(75, 192, 192, 0.1)",
          fill: true,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Function to update chart (example data for different periods)
  window.updateChart = function (period) {
    let labels, data;
    switch (period) {
      case "day":
        labels = [
          "00:00",
          "02:00",
          "04:00",
          "06:00",
          "08:00",
          "10:00",
          "12:00",
          "14:00",
          "16:00",
          "18:00",
          "20:00",
          "22:00",
        ];
        data = [10, 20, 30, 40, 30, 20, 12, 18, 26, 36, 24, 16];
        break;
      case "week":
        labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        data = [65, 59, 80, 81, 56, 55, 40];
        break;
      case "month":
        labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
        data = [200, 250, 300, 280];
        break;
      case "year":
        labels = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        data = [400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950];
        break;
    }
    usageChart.data.labels = labels;
    usageChart.data.datasets[0].data = data;
    usageChart.update();

    // Update active button
    const buttons = document.querySelectorAll(".btn-group button");
    buttons.forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");
  };

  // Initialize Disease Distribution Map
  const map = L.map("diseaseMap").setView([0, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Example markers for wheat diseases
  let markers = [];
  function addMarkers(crop) {
    // Clear existing markers
    markers.forEach((marker) => map.removeLayer(marker));
    markers = [];

    // Example data
    let locations = [];
    if (crop === "wheat") {
      locations = [
        { lat: 39.8283, lng: -98.5795, popup: "Wheat Rust - High Incidence" },
        { lat: 51.5074, lng: -0.1278, popup: "Stem Rust - Medium" },
        { lat: 35.6762, lng: 139.6503, popup: "Leaf Rust - Low" },
      ];
    } else if (crop === "tomatoes") {
      locations = [
        { lat: 40.7128, lng: -74.006, popup: "Tomato Blight - High" },
        { lat: 48.8566, lng: 2.3522, popup: "Late Blight - Medium" },
      ];
    } else if (crop === "maize") {
      locations = [
        { lat: 41.8781, lng: -87.6298, popup: "Maize Streak Virus - High" },
        { lat: -33.8688, lng: 151.2093, popup: "Corn Smut - Low" },
      ];
    } else if (crop === "potatoes") {
      locations = [
        { lat: 53.3498, lng: -6.2603, popup: "Potato Late Blight - High" },
        { lat: -12.0464, lng: -77.0428, popup: "Potato Virus Y - Medium" },
      ];
    }

    locations.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng])
        .addTo(map)
        .bindPopup(loc.popup);
      markers.push(marker);
    });
  }

  // Initial load for wheat
  addMarkers("wheat");

  // Function to update map
  window.updateMap = function (crop) {
    addMarkers(crop);

    // Update active button
    const buttons = document.querySelectorAll(".btn-group button");
    buttons.forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");
  };

  // Theme switching code
  (() => {
    "use strict";

    const getStoredTheme = () => localStorage.getItem("theme");
    const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

    const getPreferredTheme = () => {
      const storedTheme = getStoredTheme();
      if (storedTheme) {
        return storedTheme;
      }

      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    };

    const setTheme = (theme) => {
      let effectiveTheme = theme;
      if (theme === "system") {
        effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
      }
      document.body.setAttribute("data-bs-theme", effectiveTheme);
    };

    setTheme(getStoredTheme() || "system");

    const showActiveTheme = (theme) => {
      const themeOptions = document.querySelectorAll(".theme-option");
      themeOptions.forEach((element) => {
        element.classList.remove("active");
      });

      const activeBtn = document.querySelector(`[data-theme="${theme}"]`);
      if (activeBtn) {
        activeBtn.classList.add("active");
      }

      // Update dropdown icon based on effective theme
      const themeIcon = document.querySelector("#themeDropdown i");
      const effectiveTheme = document.body.getAttribute("data-bs-theme");
      themeIcon.className = `fas ${
        effectiveTheme === "dark" ? "fa-moon" : "fa-sun"
      }`;
    };

    showActiveTheme(getStoredTheme() || "system");

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        const storedTheme = getStoredTheme();
        if (storedTheme === "system" || !storedTheme) {
          setTheme("system");
          showActiveTheme("system");
        }
      });

    const themeToggles = document.querySelectorAll(".theme-option");
    themeToggles.forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        const theme = toggle.getAttribute("data-theme");
        setStoredTheme(theme);
        setTheme(theme);
        showActiveTheme(theme);
      });
    });
  })();
});

// Initialize Model Performance Chart
document.addEventListener("DOMContentLoaded", function () {
  const modelPerfCtx = document
    .getElementById("modelPerformanceChart")
    .getContext("2d");
  const modelPerfChart = new Chart(modelPerfCtx, {
    type: "doughnut",
    data: {
      labels: ["Tomato", "Wheat", "Maize", "Potato", "Rice"],
      datasets: [
        {
          label: "Accuracy",
          data: [94, 89, 87, 85, 76],
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label + ": " + context.raw + "%";
            },
          },
        },
      },
    },
  });

  // Function to update performance chart
  window.updatePerformanceChart = function (metric) {
    let data;
    switch (metric) {
      case "accuracy":
        data = [94, 89, 87, 85, 76];
        break;
      case "precision":
        data = [92, 87, 85, 83, 74];
        break;
      case "recall":
        data = [93, 88, 86, 84, 75];
        break;
      case "f1":
        data = [93, 87, 85, 83, 74];
        break;
    }
    modelPerfChart.data.datasets[0].data = data;
    modelPerfChart.data.datasets[0].label =
      metric.charAt(0).toUpperCase() + metric.slice(1);
    modelPerfChart.update();
  };

  // Initialize Confusion Matrix Chart
  const confusionMatrixCtx = document
    .getElementById("confusionMatrixChart")
    .getContext("2d");
  const confusionMatrixChart = new Chart(confusionMatrixCtx, {
    type: "heatmap",
    data: {
      labels: {
        x: [
          "Late Blight",
          "Early Blight",
          "Leaf Mold",
          "Septoria",
          "Spider Mites",
          "Target Spot",
          "Yellow Leaf Curl",
          "Bacterial Spot",
        ],
        y: [
          "Late Blight",
          "Early Blight",
          "Leaf Mold",
          "Septoria",
          "Spider Mites",
          "Target Spot",
          "Yellow Leaf Curl",
          "Bacterial Spot",
        ],
      },
      datasets: [
        {
          label: "Confusion Matrix",
          data: [
            { x: 0, y: 0, v: 120 },
            { x: 0, y: 1, v: 5 },
            { x: 0, y: 2, v: 2 },
            { x: 0, y: 3, v: 1 },
            { x: 0, y: 4, v: 0 },
            { x: 0, y: 5, v: 1 },
            { x: 0, y: 6, v: 0 },
            { x: 0, y: 7, v: 1 },
            { x: 1, y: 0, v: 4 },
            { x: 1, y: 1, v: 115 },
            { x: 1, y: 2, v: 3 },
            { x: 1, y: 3, v: 2 },
            { x: 1, y: 4, v: 1 },
            { x: 1, y: 5, v: 0 },
            { x: 1, y: 6, v: 1 },
            { x: 1, y: 7, v: 0 },
            { x: 2, y: 0, v: 2 },
            { x: 2, y: 1, v: 3 },
            { x: 2, y: 2, v: 110 },
            { x: 2, y: 3, v: 4 },
            { x: 2, y: 4, v: 2 },
            { x: 2, y: 5, v: 1 },
            { x: 2, y: 6, v: 0 },
            { x: 2, y: 7, v: 1 },
            { x: 3, y: 0, v: 1 },
            { x: 3, y: 1, v: 2 },
            { x: 3, y: 2, v: 3 },
            { x: 3, y: 3, v: 105 },
            { x: 3, y: 4, v: 2 },
            { x: 3, y: 5, v: 1 },
            { x: 3, y: 6, v: 1 },
            { x: 3, y: 7, v: 2 },
            { x: 4, y: 0, v: 0 },
            { x: 4, y: 1, v: 1 },
            { x: 4, y: 2, v: 2 },
            { x: 4, y: 3, v: 2 },
            { x: 4, y: 4, v: 100 },
            { x: 4, y: 5, v: 3 },
            { x: 4, y: 6, v: 1 },
            { x: 4, y: 7, v: 0 },
            { x: 5, y: 0, v: 1 },
            { x: 5, y: 1, v: 0 },
            { x: 5, y: 2, v: 1 },
            { x: 5, y: 3, v: 1 },
            { x: 5, y: 4, v: 2 },
            { x: 5, y: 5, v: 95 },
            { x: 5, y: 6, v: 2 },
            { x: 5, y: 7, v: 1 },
            { x: 6, y: 0, v: 0 },
            { x: 6, y: 1, v: 1 },
            { x: 6, y: 2, v: 0 },
            { x: 6, y: 3, v: 1 },
            { x: 6, y: 4, v: 1 },
            { x: 6, y: 5, v: 2 },
            { x: 6, y: 6, v: 90 },
            { x: 6, y: 7, v: 3 },
            { x: 7, y: 0, v: 1 },
            { x: 7, y: 1, v: 0 },
            { x: 7, y: 2, v: 1 },
            { x: 7, y: 3, v: 2 },
            { x: 7, y: 4, v: 0 },
            { x: 7, y: 5, v: 1 },
            { x: 7, y: 6, v: 2 },
            { x: 7, y: 7, v: 85 },
          ],
          backgroundColor: (ctx) => {
            const value = ctx.dataset.data[ctx.dataIndex].v;
            return value > 100
              ? "rgba(30, 114, 15, 0.9)"
              : value > 50
              ? "rgba(30, 114, 15, 0.7)"
              : value > 10
              ? "rgba(30, 114, 15, 0.5)"
              : value > 0
              ? "rgba(30, 114, 15, 0.3)"
              : "rgba(200, 200, 200, 0.1)";
          },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Predicted",
          },
        },
        y: {
          title: {
            display: true,
            text: "Actual",
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `Count: ${context.raw.v}`;
            },
          },
        },
      },
    },
  });

  // Initialize Training History Chart
  const trainingHistoryCtx = document
    .getElementById("trainingHistoryChart")
    .getContext("2d");
  const trainingHistoryChart = new Chart(trainingHistoryCtx, {
    type: "line",
    data: {
      labels: Array.from({ length: 50 }, (_, i) => `Epoch ${i + 1}`),
      datasets: [
        {
          label: "Training Accuracy",
          data: Array.from({ length: 50 }, (_, i) =>
            Math.min(94, 50 + i * 0.88)
          ),
          borderColor: "rgba(30, 114, 15, 1)",
          backgroundColor: "rgba(30, 114, 15, 0.2)",
          fill: true,
        },
        {
          label: "Validation Accuracy",
          data: Array.from({ length: 50 }, (_, i) =>
            Math.min(92, 48 + i * 0.88)
          ),
          borderColor: "rgba(0, 123, 255, 1)",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          fill: true,
        },
        {
          label: "Training Loss",
          data: Array.from({ length: 50 }, (_, i) =>
            Math.max(0.1, 2.0 - i * 0.038)
          ),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
        {
          label: "Validation Loss",
          data: Array.from({ length: 50 }, (_, i) =>
            Math.max(0.15, 2.2 - i * 0.041)
          ),
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Value",
          },
        },
        x: {
          title: {
            display: true,
            text: "Epoch",
          },
        },
      },
    },
  });
});
