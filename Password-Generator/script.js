(function () {
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const digitChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const ambiguousChars = 'il1o0ILO';

    const output = document.getElementById('password-output');
    const copyBtn = document.getElementById('copy-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const generateBtn = document.getElementById('generate-main-btn');
    const tooltip = document.getElementById('copy-tooltip');
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    const themeToggle = document.getElementById('theme-toggle');

    themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('tools-theme', isDark ? 'light' : 'dark');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    function getCharset() {
        let chars = '';
        const hasUpper = document.getElementById('chk-upper').checked;
        const hasLower = document.getElementById('chk-lower').checked;
        const hasDigits = document.getElementById('chk-digits').checked;
        const hasSymbols = document.getElementById('chk-symbols').checked;
        const avoidAmb = document.getElementById('chk-ambiguous').checked;

        if (hasUpper) chars += upperChars;
        if (hasLower) chars += lowerChars;
        if (hasDigits) chars += digitChars;
        if (hasSymbols) chars += symbolChars;

        if (avoidAmb) {
            for (const c of ambiguousChars) {
                chars = chars.replace(new RegExp('\\' + c, 'g'), '');
            }
        }

        if (!chars) chars = lowerChars;
        return chars;
    }

    function generatePassword() {
        const length = parseInt(lengthSlider.value, 10);
        const charset = getCharset();
        let password = '';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }

        const checks = document.getElementById('chk-upper').checked;
        const checkl = document.getElementById('chk-lower').checked;
        const checkd = document.getElementById('chk-digits').checked;
        const checksym = document.getElementById('chk-symbols').checked;

        if (checks && !/[A-Z]/.test(password)) {
            password = password.slice(0, -1) + upperChars[Math.floor(Math.random() * upperChars.length)];
        }
        if (checkl && !/[a-z]/.test(password)) {
            password = password.slice(0, -1) + lowerChars[Math.floor(Math.random() * lowerChars.length)];
        }
        if (checkd && !/\d/.test(password)) {
            password = password.slice(0, -1) + digitChars[Math.floor(Math.random() * digitChars.length)];
        }
        if (checksym && !/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) {
            password = password.slice(0, -1) + symbolChars[Math.floor(Math.random() * symbolChars.length)];
        }

        output.value = password;
        updateStrength(password);
    }

    function updateStrength(password) {
        const len = password.length;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSymbol = /[^a-zA-Z0-9]/.test(password);
        let score = 0;
        if (hasUpper) score++;
        if (hasLower) score++;
        if (hasDigit) score++;
        if (hasSymbol) score++;
        if (len >= 8) score++;
        if (len >= 12) score++;
        if (len >= 16) score++;
        if (len >= 20) score++;

        if (score <= 2) { strengthFill.className = 'strength-fill weak'; strengthText.textContent = 'Weak'; strengthText.style.color = 'var(--weak-color)'; }
        else if (score <= 4) { strengthFill.className = 'strength-fill medium'; strengthText.textContent = 'Medium'; strengthText.style.color = 'var(--medium-color)'; }
        else if (score <= 6) { strengthFill.className = 'strength-fill strong'; strengthText.textContent = 'Strong'; strengthText.style.color = 'var(--strong-color)'; }
        else { strengthFill.className = 'strength-fill very-strong'; strengthText.textContent = 'Very Strong'; strengthText.style.color = '#059669'; }
    }

    copyBtn.addEventListener('click', async () => {
        if (!output.value) return;
        try {
            await navigator.clipboard.writeText(output.value);
            tooltip.classList.remove('hidden');
            tooltip.textContent = 'Copied!';
            setTimeout(() => tooltip.classList.add('hidden'), 1500);
        } catch {
            output.select();
            document.execCommand('copy');
            tooltip.classList.remove('hidden');
            tooltip.textContent = 'Copied!';
            setTimeout(() => tooltip.classList.add('hidden'), 1500);
        }
    });

    regenerateBtn.addEventListener('click', generatePassword);
    generateBtn.addEventListener('click', generatePassword);
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
        generatePassword();
    });

    document.querySelectorAll('.checkboxes input').forEach(cb => {
        cb.addEventListener('change', generatePassword);
    });

    generatePassword();
})();
