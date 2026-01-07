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