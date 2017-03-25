// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Semantic Calendar Options
import {datePickerOptions} from '../../../lib/modules/datepicker/datepicker_config.js';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Semantic Modal Options
import {modalOptions} from '../../../lib/modules/modal/modal_config.js';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Get Number Of Pages Function and String To Boolean Function
import {getNumberOfPages, stringToBoolean} from '../../../lib/utils.js';

// -----------------------------------------------------------------------------
// - - - - - - - - - - - P L A N T S  F U N C T I O N S- - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Deletes record
 * @param {Object} e - event object.
 */
const deleteRecord = e => {
    // Override modalOptions onApprove function
    modalOptions.onApprove = () => {
        // Plant ID from event target
        const plantId = $(e.target).closest('.record')[0].id;
        // Meteor Call for removing data function
        Meteor.call('removeData', 'plants', plantId);
        // Show sidebar notification
        notify('positive', 'Brawo!', 'Pomyślnie usunięto roślinę.');
    };
    // Override modalOptions onHidden function
    modalOptions.onHidden = () => {};
    // Show modal with changed options
    $('#modalDelete').modal(modalOptions).modal('show');
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Sets plants selector
 * @param {Object} data - selector data.
 * @return {Object} selector - The MongoDB selector.
 */
const setPlantsSelector = data => {
    let selector = {$and: []};
    let abilityToSow = {};
    let abilityToPropagate = {};
    let quantity = {};
    let importYear = {};
    let createdDate = {createdAt: {}};

    if (data.search !== '') {
        selector.$and.push({
            $or: [{
                    catalogNumber: {$regex: data.search, $options: 'i'}
                },
                {
                    "generalInformations.name.genus": {$regex: data.search, $options: 'i'}
                },
                {
                    "generalInformations.name.species": {$regex: data.search, $options: 'i'}
                },
                {
                    "generalInformations.name.variety": {$regex: data.search, $options: 'i'}
                },
                {
                    "generalInformations.name.authorship": {$regex: data.search, $options: 'i'}
                },
                {
                    "generalInformations.namePL": {$regex: data.search, $options: 'i'}
                },
                {
                    "generalInformations.order.name": {$regex: data.search, $options: 'i'}
                },
                {
                    "generalInformations.family.name": {$regex: data.search, $options: 'i'}
                },
                {
                    "generalInformations.habitat": {$regex: data.search, $options: 'i'}
                },
                {
                    note: {$regex: data.search, $options: 'i'}
                }
            ]
        });
    } else {
        selector.$and.push({
            catalogNumber: {$regex: '.*'}
        });
    }

    // hybrid selector
    if (data.generalInformations.hybrid !== null) {
        selector.$and.push({"generalInformations.name.hybrid": data.generalInformations.hybrid});
    }

    // division selector
    if (data.generalInformations.division !== null) {
        selector.$and.push({"generalInformations.division": data.generalInformations.division});
    }

    // clade selector
    if (data.generalInformations.clade !== null) {
        selector.$and.push({"generalInformations.clade": data.generalInformations.clade});
    }

    // type selector
    if (data.generalInformations.type !== null) {
        const types = data.generalInformations.type;
        let typeSelector = {$or: []};

        types.forEach(type => {
            typeSelector.$or.push({"generalInformations.type": type});
        });

        selector.$and.push(typeSelector);
    }

    // region of living selector
    if (data.generalInformations.regionOfLiving !== null) {
        const regionsOfLiving = data.generalInformations.regionOfLiving;
        let regionSelector = {$or: []};

        regionsOfLiving.forEach(region => {
            regionSelector.$or.push({"gardenInformations.regionOfLiving": region});
        });

        selector.$and.push(regionSelector);
    }

    // type of protection selector
    if (data.generalInformations.typeOfProtection !== null) {
        const typesOfProtection = data.generalInformations.typeOfProtection;
        let protectionSelector = {$or: []};

        typesOfProtection.forEach(type => {
            protectionSelector.$or.push({"generalInformations.typeOfProtection": type});
        });

        selector.$and.push(protectionSelector);
    }

    // endangered selector
    if (data.generalInformations.endangered !== null) {
        selector.$and.push({"generalInformations.endangered": data.generalInformations.endangered});
    }

    // ability to sow selector
    if (data.generalInformations.abilityToSow.from !== null) {
        abilityToSow.$gte = parseInt(data.generalInformations.abilityToSow.from);
    }
    if (data.generalInformations.abilityToSow.to !== null) {
        abilityToSow.$lte = parseInt(data.generalInformations.abilityToSow.to);
    }
    if (!isNaN(abilityToSow.$gte) || !isNaN(abilityToSow.$lte)) {
        selector.$and.push({"generalInformations.abilityToSow": abilityToSow});
    }

    // ability to propagate selector
    if (data.generalInformations.abilityToPropagate.from !== null) {
        abilityToPropagate.$gte = parseInt(data.generalInformations.abilityToPropagate.from);
    }
    if (data.generalInformations.abilityToPropagate.to !== null) {
        abilityToPropagate.$lte = parseInt(data.generalInformations.abilityToPropagate.to);
    }
    if (!isNaN(abilityToPropagate.$gte) || !isNaN(abilityToPropagate.$lte)) {
        selector.$and.push({"generalInformations.abilityToPropagate": abilityToPropagate});
    }

    // place in garden selector
    if (data.gardenInformations.place !== null) {
        const places = data.gardenInformations.place;
        let placeSelector = {$or: []};

        places.forEach(place => {
            placeSelector.$or.push({"gardenInformations.place": place});
        });

        selector.$and.push(placeSelector);
    }

    // quantity selector
    if (data.gardenInformations.quantity.from !== null) {
        quantity.$gte = parseInt(data.gardenInformations.quantity.from);
    }
    if (data.gardenInformations.quantity.to !== null) {
        quantity.$lte = parseInt(data.gardenInformations.quantity.to);
    }
    if (!isNaN(quantity.$gte) || !isNaN(quantity.$lte)) {
        selector.$and.push({"gardenInformations.quantity": quantity});
    }

    // import type selector
    if (data.gardenInformations.importType !== null) {
        selector.$and.push({"gardenInformations.importType": data.gardenInformations.importType});
    }

    // import year selector
    if (data.gardenInformations.importYear.from !== null) {
        importYear.$gte = data.gardenInformations.importYear.from;
    }
    if (data.gardenInformations.importYear.to !== null) {
        importYear.$lte = data.gardenInformations.importYear.to;
    }
    if (importYear.$gte || importYear.$lte) {
        selector.$and.push({"gardenInformations.importYear": importYear});
    }

    // import garden selector
    if (data.gardenInformations.importGarden !== null) {
        const gardens = data.gardenInformations.importGarden;
        let gardenSelector = {$or: []};

        gardens.forEach(garden => {
            gardenSelector.$or.push({"gardenInformations.importGarden": garden});
        });

        selector.$and.push(gardenSelector);
    }

    // research at pharmacy selector
    if (data.gardenInformations.researchAtPharmacy !== null) {
        selector.$and.push({"gardenInformations.researchAtPharmacy": data.gardenInformations.researchAtPharmacy});
    }

    // herbarium selector
    if (data.gardenInformations.herbarium !== null) {
        selector.$and.push({"gardenInformations.herbarium": data.gardenInformations.herbarium});
    }

    // confirmed selector
    if (data.gardenInformations.confirmed !== null) {
        selector.$and.push({"gardenInformations.confirmed": data.gardenInformations.confirmed});
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Characteristic

    // pharmacopoeial selector
    if (data.characteristic.pharmacopoeial !== null) {
        selector.$and.push({"characteristic.pharmacopoeial": data.characteristic.pharmacopoeial});
    }

    // medicinal selector
    if (data.characteristic.medicinal !== null) {
        selector.$and.push({"characteristic.medicinal": data.characteristic.medicinal});
    }

    // poisonous selector
    if (data.characteristic.poisonous !== null) {
        selector.$and.push({"characteristic.poisonous": data.characteristic.poisonous});
    }

    // edible selector
    if (data.characteristic.edible !== null) {
        selector.$and.push({"characteristic.edible": data.characteristic.edible});
    }

    // spice selector
    if (data.characteristic.spice !== null) {
        selector.$and.push({"characteristic.spice": data.characteristic.spice});
    }

    // appropriable selector
    if (data.characteristic.appropriable !== null) {
        selector.$and.push({"characteristic.appropriable": data.characteristic.appropriable});
    }

    // ornamental selector
    if (data.characteristic.ornamental !== null) {
        selector.$and.push({"characteristic.ornamental": data.characteristic.ornamental});
    }

    // bulb selector
    if (data.characteristic.bulb !== null) {
        selector.$and.push({"characteristic.bulb": data.characteristic.bulb});
    }

    // evergreen selector
    if (data.characteristic.evergreen !== null) {
        selector.$and.push({"characteristic.evergreen": data.characteristic.evergreen});
    }

    // created at selector
    if (data.createdAt.from !== null) {
        createdDate.createdAt.$gte = data.createdAt.from;
    }
    if (data.createdAt.to !== null) {
        createdDate.createdAt.$lte = data.createdAt.to;
    }
    if (createdDate.createdAt.$gte || createdDate.createdAt.$lte) {
        selector.$and.push(createdDate);
    }

    return selector;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Sets plants sort
 * @param {Object} data - sort field and sort direction.
 * @return {Object} sortObject - The MongoDB sort.
 */
const setPlantsSort = data => {
    const field = data.field;
    const sort = data.sort;

    let sortObject = {};

    switch (field) {
        case 'catalogNumber':
            sortObject.catalogNumber = sort;
            break;
        case 'order':
            sortObject = {
                "generalInformations.order.name": sort
            };
            break;
        case 'family':
            sortObject = {
                "generalInformations.family.name": sort
            };
            break;
        case 'name':
            sortObject = {
                "generalInformations.name.genus": sort
            };
            break;
        case 'namePL':
            sortObject = {
                "generalInformations.namePL": sort
            };
            break;
        case 'type':
            sortObject = {
                "generalInformations.type": sort
            };
            break;
        case 'quantity':
            sortObject = {
                "gardenInformations.quantity": sort
            };
            break;
        default:
            break;
    }

    return sortObject;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Shows modal with plants report
 */
export const printReportPlants = () => {
    // Override reportModalOptions transition value
    reportModalOptions.transition = 'fade';
    // Override reportModalOptions onShow method
    reportModalOptions.onShow = () => {
        // Call Meteor method generateOrderPDF to generate order PDF
        Meteor.call('generateReport', 'Rośliny', setPlantsSelector(plantsSelector.get()), setPlantsSort(plantsSort.get()), plantsSelector.get(), (error, result) => {
            if (error) {
                // TODO: This shouldn't be called, but who knows
                console.error(error);
            } else if (result) {
                // PDF data URI
                const pdfAsDataUri = "data:application/pdf;base64, " + result;
                // Add source to PDF display frame
                $('#pdfFrame').attr('src', pdfAsDataUri);
            }
        });
    };
    // Override reportModalOptions onHidden method
    reportModalOptions.onHidden = () => {
        // Clear source of PDF display frame
        $('#pdfFrame').attr('src', null);
        // Override reportModalOptions onShow method
        reportModalOptions.onShow = () => {};
        // Override reportModalOptions transition value
        reportModalOptions.transition = 'scale';
    };
    // Show modal
    $('#modalReportPrint').modal(reportModalOptions).modal('show');
};

// -----------------------------------------------------------------------------
// - - - - - - - - - - - P L A N T S  V A R I A B L E S- - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Exported variables with current page and total pages for pagination module
export const plantsCurrentPage = new ReactiveVar();
export const plantsNumberOfPages = new ReactiveVar();
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Copied Semantic Calendar Options into four variables for four calendars purpose
let importDateFromOptions = $.extend(true, {}, datePickerOptions);
let importDateToOptions = $.extend(true, {}, datePickerOptions);
let createdDateFromOptions = $.extend(true, {}, datePickerOptions);
let createdDateToOptions = $.extend(true, {}, datePickerOptions);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Copied Semantic Modal Options into one variable for modal purpose
let reportModalOptions = $.extend(true, {}, modalOptions);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Global selector
const plantsSelector = new ReactiveVar();
// Global sort
const plantsSort = new ReactiveVar();

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - - P L A N T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.plants.onCreated(function() {
    // Instance variable (this)
    const instance = this;
    // Set current page to first
    plantsCurrentPage.set(1);
    // Limit displaying records to 10
    instance.limit = new ReactiveVar(10);
    // Set selector to query all data
    instance.selector = new ReactiveVar({
        search: '',
        generalInformations: {
            hybrid: null,
            division: null,
            clade: null,
            type: null,
            regionOfLiving: null,
            typeOfProtection: null,
            endangered: null,
            abilityToSow: {
                from: null,
                to: null
            },
            abilityToPropagate: {
                from: null,
                to: null
            }
        },
        gardenInformations: {
            place: null,
            quantity: {
                from: null,
                to: null
            },
            importType: null,
            importYear: {
                from: null,
                to: null
            },
            importGarden: null,
            researchAtPharmacy: null,
            herbarium: null,
            confirmed: null
        },
        characteristic: {
            pharmacopoeial: null,
            medicinal: null,
            poisonous: null,
            edible: null,
            spice: null,
            appropriable: null,
            ornamental: null,
            bulb: null,
            evergreen: null
        },
        createdAt: {
            from: null,
            to: null
        }
    });
    plantsSelector.set(instance.selector.get());
    // Sort records in descending order by createdAt field
    instance.sort = new ReactiveVar({field: 'catalogNumber', sort: 1});
    plantsSort.set(instance.sort.get());
    // Set loaded number of records to 10
    instance.loaded = new ReactiveVar(10);

    // Autorun function
    instance.autorun(() => {
        // Get current reactive values
        const page = plantsCurrentPage.get();
        const limit = instance.limit.get();
        const selector = instance.selector.get();
        const sort = instance.sort.get();

        plantsSelector.set(selector);
        plantsSort.set(sort);

        // Subscribe to collections
        const plantsSubscribtion = instance.subscribe('plants', page, limit, setPlantsSelector(selector), setPlantsSort(sort));
        const plantsCountSubscription = instance.subscribe('plantsCount', setPlantsSelector(selector));

        // When subscribtion is ready set number of loaded records to current limit
        if (plantsSubscribtion.ready()) {
            instance.loaded.set(limit);
        }
        // When subscribtion is ready set total number of pages according to current limit
        if (plantsCountSubscription.ready()) {
            plantsNumberOfPages.set(getNumberOfPages('plants', limit));
        }
    });

    // Plants collection cursor
    instance.plants = () => {
        return plants.find({}, {limit: instance.loaded.get(), sort: setPlantsSort(instance.sort.get())});
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.plants.onRendered(function() {
    // Instance variable (this)
    const instance = this;
    // Override onChange function from importDateFromOptions object
    importDateFromOptions.onChange = date => {
        const selector = instance.selector.get();

        if (date) {
            date = new Date(moment(date).hour(23).minute(59).second(59).toISOString()).getFullYear();
        } else {
            date = null;
        }

        selector.gardenInformations.importYear.from = date;

        instance.selector.set(selector);
    };
    // Override calendar type to display only year
    importDateFromOptions.type = 'year';
    // Override calendar formatter to display only year in input field
    importDateFromOptions.formatter = {
        date: (date, settings) => {
            return date.getFullYear();
        }
    };
    // Sets endCalendar option to first calendar widget
    importDateFromOptions.endCalendar = $('#importDateToCalendar');
    // Override onChange function from importDateToOptions object
    importDateToOptions.onChange = date => {
        const selector = instance.selector.get();

        if (date) {
            date = new Date(moment(date).hour(23).minute(59).second(59).toISOString()).getFullYear();
        } else {
            date = null;
        }

        selector.gardenInformations.importYear.to = date;

        instance.selector.set(selector);
    };
    // Override calendar type to display only year
    importDateToOptions.type = 'year';
    // Override calendar formatter to display only year in input field
    importDateToOptions.formatter = {
        date: (date, settings) => {
            return date.getFullYear();
        }
    };
    // Sets startCalendar option to second calendar widget
    importDateToOptions.startCalendar = $('#importDateFromCalendar');
    // Override onChange function from createdDateFromOptions object
    createdDateFromOptions.onChange = date => {
        const selector = instance.selector.get();

        if (date) {
            date = new Date(moment(date).hour(0).minute(0).second(0).toISOString());
        } else {
            date = null;
        }

        selector.createdAt.from = date;

        instance.selector.set(selector);
    };
    // Sets endCalendar option to first calendar widget
    createdDateFromOptions.endCalendar = $('#createdDateToCalendar');
    // Override onChange function from createdDateToOptions object
    createdDateToOptions.onChange = date => {
        const selector = instance.selector.get();

        if (date) {
            date = new Date(moment(date).hour(23).minute(59).second(59).toISOString());
        } else {
            date = null;
        }

        selector.createdAt.to = date;

        instance.selector.set(selector);
    };
    // Sets startCalendar option to second calendar widget
    createdDateToOptions.startCalendar = $('#createdDateFromCalendar');

    // Initialize popups
    $('.editButton').popup();
    $('.delteButton').popup();
    $('#helpButton').popup();
    // Initialize modal
    $('#modalDelete').modal(modalOptions);
    $('#modalReportPrint').modal(reportModalOptions);
    // Initialize dropdowns
    $('#hybrid-dropdown').dropdown();
    $('#division-dropdown').dropdown();
    $('#clade-dropdown').dropdown();
    $('#type-dropdown').dropdown();
    $('#regionOfLiving-dropdown').dropdown();
    $('#typeOfProtection-dropdown').dropdown();
    $('#endangered-dropdown').dropdown();
    $('#place-dropdown').dropdown();
    $('#importType-dropdown').dropdown();
    $('#importGarden-dropdown').dropdown({
        allowAdditions: false,
        apiSettings: {
            action: 'get gardens',
            saveRemoteData: false
        }
    });
    $('#researchAtPharmacy-dropdown').dropdown();
    $('#herbarium-dropdown').dropdown();
    $('#confirmed-dropdown').dropdown();
    $('#pharmacopoeial-dropdown').dropdown();
    $('#medicinal-dropdown').dropdown();
    $('#poisonous-dropdown').dropdown();
    $('#edible-dropdown').dropdown();
    $('#spice-dropdown').dropdown();
    $('#appropriable-dropdown').dropdown();
    $('#ornamental-dropdown').dropdown();
    $('#bulb-dropdown').dropdown();
    $('#evergreen-dropdown').dropdown();
    // Initialize calendars
    $('#importDateFromCalendar').calendar(importDateFromOptions);
    $('#importDateToCalendar').calendar(importDateToOptions);
    $('#createdDateFromCalendar').calendar(createdDateFromOptions);
    $('#createdDateToCalendar').calendar(createdDateToOptions);
    // Sets button with 10 records per page to active
    $('#10recordsPerPage').addClass('active');
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.plants.helpers({
    // Plants records
    plants: () => {
        return Template.instance().plants();
    },
    isConfirmed: id => {
        const plantRecord = plants.findOne(id, {fields: {"gardenInformations.confirmed": 1}});
        return plantRecord.gardenInformations && plantRecord.gardenInformations.confirmed ? 'positive' : '';
    },
    noPlants: quantity => {
        return (quantity === 0) ? 'red' : '';
    },
    // Sort indicator
    sort: field => {
        const sort = Template.instance().sort.get();
        let sortClassName;

        if (sort.sort === 1) {
            sortClassName = 'ascending';
        } else if (sort.sort === -1) {
            sortClassName = 'descending';
        }

        if (field === sort.field) {
            return `<i class="sort ${sortClassName} icon"></i>`;
        } else {
            return false;
        }
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.plants.events({
    // Double click record to go to the plants details page
    "dblclick .record" : (e, t) => {
        const plantId = $(e.target).closest('.record')[0].id;
        if (plantId !== '') {
            FlowRouter.go('plantsDetails', {id: plantId});
        }
    },
    // Click edit button to go to the plants edit page
    "click .editButton": (e, t) => {
        e.stopPropagation();
        const plantId = $(e.target).closest('.record')[0].id;
        if (plantId !== '') {
            FlowRouter.go('plantsEdit', {id: plantId});
        }
    },
    // Hover edit button to show popup
    "mouseenter .editButton": (e, t) => {
        $(e.target).popup('show');
    },
    // Click delete button to show modal and delete record
    "click .deleteButton": (e, t) => {
        e.stopPropagation();
        deleteRecord(e);
    },
    // Hover delete button to show popup
    "mouseenter .deleteButton": (e, t) => {
        $(e.target).popup('show');
    },
    // Click table headers to sort by this field in given direction
    "click .sortable": (e, t) => {
        e.preventDefault();

        const sortType = e.currentTarget.dataset.sort;
        const sortTypeOld = t.sort.get().field;
        const sortValueOld = t.sort.get().sort;

        if (sortType === sortTypeOld) {
            const sortValue = -sortValueOld;

            t.sort.set({field: sortType, sort: sortValue});
        } else {
            t.sort.set({field: sortType, sort: 1});
        }
    },
    // Type search phrase
    "keyup #search": (e, t) => {
        const value = e.currentTarget.value;
        const selector = t.selector.get();

        selector.search = value;

        t.selector.set(selector);
    },
    // action for changing hybrid value for filtering
    "change #hybrid-dropdown": (e, t) => {
        const value = $('#hybrid-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.generalInformations.hybrid = stringToBoolean(value);

        t.selector.set(selector);
    },
    // clear hybrid dropdown
    "click #clearHybrid": (e, t) => {
        $('#hybrid-dropdown').dropdown('restore defaults');
    },
    // action for changing division value for filtering
    "change #division-dropdown": (e, t) => {
        let value = $('#division-dropdown').dropdown('get value');
        const selector = t.selector.get();

        if (value === '') {
            value = null;
        }

        selector.generalInformations.division = value;

        t.selector.set(selector);
    },
    // clear division dropdown
    "click #clearDivision": (e, t) => {
        $('#division-dropdown').dropdown('restore defaults');
    },
    // action for changing clade value for filtering
    "change #clade-dropdown": (e, t) => {
        let value = $('#clade-dropdown').dropdown('get value');
        const selector = t.selector.get();

        if (value === '') {
            value = null;
        }

        selector.generalInformations.clade = value;

        t.selector.set(selector);
    },
    // clear clade dropdown
    "click #clearClade": (e, t) => {
        $('#clade-dropdown').dropdown('restore defaults');
    },
    // action for changing type value for filtering
    "change #type-dropdown": (e, t) => {
        let value = $('#type-dropdown').dropdown('get value');
        const selector = t.selector.get();

        if (value === '') {
            value = null;
        } else {
            value = value.split(',');
        }

        selector.generalInformations.type = value;

        t.selector.set(selector);
    },
    // clear type dropdown
    "click #clearType": (e, t) => {
        $('#type-dropdown').dropdown('restore defaults');
    },
    // action for changing region of living value for filtering
    "change #regionOfLiving-dropdown": (e, t) => {
        let value = $('#regionOfLiving-dropdown').dropdown('get value');
        const selector = t.selector.get();

        if (value === '') {
            value = null;
        } else {
            value = value.split(',');
        }

        selector.generalInformations.regionOfLiving = value;

        t.selector.set(selector);
    },
    // clear region of living dropdown
    "click #clearRegionOfLiving": (e, t) => {
        $('#regionOfLiving-dropdown').dropdown('restore defaults');
    },
    // action for changing type of protection value for filtering
    "change #typeOfProtection-dropdown": (e, t) => {
        let value = $('#typeOfProtection-dropdown').dropdown('get value');
        const selector = t.selector.get();

        if (value === '') {
            value = null;
        } else {
            value = value.split(',');
        }

        selector.generalInformations.typeOfProtection = value;

        t.selector.set(selector);
    },
    // clear type of protection dropdown
    "click #clearTypeOfProtection": (e, t) => {
        $('#typeOfProtection-dropdown').dropdown('restore defaults');
    },
    // action for changing endangered value for filtering
    "change #endangered-dropdown": (e, t) => {
        const value = $('#endangered-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.generalInformations.endangered = stringToBoolean(value);

        t.selector.set(selector);
    },
    // clear endangered dropdown
    "click #clearEndangered": (e, t) => {
        $('#endangered-dropdown').dropdown('restore defaults');
    },
    // Change ability to sow from input value
    "keyup #abilityToSowFromInput": (e, t) => {
        let value = e.currentTarget.value;
        const selector = t.selector.get();

        if (value !== '') {
            if (!isNaN(value)) {
                selector.generalInformations.abilityToSow.from = value;
            }
        } else {
            selector.generalInformations.abilityToSow.from = null;
        }

        t.selector.set(selector);
    },
    // Change ability to sow to input value
    "keyup #abilityToSowToInput": (e, t) => {
        let value = e.currentTarget.value;
        const selector = t.selector.get();

        if (value !== '') {
            if (!isNaN(value)) {
                selector.generalInformations.abilityToSow.to = value;
            }
        } else {
            selector.generalInformations.abilityToSow.to = null;
        }

        t.selector.set(selector);
    },
    // Clear ability to sow input fields
    "click #clearAbilityToSow": (e, t) => {
        const selector = t.selector.get();

        $('#abilityToSowFromInput').val('');
        $('#abilityToSowToInput').val('');

        selector.generalInformations.abilityToSow.from = null;
        selector.generalInformations.abilityToSow.to = null;

        t.selector.set(selector);
    },
    // Change ability to propagate from input value
    "keyup #abilityToPropagateFromInput": (e, t) => {
        let value = e.currentTarget.value;
        const selector = t.selector.get();

        if (value !== '') {
            if (!isNaN(value)) {
                selector.generalInformations.abilityToPropagate.from = value;
            }
        } else {
            selector.generalInformations.abilityToPropagate.from = null;
        }

        t.selector.set(selector);
    },
    // Change ability to propagate to input value
    "keyup #abilityToPropagateToInput": (e, t) => {
        let value = e.currentTarget.value;
        const selector = t.selector.get();

        if (value !== '') {
            if (!isNaN(value)) {
                selector.generalInformations.abilityToPropagate.to = value;
            }
        } else {
            selector.generalInformations.abilityToPropagate.to = null;
        }

        t.selector.set(selector);
    },
    // Clear ability to propagate input fields
    "click #clearAbilityToPropagate": (e, t) => {
        const selector = t.selector.get();

        $('#abilityToPropagateFromInput').val('');
        $('#abilityToPropagateToInput').val('');

        selector.generalInformations.abilityToPropagate.from = null;
        selector.generalInformations.abilityToPropagate.to = null;

        t.selector.set(selector);
    },
    // action for changing place in garden value for filtering
    "change #place-dropdown": (e, t) => {
        let value = $('#place-dropdown').dropdown('get value');
        const selector = t.selector.get();

        if (value === '') {
            value = null;
        } else {
            value = value.split(',');
        }

        selector.gardenInformations.place = value;

        t.selector.set(selector);
    },
    // clear place in garden dropdown
    "click #clearPlace": (e, t) => {
        $('#place-dropdown').dropdown('restore defaults');
    },
    // Change quantity from input value
    "keyup #quantityFromInput": (e, t) => {
        let value = e.currentTarget.value;
        const selector = t.selector.get();

        if (value !== '') {
            if (!isNaN(value)) {
                selector.gardenInformations.quantity.from = value;
            }
        } else {
            selector.gardenInformations.quantity.from = null;
        }

        t.selector.set(selector);
    },
    // Change quantity to input value
    "keyup #quantityToInput": (e, t) => {
        let value = e.currentTarget.value;
        const selector = t.selector.get();

        if (value !== '') {
            if (!isNaN(value)) {
                selector.gardenInformations.quantity.to = value;
            }
        } else {
            selector.gardenInformations.quantity.to = null;
        }

        t.selector.set(selector);
    },
    // Clear quantity input fields
    "click #clearQuantity": (e, t) => {
        const selector = t.selector.get();

        $('#quantityFromInput').val('');
        $('#quantityToInput').val('');

        selector.gardenInformations.quantity.from = null;
        selector.gardenInformations.quantity.to = null;

        t.selector.set(selector);
    },
    // action for changing import type value for filtering
    "change #importType-dropdown": (e, t) => {
        let value = $('#importType-dropdown').dropdown('get value');
        const selector = t.selector.get();

        if (value === '') {
            value = null;
        }

        selector.gardenInformations.importType = value;

        t.selector.set(selector);
    },
    // clear import type dropdown
    "click #clearImportType": (e, t) => {
        $('#importType-dropdown').dropdown('restore defaults');
    },
    // Click clearImportDateFrom button to clear selected date
    "click #clearImportDateFrom": (e, t) => {
        e.preventDefault();

        $('#importDateFromCalendar').calendar('clear');
        $(e.currentTarget).blur();
    },
    // Click clearImportDateTo button to clear selected date
    "click #clearImportDateTo": (e, t) => {
        e.preventDefault();

        $('#importDateToCalendar').calendar('clear');
        $(e.currentTarget).blur();
    },
    // action for changing import garden value for filtering
    "change #importGarden-dropdown": (e, t) => {
        let value = $('#importGarden-dropdown').dropdown('get value');
        const selector = t.selector.get();

        if (value === '') {
            value = null;
        } else {
            value = value.split(',');
        }

        selector.gardenInformations.importGarden = value;

        t.selector.set(selector);
    },
    // clear import garden dropdown
    "click #clearImportGarden": (e, t) => {
        $('#importGarden-dropdown').dropdown('restore defaults');
    },
    // action for changing research at pharmacy value for filtering
    "change #researchAtPharmacy-dropdown": (e, t) => {
        const value = $('#researchAtPharmacy-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.gardenInformations.researchAtPharmacy = stringToBoolean(value);

        t.selector.set(selector);
    },
    // clear research at pharmacy dropdown
    "click #clearResearchAtPharmacy": (e, t) => {
        $('#researchAtPharmacy-dropdown').dropdown('restore defaults');
    },
    // action for changing herbarium value for filtering
    "change #herbarium-dropdown": (e, t) => {
        const value = $('#herbarium-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.gardenInformations.herbarium = stringToBoolean(value);

        t.selector.set(selector);
    },
    // clear herbarium dropdown
    "click #clearHerbarium": (e, t) => {
        $('#herbarium-dropdown').dropdown('restore defaults');
    },
    // action for changing confirmed value for filtering
    "change #confirmed-dropdown": (e, t) => {
        const value = $('#confirmed-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.gardenInformations.confirmed = stringToBoolean(value);

        t.selector.set(selector);
    },
    // clear confirmed dropdown
    "click #clearConfirmed": (e, t) => {
        $('#confirmed-dropdown').dropdown('restore defaults');
    },

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Characteristic

    // action for changing pharmacopoeial value for filtering
    "change #pharmacopoeial-dropdown": (e, t) => {
        const value = $('#pharmacopoeial-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.characteristic.pharmacopoeial = stringToBoolean(value);

        t.selector.set(selector);
    },
    // clear pharmacopoeial dropdown
    "click #clearPharmacopoeial": (e, t) => {
        $('#pharmacopoeial-dropdown').dropdown('restore defaults');
    },
    // action for changing medicinal value for filtering
    "change #medicinal-dropdown": (e, t) => {
        const value = $('#medicinal-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.characteristic.medicinal = stringToBoolean(value);

        t.selector.set(selector);
    },
    // clear medicinal dropdown
    "click #clearMedicinal": (e, t) => {
        $('#medicinal-dropdown').dropdown('restore defaults');
    },
    // action for changing poisonous value for filtering
    "change #poisonous-dropdown": (e, t) => {
        const value = $('#poisonous-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.characteristic.poisonous = stringToBoolean(value);

        t.selector.set(selector);
    },
    // clear poisonous dropdown
    "click #clearPoisonous": (e, t) => {
        $('#poisonous-dropdown').dropdown('restore defaults');
    },
    // action for changing edible value for filtering
    "change #edible-dropdown": (e, t) => {
        const value = $('#edible-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.characteristic.edible = stringToBoolean(value);

        t.selector.set(selector);
    },
    // clear edible dropdown
    "click #clearEdible": (e, t) => {
        $('#edible-dropdown').dropdown('restore defaults');
    },
    // action for changing spice value for filtering
    "change #spice-dropdown": (e, t) => {
        const value = $('#spice-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.characteristic.spice = stringToBoolean(value);

        t.selector.set(selector);
    },
    // clear spice dropdown
    "click #clearSpice": (e, t) => {
        $('#spice-dropdown').dropdown('restore defaults');
    },
    // action for changing appropriable value for filtering
    "change #appropriable-dropdown": (e, t) => {
        const value = $('#appropriable-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.characteristic.appropriable = stringToBoolean(value);

        t.selector.set(selector);
    },
    // clear appropriable dropdown
    "click #clearAppropriable": (e, t) => {
        $('#appropriable-dropdown').dropdown('restore defaults');
    },
    // action for changing ornamental value for filtering
    "change #ornamental-dropdown": (e, t) => {
        const value = $('#ornamental-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.characteristic.ornamental = stringToBoolean(value);

        t.selector.set(selector);
    },
    // clear ornamental dropdown
    "click #clearOrnamental": (e, t) => {
        $('#ornamental-dropdown').dropdown('restore defaults');
    },
    // action for changing bulb value for filtering
    "change #bulb-dropdown": (e, t) => {
        const value = $('#bulb-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.characteristic.bulb = stringToBoolean(value);

        t.selector.set(selector);
    },
    // clear bulb dropdown
    "click #clearBulb": (e, t) => {
        $('#bulb-dropdown').dropdown('restore defaults');
    },
    // action for changing evergreen value for filtering
    "change #evergreen-dropdown": (e, t) => {
        const value = $('#evergreen-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.characteristic.evergreen = stringToBoolean(value);

        t.selector.set(selector);
    },
    // clear evergreen dropdown
    "click #clearEvergreen": (e, t) => {
        $('#evergreen-dropdown').dropdown('restore defaults');
    },
    // Click clearCreatedDateFrom button to clear selected date
    "click #clearCreatedDateFrom": (e, t) => {
        e.preventDefault();

        $('#createdDateFromCalendar').calendar('clear');
        $(e.currentTarget).blur();
    },
    // Click clearCreatedDateTo button to clear selected date
    "click #clearCreatedDateTo": (e, t) => {
        e.preventDefault();

        $('#createdDateToCalendar').calendar('clear');
        $(e.currentTarget).blur();
    },
    // Click records per page button to select new limit of loaded records
    "click .recordsPerPage": (e, t) => {
        e.preventDefault();

        $('.recordsPerPage').removeClass('active');
        t.limit.set(parseInt(e.currentTarget.value));
        $(e.currentTarget).addClass('active');

        plantsCurrentPage.set(1);
    }
});