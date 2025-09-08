// Category Selection Handler
document.addEventListener('DOMContentLoaded', function() {
    const healthyCropsBtn = document.getElementById('healthyCrops');
    const diseasedCropsBtn = document.getElementById('diseasedCrops');
    const modal = document.getElementById('categorySelectionModal');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const diseasedSection = document.querySelector('.diseasedCrops');
    const healthySection = document.querySelector('.healthyCrops');
    
    // Handle healthy crops selection
    healthyCropsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        enableHealthyCrops();
        hideModal();
    });
    
    // Handle diseased crops selection
    diseasedCropsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        enableDiseasedCrops();
        hideModal();
    });
    
    function enableHealthyCrops() {
        // Enable healthy crops section only
        healthySection.style.display = 'block';
        diseasedSection.style.display = 'none';
        document.getElementById('characteristicsSection').style.display = 'block';
    }
    
    function enableDiseasedCrops() {
        // Enable diseased crops section only
        diseasedSection.style.display = 'block';
        healthySection.style.display = 'none';
        document.getElementById('characteristicsSection').style.display = 'none';
    }
    
    function hideModal() {
        modal.style.display = 'none';
        modalBackdrop.style.display = 'none';
    }
});