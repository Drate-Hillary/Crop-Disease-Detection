document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.querySelector("#togglePassword");
  const password = document.querySelector("#password");

  // Toggle password visibility
  if (togglePassword && password) {
    togglePassword.addEventListener("click", function () {
      const type = password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);

      this.src = type === "password" 
        ? this.dataset.visibilityOff 
        : this.dataset.visibilityOn;
    });
  }

  // Form submission handler
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const signInBtn = document.getElementById("signInBtn");
      const signInIcon = document.getElementById("signInIcon");
      const signInText = document.getElementById("signInText");

      // Show loading state
      signInBtn.disabled = true;
      if (signInIcon) signInIcon.style.display = "none";
      if (signInText) signInText.textContent = "Signing in...";

      // Validate form first
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (!email || !password) {
        // Show error and reset button
        alert("Please fill in all fields");
        resetButtonState(signInBtn, signInIcon, signInText);
        return;
      }

      // Submit the form after a brief delay for UX
      setTimeout(function () {
        loginForm.submit(); // This actually submits the form
      }, 1000);
    });
  }

  // Function to reset button state
  function resetButtonState(btn, icon, text) {
    btn.disabled = false;
    if (icon) icon.style.display = "inline-block";
    if (text) text.textContent = "Sign In";
  }
});