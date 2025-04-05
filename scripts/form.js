const username = document.getElementById("username");
const usernameHint = document.getElementById("usernameHint");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const email = document.getElementById("email");
const confirmEmail = document.getElementById("confirmEmail");
const phone = document.getElementById("phone");
const zip = document.getElementById("zipCode");
const submitBtn = document.getElementById("submitBtn");

const length = document.getElementById("length");
const upper = document.getElementById("upper");
const lower = document.getElementById("lower");
const number = document.getElementById("number");
const symbol = document.getElementById("symbol");
const strengthBar = document.getElementById("strengthBar");

const iti = window.intlTelInput(phone, {
    initialCountry: "us",
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
});

document.getElementById('darkToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    field.type = field.type === "password" ? "text" : "password";
}

function debounce(func, delay = 300) {
    let timer;
    return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
    };
}

function updatePasswordRules(pw) {
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSymbol = /[@$!%*?&]/.test(pw);
    const hasLength = pw.length >= 8 && pw.length <= 64;

    upper.classList.toggle("valid", hasUpper);
    lower.classList.toggle("valid", hasLower);
    number.classList.toggle("valid", hasNumber);
    symbol.classList.toggle("valid", hasSymbol);
    length.classList.toggle("valid", hasLength);

    const score = [hasUpper, hasLower, hasNumber, hasSymbol, hasLength].filter(Boolean).length;
    strengthBar.style.width = (score * 20) + "%";
    strengthBar.className = "strength-bar score-" + score;
}

function validateUsername(value) {
    const pattern = /^[a-zA-Z0-9._]{3,20}$/;
    const taken = value === "takenuser"; // mock
    const valid = pattern.test(value);
    if (valid && !taken) {
    username.classList.add("valid");
    username.classList.remove("invalid");
    usernameHint.textContent = "Username is available";
    usernameHint.style.color = "limegreen";
    return true;
    } else {
    username.classList.remove("valid");
    username.classList.add("invalid");
    usernameHint.textContent = taken ? "Username is taken" : "Invalid username format";
    usernameHint.style.color = "crimson";
    return false;
    }
}

function validateEmail(value) {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const taken = value.trim().toLowerCase() === "taken@email.com"; // mock
    const emailStatus = document.getElementById("emailStatus");

    email.classList.toggle("valid", valid && !taken);
    email.classList.toggle("invalid", !valid || taken);

    if (!valid) {
    emailStatus.textContent = "Please enter a valid email address.";
    emailStatus.style.color = "crimson";
    } else if (taken) {
    emailStatus.textContent = "This email is already in use.";
    emailStatus.style.color = "crimson";
    } else {
    emailStatus.textContent = "Email is valid and available.";
    emailStatus.style.color = "limegreen";
    }
}

function validatePhone() {
    const valid = iti.isValidNumber();
    const taken = iti.getNumber() === "+11234567890"; // mock
    const phoneStatus = document.getElementById("phoneStatus");

    phone.classList.toggle("valid", valid && !taken);
    phone.classList.toggle("invalid", !valid || taken);

    if (!valid) {
    phoneStatus.textContent = "Please enter a valid phone number.";
    phoneStatus.style.color = "crimson";
    } else if (taken) {
    phoneStatus.textContent = "This phone number is already in use.";
    phoneStatus.style.color = "crimson";
    } else {
    phoneStatus.textContent = "Phone number is valid and available.";
    phoneStatus.style.color = "limegreen";
    }
}

function validateZip() {
    const zipStatus = document.getElementById("zipStatus");
    const zipValue = zip.value.trim();
    const valid = /^[0-9]{5}$/.test(zipValue);

    if (zipValue === "") {
    zip.classList.remove("valid", "invalid");
    zipStatus.textContent = "";
    return true;
    }

    zip.classList.toggle("valid", valid);
    zip.classList.toggle("invalid", !valid);

    if (valid) {
    zipStatus.textContent = "ZIP code is valid.";
    zipStatus.style.color = "limegreen";
    } else {
    zipStatus.textContent = "Invalid ZIP code. Please enter a 5-digit US ZIP.";
    zipStatus.style.color = "crimson";
    }

    return valid;
}

function validatePasswordMatch() {
    if (confirmPassword.value.length === 0) {
    confirmPassword.classList.remove("valid", "invalid");
    return false;
    }
    const match = password.value === confirmPassword.value && password.validity.valid;
    confirmPassword.classList.toggle("valid", match);
    confirmPassword.classList.toggle("invalid", !match);
    return match;
}

function validateEmailMatch() {
    if (confirmEmail.value.length === 0) {
    confirmEmail.classList.remove("valid", "invalid");
    return false;
    }
    const match = email.value === confirmEmail.value && email.validity.valid;
    confirmEmail.classList.toggle("valid", match);
    confirmEmail.classList.toggle("invalid", !match);
    return match;
}

function checkAll() {
    updatePasswordRules(password.value);
    const pass = validatePasswordMatch();
    const mail = validateEmailMatch();
    const user = username.classList.contains("valid");
    const emailValid = email.classList.contains("valid");
    const phoneValid = phone.classList.contains("valid") || phone.value === "";
    const zipValid = validateZip();
    submitBtn.disabled = !(user && pass && mail && emailValid && phoneValid && zipValid);
}

username.addEventListener("input", debounce(e => {
    validateUsername(e.target.value);
    checkAll();
}));

email.addEventListener("input", debounce(e => {
    validateEmail(e.target.value);
    checkAll();
}));

phone.addEventListener("input", debounce(() => {
    validatePhone();
    checkAll();
}));

password.addEventListener("input", checkAll);
confirmPassword.addEventListener("input", checkAll);
confirmEmail.addEventListener("input", checkAll);
zip.addEventListener("input", checkAll);

document.getElementById("userForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = {
    username: username.value,
    password: password.value,
    firstName: document.querySelector('[name="firstName"]').value,
    lastName: document.querySelector('[name="lastName"]').value,
    email: email.value
    };

    if (phone.classList.contains("valid")) {
    formData.phone = iti.getNumber();
    }

    if (zip.classList.contains("valid")) {
    formData.zipCode = zip.value;
    }

    console.log("Submitting to backend:", formData);
    alert("Form submitted successfully!");
});

