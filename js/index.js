const login_form = document.getElementById("login-form");
const createAnAccount_form = document.getElementById("create-account-form");
const createAccountModal_div = new bootstrap.Modal("#createAccountModal");
const keepConnected_checkboxInput = document.getElementById("keepConnected");
const togglePassword_span = document.querySelector("#toggle-password");
const password = document.querySelector("#login-password");

function getAccount(login) {
  const accountData = localStorage.getItem(login);
  return accountData ? JSON.parse(accountData) : null;
}

function saveAccount(data) {
  localStorage.setItem(data.login, JSON.stringify(data));
}

function submitForm(isLogin) {
  const email_input = document.getElementById(
    isLogin ? "login-email" : "create-account-email"
  ).value;
  const password_input = document.getElementById(
    isLogin ? "login-password" : "create-account-password"
  ).value;
  const session = keepConnected_checkboxInput.checked;

  if (isLogin) {
    const account = getAccount(email_input);

    if (!account) {
      alert(
        "Incorrect email or password. Please try again. Or create a new account."
      );
      return;
    }

    if (account.password !== password_input) {
      alert("Incorrect email or password. Please try again.");
      return;
    }

    if (session) {
      localStorage.setItem("session", email_input);
    }
    sessionStorage.setItem("logged", email_input);
    window.location.href = "home.html";
    return;
  }

  //--- Create Account Logic ---
  if (getAccount(email_input)) {
    alert(
      "An account with this email already exists. Please log in or choose a different email."
    );
    return;
  }

  if (email_input.length < 3 || email_input.indexOf("@") === -1) {
    alert(
      'Please enter a valid email address. With at least 4 characters including "@" symbol.'
    );
    return;
  }
  const confirmPassword_input = document.getElementById(
    "create-account-confirm-password"
  ).value;

  if (password_input.length < 4) {
    alert("Please enter a password at least 4 characters long.");
    return;
  }

  if (password_input !== confirmPassword_input) {
    alert("Passwords do not match. Please try again.");
    return;
  }
  saveAccount({
    login: email_input,
    password: password_input,
    transactions: [],
  });
  alert("Account created successfully!");
  createAccountModal_div.hide();
}

addEventListener("DOMContentLoaded", (event) => {
  const session = localStorage.getItem("session");

  if (session) {
    if (getAccount(session)) {
      window.location.href = "home.html";
    }
  }

  login_form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Login form submitted");
    submitForm(true);
  });

  createAnAccount_form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Create An Account form submitted");
    submitForm(false);
  });

  togglePassword_span.addEventListener("click", function () {
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    const icon = this.querySelector("i");
    if (type === "password") {
      icon.classList.replace("bi-eye", "bi-eye-slash");
    } else {
      icon.classList.replace("bi-eye-slash", "bi-eye");
    }
  });

  const toggleCreatePassword_span = document.querySelector(
    "#toggle-create-password"
  );
  const createPassword = document.querySelector("#create-account-password");

  toggleCreatePassword_span.addEventListener("click", function () {
    const type =
      createPassword.getAttribute("type") === "password" ? "text" : "password";
    createPassword.setAttribute("type", type);

    const icon = this.querySelector("i");
    if (type === "password") {
      icon.classList.replace("bi-eye", "bi-eye-slash");
    } else {
      icon.classList.replace("bi-eye-slash", "bi-eye");
    }
  });

  const toggleCreateConfirmPassword_span = document.querySelector(
    "#toggle-create-confirm-password"
  );
  const createConfirmPassword = document.querySelector(
    "#create-account-confirm-password"
  );

  toggleCreateConfirmPassword_span.addEventListener("click", function () {
    const type =
      createConfirmPassword.getAttribute("type") === "password"
        ? "text"
        : "password";
    createConfirmPassword.setAttribute("type", type);

    const icon = this.querySelector("i");
    if (type === "password") {
      icon.classList.replace("bi-eye", "bi-eye-slash");
    } else {
      icon.classList.replace("bi-eye-slash", "bi-eye");
    }
  });
});
