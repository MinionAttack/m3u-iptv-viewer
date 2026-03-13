'use strict';

const locales = new Set(['en', 'es']);

const modalSections = new Set(['title', 'description', 'button']);

const localeStrings = {
    navBarTexts: {
        navBarTitleText: {
            en: 'M3U Viewer for IPTV',
            es: 'Visor de M3U para IPTV',
        },
        processButtonText: {
            en: 'Process',
            es: 'Procesar',
        },
    },
    searchBoxTexts: {
        placeholderText: {
            en: 'Search by name, group or subgroup',
            es: 'Busque por nombre, grupo o subgrupo',
        },
    },
    searchBoxSwitchesTexts: {
        tv: {
            en: 'TV Channels',
            es: 'Canales de TV',
        },
        tvSeries: {
            en: 'TV Series',
            es: 'Series de TV',
        },
        movies: {
            en: 'Movies',
            es: 'Películas',
        },
    },
    modalTexts: {
        localeSelectionTexts: {
            staticBackdropModalText: {
                en: 'Language selection',
                es: 'Selección del idioma',
            },
            staticBackdropModalDescriptionText: {
                en: 'There was a problem saving the new language selected. Please check your browser\'s console.',
                es: 'Hubo un problema al guardar el nuevo idioma seleccionado. Por favor, revise la consola del navegador.',
            },
            staticBackdropModalButtonText: {
                en: 'Accept',
                es: 'Aceptar',
            },
        },
        invalidFileTexts: {
            staticBackdropModalText: {
                en: 'Invalid M3U file',
                es: 'Fichero M3U no válido',
            },
            staticBackdropModalDescriptionText: {
                en: 'The M3U file you wish to process is invalid or incompatible.',
                es: 'El fichero M3U que desea procesar no es válido o es incompatible.',
            },
            staticBackdropModalButtonText: {
                en: 'Accept',
                es: 'Aceptar',
            },
        },
        databaseOperationTexts: {
            staticBackdropModalText: {
                en: 'Database management',
                es: 'Gestión de la base de datos',
            },
            staticBackdropModalDescriptionText: {
                en: 'There was a problem trying to operate with the database. Please check your browser\'s console.',
                es: 'Hubo un problema al intentar operar con la base de datos. Por favor, revise la consola del navegador.',
            },
            staticBackdropModalButtonText: {
                en: 'Accept',
                es: 'Aceptar',
            },
        },
        loadChannelsTexts: {
            staticBackdropModalText: {
                en: 'Saved data has been detected',
                es: 'Se han detectado datos guardados',
            },
            staticBackdropModalDescriptionText: {
                en: 'There is data saved from a previous load. You can start searching now.',
                es: 'Hay datos guardados de una carga previa. Puede comenzar a buscar ahora.',
            },
            staticBackdropModalButtonText: {
                en: 'Close',
                es: 'Cerrar',
            },
        },
        processFileTexts: {
            staticBackdropModalText: {
                en: 'M3U file processing',
                es: 'Procesado del archivo M3U',
            },
            staticBackdropModalDescriptionText: {
                en: 'Please wait until the file processing is complete. The duration depends on the size of the file.',
                es: 'Por favor, espere a que el procesado del fichero termine. La duración depende de lo grande que sea el fichero.',
            },
            staticBackdropModalButtonText: {
                en: 'Close',
                es: 'Cerrar',
            },
        },
    },
    cardTexts: {
        cardCategoryText: {
            en: 'Category:',
            es: 'Categoría:',
        },
        cardLogoAltText: {
            en: 'Logo',
            es: 'Logotipo',
        },
        cardGroupText: {
            en: 'Group:',
            es: 'Grupo:',
        },
        cardSubgroupText: {
            en: 'Subgroup:',
            es: 'Subgrupo:',
        },
        cardCopyIconText: {
            en: 'Copy link',
            es: 'Copiar enlace',
        },
    },
    footerTexts: {
        footerDescriptionText: {
            en: 'See this project on',
            es: 'Vea este proyecto en',
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
    updateSearchSwitchTexts(selectedLocale);
    updateSearchBoxTexts(selectedLocale);
    updateCardTexts(selectedLocale);
    updateFooterTexts(selectedLocale);
}

function updateNavBarTexts(selectedLocale) {
    const navBarTitle = document.getElementById('navBarTitle');
    const processButton = document.getElementById('processButton');
    if (navBarTitle) {
        navBarTitle.textContent = localeStrings.navBarTexts.navBarTitleText[selectedLocale];
    }
    if (processButton) {
        processButton.textContent = localeStrings.navBarTexts.processButtonText[selectedLocale];
    }
}

function updateSearchSwitchTexts(selectedLocale) {
    const tvSwitch = document.getElementById('tvSwitchLabelText');
    const tvSeriesSwitch = document.getElementById('tvSeriesSwitchLabelText');
    const moviesSwitch = document.getElementById('moviesSwitchLabelText');
    if (tvSwitch) {
        tvSwitch.textContent = localeStrings.searchBoxSwitchesTexts.tv[selectedLocale];
    }
    if (tvSeriesSwitch) {
        tvSeriesSwitch.textContent = localeStrings.searchBoxSwitchesTexts.tvSeries[selectedLocale];
    }
    if (moviesSwitch) {
        moviesSwitch.textContent = localeStrings.searchBoxSwitchesTexts.movies[selectedLocale];
    }
}

function updateSearchBoxTexts(selectedLocale) {
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.placeholder = localeStrings.searchBoxTexts.placeholderText[selectedLocale];
    }
}

function updateModalTexts(selectedLocale, modalType, sections = modalSections) {
    for (const section of sections) {
        switch (section) {
            case 'title':
                if (modalTitle) {
                    modalTitle.textContent = localeStrings.modalTexts[modalType].staticBackdropModalText[selectedLocale];
                }
                break;
            case 'description':
                if (modalDescription) {
                    modalDescription.textContent = localeStrings.modalTexts[modalType].staticBackdropModalDescriptionText[selectedLocale];
                }
                break;
            case 'button':
                if (modalButton) {
                    modalButton.textContent = localeStrings.modalTexts[modalType].staticBackdropModalButtonText[selectedLocale];
                }
                break;
            default:
                console.error(`Unsupported modal section ${section}`);
        }
    }
}

function updateCardTexts(selectedLocale) {
    const cards = document.querySelectorAll('.card');
    for (const card of cards) {
        const cardLogo = card.querySelector("[id^='logo-']");
        const cardCategory = card.querySelector("[id^='category-']");
        const cardGroup = card.querySelector("[id^='group-']");
        const cardSubgroup = card.querySelector("[id^='subgroup-']");
        updateCardLogoText(selectedLocale, cardLogo);
        updateCardBodySectionText(cardCategory, localeStrings.cardTexts.cardCategoryText[selectedLocale]);
        updateCardBodySectionText(cardGroup, localeStrings.cardTexts.cardGroupText[selectedLocale]);
        updateCardBodySectionText(cardSubgroup, localeStrings.cardTexts.cardSubgroupText[selectedLocale]);
    }
}

function updateCardLogoText(selectedLocale, cardLogo) {
    if (cardLogo) {
        const logoAlt = cardLogo.getAttribute('alt');
        const lastSpaceIndex = Math.max(0, logoAlt.lastIndexOf(" "));
        const channelName = logoAlt.substring(0, lastSpaceIndex);
        cardLogo.alt = `${channelName} ${localeStrings.cardTexts.cardLogoAltText[selectedLocale]}`;
    }
}

function updateCardBodySectionText(bodySection, bodySectionText) {
    if (bodySection) {
        const channelSectionText = bodySection.textContent.split(': ', 2);
        if (channelSectionText.length === 2) {
            bodySection.textContent = `${bodySectionText} ${channelSectionText[1]}`;
        }
    }
}

function updateFooterTexts(selectedLocale) {
    const footerDescription = document.getElementById('footerDescription');
    if (footerDescription) {
        footerDescription.textContent = localeStrings.footerTexts.footerDescriptionText[selectedLocale];
    }
}
