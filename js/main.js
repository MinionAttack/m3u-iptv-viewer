"use strict";

const processButton = document.getElementById('processButton');
if (processButton) {
    processButton.disabled = true;
}

document.addEventListener("DOMContentLoaded", function () {
    const fileForm = document.getElementById('fileForm');
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', (event) => validateFileFormat(event, fileForm, processButton));
});
