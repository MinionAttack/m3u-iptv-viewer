'use strict';

async function validateFileFormat(event, fileForm, processButton) {
    const file = event.target.files[0];
    if (file) {
        let firstTwoLines = await readFile(file);
        const isValid = checkFirstTwoLines(firstTwoLines);
        if (isValid) {
            changeStatusModalCloseButton(processButton, false, 'btn-outline-success', 'btn-outline-secondary');
        } else {
            fileForm.reset();
            hideElement('searchBox');
            changeStatusModalCloseButton(processButton, true, 'btn-outline-secondary', 'btn-outline-success');
            const invalidBootstrapModal = createModal(ModalOptions.DEFAULT, ModalTypes.INVALID_FILE);
            invalidBootstrapModal.show();
        }
    } else {
        fileForm.reset();
        changeStatusModalCloseButton(processButton, true, 'btn-outline-secondary', 'btn-outline-success');
    }
}

async function readFile(file, preview = true) {
    const startTime = performance.now();
    const decoder = new TextDecoder('utf-8');
    const reader = file?.stream().getReader();
    let leftover = '';
    let allLines = [];
    try {
        while (true) {
            const {value, done} = await reader.read();
            if (done) {
                break;
            }
            const text = decoder?.decode(value, {stream: true});
            const full = leftover + text;
            const lines = full.split(/\r?\n/).filter(line => '' !== line);
            leftover = lines.pop();
            if (preview) {
                allLines.push(...lines);
                if (allLines.length >= 2) {
                    return allLines.slice(0, 2);
                }
                return [];
            } else {
                await processChannelEntries(lines);
            }
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        if (leftover) {
            if (preview) {
                allLines.push(leftover);
            } else {
                await processChannelEntries([leftover]);
            }
        }
        const endTime = performance.now();
        extendedConvertMilliseconds(endTime - startTime, 'Parsing and insertion completed in');
    } catch (error) {
        console.error(`Error reading the file to check if it is valid: ${error}`);
    } finally {
        decoder.decode(); // Flush any leftover characters.
        reader.cancel().catch(error => {
            console.warn(`Error cancelling stream reading: ${error}`);
        });
    }
    return preview ? allLines.slice(0, 2) : [];
}

function processFile(event, fileSelector) {
    changeStatusModalCloseButton(event.target, true, 'btn-outline-secondary', 'btn-outline-success');
    const file = fileSelector?.files[0];
    if (file) {
        closeDBConnection()
            .then(() =>
                deleteDatabase()
                    .then(() =>
                        connectToDB()
                            .then(() => doProcessing(file, fileSelector))
                            .catch(error => {
                                console.error(`Error connecting to the database: ${error}`);
                                const connectDatabaseModal = createModal(ModalOptions.DEFAULT, ModalTypes.DATABASE_OPERATION);
                                connectDatabaseModal.show();
                                fileSelector.value = '';
                            }))
                    .catch(error => {
                        console.error(`Error clearing the database: ${error}`);
                        const clearDatabaseModal = createModal(ModalOptions.DEFAULT, ModalTypes.DATABASE_OPERATION);
                        clearDatabaseModal.show();
                        fileSelector.value = '';
                    }))
            .catch(error => {
                console.error(`Error closing the database: ${error}`);
                const connectDatabaseModal = createModal(ModalOptions.DEFAULT, ModalTypes.DATABASE_OPERATION);
                connectDatabaseModal.show();
                fileSelector.value = '';
            });
    }
}

function doProcessing(file, fileSelector) {
    const processFileModal = createModal(ModalOptions.DEFAULT, ModalTypes.PROCESS_FILE);
    processFileModal.show();
    readFile(file, false)
        .then(() => {
            // TODO: create card and fetch logo
        })
        .catch(error => {
            console.error(`Error processing the file: ${error}`);
        })
        .finally(() => {
            const currentLocale = localStorage.getItem('selectedLocale');
            enableModalCloseButton(currentLocale, ModalTypes.PROCESS_FILE);
            fileSelector.value = '';
        });
}
