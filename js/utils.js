'use strict';

function checkFirstTwoLines(lines) {
    // https://en.wikipedia.org/wiki/M3U
    if (lines?.length === 2) {
        return lines[0]?.startsWith('#EXTM3U') && lines[1]?.startsWith('#EXTINF:');
    }
    return false;
}

function extendedConvertMilliseconds(ms, text) {
    const days = Math.floor(ms / (24 * 3600000));
    ms %= (24 * 3600000);
    const remainder = convertMilliseconds(ms);
    const fullTime = {
        days: days,
        ...remainder,
    };
    console.info(`${text} ${fullTime.days} days, ${fullTime.hours} hours, ${fullTime.minutes} minutes and ${fullTime.seconds} seconds.`);
}

function convertMilliseconds(ms) {
    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;
    const minutes = Math.floor(ms / 60000);
    ms %= 60000;
    const seconds = Math.floor(ms / 1000);
    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
    };
}

function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('d-none');
    }
}

function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('d-none');
    }
}

function addListenersToSearchBoxSwitches(elementIds) {
    for (const elementId of elementIds) {
        const elementNode = document.getElementById(elementId);
        if (elementNode) {
            elementNode.addEventListener('click', (event) => event.preventDefault());
            elementNode.addEventListener('change', (event) => {
                synchroniseAriaChecked(event.target);
            });
        }
    }
}

function synchroniseAriaChecked(element) {
    if (element) {
        element.setAttribute('aria-checked', element.checked ? 'true' : 'false');
    }
}

function updateCategoryAvailability(categories) {
    const tvSwitch = document.getElementById('tvSwitch');
    const tvSeriesSwitch = document.getElementById('tvSeriesSwitch');
    const moviesSwitch = document.getElementById('moviesSwitch');
    Object.entries(categories).forEach(([category, exists]) => {
        switch (category) {
            case 'live':
                tvSwitch.checked = exists;
                synchroniseAriaChecked(tvSwitch);
                break;
            case 'series':
                tvSeriesSwitch.checked = exists;
                synchroniseAriaChecked(tvSeriesSwitch);
                break;
            case 'movie':
                moviesSwitch.checked = exists;
                synchroniseAriaChecked(moviesSwitch);
                break;
            default:
                console.warn(`Unsupported category: ${category}`);
        }
    });
}

function doContentAvailabilityCheck() {
    checkAvailableContentForSearch()
        .then(availableContent => {
            updateCategoryAvailability(availableContent);
            showElement('searchBoxContainer');
        })
        .catch(error => {
            console.error(`Error checking the type of content available for searching: ${error}`);
        });
}

const processChannelBatch = (channelsBatch) => {
    // Use requestAnimationFrame to wait for the browser to be ready to paint and avoid blocking the user interface.
    return globalThis.requestAnimationFrame(() => {
        // Create a DocumentFragment in memory and do a single appendChild at the end of the batch. This avoids
        // ‘Reflow’ (layout recalculation) for each element.
        const fragment = document.createDocumentFragment();
        channelsBatch.forEach(channel => {
            // TODO: create card and fetch logo
            const div = document.createElement('div');
            div.textContent = channel.name;
            fragment.appendChild(div);
        });
        // Print all batch in a single DOM operation
        //document.getElementById('channelsContainer').appendChild(fragment);
    });
}
