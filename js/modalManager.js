'use strict';

const modalElement = document.getElementById('messageModal');

const ModalTypes = Object.freeze({
    INVALID_FILE: Symbol('invalidFileTexts'),
});

function createModal(options, type) {
    const currentLocale = localStorage.getItem('selectedLocale');
    switch (type) {
        case ModalTypes.INVALID_FILE:
            updateModalTexts(currentLocale, ModalTypes.INVALID_FILE.description);
            break;
        default:
            console.error(`Unsupported modal type ${type}`);
    }
    return new bootstrap.Modal(modalElement, options);
}
