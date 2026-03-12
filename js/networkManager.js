'use strict';

const FETCH_OPTIONS = {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit'
}

function fetchChannelLogo(channelId, logoUrl) {
    const cardLogoElement = document.getElementById(`logo-${channelId}`);
    fetch(logoUrl, FETCH_OPTIONS)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
            }
            return response.blob();
        })
        .then(logoBlob => {
            if (!cardLogoElement) {
                console.warn(`DOM element for 'logo-${channelId}' not found. Skipping logo fetch for channel ${channelId}.`);
                return;
            }
            if (cardLogoElement.src?.startsWith('blob:')) {
                URL.revokeObjectURL(cardLogoElement.src);
            }
            cardLogoElement.src = URL.createObjectURL(logoBlob);
        })
        .catch(error => {
            console.error(`Error fetching the logo for channel ${channelId}: ${error}`);
            if (cardLogoElement) {
                cardLogoElement.src = '../images/http_cat_not_found.jpg';
            }
        });
}

function fetchBatchLogos(logosBatchData) {
    for (const [channelId, logoUrl] of logosBatchData) {
        fetchChannelLogo(channelId, logoUrl);
    }
}
