// Global variables
let currentLanguage = 'en';
let voiceEnabled = true;
let birthDate = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    // Set max date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dobInput').max = today;

    // Load saved preferences
    loadPreferences();

    // Apply saved theme
    const savedTheme = localStorage.getItem('ageCalculatorTheme') || 'light';
    applyTheme(savedTheme);

    // Apply saved language
    const savedLanguage = localStorage.getItem('ageCalculatorLanguage') || 'en';
    setLanguage(savedLanguage);

    // Add keyboard shortcuts
    addKeyboardShortcuts();

    // Add input validation
    addInputValidation();
}

function loadPreferences() {
    const savedVoice = localStorage.getItem('ageCalculatorVoice');
    if (savedVoice !== null) {
        voiceEnabled = savedVoice === 'true';
        updateVoiceIcon();
    }
}

function savePreferences() {
    localStorage.setItem('ageCalculatorTheme', document.documentElement.getAttribute('data-theme') || 'light');
    localStorage.setItem('ageCalculatorLanguage', currentLanguage);
    localStorage.setItem('ageCalculatorVoice', voiceEnabled.toString());
}

// Theme Management
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    savePreferences();
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('themeIcon');
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Language Management
function toggleLanguage() {
    const newLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    setLanguage(newLanguage);
    savePreferences();
}

function setLanguage(language) {
    currentLanguage = language;
    const elements = document.querySelectorAll('[data-en][data-hi]');

    elements.forEach(element => {
        const text = element.getAttribute(`data-${language}`);
        if (text) {
            element.textContent = text;
        }
    });

    // Update language toggle button
    const langToggle = document.getElementById('langToggle');
    langToggle.innerHTML = `<i class="fas fa-globe"></i> ${language.toUpperCase()}`;

    // Update HTML lang attribute
    document.documentElement.lang = language;
}

// Voice Management
function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    updateVoiceIcon();
    savePreferences();

    if (voiceEnabled) {
        speak(currentLanguage === 'en' ? 'Voice announcements enabled' : 'ध्वनि घोषणा सक्रिय');
    }
}

function updateVoiceIcon() {
    const voiceToggle = document.querySelector('.voice-toggle');
    const voiceIcon = document.getElementById('voiceIcon');

    if (voiceEnabled) {
        voiceIcon.className = 'fas fa-volume-up';
        voiceToggle.classList.remove('muted');
    } else {
        voiceIcon.className = 'fas fa-volume-mute';
        voiceToggle.classList.add('muted');
    }
}

function speak(text) {
    if (!voiceEnabled || !window.speechSynthesis) return;

    try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    } catch (error) {
        console.warn('Speech synthesis not supported:', error);
    }
}

// Input Validation
function addInputValidation() {
    const dobInput = document.getElementById('dobInput');

    dobInput.addEventListener('change', function () {
        const selectedDate = new Date(this.value);
        const today = new Date();

        if (selectedDate > today) {
            alert(currentLanguage === 'en'
                ? 'Please select a date in the past'
                : 'कृपया भूतकाल की तारीख चुनें');
            this.value = '';
        }

        if (selectedDate < new Date('1900-01-01')) {
            alert(currentLanguage === 'en'
                ? 'Please select a date after 1900'
                : 'कृपया 1900 के बाद की तारीख चुनें');
            this.value = '';
        }
    });
}

// Keyboard Shortcuts
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + Enter to calculate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            calculateAge();
        }

        // Ctrl/Cmd + D for dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }

        // Ctrl/Cmd + L for language
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            toggleLanguage();
        }

        // Ctrl/Cmd + V for voice
        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            e.preventDefault();
            toggleVoice();
        }

        // Escape to reset
        if (e.key === 'Escape') {
            resetCalculator();
        }
    });
}

// Main Calculation Function
async function calculateAge() {
    const dobInput = document.getElementById('dobInput');
    const dobValue = dobInput.value;

    if (!dobValue) {
        alert(currentLanguage === 'en'
            ? 'Please select your date of birth'
            : 'कृपया अपनी जन्म तिथि चुनें');
        dobInput.focus();
        return;
    }

    birthDate = new Date(dobValue);
    const today = new Date();

    if (birthDate > today) {
        alert(currentLanguage === 'en'
            ? 'Birth date cannot be in the future'
            : 'जन्म तिथि भविष्य में नहीं हो सकती');
        return;
    }

    // Show loading
    showLoading();

    // Add delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        // Calculate all age data
        const ageData = calculateAgeData(birthDate, today);

        // Display results
        displayResults(ageData);

        // Voice announcement
        if (voiceEnabled) {
            const ageText = currentLanguage === 'en'
                ? `You are ${ageData.years} years, ${ageData.months} months, and ${ageData.days} days old`
                : `आप ${ageData.years} साल, ${ageData.months} महीने, और ${ageData.days} दिन के हैं`;
            speak(ageText);
        }

        // Show results section
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error calculating age:', error);
        alert(currentLanguage === 'en'
            ? 'An error occurred while calculating your age. Please try again.'
            : 'आयु गणना करते समय एक त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
        hideLoading();
    }
}

function calculateAgeData(birthDate, currentDate) {
    const birth = new Date(birthDate);
    const now = new Date(currentDate);

    // Calculate exact age
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
        months--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    // Calculate total days lived
    const timeDiff = now.getTime() - birth.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const totalMinutes = Math.floor(timeDiff / (1000 * 60));
    const totalSeconds = Math.floor(timeDiff / 1000);

    // Calculate next birthday
    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    const daysToNextBirthday = Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24));

    // Get additional information
    const dayOfWeek = getDayOfWeek(birth);
    const zodiacSign = getZodiacSign(birth);
    const chineseZodiac = getChineseZodiac(birth.getFullYear());
    const season = getSeason(birth);
    const birthstone = getBirthstone(birth.getMonth());

    // Calculate life statistics
    const heartbeats = Math.floor(totalDays * 100000); // ~100k beats per day
    const breaths = Math.floor(totalDays * 20000); // ~20k breaths per day
    const sleepHours = Math.floor(totalHours * 0.33); // ~8 hours sleep per day
    const meals = Math.floor(totalDays * 3); // 3 meals per day

    return {
        years,
        months,
        days,
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds,
        daysToNextBirthday,
        nextBirthday,
        dayOfWeek,
        zodiacSign,
        chineseZodiac,
        season,
        birthstone,
        heartbeats,
        breaths,
        sleepHours,
        meals,
        birthDate: birth
    };
}

function displayResults(ageData) {
    // Update quick stats
    document.getElementById('mainAge').textContent = ageData.years;
    document.getElementById('nextBirthdayDays').textContent = ageData.daysToNextBirthday;
    document.getElementById('zodiacSign').textContent = ageData.zodiacSign;

    // Update detailed age
    document.getElementById('years').textContent = ageData.years;
    document.getElementById('months').textContent = ageData.months;
    document.getElementById('days').textContent = ageData.days;

    // Update alternative formats
    document.getElementById('totalDays').textContent = formatNumber(ageData.totalDays);
    document.getElementById('totalHours').textContent = formatNumber(ageData.totalHours);
    document.getElementById('totalMinutes').textContent = formatNumber(ageData.totalMinutes);
    document.getElementById('totalSeconds').textContent = formatNumber(ageData.totalSeconds);

    // Update life statistics
    document.getElementById('heartbeats').textContent = formatNumber(ageData.heartbeats);
    document.getElementById('breaths').textContent = formatNumber(ageData.breaths);
    document.getElementById('sleepHours').textContent = formatNumber(ageData.sleepHours);
    document.getElementById('meals').textContent = formatNumber(ageData.meals);

    // Update birth information
    document.getElementById('dayOfWeek').textContent = ageData.dayOfWeek;
    document.getElementById('season').textContent = ageData.season;
    document.getElementById('chineseZodiac').textContent = ageData.chineseZodiac;
    document.getElementById('birthstone').textContent = ageData.birthstone;

    // Generate milestones
    generateMilestones(ageData);

    // Generate fun facts
    generateFunFacts(ageData);
}

function generateMilestones(ageData) {
    const milestones = [];
    const currentAge = ageData.years;

    // Find next milestone birthdays
    const milestoneAges = [25, 30, 40, 50, 60, 65, 70, 75, 80, 90, 100];

    for (const age of milestoneAges) {
        if (age > currentAge) {
            const yearsToMilestone = age - currentAge;
            const milestoneDate = new Date(ageData.birthDate);
            milestoneDate.setFullYear(milestoneDate.getFullYear() + age);

            const daysToMilestone = Math.ceil((milestoneDate - new Date()) / (1000 * 60 * 60 * 24));

            milestones.push({
                age: age,
                years: yearsToMilestone,
                date: milestoneDate,
                days: daysToMilestone
            });

            if (milestones.length >= 3) break;
        }
    }

    const container = document.getElementById('milestonesContainer');
    container.innerHTML = '';

    milestones.forEach(milestone => {
        const milestoneEl = document.createElement('div');
        milestoneEl.className = 'milestone-item';

        const ageText = currentLanguage === 'en' ? `${milestone.age} Years Old` : `${milestone.age} साल के`;
        const dateText = currentLanguage === 'en'
            ? milestone.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : milestone.date.toLocaleDateString('hi-IN');
        const daysText = currentLanguage === 'en'
            ? `in ${formatNumber(milestone.days)} days`
            : `${formatNumber(milestone.days)} दिनों में`;

        milestoneEl.innerHTML = `
            <div class="milestone-age">${ageText}</div>
            <div class="milestone-date">${dateText}</div>
            <div class="milestone-days">${daysText}</div>
        `;

        container.appendChild(milestoneEl);
    });
}

function generateFunFacts(ageData) {
    const facts = [];

    if (currentLanguage === 'en') {
        facts.push(`You have lived through approximately ${Math.floor(ageData.totalDays / 365.25)} New Year's celebrations! 🎉`);
        facts.push(`Your heart has beaten approximately ${formatNumber(ageData.heartbeats)} times since you were born! ❤️`);
        facts.push(`You have experienced about ${Math.floor(ageData.totalDays / 7)} weekends in your lifetime! 🎈`);
        facts.push(`You have slept for roughly ${Math.floor(ageData.sleepHours / 24)} days of your life! 😴`);
        facts.push(`You have probably eaten about ${formatNumber(ageData.meals)} meals so far! 🍽️`);

        if (ageData.years >= 18) {
            facts.push(`You have been legally an adult for ${ageData.years - 18} years! 🎓`);
        }

        if (ageData.totalDays > 10000) {
            facts.push(`Congratulations! You have lived for over 10,000 days! 🌟`);
        }

        if (ageData.daysToNextBirthday < 30) {
            facts.push(`Your birthday is coming up soon - only ${ageData.daysToNextBirthday} days to go! 🎂`);
        }
    } else {
        facts.push(`आपने लगभग ${Math.floor(ageData.totalDays / 365.25)} नए साल मनाए हैं! 🎉`);
        facts.push(`आपका दिल अब तक लगभग ${formatNumber(ageData.heartbeats)} बार धड़का है! ❤️`);
        facts.push(`आपने अपने जीवन में लगभग ${Math.floor(ageData.totalDays / 7)} सप्ताहांत देखे हैं! 🎈`);
        facts.push(`आपने अपने जीवन के लगभग ${Math.floor(ageData.sleepHours / 24)} दिन सोते हुए बिताए हैं! 😴`);
        facts.push(`आपने अब तक लगभग ${formatNumber(ageData.meals)} भोजन खाया है! 🍽️`);

        if (ageData.years >= 18) {
            facts.push(`आप ${ageData.years - 18} साल से कानूनी रूप से वयस्क हैं! 🎓`);
        }

        if (ageData.totalDays > 10000) {
            facts.push(`बधाई हो! आपने 10,000 दिनों से अधिक जिया है! 🌟`);
        }

        if (ageData.daysToNextBirthday < 30) {
            facts.push(`आपका जन्मदिन जल्द आ रहा है - केवल ${ageData.daysToNextBirthday} दिन बाकी! 🎂`);
        }
    }

    const container = document.getElementById('funFactsContainer');
    container.innerHTML = '';

    facts.slice(0, 5).forEach(fact => {
        const factEl = document.createElement('div');
        factEl.className = 'fun-fact-item';
        factEl.textContent = fact;
        container.appendChild(factEl);
    });
}

// Helper Functions
function formatNumber(num) {
    return new Intl.NumberFormat(currentLanguage === 'hi' ? 'hi-IN' : 'en-US').format(num);
}

function getDayOfWeek(date) {
    const days = {
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार']
    };
    return days[currentLanguage][date.getDay()];
}

function getZodiacSign(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const signs = {
        en: [
            'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
            'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'
        ],
        hi: [
            'मकर', 'कुंभ', 'मीन', 'मेष', 'वृषभ', 'मिथुन',
            'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु'
        ]
    };

    const dates = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
    let signIndex = month - 1;

    if (day < dates[signIndex]) {
        signIndex = signIndex === 0 ? 11 : signIndex - 1;
    }

    return signs[currentLanguage][signIndex];
}

function getChineseZodiac(year) {
    const animals = {
        en: ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'],
        hi: ['चूहा', 'बैल', 'बाघ', 'खरगोश', 'अजगर', 'सांप', 'घोड़ा', 'बकरी', 'बंदर', 'मुर्गा', 'कुत्ता', 'सुअर']
    };
    const startYear = 1900;
    const index = (year - startYear) % 12;
    return animals[currentLanguage][index];
}

function getSeason(date) {
    const month = date.getMonth();
    const seasons = {
        en: ['Winter', 'Spring', 'Summer', 'Autumn'],
        hi: ['शीत', 'वसंत', 'गर्मी', 'शरद']
    };

    if (month >= 2 && month <= 4) return seasons[currentLanguage][1]; // Spring
    if (month >= 5 && month <= 7) return seasons[currentLanguage][2]; // Summer
    if (month >= 8 && month <= 10) return seasons[currentLanguage][3]; // Autumn
    return seasons[currentLanguage][0]; // Winter
}

function getBirthstone(month) {
    const stones = {
        en: [
            'Garnet', 'Amethyst', 'Aquamarine', 'Diamond', 'Emerald', 'Pearl',
            'Ruby', 'Peridot', 'Sapphire', 'Opal', 'Topaz', 'Turquoise'
        ],
        hi: [
            'गार्नेट', 'अमेथिस्ट', 'एक्वामरीन', 'हीरा', 'पन्ना', 'मोती',
            'माणिक', 'पेरिडॉट', 'नीलम', 'ओपल', 'पुखराज', 'फिरोजा'
        ]
    };
    return stones[currentLanguage][month];
}

// UI Helper Functions
function showLoading() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
    document.getElementById('calculateBtn').classList.add('loading');
    document.getElementById('calculateBtn').disabled = true;
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
    document.getElementById('calculateBtn').classList.remove('loading');
    document.getElementById('calculateBtn').disabled = false;
}

// Action Functions
function shareResults() {
    if (!birthDate) return;

    const ageData = calculateAgeData(birthDate, new Date());
    const text = currentLanguage === 'en'
        ? `I am exactly ${ageData.years} years, ${ageData.months} months, and ${ageData.days} days old! 🎂 My zodiac sign is ${ageData.zodiacSign}. Calculate your age too!`
        : `मैं बिल्कुल ${ageData.years} साल, ${ageData.months} महीने, और ${ageData.days} दिन का हूँ! 🎂 मेरी राशि ${ageData.zodiacSign} है। आप भी अपनी आयु गणना करें!`;

    if (navigator.share) {
        navigator.share({
            title: currentLanguage === 'en' ? 'My Age Calculation' : 'मेरी आयु गणना',
            text: text,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(text + ' ' + window.location.href).then(() => {
            alert(currentLanguage === 'en'
                ? 'Results copied to clipboard!'
                : 'परिणाम क्लिपबोर्ड में कॉपी हो गया!');
        }).catch(() => {
            alert(currentLanguage === 'en'
                ? 'Unable to share. Please copy the URL manually.'
                : 'साझा करने में असमर्थ। कृपया URL को मैन्युअल रूप से कॉपी करें।');
        });
    }
}

function printResults() {
    // Hide elements not needed for print
    const elementsToHide = ['.theme-toggle', '.voice-toggle', '.language-toggle', '.action-buttons'];
    elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.style.display = 'none');
    });

    // Print
    window.print();

    // Restore hidden elements
    elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.style.display = '');
    });
}

function downloadPDF() {
    // This would require a PDF library like jsPDF
    // For now, we'll use the browser's print dialog
    alert(currentLanguage === 'en'
        ? 'Use your browser\'s print function and select "Save as PDF" as the destination.'
        : 'अपने ब्राउज़र के प्रिंट फ़ंक्शन का उपयोग करें और गंतव्य के रूप में "PDF के रूप में सहेजें" चुनें।');
    printResults();
}

function resetCalculator() {
    // Clear input
    document.getElementById('dobInput').value = '';

    // Hide results
    document.getElementById('resultsSection').classList.add('hidden');

    // Scroll to top
    document.querySelector('.input-section').scrollIntoView({ behavior: 'smooth' });

    // Focus input
    document.getElementById('dobInput').focus();

    // Voice announcement
    if (voiceEnabled) {
        speak(currentLanguage === 'en' ? 'Calculator reset' : 'कैलकुलेटर रीसेट');
    }
}

// Service Worker Registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
