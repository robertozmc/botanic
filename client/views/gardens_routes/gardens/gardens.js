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
// - - - - - - - - - - G A R D E N S  F U N C T I O N S- - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Deletes record
 * @param {Object} e - event object.
 */
const deleteRecord = e => {
    // Override modalOptions onApprove function
    modalOptions.onApprove = () => {
        // Garden ID from event target
        const gardenId = $(e.target).closest('.record')[0].id;
        // Meteor Call for removing data function
        Meteor.call('removeData', 'gardens', gardenId);
        // Show sidebar notification
        notify('positive', 'Brawo!', 'Pomyślnie usunięto ogród.');
    };
    // Override modalOptions onHidden function
    modalOptions.onHidden = () => {};
    // Show modal with changed options
    $('#modalDelete').modal(modalOptions).modal('show');
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Sets gardens selector
 * @param {Object} data - selector search value and created dates.
 * @return {Object} selector - The MongoDB selector.
 */
const setGardensSelector = data => {
    let selector = {$and: []};
    let createdAt = {createdAt: {}};

    if (data.search !== '') {
        selector.$and.push({
            $or: [{
                    name: {$regex: data.search, $options: 'i'}
                },
                {
                    subname: {$regex: data.search, $options: 'i'}
                },
                {
                    "address.street": {$regex: data.search, $options: 'i'}
                },
                {
                    "address.number": {$regex: data.search, $options: 'i'}
                },
                {
                    "address.postalCode": {$regex: data.search, $options: 'i'}
                },
                {
                    "address.city": {$regex: data.search, $options: 'i'}
                },
                {
                    "address.country": {$regex: data.search, $options: 'i'}
                },
                {
                    "contact.phone": {$regex: data.search, $options: 'i'}
                },
                {
                    "contact.fax": {$regex: data.search, $options: 'i'}
                },
                {
                    "contact.email": {$regex: data.search, $options: 'i'}
                },
                {
                    "contact.website": {$regex: data.search, $options: 'i'}
                },
                {
                    representative: {$regex: data.search, $options: 'i'}
                }
            ]
        });
    } else {
        selector.$and.push({
            name: {$regex: '.*'}
        });
    }

    if (data.dateFrom !== null) {
        createdAt.createdAt.$gte = data.dateFrom;
    }

    if (data.dateTo !== null) {
        createdAt.createdAt.$lte = data.dateTo;
    }

    if (createdAt.createdAt.$gte || createdAt.createdAt.$lte) {
        selector.$and.push(createdAt);
    }

    return selector;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Sets gardens sort
 * @param {Object} data - sort field and sort direction.
 * @return {Object} sortObject - The MongoDB sort.
 */
const setGardensSort = data => {
    const field = data.field;
    const sort = data.sort;

    let sortObject = {};

    switch (field) {
        case 'name':
            sortObject.name = sort;
            break;
        case 'address':
            sortObject = {
                "address.street": sort
            };
            break;
        case 'phoneFax':
            sortObject = {
                "contact.phone": sort
            };
            break;
        case 'emailWebsite':
            sortObject = {
                "contact.email": sort
            };
            break;
        case 'representative':
            sortObject.representative = sort;
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
 * Shows modal with gardens report
 */
export const printReportGardens = () => {
    // Override reportModalOptions transition value
    reportModalOptions.transition = 'fade';
    // Override reportModalOptions onShow method
    reportModalOptions.onShow = () => {
        // Call Meteor method generateOrderPDF to generate order PDF
        Meteor.call('generateReport', 'Ogrody botaniczne', setGardensSelector(gardensSelector.get()), setGardensSort(gardensSort.get()), gardensSelector.get(), (error, result) => {
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
// - - - - - - - - - - G A R D E N S  V A R I A B L E S- - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Exported variables with current page and total pages for pagination module
export const gardensCurrentPage = new ReactiveVar();
export const gardensNumberOfPages = new ReactiveVar();
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Copied Semantic Calendar Options into two variables for two calendars purpose
let dateFromOptions = $.extend(true, {}, datePickerOptions);
let dateToOptions = $.extend(true, {}, datePickerOptions);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Copied Semantic Modal Options into one variable for modal purpose
let reportModalOptions = $.extend(true, {}, modalOptions);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Clipboard
const Clipboard = require('clipboard');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Page Session
const pageSession = new ReactiveDict();
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Global selector
const gardensSelector = new ReactiveVar();
// Global sort
const gardensSort = new ReactiveVar();

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - G A R D E N S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.gardens.onCreated(function() {
    // Instance variable (this)
    const instance = this;
    // Set current page to first
    gardensCurrentPage.set(1);
    // Limit displaying records to 10
    instance.limit = new ReactiveVar(10);
    // Set selector to query all data
    instance.selector = new ReactiveVar({
        search: '',
        dateFrom: null,
        dateTo: null
    });
    gardensSelector.set(instance.selector.get());
    // Sort records in descending order by createdAt field
    instance.sort = new ReactiveVar({field: 'createdAt', sort: -1});
    gardensSort.set(instance.sort.get());
    // Set loaded number of records to 10
    instance.loaded = new ReactiveVar(10);

    // Autorun function
    instance.autorun(() => {
        // Get current reactive values
        const page = gardensCurrentPage.get();
        const limit = instance.limit.get();
        const selector = instance.selector.get();
        const sort = instance.sort.get();

        gardensSelector.set(selector);
        gardensSort.set(sort);

        // Subscribe to collections
        const gardensSubscribtion = instance.subscribe('gardens', page, limit, setGardensSelector(selector), setGardensSort(sort));
        const gardensCountSubscription = instance.subscribe('gardensCount', setGardensSelector(selector));

        // When subscribtion is ready set number of loaded records to current limit
        if (gardensSubscribtion.ready()) {
            instance.loaded.set(limit);
        }
        // When subscribtion is ready set total number of pages according to current limit
        if (gardensCountSubscription.ready()) {
            gardensNumberOfPages.set(getNumberOfPages('gardens', limit));
        }
    });

    // Gardens collection cursor
    instance.gardens = () => {
        return gardens.find({}, {limit: instance.loaded.get(), sort: setGardensSort(instance.sort.get())});
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.gardens.onRendered(function() {
    // Instance variable (this)
    const instance = this;
    // Override onChange function from dateFromOptions object
    dateFromOptions.onChange = date => {
        const selector = instance.selector.get();

        if (date) {
            date = new Date(moment(date).hour(0).minute(0).second(0).toISOString());
        } else {
            date = null;
        }

        selector.dateFrom = date;

        instance.selector.set(selector);
    };
    // Sets endCalendar option to first calendar widget
    dateFromOptions.endCalendar = $('#dateToCalendar');
    // Override onChange function from dateToOptions object
    dateToOptions.onChange = date => {
        const selector = instance.selector.get();

        if (date) {
            date = new Date(moment(date).hour(23).minute(59).second(59).toISOString());
        } else {
            date = null;
        }

        selector.dateTo = date;

        instance.selector.set(selector);
    };
    // Sets startCalendar option to second calendar widget
    dateToOptions.startCalendar = $('#dateFromCalendar');

    // Initialize popups
    $('.copyEmail').popup();
    $('.editButton').popup();
    $('.deleteButton').popup();
    // Initialize modal
    $('#modalDelete').modal(modalOptions);
    $('#modalReportPrint').modal(reportModalOptions);
    // Initialize calendars
    $('#dateFromCalendar').calendar(dateFromOptions);
    $('#dateToCalendar').calendar(dateToOptions);
    // Sets button with 10 records per page to active
    $('#10recordsPerPage').addClass('active');

    // Clipboard object
    const copyEmail = new Clipboard('.copyEmail', {
        target: function(trigger) {
            return trigger.parentElement;
        }
    });
    // copyEmail onSuccess event handler
    copyEmail.on('success', function(e) {
        e.clearSelection();
        pageSession.set('copyEmail', false);
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.gardens.helpers({
    // Gardens records
    gardens: () => {
        return Template.instance().gardens();
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
Template.gardens.events({
    // Double click record to go to the gardens details page
    "dblclick .record" : (e, t) => {
        const gardenId = $(e.target).closest('.record')[0].id;
        if (gardenId !== '' && !pageSession.get('copyEmail')) {
            FlowRouter.go('gardensDetails', {id: gardenId});
        }
    },
    // Click copyEmail button to copy email to clipboard
    "click .copyEmail": (e, t) => {
        pageSession.set('copyEmail', true);
        notify('positive', 'Brawo!', 'Pomyślnie skopiowano adres e-mail.');
    },
    // Hover copyEmail button to show popup
    "mouseenter .copyEmail": (e, t) => {
        $(e.target).popup('show');
    },
    // Click edit button to go to the gardens edit page
    "click .editButton": (e, t) => {
        e.stopPropagation();
        const gardenId = $(e.target).closest('.record')[0].id;
        if (gardenId !== '') {
            FlowRouter.go('gardensEdit', {id: gardenId});
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
    // Click clear dateFrom button to clear selected date
    "click #clearDateFrom": (e, t) => {
        e.preventDefault();

        $('#dateFromCalendar').calendar('clear');
        $(e.currentTarget).blur();
    },
    // Click clear dateTo button to clear selected date
    "click #clearDateTo": (e, t) => {
        e.preventDefault();

        $('#dateToCalendar').calendar('clear');
        $(e.currentTarget).blur();
    },
    // Click records per page button to select new limit of loaded records
    "click .recordsPerPage": (e, t) => {
        e.preventDefault();

        $('.recordsPerPage').removeClass('active');
        t.limit.set(parseInt(e.currentTarget.value));
        $(e.currentTarget).addClass('active');

        gardensCurrentPage.set(1);
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
    }
});