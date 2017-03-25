// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Dropzone Options
import {dropzoneOptions} from '../../lib/modules/dropzone/dropzone_config.js';

// -----------------------------------------------------------------------------
// - - - - - - - - - - - I M P O R T  V A R I A B L E S- - - - - - - - - - - - -
// -----------------------------------------------------------------------------

const Dropzone = require('dropzone');
let myDropzone;

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T - - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.import.onRendered(() => {
    // Initialize dropzone component
    myDropzone = new Dropzone('#dropzone', dropzoneOptions);
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.import.events({
    // Click import button
    "click #import": (e, t) => {
        // Files loaded from dropzone component
        const files = myDropzone.getAcceptedFiles();
        // For each file in files
        files.forEach(file => {
            // Initialize FileReader
            const reader = new FileReader();
            // Override reader onload function
            reader.onload = function (e) {
                // Parse file data to JSON
                const data = JSON.parse(e.target.result);

                if (data.order) {
                    // Import order
                    Meteor.call('importOrder', data.order.data);
                } else if (data.family) {
                    // Import family
                    Meteor.call('importFamily', data.family.data);
                } else if (data.gardens) {
                    // Import gardens
                    Meteor.call('importGardens', data.gardens.data);
                } else if (data.plants) {
                    // Import plants
                    Meteor.call('importPlants', data.plants.data);
                } else {
                    // Wrong file
                    console.log("Zły plik");
                }
            };
            // Initialize file read
            reader.readAsText(file);
        });
    }
});