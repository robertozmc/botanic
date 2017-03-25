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
// Get Number Of Pages Function
import {getNumberOfPages} from '../../../lib/utils.js';

// -----------------------------------------------------------------------------
// - - - - - - - - - - - S E E D S  F U N C T I O N S- - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Deletes record
 * @param {Object} e - event object.
 */
const deleteRecord = e => {
    // Override modalOptions onApprove function
    modalOptions.onApprove = () => {
        // Seed ID from event target
        const seedId = $(e.target).closest('.record')[0].id;
        // Meteor Call for removing data function
        Meteor.call('removeData', 'seeds', seedId);
        // Show sidebar notification
        notify('positive', 'Brawo!', 'Pomyślnie usunięto rekord.');
    };
    // Override modalOptions onHidden function
    modalOptions.onHidden = () => {};
    // Show modal with changed options
    $('#modalDelete').modal(modalOptions).modal('show');
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Sets seeds selector
 * @param {Object} data - selector data.
 * @return {Object} selector - The MongoDB selector.
 */
const setSeedsSelector = data => {
    let selector = {$and: []};
    let quantity = {quantity: {}};
    let harvestDate = {date: {}};
    let createdDate = {createdAt: {}};

    if (data.search !== '') {
        selector.$and.push({
            $or: [{
                    "plant.name": {$regex: data.search, $options: 'i'}
                },
                {
                    note: {$regex: data.search, $options: 'i'}
                }
            ]
        });
    } else {
        selector.$and.push({
            "plant.name": {$regex: '.*'}
        });
    }

    // quantity selector
    if (data.quantity.from !== null) {
        quantity.quantity.$gte = parseInt(data.quantity.from);
    }
    if (data.quantity.to !== null) {
        quantity.quantity.$lte = parseInt(data.quantity.to);
    }
    if (!isNaN(quantity.quantity.$gte) || !isNaN(quantity.quantity.$lte)) {
        selector.$and.push(quantity);
    }

    // unit selector
    if (data.unit !== null) {
        selector.$and.push({unit: data.unit});
    }

    // usage selector
    if (data.usage !== null) {
        selector.$and.push({usage: data.usage});
    }

    // harvest date selector
    if (data.harvestDate.from !== null) {
        harvestDate.date.$gte = data.harvestDate.from;
    }
    if (data.harvestDate.to !== null) {
        harvestDate.date.$lte = data.harvestDate.to;
    }
    if (harvestDate.date.$gte || harvestDate.date.$lte) {
        selector.$and.push(harvestDate);
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
 * Sets seeds sort
 * @param {Object} data - sort field and sort direction.
 * @return {Object} sortObject - The MongoDB sort.
 */
const setSeedsSort = data => {
    const field = data.field;
    const sort = data.sort;

    let sortObject = {};

    switch (field) {
        case 'plant':
            sortObject = {
                "plant.name": sort
            };
            break;
        case 'quantity':
            sortObject.quantity = sort;
            break;
        case 'unit':
            sortObject.unit = sort;
            break;
        case 'date':
            sortObject.date = sort;
            break;
        case 'usage':
            sortObject.usage = sort;
            break;
        case 'note':
            sortObject.note = sort;
            break;
        case 'createdAt':
            sortObject.createdAt = sort;
            break;
        default:
            break;
    }

    return sortObject;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Shows modal with seeds report
 */
export const printReportSeeds = () => {
    // Override reportModalOptions transition value
    reportModalOptions.transition = 'fade';
    // Override reportModalOptions onShow method
    reportModalOptions.onShow = () => {
        // Call Meteor method generateOrderPDF to generate order PDF
        Meteor.call('generateReport', 'Nasiona', setSeedsSelector(seedsSelector.get()), setSeedsSort(seedsSort.get()), seedsSelector.get(), (error, result) => {
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
// - - - - - - - - - - - S E E D S  V A R I A B L E S- - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Exported variables with current page and total pages for pagination module
export const seedsCurrentPage = new ReactiveVar();
export const seedsNumberOfPages = new ReactiveVar();
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Copied Semantic Calendar Options into four variables for four calendars purpose
let harvestDateFromOptions = $.extend(true, {}, datePickerOptions);
let harvestDateToOptions = $.extend(true, {}, datePickerOptions);
let createdDateFromOptions = $.extend(true, {}, datePickerOptions);
let createdDateToOptions = $.extend(true, {}, datePickerOptions);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Copied Semantic Modal Options into one variable for modal purpose
let reportModalOptions = $.extend(true, {}, modalOptions);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Global selector
const seedsSelector = new ReactiveVar();
// Global sort
const seedsSort = new ReactiveVar();

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - S E E D S - - - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.seeds.onCreated(function() {
    // Instance variable (this)
    const instance = this;
    // Set current page to first
    seedsCurrentPage.set(1);
    // Limit displaying records to 10
    instance.limit = new ReactiveVar(10);
    // Set selector to query all data
    instance.selector = new ReactiveVar({
        search: '',
        quantity: {
            from: null,
            to: null
        },
        unit: null,
        harvestDate: {
            from: null,
            to: null
        },
        usage: null,
        createdAt: {
            from: null,
            to: null
        }
    });
    seedsSelector.set(instance.selector.get());
    // Sort records in descending order by createdAt field
    instance.sort = new ReactiveVar({field: 'createdAt', sort: -1});
    seedsSort.set(instance.sort.get());
    // Set loaded number of records to 10
    instance.loaded = new ReactiveVar(10);

    // Autorun function
    instance.autorun(() => {
        // Get current reactive values
        const page = seedsCurrentPage.get();
        const limit = instance.limit.get();
        const selector = instance.selector.get();
        const sort = instance.sort.get();

        seedsSelector.set(selector);
        seedsSort.set(sort);

        // Subscribe to collections
        const seedsSubscribtion = instance.subscribe('seeds', page, limit, setSeedsSelector(selector), setSeedsSort(sort));
        const seedsCountSubscription = instance.subscribe('seedsCount', setSeedsSelector(selector));

        // When subscribtion is ready set number of loaded records to current limit
        if (seedsSubscribtion.ready()) {
            instance.loaded.set(limit);
        }
        // When subscribtion is ready set total number of pages according to current limit
        if (seedsCountSubscription.ready()) {
            seedsNumberOfPages.set(getNumberOfPages('seeds', limit));
        }
    });

    // Seeds collection cursor
    instance.seeds = () => {
        return seeds.find({}, {limit: instance.loaded.get(), sort: setSeedsSort(instance.sort.get())});
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.seeds.onRendered(function() {
    // Instance variable (this)
    const instance = this;
    // Override onChange function from harvestDateFromOptions object
    harvestDateFromOptions.onChange = date => {
        const selector = instance.selector.get();

        if (date) {
            date = new Date(moment(date).hour(0).minute(0).second(0).toISOString());
        } else {
            date = null;
        }

        selector.harvestDate.from = date;

        instance.selector.set(selector);
    };
    // Sets endCalendar option to first calendar widget
    harvestDateFromOptions.endCalendar = $('#harvestDateToCalendar');
    // Override onChange function from harvestDateToOptions object
    harvestDateToOptions.onChange = date => {
        const selector = instance.selector.get();

        if (date) {
            date = new Date(moment(date).hour(23).minute(59).second(59).toISOString());
        } else {
            date = null;
        }

        selector.harvestDate.to = date;

        instance.selector.set(selector);
    };
    // Sets startCalendar option to second calendar widget
    harvestDateToOptions.startCalendar = $('#harvestDateFromCalendar');

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
    // Initialize modal
    $('#modalDelete').modal(modalOptions);
    $('#modalReportPrint').modal(reportModalOptions);
    // Initialize dropdowns
    $('#unit-dropdown').dropdown();
    $('#usage-dropdown').dropdown();
    // Initialize calendars
    $('#harvestDateFromCalendar').calendar(harvestDateFromOptions);
    $('#harvestDateToCalendar').calendar(harvestDateToOptions);
    $('#createdDateFromCalendar').calendar(createdDateFromOptions);
    $('#createdDateToCalendar').calendar(createdDateToOptions);
    // Sets button with 10 records per page to active
    $('#10recordsPerPage').addClass('active');
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.seeds.helpers({
    // Seeds records
    seeds: () => {
        return Template.instance().seeds();
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
Template.seeds.events({
    // Double click record to go to the seeds details page
    "dblclick .record" : (e, t) => {
        const seedId = $(e.target).closest('.record')[0].id;
        if (seedId !== '') {
            FlowRouter.go('seedsDetails', {id: seedId});
        }
    },
    // Click edit button to go to the seeds edit page
    "click .editButton": (e, t) => {
        e.stopPropagation();

        const seedId = $(e.target).closest('.record')[0].id;
        if (seedId !== '') {
            FlowRouter.go('seedsEdit', {id: seedId});
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
    // Type search phrase
    "keyup #search": (e, t) => {
        const value = e.currentTarget.value;
        const selector = t.selector.get();

        selector.search = value;

        t.selector.set(selector);
    },
    // Click clearHarvestDateFrom button to clear selected date
    "click #clearHarvestDateFrom": (e, t) => {
        e.preventDefault();

        $('#harvestDateFromCalendar').calendar('clear');
        $(e.currentTarget).blur();
    },
    // Click clearHarvestDateTo button to clear selected date
    "click #clearHarvestDateTo": (e, t) => {
        e.preventDefault();

        $('#harvestDateToCalendar').calendar('clear');
        $(e.currentTarget).blur();
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

        seedsCurrentPage.set(1);
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
    // Change quantity from input value
    "keyup #quantityFromInput": (e, t) => {
        const value = e.currentTarget.value;
        const selector = t.selector.get();

        if (value !== '') {
            if (!isNaN(value)) {
                selector.quantity.from = value;
            }
        } else {
            selector.quantity.from = null;
        }

        t.selector.set(selector);
    },
    // Change quantity to input value
    "keyup #quantityToInput": (e, t) => {
        const value = e.currentTarget.value;
        const selector = t.selector.get();

        if (value !== '') {
            if (!isNaN(value)) {
                selector.quantity.to = value;
            }
        } else {
            selector.quantity.to = null;
        }

        t.selector.set(selector);
    },
    // Clear quantity input fields
    "click #clearQuantity": (e, t) => {
        const selector = t.selector.get();

        $('#quantityFromInput').val('');
        $('#quantityToInput').val('');

        selector.quantity.from = null;
        selector.quantity.to = null;

        t.selector.set(selector);
    },
    // action for changing unit value for filtering
    "change #unit-dropdown": (e, t) => {
        let value = $('#unit-dropdown').dropdown('get value');
        const selector = t.selector.get();

        if (value === '') {
            value = null;
        }

        selector.unit = value;

        t.selector.set(selector);
    },
    // clear unit dropdown
    "click #clearUnit": (e, t) => {
        $('#unit-dropdown').dropdown('restore defaults');
    },
    // action for changing usage value for filtering
    "change #usage-dropdown": (e, t) => {
        let value = $('#usage-dropdown').dropdown('get value');
        const selector = t.selector.get();

        if (value === '') {
            value = null;
        }

        selector.usage = value;

        t.selector.set(selector);
    },
    // clear usage dropdown
    "click #clearUsage": (e, t) => {
        $('#usage-dropdown').dropdown('restore defaults');
    }
});