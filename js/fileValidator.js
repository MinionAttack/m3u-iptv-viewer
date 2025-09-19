'use strict';

async function validateFileFormat(event, fileForm, processButton) {
    const file = event.target.files[0];
    if (!file) return false;
    let firstTwoLines = await readFirstTwoLines(file);
    const isValid = checkFirstTwoLines(firstTwoLines);
    if (!isValid) {
        fileForm.reset();
        manageButtonStatus(processButton, true, 'btn-outline-secondary', 'btn-outline-success');
        const invalidFileModalOptions = {backdrop: 'static', keyboard: false, focus: true}
        const invalidFileModal = document.getElementById('invalidFileModal');
        const invalidBootstrapModal = new bootstrap.Modal(invalidFileModal, invalidFileModalOptions);
        invalidBootstrapModal.show();
    } else {
        console.info('The M3U file is valid!');
        manageButtonStatus(processButton, false, 'btn-outline-success', 'btn-outline-secondary');
    }
}

async function readFirstTwoLines(file) {
    // https://medium.com/@AlexanderObregon/parsing-large-files-in-the-browser-using-javascript-streams-api-78cb88f30d23
    const decoder = new TextDecoder('utf-8');
    const reader = file?.stream().getReader();
    let leftover = '';
    try {
        while (true) {
            const {value, done} = await reader.read();
            if (done) break;
            const text = decoder?.decode(value, {stream: true});
            const full = leftover + text;
            const lines = full.split(/\r?\n/, 2).filter(line => '' !== line);
            if (lines?.length === 2) {
                return lines.slice(0, 2);
            }
            leftover = lines.pop();
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
    } catch (error) {
        console.error('Error reading the file to check if it is valid:', error);
    } finally {
        decoder.decode(); // Flush any leftover characters.
        reader.cancel().catch(error => {
            console.warn('Error cancelling stream reading:', error);
        });
    }
    return [];
}

function checkFirstTwoLines(lines) {
    // https://en.wikipedia.org/wiki/M3U
    if (lines?.length === 2) {
        const FIRST_LINE_REGEX = /^#EXTM3U$/;
        return FIRST_LINE_REGEX.test(lines[0]) && lines[1]?.startsWith('#EXTINF:');
    }
    return false;
}

function manageButtonStatus(button, isDisabled, classToAdd, classToRemove) {
    button.disabled = isDisabled;
    if (button.classList.contains(classToRemove)) {
        button.classList.remove(classToRemove);
    }
    if (!button.classList.contains(classToAdd)) {
        button.classList.add(classToAdd);
    }
}
