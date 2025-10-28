'use strict';

const modeToggle = document.getElementById('modeToggle');
const sunLabel = document.getElementById('sunLabel');
const moonLabel = document.getElementById('moonLabel');

function applyTheme(selectedMode) {
    document.documentElement.dataset.bsTheme = selectedMode;
    saveThemePreference(selectedMode);
    if (selectedMode === 'dark') {
        applyDarkThemeToModeToggle();
    } else {
        applyLightThemeToModeToggle();
    }
}

function applyLightThemeToModeToggle() {
    sunLabel.removeAttribute('for');
    moonLabel.setAttribute('for', 'modeToggle');
    sunLabel.classList.remove('cursor-pointer');
    moonLabel.classList.add('cursor-pointer');
    modeToggle.checked = false;
}

function applyDarkThemeToModeToggle() {
    moonLabel.removeAttribute('for');
    sunLabel.setAttribute('for', 'modeToggle');
    moonLabel.classList.remove('cursor-pointer');
    sunLabel.classList.add('cursor-pointer');
    modeToggle.checked = true;
}

// Manual selection.
modeToggle.addEventListener('change', (event) => {
    updateTheme(event.target);
});

function updateTheme(toggle) {
    if (toggle.checked) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
}

function saveThemePreference(selectedMode) {
    localStorage.setItem('themeMode', selectedMode);
}
