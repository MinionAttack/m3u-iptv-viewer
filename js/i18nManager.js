'use strict';

const locales = new Set(['en', 'es']);

const localeStrings = {
    en: {
        navBarTexts: {navBarTitleText: 'M3U IPTV Viewer', processButtonText: 'Process'},
        modalTexts: {
            invalidFileTexts: {
                staticBackdropModalText: 'Invalid M3U file',
                staticBackdropModalDescriptionText: 'The M3U file you wish to process is invalid or incompatible.',
                staticBackdropModalButtonText: 'Accept'
            }
        },
        footerTexts: {footerDescriptionText: 'See this project on'}
    },
    es: {
        navBarTexts: {navBarTitleText: 'Visor de M3U para IPTV', processButtonText: 'Procesar'},
        modalTexts: {
            invalidFileTexts: {
                staticBackdropModalText: 'Fichero M3U no válido',
                staticBackdropModalDescriptionText: 'El fichero M3U que desea procesar no es válido o es incompatible.',
                staticBackdropModalButtonText: 'Aceptar'
            }
        },
        footerTexts: {footerDescriptionText: 'Vea este proyecto en'}
    }
};

const localeOptions = document.getElementById('localeDropdownOptions');

function applyPreferredLocale(selectedLocale) {
    const localeOption = localeOptions.querySelector(`.dropdown-item[data-lang="${selectedLocale}"]`);
    const languageFlag = localeOption.dataset.flag;
    const languageName = localeOption.textContent.trim().substring(5); // Remove the emoji
    changeLocale(selectedLocale, languageFlag, languageName);
}

function findPreferredBrowserLocales(preferredLocales) {
    let localeAvailable = false;
    for (const preferredLocale of preferredLocales) {
        // The browser returns the locales in order of preference from highest to lowest, so the first one will always
        // be the most preferred.
        if (locales.has(preferredLocale)) {
            localeAvailable = true;
            applyPreferredLocale(preferredLocale);
            break;
        }
    }
    if (!localeAvailable) {
        applyPreferredLocale('en');
    }
}

function addListenerToLocaleOptions() {
    const locales = localeOptions.querySelectorAll('.dropdown-item');
    for (const locale of locales) {
        locale.addEventListener("click", event => {
            event.preventDefault();
            const selectedLocale = locale.dataset.lang;
            const languageFlag = locale.dataset.flag;
            const languageName = locale.textContent.trim().substring(5); // Remove the emoji
            changeLocale(selectedLocale, languageFlag, languageName);
        });
    }
}

function changeLocale(selectedLocale, languageFlag, languageName) {
    document.getElementById("actualFlag").textContent = languageFlag;
    document.getElementById("actualName").textContent = languageName;
    localStorage.setItem("selectedLocale", selectedLocale);
    updateApplicationTexts(selectedLocale);
}

function updateApplicationTexts(selectedLocale) {
    updateNavBarTexts(selectedLocale);
    updateFooterTexts(selectedLocale);
}

function updateNavBarTexts(selectedLocale) {
    const navBarTitle = document.getElementById('navBarTitle');
    const processButton = document.getElementById('processButton');
    navBarTitle.textContent = localeStrings[selectedLocale].navBarTexts.navBarTitleText;
    processButton.textContent = localeStrings[selectedLocale].navBarTexts.processButtonText;
}

function updateModalTexts(selectedLocale, modalType) {
    const modalTitle = document.getElementById('staticBackdropModal');
    const modalDescription = document.getElementById('staticBackdropModalDescription');
    const modalButton = document.getElementById('staticBackdropModalButton');
    modalTitle.textContent = localeStrings[selectedLocale].modalTexts[modalType].staticBackdropModalText;
    modalDescription.textContent = localeStrings[selectedLocale].modalTexts[modalType].staticBackdropModalDescriptionText;
    modalButton.textContent = localeStrings[selectedLocale].modalTexts[modalType].staticBackdropModalButtonText;
}

function updateFooterTexts(selectedLocale) {
    const footerDescription = document.getElementById('footerDescription');
    footerDescription.textContent = localeStrings[selectedLocale].footerTexts.footerDescriptionText;
}
