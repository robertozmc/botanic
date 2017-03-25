// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Semantic Modal Options
import {modalOptions} from '../../../lib/modules/modal/modal_config.js';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Semantic Calendar Options
import {datePickerOptions} from '../../../lib/modules/datepicker/datepicker_config.js';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// formatDivision, formatClade, formatType, formatTypeOfProtection, formatImportType  functions
import {formatDivision, formatClade, formatType, formatTypeOfProtection, formatImportType} from '../../../lib/utils.js';


// -----------------------------------------------------------------------------
// - - - - - - - - - P L A N T S  E D I T  F U N C T I O N S - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Edits plant record
 * @param {Object} e - event object.
 * @param {Object} plant - plant object.
 */
const editPlantData = (e, plant) => {
    // Prevent default submit action
    e.preventDefault();
    // Get form values
    const catalogNumber      = $('.ui.form').form('get value', 'catalogNumber');
    const genus              = $('.ui.form').form('get value', 'genus');
    const species            = $('.ui.form').form('get value', 'species');
    const variety            = $('.ui.form').form('get value', 'variety');
    const subspecies         = $('.ui.form').form('get value', 'subspecies');
    const cultivar           = $('.ui.form').form('get value', 'cultivar');
    const authorship         = $('.ui.form').form('get value', 'authorship');
    const hybrid             = $('#hybrid').hasClass('active');
    const namePL             = $('.ui.form').form('get value', 'namePL');
    const division           = $('.ui.form').form('get value', 'division');
    const clade              = $('.ui.form').form('get value', 'clade');
    const order              = {
        id:                    $('.ui.form').form('get value', 'order'),
        name:                  $('.ui.form').form('get field', 'order')[0].parentNode.children[3].innerHTML
    };
    const family             = {
        id:                    $('.ui.form').form('get value', 'family'),
        name:                  $('.ui.form').form('get field', 'family')[0].parentNode.children[3].innerHTML
    };
    const type               = $('.ui.form').form('get value', 'type');
    let continent            = $('.ui.form').form('get value', 'continent');
    const description        = $('.ui.form').form('get value', 'description');
    const habitat            = $('.ui.form').form('get value', 'habitat');
    const typeOfProtection   = $('.ui.form').form('get value', 'typeOfProtection');
    const endangered         = $('#endangered').hasClass('active');
    const rawMaterial        = $('.ui.form').form('get value', 'rawMaterial');
    const abilityToSow       = $('.ui.form').form('get value', 'abilityToSow');
    const abilityToPropagate = $('.ui.form').form('get value', 'abilityToPropagate');
    let place                = $('.ui.form').form('get value', 'place');
    let quantity             = $('.ui.form').form('get value', 'quantity');
    const importType         = $('.ui.form').form('get value', 'importType');
    let importYear           = $('.ui.form').form('get value', 'importYear');
    const importGarden       = $('.ui.form').form('get value', 'importGarden');
    const researchAtPharmacy = $('#researchAtPharmacy').hasClass('active');
    const herbarium          = $('#herbarium').hasClass('active');
    const confirmed          = $('#confirmed').hasClass('active');
    const pharmacopoeial     = $('#pharmacopoeial').hasClass('active');
    const medicinal          = $('#medicinal').hasClass('active');
    const poisonous          = $('#poisonous').hasClass('active');
    const edible             = $('#edible').hasClass('active');
    const spice              = $('#spice').hasClass('active');
    const appropriable       = $('#appropriable').hasClass('active');
    const ornamental         = $('#ornamental').hasClass('active');
    const bulb               = $('#bulb').hasClass('active');
    const evergreen          = $('#evergreen').hasClass('active');
    const note               = $('.ui.form').form('get value', 'note');
    let state                = plant.state;

    // Split continent
    continent = continent.split(',');
    // Split place
    place = place.split(',');

    // If quantity changed then update state as well
    quantity = parseInt(quantity);
    if (quantity !== plant.gardenInformations.quantity) {
        state.push({
            quantity: quantity,
            date: new Date()
        });
    }

    const plantData = {
        id: plant.id,
        id1: plant.id1,
        catalogNumber: catalogNumber,
        generalInformations: {
            name: {
                genus: genus,
                species: species,
                variety: variety !== '' ? variety : null,
                subspecies: subspecies !== '' ? subspecies : null,
                cultivar: cultivar !== '' ? cultivar : null,
                authorship: authorship,
                hybrid: hybrid
            },
            oldName: plant.generalInformations.oldName,
            namePL: namePL,
            division: division,
            clade: clade,
            order: order,
            family: family,
            type: type,
            regionOfLiving: {
                continent: continent,
                description: description !== '' ? description : null
            },
            habitat: habitat,
            typeOfProtection: typeOfProtection,
            endangered: endangered,
            rawMaterial: rawMaterial !== '' ? rawMaterial : null,
            abilityToSow: parseInt(abilityToSow),
            abilityToPropagate: parseInt(abilityToPropagate)
        },
        gardenInformations: {
            place: place,
            quantity: quantity,
            importType: importType,
            importYear: parseInt(importYear),
            importGarden: importGarden,
            researchAtPharmacy: researchAtPharmacy,
            herbarium: herbarium,
            confirmed: confirmed
        },
        characteristic: {
            pharmacopoeial: pharmacopoeial,
            medicinal: medicinal,
            poisonous: poisonous,
            edible: edible,
            spice: spice,
            appropriable: appropriable,
            ornamental: ornamental,
            bulb: bulb,
            evergreen: evergreen
        },
        note: note !== '' ? note : null,
        createdAt: plant.createdAt,
        editedAt: new Date(),
        state: state
    };

    // TODO: Implement this
    // Meteor.call('editPlantRecord', plantData, (error, result) => {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         // TODO: if inserted data is different from API data then show modal and ask for version to save into db
    //         if (result !== null) {
    //             console.log(result);
    //             // check if api data is same as entered data
    //             // if no then show modal to choose correct variant
    //
    //             // if yes then just update record with given values
    //         } else {
    //             // update record with given data
    //         }
    //     }
    // });

    Meteor.call('editData', 'plants', plant._id, plantData);
    notify('positive', 'Brawo!', 'Pomyślnie edytowano rekord.');
    FlowRouter.go('plants');
};

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - P L A N T S  E D I T- - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.plantsEdit.onCreated(function() {
    // Template instance (this)
    const instance = this;
    // Plant ID
    const plantId = FlowRouter.getParam('id');
    // Plant subscription
    instance.plantSubscription = new ReactiveVar(false);
    // Autorun
    instance.autorun(() => {
        // Subscribe to plants colection
        instance.plantSubscription.set(instance.subscribe('plantRecord', plantId));
    });
    // Plant record
    instance.plant = () => {
        return plants.findOne();
    };

    datePickerOptions.type = 'year';
    datePickerOptions.formatter = {
        date: (date, settings) => {
            if (!date) return '';

            return date.getFullYear();
        }
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.plantsEdit.onRendered(function() {
    // Template instance (this)
    const instance = this;
    // Autorun
    instance.autorun(() => {
        // If plant subscribtion is ready
        if (instance.plantSubscription.get().ready()) {
            // Plant record
            const plant = instance.plant();
            // Meteor timeout to properly set all form values
            Meteor.setTimeout(() => {
                // Set focus to catalogNumber input field
                $('#catalogNumber').focus();
                // Initialize dropdowns
                $('.ui.dropdown').dropdown();
                $('#order-dropdown').dropdown({
                    allowAdditions: true,
                    apiSettings: {
                        action: 'get order',
                        saveRemoteData: false
                    }
                });
                $('#family-dropdown').dropdown({
                    allowAdditions: true,
                    apiSettings: {
                        action: 'get family',
                        saveRemoteData: false
                    }
                });
                $('#gardens-dropdown').dropdown({
                    allowAdditions: false,
                    apiSettings: {
                        action: 'get gardens',
                        saveRemoteData: false
                    }
                });
                // Initialize ranges
                $('#abilityToSowRange').range({
                    min: 0,
                    max: 6,
                    start: 3,
                    input: '#abilityToSow'
                });
                $('#abilityToPropagateRange').range({
                    min: 0,
                    max: 6,
                    start: 3,
                    input: '#abilityToPropagate'
                });
                // Initialize toogle buttons
                $('.ui.toggle.button').state();
                // Initialize calendar
                $('.ui.calendar').calendar(datePickerOptions);
                // Initialize form
                $('.ui.form').form({
                    fields: {
                        catalogNumber: {
                            identifier: 'catalogNumber',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić numer katalogowy'
                            }]
                        },
                        genus: {
                            identifier: 'genus',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić rodzaj rośliny'
                            },
                            {
                                type: 'regExp[/^[A-Z][a-z]+$/]',
                                prompt: 'Nazwy rodzajów piszemy wielką literą'
                            }]
                        },
                        species: {
                            identifier: 'species',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić gatunek rośliny'
                            },
                            {
                                type: 'regExp[/^[a-z]+$/]',
                                prompt: 'Nazwy gatunków piszemy małą literą'
                            }]
                        },
                        variety: {
                            identifier: 'variety',
                            optional: true,
                            rules: [{
                                type: 'regExp[/^[a-z]+$/]',
                                prompt: 'Nazwy odmian piszemy małą literą'
                            }]
                        },
                        authorship: {
                            identifier: 'authorship',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić autora'
                            }]
                        },
                        namePL: {
                            identifier: 'namePL',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić nazwę polską rośliny'
                            }]
                        },
                        division: {
                            identifier: 'division',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić gromadę rośliny'
                            }]
                        },
                        clade: {
                            identifier: 'clade',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić klad rośliny'
                            }]
                        },
                        order: {
                            identifier: 'order',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić rząd rośliny'
                            }]
                        },
                        family: {
                            identifier: 'family',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić rodzinę rośliny'
                            }]
                        },
                        type: {
                            identifier: 'type',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić charakter rośliny'
                            }]
                        },
                        continent: {
                            identifier: 'continent',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić miejsce występowania rośliny'
                            }]
                        },
                        habitat: {
                            identifier: 'habitat',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić siedlisko rośliny'
                            }]
                        },
                        typeOfProtection: {
                            identifier: 'typeOfProtection',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić typ ochrony rośliny'
                            }]
                        },
                        abilityToSow: {
                            identifier: 'abilityToSow',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić zdolność nasiewania rośliny'
                            }]
                        },
                        abilityToPropagate: {
                            identifier: 'abilityToPropagate',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić zdolność rozmnażania rośliny'
                            }]
                        },
                        place: {
                            identifier: 'place',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić miejsce rośliny w ogrodzie'
                            }]
                        },
                        quantity: {
                            identifier: 'quantity',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić ilość roślin'
                            }]
                        },
                        importType: {
                            identifier: 'importType',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić rodzaj sprowadzenia rośliny'
                            }]
                        },
                        importYear: {
                            identifier: 'importYear',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić rok sprowadzenia rośliny'
                            }]
                        },
                        importGarden: {
                            identifier: 'importGarden',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić skąd sprowadzono roślinę'
                            }]
                        }
                    },
                    inline: true,
                });

                // Set form values
                $('#catalogNumber').val(plant.catalogNumber);                                                                               // catalog number
                $('#genus').val(plant.generalInformations.name.genus);                                                                      // genus
                $('#species').val(plant.generalInformations.name.species);                                                                  // species
                $('#variety').val(plant.generalInformations.name.variety);                                                                  // variety
                $('#subspecies').val(plant.generalInformations.name.subspecies);                                                            // subspecies
                $('#cultivar').val(plant.generalInformations.name.cultivar);                                                                // cultivar
                $('#authorship').val(plant.generalInformations.name.authorship);                                                            // autorship
                if (plant.generalInformations.name.hybrid) {                                                                                // hybrid
                    $('#hybrid').addClass('active');
                } else {
                    $('#hybrid').removeClass('active');
                }
                $('#namePL').val(plant.generalInformations.namePL);                                                                         // polish name
                $('#division-dropdown').dropdown('set text', formatDivision(plant.generalInformations.division));                           // division
                $('#division-dropdown').dropdown('set value', plant.generalInformations.division);
                $('#clade-dropdown').dropdown('set text', formatClade(plant.generalInformations.clade));                                    // clade
                $('#clade-dropdown').dropdown('set value', plant.generalInformations.clade);
                $('#order-dropdown').dropdown('set text', plant.generalInformations.order.name);                                            // order
                $('#order-dropdown').dropdown('set value', plant.generalInformations.order.id);
                $('#family-dropdown').dropdown('set text', plant.generalInformations.family.name);                                          // family
                $('#family-dropdown').dropdown('set value', plant.generalInformations.family.id);
                $('#type-dropdown').dropdown('set text', formatType(plant.generalInformations.type));                                       // type
                $('#type-dropdown').dropdown('set value', plant.generalInformations.type);
                $('#continent-dropdown').dropdown('set selected', plant.generalInformations.regionOfLiving.continent);                      // continent
                $('#description').val(plant.generalInformations.regionOfLiving.description);                                                // continent description
                $('#habitat').val(plant.generalInformations.habitat);                                                                       // habitat
                $('#typeOfProtection-dropdown').dropdown('set text', formatTypeOfProtection(plant.generalInformations.typeOfProtection));   // type of protection
                $('#typeOfProtection-dropdown').dropdown('set value', plant.generalInformations.typeOfProtection);
                if (plant.generalInformations.endangered) {                                                                                 // endangered
                    $('#endangered').addClass('active');
                } else {
                    $('#endangered').removeClass('active');
                }
                $('#rawMaterial').val(plant.generalInformations.rawMaterial);                                                               // raw material
                $('#abilityToSow').range('set value', plant.generalInformations.abilityToSow);                                              // ability to sow
                $('#abilityToPropagate').range('set value', plant.generalInformations.abilityToPropagate);                                  // ability to propagate
                $('#place-dropdown').dropdown('set selected', plant.gardenInformations.place);                                              // place in garden
                $('#quantity').val(plant.gardenInformations.quantity);                                                                      // quantity
                $('#importType-dropdown').dropdown('set text', formatImportType(plant.gardenInformations.importType));
                $('#importType-dropdown').dropdown('set value', plant.gardenInformations.importType);                                       // import type
                $('.ui.calendar').calendar('set date', plant.gardenInformations.importYear);                                                // import year
                $('#gardens-dropdown').dropdown('set text', plant.gardenData.name);                                                         // import garden
                $('#gardens-dropdown').dropdown('set value', plant.gardenData._id);
                if (plant.gardenInformations.researchAtPharmacy) {                                                                          // research at pharmacy
                    $('#researchAtPharmacy').addClass('active');
                } else {
                    $('#researchAtPharmacy').removeClass('active');
                }
                if (plant.gardenInformations.herbarium) {                                                                                   // herbarium
                    $('#herbarium').addClass('active');
                } else {
                    $('#herbarium').removeClass('active');
                }
                if (plant.gardenInformations.confirmed) {                                                                                   // confirmed
                    $('#confirmed').addClass('active');
                } else {
                    $('#confirmed').removeClass('active');
                }
                if (plant.characteristic.pharmacopoeial) {                                                                                  // pharmacopoeial
                    $('#pharmacopoeial').addClass('active');
                } else {
                    $('#pharmacopoeial').removeClass('active');
                }
                if (plant.characteristic.medicinal) {                                                                                       // medicinal
                    $('#medicinal').addClass('active');
                } else {
                    $('#medicinal').removeClass('active');
                }
                if (plant.characteristic.poisonous) {                                                                                       // poisonous
                    $('#poisonous').addClass('active');
                } else {
                    $('#poisonous').removeClass('active');
                }
                if (plant.characteristic.edible) {                                                                                          // edible
                    $('#edible').addClass('active');
                } else {
                    $('#edible').removeClass('active');
                }
                if (plant.characteristic.spice) {                                                                                           // spice
                    $('#spice').addClass('active');
                } else {
                    $('#spice').removeClass('active');
                }
                if (plant.characteristic.appropriable) {                                                                                    // appropriable
                    $('#appropriable').addClass('active');
                } else {
                    $('#appropriable').removeClass('active');
                }
                if (plant.characteristic.ornamental) {                                                                                      // ornamental
                    $('#ornamental').addClass('active');
                } else {
                    $('#ornamental').removeClass('active');
                }
                if (plant.characteristic.bulb) {                                                                                            // bulb
                    $('#bulb').addClass('active');
                } else {
                    $('#bulb').removeClass('active');
                }
                if (plant.characteristic.evergreen) {                                                                                       // evergreen
                    $('#evergreen').addClass('active');
                } else {
                    $('#evergreen').removeClass('active');
                }
                $('#note').val(plant.note);                                                                                                 // note
            });
        }
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.plantsEdit.events({
    // Click submit button to edit plant record
    'click #submit': (e, t) => {
        if ($('.ui.form').form('is valid')) {
            editPlantData(e, t.plant());
        }
    }
});