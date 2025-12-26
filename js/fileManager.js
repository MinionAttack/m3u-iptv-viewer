'use strict';

async function validateFileFormat(event, fileForm, processButton) {
    const file = event.target.files[0];
    if (!file) {
        return false;
    }
    let firstTwoLines = await readFile(file);
    const isValid = checkFirstTwoLines(firstTwoLines);
    if (isValid) {
        console.info('The M3U file is valid!');
        manageButtonStatus(processButton, false, 'btn-outline-success', 'btn-outline-secondary');
    } else {
        fileForm.reset();
        manageButtonStatus(processButton, true, 'btn-outline-secondary', 'btn-outline-success');
        const invalidFileModalOptions = {backdrop: 'static', keyboard: false, focus: true};
        const invalidBootstrapModal = createModal(invalidFileModalOptions, ModalTypes.INVALID_FILE);
        invalidBootstrapModal.show();
    }
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

async function readFile(file, preview = true) {
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
            let lines = '';
            if (preview) {
                lines = full.split(/\r?\n/, 2).filter(line => '' !== line);
                if (lines?.length === 2) {
                    return lines.slice(0, 2);
                }
                return [];
            } else {
                lines = full.split(/\r?\n/).filter(line => '' !== line);
                leftover = lines.pop();
                for (const line of lines) {
                    processChannelEntry(line);
                }
            }
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        if (!preview && leftover) {
            processChannelEntry(leftover);
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
        return lines[0]?.startsWith('#EXTM3U') && lines[1]?.startsWith('#EXTINF:');
    }
    return false;
}

function processChannelEntry(channelData) {
    // TODO
}
