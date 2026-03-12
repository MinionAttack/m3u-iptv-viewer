'use strict';

const EXT_M3U_PREFIX = '#EXTM3U';
const EXT_INF_PREFIX = '#EXTINF:';

const ICON_STATUS_TIMEOUT = 2000;

function clearAllChannels() {
    const channelsContainer = document.getElementById('channelsContainer');
    channelsContainer?.replaceChildren();
}

function checkFirstTwoLines(lines) {
    // https://en.wikipedia.org/wiki/M3U
    if (lines?.length === 2) {
        return lines[0]?.startsWith(EXT_M3U_PREFIX) && lines[1]?.startsWith(EXT_INF_PREFIX);
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

const processChannelBatch = (channelsBatch, selectedLocale) => {
    // Use requestAnimationFrame to wait for the browser to be ready to paint and avoid blocking the user interface.
    return globalThis.requestAnimationFrame(() => {
        // Create a DocumentFragment in memory and do a single appendChild at the end of the batch. This avoids
        // ‘Reflow’ (layout recalculation) for each element.
        const fragment = document.createDocumentFragment();
        const batchLogosData = new Map();
        channelsBatch.forEach(channel => {
            const cardDiv = createCardDiv();
            const cardImage = createCardImageElement(selectedLocale, channel.tvgId, channel.tvgName);
            cardDiv.appendChild(cardImage);
            const cardBody = createCardBodyDiv();
            const cardTitle = createCardTitleElement(channel.tvgName);
            cardBody.appendChild(cardTitle);
            const thematicBreak = document.createElement('hr');
            cardBody.appendChild(thematicBreak);
            const cardDescription = createCardDescriptionElement(selectedLocale, channel.tvgId,
                channel.category, channel.group, channel.subgroup);
            cardBody.appendChild(cardDescription);
            cardDiv.appendChild(cardBody);
            const cardButton = createCardButtonElement(selectedLocale, channel.url);
            cardDiv.appendChild(cardButton);
            fragment.appendChild(cardDiv);
            if (channel.tvgId) {
                batchLogosData.set(channel.tvgId, channel.tvgLogo);
            }
        });
        // Print all batch in a single DOM operation
        document.getElementById('channelsContainer').appendChild(fragment);
        // Retrieve all logos from the batch
        fetchBatchLogos(batchLogosData);
    });
}

function createCardDiv() {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'box-shadow', 'width-18');
    return cardDiv;
}

function createCardImageElement(selectedLocale, id, name) {
    const cardImage = document.createElement('img');
    if (id) {
        cardImage.id = `logo-${id}`;
    }
    cardImage.classList.add('card-img-top', 'channel-logo');
    cardImage.alt = `${name} ${localeStrings[selectedLocale].cardTexts.cardLogoAltText}`;
    cardImage.src = '../images/http_cat_no_content.jpg';
    return cardImage;
}

function createCardBodyDiv() {
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    return cardBody;
}

function createCardTitleElement(name) {
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title', 'text-center');
    cardTitle.textContent = name;
    return cardTitle;
}

function createCardDescriptionElement(selectedLocale, id, category, group, subgroup) {
    const separator = document.createElement('br');
    const cardDescription = document.createElement('p');
    cardDescription.classList.add('card-text');
    if (category) {
        const descriptionCategoryItem = document.createElement('span');
        descriptionCategoryItem.id = `category-${id}`;
        descriptionCategoryItem.textContent = `${localeStrings[selectedLocale].cardTexts.cardCategoryText} ${category}`;
        cardDescription.appendChild(descriptionCategoryItem);
    }
    if (group) {
        cardDescription.appendChild(separator.cloneNode(false));
        const descriptionGroupItem = document.createElement('span');
        descriptionGroupItem.id = `group-${id}`;
        descriptionGroupItem.textContent = `${localeStrings[selectedLocale].cardTexts.cardGroupText} ${group}`;
        cardDescription.appendChild(descriptionGroupItem);
    }
    if (subgroup) {
        cardDescription.appendChild(separator.cloneNode(false));
        const descriptionSubgroupItem = document.createElement('span');
        descriptionSubgroupItem.id = `subgroup-${id}`;
        descriptionSubgroupItem.textContent = `${localeStrings[selectedLocale].cardTexts.cardSubgroupText} ${subgroup}`;
        cardDescription.appendChild(descriptionSubgroupItem);
    }
    return cardDescription;
}

function createCardButtonElement(selectedLocale, url) {
    const cardButton = document.createElement('button');
    cardButton.type = 'button';
    cardButton.classList.add('button', 'btn-outline-primary', 'd-block', 'mx-auto', 'rounded', 'mb-3', 'copy-icon-width');
    cardButton.ariaLabel = `${localeStrings[selectedLocale].cardTexts.cardCopyIconText}`;
    cardButton.dataset.url = url;
    const cardIcon = document.createElement('i');
    cardIcon.classList.add('bi', 'bi-clipboard');
    cardButton.appendChild(cardIcon);
    cardButton.addEventListener('click', (event) => {
        const urlToCopy = event?.currentTarget?.dataset?.url;
        const icon = event?.currentTarget?.querySelector('i');
        if (urlToCopy) {
            navigator.clipboard.writeText(urlToCopy)
                .then(() => {
                    changeIconStatus(icon, 'bi-clipboard', 'bi-clipboard-check', 'text-success');
                })
                .catch(error => {
                    console.error(`The URL could not be copied to the clipboard: ${error}`);
                    changeIconStatus(icon, 'bi-clipboard', 'bi-clipboard2-x', 'text-danger');
                });
        }
    });
    return cardButton;
}

function changeIconStatus(icon, originalClass, newClass, textType) {
    icon?.classList.remove(originalClass);
    icon?.classList.add(newClass, textType);
    setTimeout(() => {
        icon?.classList.remove(newClass, textType);
        icon?.classList.add(originalClass);
    }, ICON_STATUS_TIMEOUT);
}
