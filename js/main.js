'use strict';

document.addEventListener('DOMContentLoaded', function () {
    // When loading the page, use localStorage or the OS preference.
    const savedThemeMode = localStorage.getItem('themeMode');
    if (savedThemeMode) {
        applyTheme(savedThemeMode);
    } else if (globalThis.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
    // Listen for OS changes (Only if the user does not manually select the theme).
    globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.getItem('themeMode')) {
            applyTheme(event.matches ? 'dark' : 'light');
        }
    });

    // When loading the page, use localStorage or the browser preference.
    const savedSelectedLocale = localStorage.getItem('selectedLocale');
    if (savedSelectedLocale) {
        applyPreferredLocale(savedSelectedLocale);
    } else {
        // Reject locales with a hyphen, for example: en-US, es-ES.
        const preferredLocales = navigator.languages.filter(language => !language.includes('-'));
        findPreferredBrowserLocales(preferredLocales);
    }
    addListenerToLocaleOptions();

    const processButton = document.getElementById('processButton');
    if (processButton) {
        processButton.disabled = true;
    }

    const fileForm = document.getElementById('fileForm');
    const fileSelector = document.getElementById('fileInput');
    fileSelector.addEventListener('change', (event) => validateFileFormat(event, fileForm, processButton));
});
