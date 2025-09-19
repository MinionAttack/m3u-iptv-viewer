'use strict';

const body = document.body;
const modeToggle = document.getElementById('modeToggle');
const topNavbar = document.getElementById('topNavbar');
const sunLabel = document.getElementById('sunLabel');
const moonLabel = document.getElementById('moonLabel');

function applyTheme(selectedMode) {
    if (selectedMode === 'dark') {
        applyDarkThemeToBodyAndNavbar();
        applyDarkThemeToModeToggle();
        saveThemePreference(selectedMode);
    } else {
        applyLightThemeToBodyAndNavbar();
        applyLightThemeToModeToggle();
        saveThemePreference(selectedMode);
    }
}

function applyDarkThemeToBodyAndNavbar() {
    body.setAttribute('data-bs-theme', 'dark');
    topNavbar.classList.remove('navbar-light', 'bg-light');
    topNavbar.classList.add('navbar-dark', 'bg-dark');
}

function applyDarkThemeToModeToggle() {
    moonLabel.removeAttribute('for');
    sunLabel.setAttribute('for', 'modeToggle');
    modeToggle.checked = true;
}

function applyLightThemeToBodyAndNavbar() {
    body.setAttribute('data-bs-theme', 'light');
    topNavbar.classList.remove('navbar-dark', 'bg-dark');
    topNavbar.classList.add('navbar-light', 'bg-light');
}

function applyLightThemeToModeToggle() {
    sunLabel.removeAttribute('for');
    moonLabel.setAttribute('for', 'modeToggle');
    modeToggle.checked = false;
}

// Manual selection.
modeToggle.addEventListener('change', (event) => {
    updateTheme(event.target);
});

function updateTheme(toggle) {
    if (toggle.checked) {
        applyTheme('dark');
        saveThemePreference('dark');
    } else {
        applyTheme('light');
        saveThemePreference('light');
    }
}

function saveThemePreference(selectedMode) {
    localStorage.setItem('themeMode', selectedMode);
}
