'use strict';

const modalElement = document.getElementById('messageModal');

const ModalTypes = Object.freeze({
    INVALID_FILE: Symbol('invalidFileTexts'),
    PROCESS_FILE: Symbol('processFileTexts'),
});

const ModalOptions = Object.freeze({
    DEFAULT: {backdrop: 'static', keyboard: false, focus: true},
});

function createModal(options, type) {
    const currentLocale = localStorage.getItem('selectedLocale');
    switch (type) {
        case ModalTypes.INVALID_FILE:
            updateModalTexts(currentLocale, ModalTypes.INVALID_FILE.description);
            break;
        case ModalTypes.PROCESS_FILE:
            updateModalTexts(currentLocale, ModalTypes.PROCESS_FILE.description, new Set(['title', 'description']));
            disableModalCloseButton();
            break;
        default:
            console.error(`Unsupported modal type ${type}`);
    }
    return new bootstrap.Modal(modalElement, options);
}

function disableModalCloseButton() {
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
