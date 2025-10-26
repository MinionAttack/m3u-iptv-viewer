'use strict';

const body = document.body;
const modalsContents = document.querySelectorAll('.modal-content');
const i18nDropdown = document.getElementById('localeDropdown');
const i18nDropdownOptions = document.getElementById('localeDropdownOptions');
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
        applyDarkThemeFileInput();
        applyDarkThemeToLocaleSelector();
        applyDarkThemeToModeToggle();
        applyDarkThemeToMainContainer();
        applyDarkThemeToFooter();
        applyDarkThemeToModals();
        saveThemePreference(selectedMode);
    } else {
        applyLightThemeToBodyAndNavbar();
        applyLightThemeFileInput();
        applyLightThemeToLocaleSelector();
        applyLightThemeToModeToggle();
        applyLightThemeToMainContainer()
        applyLightThemeToFooter();
        applyLightThemeToModals();
        saveThemePreference(selectedMode);
    }
}

function applyDarkThemeToBodyAndNavbar() {
    body.dataset.bsTheme = 'dark';
    topNavbar.classList.remove('navbar-light', 'bg-light');
    topNavbar.classList.add('navbar-dark', 'bg-dark');
}

function applyDarkThemeFileInput() {
    fileInput.classList.remove('bg-light', 'text-dark');
    fileInput.classList.add('bg-dark', 'text-light');
}

function applyDarkThemeToLocaleSelector() {
    i18nDropdown.classList.remove('btn-light');
    i18nDropdown.classList.add('btn-dark');
    i18nDropdownOptions.classList.remove('dropdown-menu-light');
    i18nDropdownOptions.classList.add('dropdown-menu-dark');
}

function applyDarkThemeToModeToggle() {
    moonLabel.removeAttribute('for');
    sunLabel.setAttribute('for', 'modeToggle');
    modeToggle.checked = true;
}

function applyDarkThemeToModals() {
    for (const modalContent of modalsContents) {
        modalContent.classList.remove('bg-light', 'text-dark');
        modalContent.classList.add('bg-dark', 'text-light');
    }
}

function applyDarkThemeToMainContainer() {
    mainContainer.classList.remove('bg-light', 'text-dark');
    mainContainer.classList.add('bg-dark', 'text-light');
}

function applyDarkThemeToFooter() {
    for (const footer of footers) {
        footer.classList.remove('bg-light', 'text-dark');
        footer.classList.add('bg-dark', 'text-light');
    }
}

function applyLightThemeToBodyAndNavbar() {
    body.dataset.bsTheme = 'light';
    topNavbar.classList.remove('navbar-dark', 'bg-dark');
    topNavbar.classList.add('navbar-light', 'bg-light');
}

function applyLightThemeFileInput() {
    fileInput.classList.remove('bg-dark', 'text-light');
    fileInput.classList.add('bg-light', 'text-dark');
}

function applyLightThemeToLocaleSelector() {
    i18nDropdown.classList.remove('btn-dark');
    i18nDropdown.classList.add('btn-light');
    i18nDropdownOptions.classList.remove('dropdown-menu-dark');
    i18nDropdownOptions.classList.add('dropdown-menu-light');
}

function applyLightThemeToModeToggle() {
    sunLabel.removeAttribute('for');
    moonLabel.setAttribute('for', 'modeToggle');
    modeToggle.checked = false;
}

function applyLightThemeToModals() {
    for (const modalContent of modalsContents) {
        modalContent.classList.remove('bg-dark', 'text-light');
        modalContent.classList.add('bg-light', 'text-dark');
    }
}

function applyLightThemeToMainContainer() {
    mainContainer.classList.remove('bg-dark', 'text-light');
    mainContainer.classList.add('bg-light', 'text-dark');
}

function applyLightThemeToFooter() {
    for (const footer of footers) {
        footer.classList.remove('bg-dark', 'text-light');
        footer.classList.add('bg-light', 'text-dark');
    }
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
