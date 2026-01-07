'use strict';

const modalElement = document.getElementById('messageModal');

const ModalTypes = Object.freeze({
    LOCALE_SELECTION: Symbol('localeSelectionTexts'),
    INVALID_FILE: Symbol('invalidFileTexts'),
    DATABASE_OPERATION: Symbol('databaseOperationTexts'),
    LOAD_CHANNELS: Symbol('loadChannelsTexts'),
    PROCESS_FILE: Symbol('processFileTexts'),
});

const ModalOptions = Object.freeze({
    DEFAULT: {backdrop: 'static', keyboard: false, focus: true},
});

function createModal(options, type) {
    const currentLocale = localStorage.getItem('selectedLocale');
    switch (type) {
        case ModalTypes.LOCALE_SELECTION:
            updateModalTexts(currentLocale, ModalTypes.LOCALE_SELECTION.description);
            break;
        case ModalTypes.INVALID_FILE:
            updateModalTexts(currentLocale, ModalTypes.INVALID_FILE.description);
            break;
        case ModalTypes.DATABASE_OPERATION:
            updateModalTexts(currentLocale, ModalTypes.DATABASE_OPERATION.description);
            break;
        case ModalTypes.LOAD_CHANNELS:
            updateModalTexts(currentLocale, ModalTypes.LOAD_CHANNELS.description);
            animateModalCloseButton();
            break;
        case ModalTypes.PROCESS_FILE:
            updateModalTexts(currentLocale, ModalTypes.PROCESS_FILE.description, new Set(['title', 'description']));
            animateModalCloseButton();
            break;
        default:
            console.error(`Unsupported modal type ${type}`);
    }
    return new bootstrap.Modal(modalElement, options);
}

function changeStatusModalCloseButton(button, isDisabled, classToAdd, classToRemove) {
    button.disabled = isDisabled;
    if (button.classList.contains(classToRemove)) {
        button.classList.remove(classToRemove);
    }
    if (!button.classList.contains(classToAdd)) {
        button.classList.add(classToAdd);
    }
}

function animateModalCloseButton() {
    const closeButton = modalElement.querySelector('#staticBackdropModalButton');
    closeButton.replaceChildren();
    const spinner = document.createElement('span');
    spinner.classList.add('spinner-border', 'spinner-border-sm');
    spinner.setAttribute('aria-hidden', 'true');
    closeButton.appendChild(spinner);
    const hiddenText = document.createElement('span');
    hiddenText.classList.add('visually-hidden');
    hiddenText.setAttribute('role', 'status');
    closeButton.appendChild(hiddenText);
    closeButton.disabled = true;
}

function enableModalCloseButton(currentLocale, modalType, sections = new Set(['button'])) {
    const closeButton = modalElement.querySelector('#staticBackdropModalButton');
    closeButton.replaceChildren();
    updateModalTexts(currentLocale, modalType.description, sections);
    closeButton.disabled = false;
}
