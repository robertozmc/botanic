// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Semantic Calendar Options
import {datePickerOptions} from '../../../lib/modules/datepicker/datepicker_config.js';

// -----------------------------------------------------------------------------
// - - - - - - - - - - - S E E D S  A D D  F U N C T I O N S - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Adds record
 * @param {Object} e - event object.
 */
const addSeedData = (e) => {
    // Prevent default submit action
    e.preventDefault();
    // Get form values
    const plant = {
        id: $('.ui.form').form('get value', 'plant'),
        name: $('.ui.form').form('get field', 'plant')[0].parentNode.children[3].innerHTML
    };
    const quantity = parseInt($('.ui.form').form('get value', 'quantity'));
    const unit = $('.ui.form').form('get value', 'unit');
    let date = $('.ui.form').form('get value', 'date');
    const usage = $('.ui.form').form('get value', 'usage');
    const note = $('.ui.form').form('get value', 'note');

    // Format gather seeds date
    const dateArray = date.split('.');
    date = new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}T00:00:00.000Z`);

    // Create seed object
    const seedData = {
        plant,
        quantity,
        unit,
        date,
        usage,
        note,
        createdAt: new Date(),
        editedAt: null
    };
    // Call Meteor method addNewData with seeds specifier and seedData
    Meteor.call('addNewData', 'seeds', seedData);
    // Show notification
    notify('positive', 'Brawo!', 'Pomyślnie dodano rekord.');
    // Call Meteor method updateIndexSeminum with seedData
    if (usage === 'seminum') {
        Meteor.call('updateIndexSeminum', seedData);
    }
    // Move to seeds view page
    FlowRouter.go('seeds');
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.seedsAdd.onRendered(() => {
    // Initialize dropdowns
    $('#unit-dropdown').dropdown();
    $('#usage-dropdown').dropdown();
    $('#plant-dropdown').dropdown({
        allowAdditions: false,
        apiSettings: {
            action: 'get plants',
            saveRemoteData: false
        }
    });
    // Initialize form
    $('.ui.form').form({
        fields: {
            // Plant form field
            plant: {
                identifier: 'plant',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić nazwę rośliny'
                }]
            },
            // Seed quantity form field
            quantity: {
                identifier: 'quantity',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić ilość zebranych nasion'
                },
                {
                    type: 'regExp[/^[1-9][0-9]*$/]',
                    prompt: 'Dozwolone są tylko cyfry'
                }]
            },
            // Seed unit form field
            unit: {
                identifier: 'unit',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić jednostkę'
                }]
            },
            // Seed gather date form field
            date: {
                identifier: 'date',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić datę zbioru nasion'
                }]
            },
            // Seed usage form field
            usage: {
                identifier: 'usage',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić przeznaczenie zebranych nasion'
                }]
            }
        },
        inline: true,
        // Override onSuccess method
        onSuccess: (e) => {
            addSeedData(e);
            return true;
        }
    });
    // Initialize calendar
    $('.ui.calendar').calendar(datePickerOptions);
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.seedsAdd.events({
    // Click submit button to add seeds record
    "click #submit": (e, t) => {
        // if form is valid
        if ($('.ui.form').form('is valid')) {
            // then add seed data
            addSeedData(e);
        }
    }
});