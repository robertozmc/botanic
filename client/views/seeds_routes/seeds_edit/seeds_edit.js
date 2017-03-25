// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Semantic Calendar Options
import {datePickerOptions} from '../../../lib/modules/datepicker/datepicker_config.js';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Format date function
import {formatDate} from '../../../lib/utils.js';

// -----------------------------------------------------------------------------
// - - - - - - - - - S E E D S  E D I T  F U N C T I O N S - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Edits seed record
 * @param {Object} e - event object.
 * @param {Object} seed - seed object.
 */
const editSeedData = (e, seed) => {
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

    const dateArray = date.split('.');
    date = new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}T00:00:00.000Z`);

    // TODO: Change edit data to only edited fields not whole record

    // Changed seed data
    const seedData = {
        plant: plant,
        quantity: quantity,
        unit: unit,
        date: date,
        usage: usage,
        note: note,
        createdAt: seed.createdAt,
        editedAt: new Date()
    };
    // Call Meteor method editData
    Meteor.call('editData', 'seeds', seed._id, seedData);
    // Display notification
    notify('positive', 'Brawo!', 'Pomyślnie edytowano rekord.');
    // Go to seeds page
    FlowRouter.go('seeds');
};

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - S E E D S  E D I T- - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.seedsEdit.onCreated(function() {
    // Template instance (this)
    const instance = this;
    // Seed ID
    const seedId = FlowRouter.getParam('id');
    // Seed subscription
    instance.seedSubscription = new ReactiveVar(false);
    // Autorun
    instance.autorun(() => {
        // Subscribe to seeds colection
        instance.seedSubscription.set(instance.subscribe('seedRecord', seedId));
    });
    // Seed record
    instance.seed = () => {
        return seeds.findOne();
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.seedsEdit.onRendered(function() {
    // Template instance (this)
    const instance = this;
    // Autorun
    instance.autorun(() => {
        // If seed subscribtion is ready
        if (instance.seedSubscription.get().ready()) {
            // Seed record
            const seed = instance.seed();
            // Meteor timeout to properly set all form values
            Meteor.setTimeout(() => {
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
                // Initialize calendar
                $('.ui.calendar').calendar(datePickerOptions);
                // Initialize form
                $('.ui.form').form({
                    fields: {
                        plant: {
                            identifier: 'plant',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić nazwę rośliny'
                            }]
                        },
                        quantity: {
                            identifier: 'quantity',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić ilość zebranych nasion'
                            },
                            {
                                type: 'regExp[/^[1-9][0-9]*$/]',
                                prompt: 'Dozwolone są tylko liczby dodatnie'
                            }]
                        },
                        unit: {
                            identifier: 'unit',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić jednostkę'
                            }]
                        },
                        date: {
                            identifier: 'date',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić datę zbioru nasion'
                            }]
                        },
                        usage: {
                            identifier: 'usage',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić przeznaczenie zebranych nasion'
                            }]
                        }
                    },
                    inline: true,
                    onSuccess: (e) => {
                        editSeedData(e);
                        return true;
                    }
                });

                // Set form values
                $('#plant-dropdown').dropdown('set text', seed.plant.name);
                $('#plant-dropdown').dropdown('set value', seed.plant.id);
                $('#quantity').val(seed.quantity);

                switch (seed.unit) {
                    case 'piece':
                        $('#unit-dropdown').dropdown('set text', '<i class="cube icon"></i>Sztuk');
                        break;
                    case 'weight':
                        $('#unit-dropdown').dropdown('set text', '<i class="law icon"></i>Gramów');
                        break;
                    default:
                        break;
                }

                $('#unit-dropdown').dropdown('set value', seed.unit);
                $('.ui.calendar').calendar('set date', formatDate(seed.date));

                switch (seed.usage) {
                    case 'seminum':
                        $('#usage-dropdown').dropdown('set text', '<i class="leaf icon"></i>Seminum');
                        break;
                    case 'lab':
                        $('#usage-dropdown').dropdown('set text', '<i class="lab icon"></i>Laboratorium');
                        break;
                    default:
                        break;
                }

                $('#usage-dropdown').dropdown('set value', seed.usage);
                $('#note').text(seed.note);
            });
        }
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.seedsEdit.helpers({
    // Seed record helper
    seed: () => {
        return Template.instance().seed();
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.seedsEdit.events({
    // Click submit button to edit seed record
    'click #submit': (e, t) => {
        if ($('.ui.form').form('is valid')) {
            editSeedData(e, t.seed());
        }
    }
});