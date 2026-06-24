// --------------------------------------------------------------
// 1. SPLASH SCREEN CONTROLLER
// --------------------------------------------------------------
(function showSplash() {
    const splash = document.getElementById('splash');
    const app = document.getElementById('app');

    setTimeout(() => {
        splash.classList.add('hidden');
        app.classList.add('visible');

        setTimeout(() => {
            splash.style.display = 'none';
        }, 900);
    }, 2800);
})();

// --------------------------------------------------------------
// 2. FORM ELEMENTS
// --------------------------------------------------------------
const form = document.getElementById('signupForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const confirmError = document.getElementById('confirm-error');

const successBanner = document.getElementById('formSuccess');

// Password checklist elements
const checkLength = document.getElementById('check-length');
const checkUppercase = document.getElementById('check-uppercase');
const checkLowercase = document.getElementById('check-lowercase');
const checkNumber = document.getElementById('check-number');
const checkSpecial = document.getElementById('check-special');

// --------------------------------------------------------------
// 3. HELPER: SET FIELD STATE
// --------------------------------------------------------------
function setFieldState(input, errorEl, isValid, message) {
    input.classList.remove('error', 'success');

    if (isValid === true) {
        input.classList.add('success');
        input.setAttribute('aria-invalid', 'false');
        errorEl.textContent = '';
        errorEl.className = 'msg';
    } else if (isValid === false) {
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
        errorEl.textContent = message || 'Invalid input.';
        errorEl.className = 'msg msg-error';
    } else {
        input.setAttribute('aria-invalid', 'false');
        errorEl.textContent = '';
        errorEl.className = 'msg';
    }
}

// --------------------------------------------------------------
// 4. UPDATE PASSWORD CHECKLIST (Real-time visual feedback)
// --------------------------------------------------------------
function updatePasswordChecklist(password) {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[#?!@$%^&*()\-]/.test(password)
    };

    // Update each check item
    checkLength.classList.toggle('met', checks.length);
    checkUppercase.classList.toggle('met', checks.uppercase);
    checkLowercase.classList.toggle('met', checks.lowercase);
    checkNumber.classList.toggle('met', checks.number);
    checkSpecial.classList.toggle('met', checks.special);

    // Update icons manually since we're using ::before pseudo-elements
    // We'll use data attributes to control the icon display
    document.querySelectorAll('.check-item').forEach(item => {
        const icon = item.querySelector('.check-icon');
        if (item.classList.contains('met')) {
            icon.textContent = '✓';
            icon.style.color = '#51cf66';
        } else {
            icon.textContent = '○';
            icon.style.color = '#ff6b6b';
        }
    });

    return checks;
}

// --------------------------------------------------------------
// 5. VALIDATION FUNCTIONS
// --------------------------------------------------------------
function validateName(value) {
    const trimmed = value.trim();
    if (trimmed === '') return { valid: false, msg: 'Full name is required.' };
    if (trimmed.length < 2) return { valid: false, msg: 'Name must be at least 2 characters.' };
    const nameRegex = /^[A-Za-z\s\-']+$/;
    if (!nameRegex.test(trimmed)) {
        return { valid: false, msg: 'Name can only contain letters, spaces, hyphens, and apostrophes.' };
    }
    return { valid: true, msg: '' };
}

function validateEmail(value) {
    const trimmed = value.trim();
    if (trimmed === '') return { valid: false, msg: 'Email address is required.' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
        return { valid: false, msg: 'Please enter a valid email address (e.g., name@domain.com).' };
    }
    return { valid: true, msg: '' };
}

function validatePassword(value) {
    if (value === '') return { valid: false, msg: 'Password is required.' };

    const checks = updatePasswordChecklist(value);
    
    if (checks.length && checks.uppercase && checks.lowercase && 
        checks.number && checks.special) {
        return { valid: true, msg: '' };
    } else {
        return { valid: false, msg: 'Please meet all password requirements below.' };
    }
}

function validateConfirm(password, confirm) {
    if (confirm === '') return { valid: false, msg: 'Please confirm your password.' };
    if (password !== confirm) return { valid: false, msg: 'Passwords do not match.' };
    return { valid: true, msg: '' };
}

// --------------------------------------------------------------
// 6. REAL-TIME FIELD VALIDATION
// --------------------------------------------------------------

// Name
nameInput.addEventListener('blur', function() {
    const result = validateName(this.value);
    setFieldState(this, nameError, result.valid, result.msg);
});
nameInput.addEventListener('input', function() {
    if (this.classList.contains('error')) {
        const result = validateName(this.value);
        setFieldState(this, nameError, result.valid, result.msg);
    }
});

// Email
emailInput.addEventListener('blur', function() {
    const result = validateEmail(this.value);
    setFieldState(this, emailError, result.valid, result.msg);
});
emailInput.addEventListener('input', function() {
    if (this.classList.contains('error')) {
        const result = validateEmail(this.value);
        setFieldState(this, emailError, result.valid, result.msg);
    }
});

// Password - Update checklist in real-time as user types
passwordInput.addEventListener('input', function() {
    const value = this.value;
    
    // Update the checklist in real-time
    updatePasswordChecklist(value);
    
    // If there was a previous error, re-evaluate
    if (this.classList.contains('error') || value.length > 0) {
        const result = validatePassword(value);
        setFieldState(this, passwordError, result.valid, result.msg);
    }
    
    // Also re-check confirm if it has a value
    if (confirmInput.value) {
        const confirmResult = validateConfirm(value, confirmInput.value);
        setFieldState(confirmInput, confirmError, confirmResult.valid, confirmResult.msg);
    }
});

passwordInput.addEventListener('blur', function() {
    const result = validatePassword(this.value);
    setFieldState(this, passwordError, result.valid, result.msg);
    
    if (confirmInput.value) {
        const confirmResult = validateConfirm(this.value, confirmInput.value);
        setFieldState(confirmInput, confirmError, confirmResult.valid, confirmResult.msg);
    }
});

// Confirm
confirmInput.addEventListener('blur', function() {
    const result = validateConfirm(passwordInput.value, this.value);
    setFieldState(this, confirmError, result.valid, result.msg);
});
confirmInput.addEventListener('input', function() {
    if (this.classList.contains('error')) {
        const result = validateConfirm(passwordInput.value, this.value);
        setFieldState(this, confirmError, result.valid, result.msg);
    }
});

// --------------------------------------------------------------
// 7. FORM SUBMISSION — The Shield
// --------------------------------------------------------------
form.addEventListener('submit', function(e) {
    e.preventDefault();

    successBanner.classList.remove('show');

    const nameResult = validateName(nameInput.value);
    const emailResult = validateEmail(emailInput.value);
    const passwordResult = validatePassword(passwordInput.value);
    const confirmResult = validateConfirm(passwordInput.value, confirmInput.value);

    setFieldState(nameInput, nameError, nameResult.valid, nameResult.msg);
    setFieldState(emailInput, emailError, emailResult.valid, emailResult.msg);
    setFieldState(passwordInput, passwordError, passwordResult.valid, passwordResult.msg);
    setFieldState(confirmInput, confirmError, confirmResult.valid, confirmResult.msg);

    const allValid = nameResult.valid && emailResult.valid && 
                     passwordResult.valid && confirmResult.valid;

    if (allValid) {
        const payload = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
            timestamp: new Date().toISOString()
        };

        console.log('✅ Approved Payload (JSON):', JSON.stringify(payload, null, 2));
        successBanner.classList.add('show');
        

    } else {
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.focus();
        }
        document.getElementById('app').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// --------------------------------------------------------------
// 8. RESET SUCCESS BANNER
// --------------------------------------------------------------
form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', function() {
        successBanner.classList.remove('show');
    });
});

console.log('🔐 DecodeLabs Form Engine loaded. Architecting trust.');
