'use strict';

const locales = new Set(['en', 'es']);

const modalSections = new Set(['title', 'description', 'button']);

const localeStrings = {
    en: {
        navBarTexts: {
            navBarTitleText: 'M3U IPTV Viewer',
            processButtonText: 'Process',
        },
        searchBoxTexts: {
            placeholderText: 'Search for a channel by name, group, or subgroup',
        },
        modalTexts: {
            localeSelectionTexts: {
                staticBackdropModalText: 'Language selection',
                staticBackdropModalDescriptionText: 'There was a problem saving the new language you selected. Please check your browser\'s console.',
                staticBackdropModalButtonText: 'Accept',
            },
            invalidFileTexts: {
                staticBackdropModalText: 'Invalid M3U file',
                staticBackdropModalDescriptionText: 'The M3U file you wish to process is invalid or incompatible.',
                staticBackdropModalButtonText: 'Accept',
            },
            databaseOperationTexts: {
                staticBackdropModalText: 'Database management',
                staticBackdropModalDescriptionText: 'There was a problem trying to operate with the database. Please check your browser\'s console.',
                staticBackdropModalButtonText: 'Accept',
            },
            loadChannelsTexts: {
                staticBackdropModalText: 'Saved data has been detected',
                staticBackdropModalDescriptionText: 'There are channels saved from a previous load. Please wait while the channels are loading.',
                staticBackdropModalButtonText: 'Close',
            },
            processFileTexts: {
                staticBackdropModalText: 'M3U file processing',
                staticBackdropModalDescriptionText: 'Please wait until the file processing is complete. The duration depends on the size of the file.',
                staticBackdropModalButtonText: 'Close',
            },
        },
        footerTexts: {
            footerDescriptionText: 'See this project on',
        },
    },
    es: {
        navBarTexts: {
            navBarTitleText: 'Visor de M3U para IPTV',
            processButtonText: 'Procesar',
        },
        searchBoxTexts: {
            placeholderText: 'Busque un canal por nombre, grupo o subgrupo',
        },
        modalTexts: {
            localeSelectionTexts: {
                staticBackdropModalText: 'Selección del idioma',
                staticBackdropModalDescriptionText: 'Hubo un problema al guardar el nuevo idioma seleccionado. Por favor, revise la consola del navegador.',
                staticBackdropModalButtonText: 'Aceptar',
            },
            invalidFileTexts: {
                staticBackdropModalText: 'Fichero M3U no válido',
                staticBackdropModalDescriptionText: 'El fichero M3U que desea procesar no es válido o es incompatible.',
                staticBackdropModalButtonText: 'Aceptar',
            },
            databaseOperationTexts: {
                staticBackdropModalText: 'Gestión de la base de datos',
                staticBackdropModalDescriptionText: 'Hubo un problema al intentar operar con la base de datos. Por favor, revise la consola del navegador.',
                staticBackdropModalButtonText: 'Aceptar',
            },
            loadChannelsTexts: {
                staticBackdropModalText: 'Se han detectado datos guardados',
                staticBackdropModalDescriptionText: 'Hay canales guardados de una carga previa. Por favor, espere mientras se cargan los canales.',
                staticBackdropModalButtonText: 'Cerrar',
            },
            processFileTexts: {
                staticBackdropModalText: 'Procesado del archivo M3U',
                staticBackdropModalDescriptionText: 'Por favor, espere a que el procesado del fichero termine. La duración depende de lo grande que sea el fichero.',
                staticBackdropModalButtonText: 'Cerrar',
            },
        },
        footerTexts: {
            footerDescriptionText: 'Vea este proyecto en',
        },
    },
};

const modalTitle = document.getElementById('staticBackdropModal');
const modalDescription = document.getElementById('staticBackdropModalDescription');
const modalButton = document.getElementById('staticBackdropModalButton');

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
    try {
        localStorage.setItem("selectedLocale", selectedLocale);
    } catch (error) {
        console.error(`Unable to save the new locale value: ${error}`);
        const changeLocaleModal = createModal(ModalOptions.DEFAULT, ModalTypes.LOCALE_SELECTION);
        changeLocaleModal.show();
    }
    updateApplicationTexts(selectedLocale);
}

function updateApplicationTexts(selectedLocale) {
    updateNavBarTexts(selectedLocale);
    updateSearchBoxTexts(selectedLocale);
    updateFooterTexts(selectedLocale);
}

function updateNavBarTexts(selectedLocale) {
    const navBarTitle = document.getElementById('navBarTitle');
    const processButton = document.getElementById('processButton');
    if (navBarTitle) {
        navBarTitle.textContent = localeStrings[selectedLocale].navBarTexts.navBarTitleText;
    }
    if (processButton) {
        processButton.textContent = localeStrings[selectedLocale].navBarTexts.processButtonText;
    }
}

function updateSearchBoxTexts(selectedLocale) {
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.placeholder = localeStrings[selectedLocale].searchBoxTexts.placeholderText;
    }
}

function updateModalTexts(selectedLocale, modalType, sections = modalSections) {
    for (const section of sections) {
        switch (section) {
            case 'title':
                if (modalTitle) {
                    modalTitle.textContent = localeStrings[selectedLocale].modalTexts[modalType].staticBackdropModalText;
                }
                break;
            case 'description':
                if (modalDescription) {
                    modalDescription.textContent = localeStrings[selectedLocale].modalTexts[modalType].staticBackdropModalDescriptionText;
                }
                break;
            case 'button':
                if (modalButton) {
                    modalButton.textContent = localeStrings[selectedLocale].modalTexts[modalType].staticBackdropModalButtonText;
                }
                break;
            default:
                console.error(`Unsupported modal section ${section}`);
        }
    }
}

function updateFooterTexts(selectedLocale) {
    const footerDescription = document.getElementById('footerDescription');
    if (footerDescription) {
        footerDescription.textContent = localeStrings[selectedLocale].footerTexts.footerDescriptionText;
    }
}
