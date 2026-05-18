const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const loginIdentity = document.getElementById("loginIdentity");
const loginPassword = document.getElementById("loginPassword");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const signupUsername = document.getElementById("signupUsername");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");

const loginEmailHint = document.getElementById("loginEmailHint");
const signupEmailHint = document.getElementById("signupEmailHint");

function clearFields() {
  document.querySelectorAll("input").forEach(input => input.value = "");
  document.querySelectorAll(".hint").forEach(hint => hint.classList.remove("show"));
}

function showForm(type) {
  clearFields();

  loginForm.classList.remove("active");
  signupForm.classList.remove("active");

  if (type === "login") {
    loginForm.classList.add("active");
  } else {
    signupForm.classList.add("active");
  }
}

function showToast(title, message, icon = "♡") {
  const toast = document.getElementById("toast");
  const toastTitle = document.getElementById("toastTitle");
  const toastMessage = document.getElementById("toastMessage");
  const toastIcon = document.getElementById("toastIcon");

  toastTitle.textContent = title;
  toastMessage.textContent = message;
  toastIcon.textContent = icon;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function isValidEmail(email) {
  return /^[^\s@]+@gmail\.com$/i.test(email);
}

function isStrongPassword(password) {
  const hasCapital = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  return (
    password.length > 0 &&
    password.length <= 15 &&
    hasCapital &&
    hasNumber &&
    hasSymbol
  );
}

function getAccounts() {
  return JSON.parse(localStorage.getItem("quackuaniAccounts")) || {};
}

function saveAccounts(accounts) {
  localStorage.setItem("quackuaniAccounts", JSON.stringify(accounts));
}

function createAccount() {
  const account = {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    username: signupUsername.value.trim(),
    email: signupEmail.value.trim().toLowerCase(),
    password: signupPassword.value
  };

  if (
    !account.firstName ||
    !account.lastName ||
    !account.username ||
    !account.email ||
    !account.password
  ) {
    showToast("Missing fields!", "Please fill out all fields before creating an account.", "!");
    return;
  }

  if (!isValidEmail(account.email)) {
    showToast("Invalid email!", "Email must be a valid @gmail.com address.", "✦");
    return;
  }

  if (!isStrongPassword(account.password)) {
    showToast(
      "Weak password!",
      "Password must include a capital letter, number, and symbol. Max 15 characters.",
      "!"
    );
    return;
  }

  const accounts = getAccounts();

  if (accounts[account.username]) {
    showToast("Username taken!", "Please choose another username.", "!");
    return;
  }

  const emailAlreadyUsed = Object.values(accounts).some(
    savedAccount => savedAccount.email === account.email
  );

  if (emailAlreadyUsed) {
    showToast("Email already used!", "Please use a different Gmail account.", "!");
    return;
  }

  accounts[account.username] = account;
  saveAccounts(accounts);

  localStorage.setItem(`favorites_${account.username}`, JSON.stringify([]));

  showToast("Account created!", "You can now sign in using your email or username.", "♡");

  setTimeout(() => {
    showForm("login");
  }, 1200);
}

function loginUser() {
  const identity = loginIdentity.value.trim();
  const password = loginPassword.value;

  if (!identity || !password) {
    showToast("Missing fields!", "Please enter your email or username and password.", "!");
    return;
  }

  const accounts = getAccounts();
  let account = null;

  if (identity.includes("@")) {
    if (!isValidEmail(identity)) {
      showToast("Invalid email!", "Please enter a valid @gmail.com email.", "✦");
      return;
    }

    account = Object.values(accounts).find(
      savedAccount => savedAccount.email === identity.toLowerCase()
    );
  } else {
    account = accounts[identity];
  }

  if (!account) {
    showToast("No account found!", "Please create an account first before signing in.", "♡");
    return;
  }

  if (password !== account.password) {
    showToast("Wrong password!", "Please check your password and try again.", "!");
    return;
  }

  localStorage.setItem("currentUser", account.username);
  localStorage.setItem("quackuaniLoggedIn", "true");

  showToast("Welcome back!", "Redirecting you to QuackuAni home.", "♡");

  setTimeout(() => {
    window.location.href = "home.html";
  }, 3000);
}

signupEmail.addEventListener("input", () => {
  if (signupEmail.value.trim() !== "" && !isValidEmail(signupEmail.value.trim())) {
    signupEmailHint.classList.add("show");
  } else {
    signupEmailHint.classList.remove("show");
  }
});

loginIdentity.addEventListener("input", () => {
  const value = loginIdentity.value.trim();

  if (value.includes("@") && !isValidEmail(value)) {
    loginEmailHint.classList.add("show");
  } else {
    loginEmailHint.classList.remove("show");
  }
});