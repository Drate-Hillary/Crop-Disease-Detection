document.addEventListener('DOMContentLoaded', function () {
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');
    const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');
    const confirmPassword = document.querySelector('#confirmPassword');

    function setupPasswordToggle(toggleElement, passwordElement) {
        toggleElement.addEventListener('click', function () {
            const type = passwordElement.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordElement.setAttribute('type', type);

            this.src = type === 'password' 
                ? this.dataset.visibilityOff 
                : this.dataset.visibilityOn;
        });
    }

    setupPasswordToggle(togglePassword, password);
    setupPasswordToggle(toggleConfirmPassword, confirmPassword);
});