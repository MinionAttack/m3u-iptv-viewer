"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', async (event) => {
        const isValid = await validateFileFormat(event.target.files[0]);
        if (!isValid) {
            const invalidFileModalOptions = {backdrop: 'static', keyboard: false, focus: true}
            const invalidFileModal = document.getElementById('invalidFileModal');
            const invalidBootstrapModal = new bootstrap.Modal(invalidFileModal, invalidFileModalOptions);
            invalidBootstrapModal.show();
        } else {
            console.info("The M3U file is valid!");
        }
    });
});
