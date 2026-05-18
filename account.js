function getAccount() {
  return JSON.parse(localStorage.getItem("quackuaniAccount"));
}

function saveAccount(account) {
  localStorage.setItem("quackuaniAccount", JSON.stringify(account));
}

function showAccountToast(message) {
  const toast = document.getElementById("accountToast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function isStrongPassword(password) {
  return (
    password.length > 0 &&
    password.length <= 15 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function changeUsername() {
  const account = getAccount();
  const newUsername = document.getElementById("newUsername").value.trim();

  if (!account) {
    showAccountToast("Please login first.");
    return;
  }

  if (!newUsername) {
    showAccountToast("Please enter a new username.");
    return;
  }

  account.username = newUsername;
  saveAccount(account);

  document.getElementById("newUsername").value = "";
  showAccountToast("Username updated!");
}

function changePassword() {
  const account = getAccount();
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;

  if (!account) {
    showAccountToast("Please login first.");
    return;
  }

  if (!currentPassword || !newPassword) {
    showAccountToast("Please fill out all password fields.");
    return;
  }

  if (currentPassword !== account.password) {
    showAccountToast("Current password is incorrect.");
    return;
  }

  if (!isStrongPassword(newPassword)) {
    showAccountToast("New password must be strong and max 15 characters.");
    return;
  }

  account.password = newPassword;
  saveAccount(account);

  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";

  showAccountToast("Password updated!");
}

function logoutAccount() {
  localStorage.removeItem("quackuaniLoggedIn");

  showAccountToast("Logged out successfully!");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 2500);
}