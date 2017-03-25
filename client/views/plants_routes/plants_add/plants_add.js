// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Semantic Modal Options
import {modalOptions} from '../../../lib/modules/modal/modal_config.js';

// reactive page session
const pageSession = new ReactiveDict();

// -----------------------------------------------------------------------------
// - - - - - - - - - - - P L A N T S  A D D  F U N C T I O N S - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Adds plant data to plants collection
 * @param {Object} e - event object.
 */
const addPlantData = e => {
    // Variables
    let gbifNameString;
    let gbifOrder;
    let gbifFamily;

    // prevent default action of form
    e.preventDefault();

    // get every field value from form
    const catalogNumber             = $('.ui.form').form('get value', 'catalogNumber');
    const genus                     = $('.ui.form').form('get value', 'genus');
    const species                   = $('.ui.form').form('get value', 'species');
    const variety                   = $('.ui.form').form('get value', 'variety');
    const subspecies                = $('.ui.form').form('get value', 'subspecies');
    const cultivar                  = $('.ui.form').form('get value', 'cultivar');
    const authorship                = $('.ui.form').form('get value', 'authorship');
    const hybrid                    = $('#hybrid').hasClass('active');
    const namePL                    = $('.ui.form').form('get value', 'namePL');
    const division                  = $('.ui.form').form('get value', 'division');
    const clade                     = $('.ui.form').form('get value', 'clade');
    let order                       = $('.ui.form').form('get value', 'order');
    let family                      = $('.ui.form').form('get value', 'family');
    const type                      = $('.ui.form').form('get value', 'type');
    let continent                   = $('.ui.form').form('get value', 'continent');
    const description               = $('.ui.form').form('get value', 'description');
    const habitat                   = $('.ui.form').form('get value', 'habitat');
    const typeOfProtection          = $('.ui.form').form('get value', 'typeOfProtection');
    const endangered                = $('#endangered').hasClass('active');
    const rawMaterial               = $('.ui.form').form('get value', 'rawMaterial');
    let abilityToSow                = $('.ui.form').form('get value', 'abilityToSow');
    let abilityToPropagate          = $('.ui.form').form('get value', 'abilityToPropagate');
    let place                       = $('.ui.form').form('get value', 'place');
    let quantity                    = $('.ui.form').form('get value', 'quantity');
    const importType                = $('.ui.form').form('get value', 'importType');
    let importYear                  = $('.ui.form').form('get value', 'importYear');
    const importGarden              = $('.ui.form').form('get value', 'importGarden');
    const researchAtPharmacy        = $('#researchAtPharmacy').hasClass('active');
    const herbarium                 = $('#herbarium').hasClass('active');
    const confirmed                 = $('#confirmed').hasClass('active');
    const pharmacopoeial            = $('#pharmacopoeial').hasClass('active');
    const medicinal                 = $('#medicinal').hasClass('active');
    const poisonous                 = $('#poisonous').hasClass('active');
    const edible                    = $('#edible').hasClass('active');
    const spice                     = $('#spice').hasClass('active');
    const appropriable              = $('#appropriable').hasClass('active');
    const ornamental                = $('#ornamental').hasClass('active');
    const bulb                      = $('#bulb').hasClass('active');
    const evergreen                 = $('#evergreen').hasClass('active');
    const note                      = $('.ui.form').form('get value', 'note');

    // split comma separated values to arrays
    continent = continent.split(',');
    place = place.split(',');

    // change string values to integers
    abilityToSow = parseInt(abilityToSow);
    abilityToPropagate = parseInt(abilityToPropagate);
    quantity = parseInt(quantity);
    importYear = parseInt(importYear);

    // set plantData to page session
    pageSession.set('plantData', {
        catalogNumber,
        generalInformations: {
            name: {
                genus,
                species,
                variety,
                subspecies,
                cultivar,
                authorship,
                hybrid
            },
            namePL,
            division,
            clade,
            order,
            family,
            type,
            regionOfLiving: {
                continent,
                description
            },
            habitat,
            typeOfProtection,
            endangered,
            rawMaterial,
            abilityToSow,
            abilityToPropagate
        },
        gardenInformations: {
            place,
            quantity,
            importType,
            importYear,
            importGarden,
            researchAtPharmacy,
            herbarium,
            confirmed
        },
        characteristic: {
            pharmacopoeial,
            medicinal,
            poisonous,
            edible,
            spice,
            appropriable,
            ornamental,
            bulb,
            evergreen
        },
        note,
        createdAt: new Date(),
        editedAt: null,
        state: [
            {
                quantity,
                date: new Date()
            }
        ]
    });

    // modal settings
    modalOptions.onApprove = () => {
        const plantData = pageSession.get('plantData');
        const enteredDataChecked = $('#enteredDataButton').hasClass('active');
        const apiDataChecked = $('#apiDataButton').hasClass('active');
        const apiData = pageSession.get('apiData');

        // if user checked api data then change correct values accordingly
        if (apiDataChecked) {
            plantData.generalInformations.name.genus = apiData.genus;
            plantData.generalInformations.name.species = apiData.species;
            plantData.generalInformations.name.variety = apiData.variety;
            plantData.generalInformations.name.authorship = apiData.authorship;
            plantData.generalInformations.order = apiData.order;
            plantData.generalInformations.family = apiData.family;
        }

        if (apiDataChecked || enteredDataChecked) {
            // add new data to plants collection
            Meteor.call('addNewData', 'plants', plantData);
        } else {
            return false;
        }
    };
    modalOptions.onHidden = () => {
        notify('positive', 'Brawo!', 'Pomyślnie dodano roślinę do bazy.');

        // go to plants route
        FlowRouter.go('plants');
    };

    const tplNameString = `${genus} ${species}`;

    // set gbifNameString depending on variety
    if (variety) {
        gbifNameString = `${genus} ${species} var. ${variety} ${authorship}`;
    } else {
        gbifNameString = `${genus} ${species} ${authorship}`;
    }

    // URLs for Global Biodiversity Information Facility and The Plant List APIs
    const gbifURL = encodeURI(`http://api.gbif.org/v1/species/match?name=${gbifNameString}`);
    const tplURL = encodeURI(`http://www.plantminer.com/tpl?taxon=${tplNameString}`);

    // get plant from Global Biodiversity Information Facility database
    $.getJSON(gbifURL, gbifResponse => {
        if ((gbifResponse.status === 'ACCEPTED' || gbifResponse.status === 'SYNONYM') && gbifResponse.matchType === 'EXACT') {
            // check if genus, species, variety and authorship match accepted name for that plant
            if (gbifResponse.scientificName === gbifNameString) {
                // if yes
                // then genus, species, variety and authorship is OK
                // and we need to check only order and family

                const plantData = pageSession.get('plantData');
                let order = plantData.generalInformations.order;
                let family = plantData.generalInformations.family;

                // check if order and family matches entered data
                if (gbifResponse.order !== order) {
                    order = gbifResponse.order;

                    plantData.generalInformations.order = order;
                    pageSession.set('plantData', plantData);
                    // message that order was changed
                }
                if (gbifResponse.family !== family) {
                    family = gbifResponse.family;

                    plantData.generalInformations.family = family;
                    pageSession.set('plantData', plantData);
                    // message that family was changed
                }
                // add order and family to correct collections only when there is no such data already
                addOrderOrFamilyData('order', order);
                addOrderOrFamilyData('family', family);

                // add new data to plants collection
                Meteor.call('addNewData', 'plants', pageSession.get('plantData'));

                // message that entered data matches data from API
                notify('positive', 'Brawo!', 'Wprowadzone dane rośliny są zgodne z bazą danych GBIF. Pomyślnie dodano roślinę.');

                FlowRouter.go('plants');
            } else {
                // if not
                // we need to check genus, species, authorship, order and family
                const gbifGenus = gbifResponse.genus;
                let gbifSpecies = gbifResponse.species;
                gbifSpecies = gbifSpecies.split(' ');
                gbifSpecies = gbifSpecies[1];
                gbifOrder = gbifResponse.order;
                gbifFamily = gbifResponse.family;

                // check if order and family matches entered data
                if (gbifResponse.order !== order) {
                    order = gbifResponse.order;
                    // message that order was changed
                }
                if (gbifResponse.family !== family) {
                    family = gbifResponse.family;
                    // message that family was changed
                }
                // add order and family to correct collections only when there is no such data already
                addOrderOrFamilyData('order', order);
                addOrderOrFamilyData('family', family);

                // get plant from The Plant List database
                $.getJSON(tplURL, tplResponse => {
                    // if there is a match
                    if (tplResponse[0].id) {
                        const tplGenus = tplResponse[0].genus;
                        const tplSpecies = tplResponse[0].species;
                        const tplAuthorship = tplResponse[0].authorship;

                        // entered data for modal
                        pageSession.set('enteredData', {
                            genus,
                            species,
                            variety,
                            authorship,
                            order,
                            family
                        });

                        // api data for modal
                        pageSession.set('apiData', {
                            genus: gbifGenus,
                            species: gbifSpecies,
                            variety: variety,
                            authorship: tplAuthorship,
                            order: gbifOrder,
                            family: gbifFamily
                        });

                        // show modal
                        $('#plantsAddModal').modal('show');
                    }
                });
            }
        } else {
            // set message
            notify('warning', 'Uwaga!', 'Nie znaleziono rośliny na podstawie wprowadzonych danych. Mimo to roślina została dodana do bazy.');

            // add new data to plants collection
            Meteor.call('addNewData', 'plants', pageSession.get('plantData'));
            FlowRouter.go('plants');
        }
    });
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Adds order or family data
 * @param {Object} e - event object.
 */
const addOrderOrFamilyData = (type, name) => {
    switch (type) {
        case 'order':
            const orderRecord = order.findOne({name: name});
            if (!orderRecord) {
                Meteor.call('addNewData', 'order', {name: name});
            }
            break;
        case 'family':
            const familyRecord = family.findOne({name: name});
            if (!familyRecord) {
                Meteor.call('addNewData', 'family', {name: name});
            }
            break;
        default:
            return false;
    }
};

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - P L A N T S  A D D- - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.plantsAdd.onRendered(() => {
    // Focus caret at catalogNumber input field
    $('#catalogNumber').focus();
    // Initialize toggle buttons
    $('.ui.toggle.button').state();
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
    // Initialize modal
    $('#plantsAddModal').modal(modalOptions);
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
        onSuccess: (e) => {
            addPlantData(e);
            return true;
        }
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.plantsAdd.events({
    // Click submit button to add plant data to collection
    'click #submit': (e, t) => {
        if ($('.ui.form').form('is valid')) {
            addPlantData(e);
        }
    },
    // Change abilityToSow range
    'change #abilityToSow': (e, t) => {
        $('#abilityToSowRange').range('set value', e.target.value);
    },
    // Change abilityToPropagate range
    'change #abilityToPropagate': (e, t) => {
        $('#abilityToPropagateRange').range('set value', e.target.value);
    }
});

// -----------------------------------------------------------------------------
// - - - - - - - - - - - P L A N T S  A D D  M O D A L - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.plantsAddModal.helpers({
    enteredData: () => {
        return pageSession.get('enteredData');
    },
    apiData: () => {
        return pageSession.get('apiData');
    }
});

// -----------------------------------------------------------------------------
// - - - - - - - - - P L A N T S  A D D  M O D A L  B U T T O N- - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.plantsAddModalButton.events({
    // Click enteredDataButton to select data from form
    'click #enteredDataButton': (e, t) => {
        const apiDataButton = $('#apiDataButton');

        if (apiDataButton.hasClass('active')) {
            apiDataButton.removeClass('active');
        }
    },
    // Click apiDataButton to select data from API
    'click #apiDataButton': (e, t) => {
        const enteredDataButton = $('#enteredDataButton');

        if (enteredDataButton.hasClass('active')) {
            enteredDataButton.removeClass('active');
        }
    }
});