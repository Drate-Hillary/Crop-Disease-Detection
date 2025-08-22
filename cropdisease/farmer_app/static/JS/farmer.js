// JavaScript for Farmer App Sidebar Navigation
document.addEventListener("DOMContentLoaded", function () {
  const sidebarLinks = document.querySelectorAll(
    ".sidebar .nav-link[data-section]"
  );
  const sections = [
    document.getElementById("dashboard-section"),
    document.getElementById("upload-diagnosis-section"),
    document.getElementById("farm-registration-section"),
    document.getElementById("history-section"),
    document.getElementById("disease-library-section"),
  ];

  function hideAllSections() {
    sections.forEach((section) => {
      if (section) section.style.display = "none";
    });
  }

  hideAllSections();
  if (sections[0]) sections[0].style.display = "";

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const sectionId = this.getAttribute("data-section") + "-section";
      hideAllSections();
      const target = document.getElementById(sectionId);
      if (target) target.style.display = "";
      sidebarLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });
});


// JavaScript for Image Upload and Crop Selection
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewSection = document.getElementById('previewSection');
    const imagePreview = document.getElementById('imagePreview');
    const changeImageBtn = document.getElementById('changeImageBtn');
    const confirmImageBtn = document.getElementById('confirmImageBtn');
    const cropSelectionSection = document.getElementById('cropSelectionSection');
    const backToUploadBtn = document.getElementById('backToUploadBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');

    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            // Validate file type and size
            if (file.type.startsWith('image/')) {
                if (file.size <= 5 * 1024 * 1024) { // 5MB limit
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imagePreview.src = e.target.result;
                        uploadArea.style.display = 'none';
                        previewSection.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('File size exceeds 5MB limit.');
                }
            } else {
                alert('Please upload a valid image file (JPG, PNG).');
            }
        }
    }

    changeImageBtn.addEventListener('click', function() {
        previewSection.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = ''; // Reset file input
    });

    confirmImageBtn.addEventListener('click', function() {
        previewSection.style.display = 'none';
        cropSelectionSection.style.display = 'block';
        updateStepIndicator(2);
    });

    backToUploadBtn.addEventListener('click', function() {
        cropSelectionSection.style.display = 'none';
        previewSection.style.display = 'block';
        updateStepIndicator(1);
    });

    analyzeBtn.addEventListener('click', function() {
        updateStepIndicator(3);
    });

    function updateStepIndicator(activeStep) {
        const steps = document.querySelectorAll('.step-indicator .step');
        steps.forEach((step, index) => {
            if (index + 1 === activeStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const form = document.getElementById('farmRegistrationForm');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const formSections = Array.from(document.querySelectorAll('.form-section'));
    const steps = document.querySelectorAll('.step-indicator .step');
    const useCurrentLocationBtn = document.getElementById('useCurrentLocation');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const locationFeedback = document.getElementById('locationFeedback');

    // Review fields
    const reviewFields = {
        farmName: document.getElementById('review-farmName'),
        farmType: document.getElementById('review-farmType'),
        ownershipType: document.getElementById('review-ownershipType'),
        establishedDate: document.getElementById('review-establishedDate'),
        farmSize: document.getElementById('review-farmSize'),
        primaryCrop: document.getElementById('review-primaryCrop'),
        farmingMethod: document.getElementById('review-farmingMethod'),
        irrigationMethod: document.getElementById('review-irrigationMethod'),
        farmDescription: document.getElementById('review-farmDescription'),
        country: document.getElementById('review-country'),
        state: document.getElementById('review-state'),
        city: document.getElementById('review-city'),
        zipCode: document.getElementById('review-zipCode'),
        address: document.getElementById('review-address'),
        coordinates: document.getElementById('review-coordinates')
    };

    // Initialize Leaflet map
    let map, marker;
    function initializeMap() {
        map = L.map('map').setView([0, 0], 2); // Default view (world map)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add click event to place marker
        map.on('click', function(e) {
            const { lat, lng } = e.latlng;
            updateMarker(lat, lng);
        });
    }

    // Update marker and form inputs
    function updateMarker(lat, lng) {
        if (marker) {
            marker.setLatLng([lat, lng]);
        } else {
            marker = L.marker([lat, lng]).addTo(map);
        }
        map.setView([lat, lng], 15); // Zoom to marker
        latitudeInput.value = lat.toFixed(6);
        longitudeInput.value = lng.toFixed(6);
        locationFeedback.textContent = `Selected: Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}`;
    }

    // Use Current Location button
    useCurrentLocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    updateMarker(latitude, longitude);
                },
                error => {
                    console.error('Geolocation error:', error);
                    locationFeedback.textContent = 'Unable to access location. Please click on the map to select a location.';
                }
            );
        } else {
            locationFeedback.textContent = 'Geolocation is not supported by this browser.';
        }
    });

    // Next button event listeners
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const nextStep = this.getAttribute('data-next');
            const currentSection = formSections.find(section => section.style.display === 'block');

            if (!currentSection) {
                console.error('No visible section found');
                return;
            }

            if (validateCurrentStep(currentSection)) {
                showSection(nextStep);
                updateStepIndicator(nextStep);
                if (nextStep === 'step2' && !map) {
                    initializeMap(); // Initialize map when step 2 is shown
                }
                if (nextStep === 'step4') {
                    populateReview();
                }
            } else {
                console.log('Validation failed for current step');
            }
        });
    });

    // Previous button event listeners
    prevButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const prevStep = this.getAttribute('data-prev');
            showSection(prevStep);
            updateStepIndicator(prevStep);
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const currentSection = formSections.find(section => section.style.display === 'block');
        if (validateCurrentStep(currentSection) && document.getElementById('termsAgreement').checked) {
            alert('Farm registration submitted successfully!');
            form.reset();
            showSection('step1');
            updateStepIndicator('step1');
            if (marker) {
                map.removeLayer(marker);
                marker = null;
                latitudeInput.value = '';
                longitudeInput.value = '';
                locationFeedback.textContent = '';
            }
        } else {
            alert('Please complete all required fields and agree to the terms.');
        }
    });

    // Show specific form section
    function showSection(sectionId) {
        formSections.forEach(section => {
            section.style.display = section.id === sectionId ? 'block' : 'none';
        });
    }

    // Update step indicator
    function updateStepIndicator(activeStep) {
        steps.forEach(step => {
            step.classList.remove('active');
            if (step.querySelector('.step-circle').textContent === activeStep.replace('step', '')) {
                step.classList.add('active');
            }
        });
    }

    // Validate current step
    function validateCurrentStep(currentSection) {
        if (!currentSection) return false;

        const requiredFields = currentSection.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
                let feedback = field.nextElementSibling;
                if (!feedback || !feedback.classList.contains('invalid-feedback')) {
                    feedback = document.createElement('div');
                    feedback.className = 'invalid-feedback';
                    feedback.textContent = 'This field is required.';
                    field.parentNode.appendChild(feedback);
                }
            } else {
                field.classList.remove('is-invalid');
                const feedback = field.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.remove();
                }
            }
        });

        return isValid;
    }

    // Populate review section
    function populateReview() {
        const farmSize = document.getElementById('farmSize').value;
        const sizeUnit = document.getElementById('sizeUnit').value;
        const latitude = latitudeInput.value;
        const longitude = longitudeInput.value;

        reviewFields.farmName.textContent = document.getElementById('farmName').value || '-';
        reviewFields.farmType.textContent = document.getElementById('farmType').value || '-';
        reviewFields.ownershipType.textContent = document.getElementById('ownershipType').value || '-';
        reviewFields.establishedDate.textContent = document.getElementById('establishedDate').value || '-';
        reviewFields.farmSize.textContent = farmSize ? `${farmSize} ${sizeUnit}` : '-';
        reviewFields.primaryCrop.textContent = document.getElementById('primaryCrop').value || '-';
        reviewFields.farmingMethod.textContent = document.getElementById('farmingMethod').value || '-';
        reviewFields.irrigationMethod.textContent = document.getElementById('irrigationMethod').value || '-';
        reviewFields.farmDescription.textContent = document.getElementById('farmDescription').value || '-';
        reviewFields.country.textContent = document.getElementById('country').value || '-';
        reviewFields.state.textContent = document.getElementById('state').value || '-';
        reviewFields.city.textContent = document.getElementById('city').value || '-';
        reviewFields.zipCode.textContent = document.getElementById('zipCode').value || '-';
        reviewFields.address.textContent = document.getElementById('address').value || '-';
        reviewFields.coordinates.textContent = latitude && longitude ? `Lat ${latitude}, Lng ${longitude}` : '-';
    }

    // Additional crop selection (pill buttons)
    const cropButtons = document.querySelectorAll('.crop-selection-pill');
    cropButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            this.classList.toggle('btn-outline-secondary');
            this.classList.toggle('btn-primary');
        });
    });

    // Initialize by showing the first step
    showSection('step1');
    updateStepIndicator('step1');
});


// JavaScript for Toggle Details in Disease Cards
document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.toggle-details');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const details = this.closest('.card-body').querySelector('.disease-details');

            if (details.style.display === 'none' || details.style.display === '') {
                details.style.display = 'block';
                this.innerHTML = '<i class="bi bi-chevron-up"></i> Hide Details';
            } else {
                details.style.display = 'none';
                this.innerHTML = '<i class="bi bi-chevron-down"></i> Details';
            }
        });
    });
});
