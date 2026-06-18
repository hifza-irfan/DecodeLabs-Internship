// 1. DATA (Config object — the source of truth for all moods)

const moodData = {
    focus: {
        emoji: '🎯',
        label: 'Focus',
        color: '#2563EB',
        quote: "Great things are rarely built in moments of inspiration; they are built in moments of uninterrupted focus."
    },
    calm: {
        emoji: '🌊',
        label: 'Calm',
        color: '#0EA5E9',
        quote: "The quieter you become, the more clearly you can hear what truly matters."
    },
    energetic: {
        emoji: '⚡',
        label: 'Energetic',
        color: '#F59E0B',
        quote: "You wake up with a limited amount of energy each day. Spend it on things that move your life forward."
    },
    creative: {
        emoji: '🎨',
        label: 'Creative',
        color: '#8B5CF6',
        quote: "Every masterpiece starts as an idea that was brave enough to leave someone's imagination."
    },
    grateful: {
        emoji: '🙏',
        label: 'Grateful',
        color: '#10B981',
        quote: "When you focus on what is already present, life often feels more abundant than before."
    },
    motivated: {
        emoji: '🚀',
        label: 'Motivated',
        color: '#EF4444',
        quote: "Success is not the result of one extraordinary effort, but hundreds of ordinary efforts repeated consistently."
    },
    peaceful: {
        emoji: '🕊️',
        label: 'Peaceful',
        color: '#06B6D4',
        quote: "Some of the most powerful moments in life happen when you choose calm over reaction."
    },
    playful: {
        emoji: '🎪',
        label: 'Playful',
        color: '#F472B6',
        quote: "Life was never meant to be a checklist of responsibilities. Leave room for wonder, laughter, and surprise. Seriousness is overrated. "
    }
};

// 2. STATE (Variables that can change)

let currentTheme = 'light';   // 'light' or 'dark'
let currentMood = 'focus';    // one of the 8 mood keys

// 3. DOM REFS (Use const — these never change)

const body = document.body;
const themeToggle = document.querySelector('.js-theme-toggle');
const moodLabel = document.querySelector('.js-mood-label');
const quoteElement = document.querySelector('.js-quote');
const moodButtons = document.querySelectorAll('.js-mood-btn');

// 4. FUNCTIONS (PROCESS + OUTPUT)

// --- Apply Theme ---
function applyTheme(theme) {
    // PROCESS: Update state and save
    currentTheme = theme;
    localStorage.setItem('theme', theme);

    // OUTPUT: Update the DOM
    if (theme === 'dark') {
        body.classList.add('is-dark');
        themeToggle.textContent = '☀️ Light';
    } else {
        body.classList.remove('is-dark');
        themeToggle.textContent = '🌙 Dark';
    }
}

// --- Apply Mood ---
function applyMood(moodKey) {
    // PROCESS: Look up data, update state, save
    const mood = moodData[moodKey];
    if (!mood) return; // Safety check

    currentMood = moodKey;
    localStorage.setItem('mood', moodKey);

    // OUTPUT: Update the DOM
    // 1. Label (emoji + name)
    moodLabel.textContent = `${mood.emoji} ${mood.label}`;

    // 2. Quote
    quoteElement.textContent = mood.quote;

    // 3. Accent color on the status card
    const statusCard = document.querySelector('.status');
    statusCard.style.borderColor = mood.color;
    statusCard.style.backgroundColor = `${mood.color}15`; // 15% opacity

    // 4. Highlight the active button
    moodButtons.forEach((btn) => {
        btn.classList.remove('is-active');
        const btnMood = btn.getAttribute('data-mood');
        if (btnMood === moodKey) {
            btn.classList.add('is-active');
            btn.style.color = mood.color;
            btn.style.borderColor = mood.color;
        } else {
            // Reset non-active buttons to default colors
            btn.style.color = '';
            btn.style.borderColor = '';
        }
    });
}

// 5. EVENT LISTENERS (INPUT)
// --- Theme Toggle ---
themeToggle.addEventListener('click', () => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
});

// --- Mood Buttons ---
moodButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const moodKey = btn.getAttribute('data-mood');
        applyMood(moodKey);
    });
});

// 6. PAGE LOAD (Restore state from localStorage)

document.addEventListener('DOMContentLoaded', () => {
    // --- Restore Theme ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        applyTheme(savedTheme);
    } else {
        // Default: light
        applyTheme('light');
    }

    // --- Restore Mood ---
    const savedMood = localStorage.getItem('mood');
    if (savedMood && moodData[savedMood]) {
        applyMood(savedMood);
    } else {
        // Default: focus
        applyMood('focus');
    }
});
