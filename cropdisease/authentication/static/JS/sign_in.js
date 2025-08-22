document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.querySelector("#togglePassword");
  const password = document.querySelector("#password");

  togglePassword.addEventListener("click", function () {
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // Use the data attributes
    this.src =
      type === "password"
        ? this.dataset.visibilityOff
        : this.dataset.visibilityOn;
  });
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const signInBtn = document.getElementById("signInBtn");
  const signInIcon = document.getElementById("signInIcon");
  const signInText = document.getElementById("signInText");

  signInBtn.disabled = true;

  signInIcon.style.display = "none";
  signInText.textContent = "Signing in...";

  setTimeout(function () {
    signInIcon.style.display = "inline-block";
    signInText.textContent = "Sign In";
    signInBtn.disabled = false;
  }, 2000);
});
