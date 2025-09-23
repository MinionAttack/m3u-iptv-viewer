'use strict';

document.addEventListener('DOMContentLoaded', function () {
    // When loading the page, use localStorage or the OS preference.
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
        applyTheme(savedMode);
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

    const processButton = document.getElementById('processButton');
    if (processButton) {
        processButton.disabled = true;
    }

    const fileForm = document.getElementById('fileForm');
    const fileSelector = document.getElementById('fileInput');
    fileSelector.addEventListener('change', (event) => validateFileFormat(event, fileForm, processButton));
});
