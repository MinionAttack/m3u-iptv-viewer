'use strict';

const body = document.body;
const modalsContents = document.querySelectorAll('.modal-content');
const fileInput = document.getElementById('fileInput');
const modeToggle = document.getElementById('modeToggle');
const topNavbar = document.getElementById('topNavbar');
const sunLabel = document.getElementById('sunLabel');
const moonLabel = document.getElementById('moonLabel');
const mainContainer = document.getElementById('mainContainer');
const footers = document.querySelectorAll('.footer');

function applyTheme(selectedMode) {
    if (selectedMode === 'dark') {
        applyDarkThemeToBodyAndNavbar();
        applyDarkThemeFileInput()
        applyDarkThemeToModeToggle();
        applyDarkThemeToMainContainer();
        applyDarkThemeToFooter();
        applyDarkThemeToModals();
        saveThemePreference(selectedMode);
    } else {
        applyLightThemeToBodyAndNavbar();
        applyLightThemeFileInput()
        applyLightThemeToModeToggle();
        applyLightThemeToMainContainer()
        applyLightThemeToFooter();
        applyLightThemeToModals();
        saveThemePreference(selectedMode);
    }
}

function applyDarkThemeToBodyAndNavbar() {
    body.setAttribute('data-bs-theme', 'dark');
    topNavbar.classList.remove('navbar-light', 'bg-light');
    topNavbar.classList.add('navbar-dark', 'bg-dark');
}

function applyDarkThemeFileInput() {
    fileInput.classList.remove('bg-light', 'text-dark');
    fileInput.classList.add('bg-dark', 'text-light');
}

function applyDarkThemeToModeToggle() {
    moonLabel.removeAttribute('for');
    sunLabel.setAttribute('for', 'modeToggle');
    modeToggle.checked = true;
}

function applyDarkThemeToModals() {
    modalsContents.forEach(modalContent => {
        modalContent.classList.remove('bg-light', 'text-dark');
        modalContent.classList.add('bg-dark', 'text-light');
    });
}

function applyDarkThemeToMainContainer() {
    mainContainer.classList.remove('bg-light', 'text-dark');
    mainContainer.classList.add('bg-dark', 'text-light');
}

function applyDarkThemeToFooter() {
    footers.forEach(footer => {
        footer.classList.remove('bg-light', 'text-dark');
        footer.classList.add('bg-dark', 'text-light');
    });
}

function applyLightThemeToBodyAndNavbar() {
    body.setAttribute('data-bs-theme', 'light');
    topNavbar.classList.remove('navbar-dark', 'bg-dark');
    topNavbar.classList.add('navbar-light', 'bg-light');
}

function applyLightThemeFileInput() {
    fileInput.classList.remove('bg-dark', 'text-light');
    fileInput.classList.add('bg-light', 'text-dark');
}

function applyLightThemeToModeToggle() {
    sunLabel.removeAttribute('for');
    moonLabel.setAttribute('for', 'modeToggle');
    modeToggle.checked = false;
}

function applyLightThemeToModals() {
    modalsContents.forEach(modalContent => {
        modalContent.classList.remove('bg-dark', 'text-light');
        modalContent.classList.add('bg-light', 'text-dark');
    });
}

function applyLightThemeToMainContainer() {
    mainContainer.classList.remove('bg-dark', 'text-light');
    mainContainer.classList.add('bg-light', 'text-dark');
}

function applyLightThemeToFooter() {
    footers.forEach(footer => {
        footer.classList.remove('bg-dark', 'text-light');
        footer.classList.add('bg-light', 'text-dark');
    });
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
