// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - D R O P Z O N E   C O N F I G U R A T I O N - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import "dropzone/dist/dropzone.css"; 

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
* Dropzone Preview Template
*/
const previewTemplate =
    `<div class="dz-preview dz-file-preview">
      <div class="dz-details">
        <div class="dz-filename"><span data-dz-name></span></div>
        <div class="dz-size" data-dz-size></div>
        <img data-dz-thumbnail />
      </div>
      <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
      <div class="dz-success-mark"><span>✔</span></div>
      <div class="dz-error-mark"><span>✘</span></div>
      <div class="dz-error-message"><span data-dz-errormessage></span></div>
    </div>`
;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
* Dropzone Options
*/
export const dropzoneOptions = {
    // previewTemplate: previewTemplate,
    uploadMultiple: true,
    addRemoveLinks: true,
    dictDefaultMessage: "Kliknij, bądź przeciągnij pliki tutaj",
    dictFallbackMessage: "Przeglądarka nie wspiera funkcji drag'n'drop",
    dictInvalidFileType: "Niedozwolony format pliku",
    dictFileTooBig: "Plik jest za duży",
    dictMaxFilesExceeded: "Osiągnięto limit plików",
    dictCancelUpload: "Anuluj wysyłanie pliku",
    dictCancelUploadConfirmation: "Czy na pewno anulować wysyłanie tego pliku?",
    dictRemoveFile: "Usuń plik"
};