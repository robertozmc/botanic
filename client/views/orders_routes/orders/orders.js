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
import {getNumberOfPages, stringToBoolean} from '../../../lib/utils.js';

// -----------------------------------------------------------------------------
// - - - - - - - - - - - O R D E R S  F U N C T I O N S- - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Deletes record
 * @param {Object} e - event object.
 */
const deleteRecord = e => {
    // Override modalOptions onApprove function
    modalOptions.onApprove = () => {
        // Order ID from event target
        const orderId = $(e.target).closest('.record')[0].id;
        // Meteor Call for removing data function
        Meteor.call('removeData', 'orders', orderId);
        // Show sidebar notification
        notify('positive', 'Brawo!', 'Pomyślnie usunięto zamówienie.');
    };
    // Override modalOptions onHidden function
    modalOptions.onHidden = () => {};
    // Show modal with changed options
    $('#modalDelete').modal(modalOptions).modal('show');
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Sets orders selector
 * @param {Object} data - selector data.
 * @return {Object} selector - The MongoDB selector.
 */
const setOrdersSelector = data => {
    let selector = {$and: []};
    let orderDate = {createdAt: {}};

    if (data.search !== '') {
        selector.$and.push({
            $or: [{
                    "orderingParty.name": {$regex: data.search, $options: 'i'}
                },
                {
                    "orderingParty.subname": {$regex: data.search, $options: 'i'}
                },
                {
                    "orderingParty.address.street": {$regex: data.search, $options: 'i'}
                },
                {
                    "orderingParty.address.number": {$regex: data.search, $options: 'i'}
                },
                {
                    "orderingParty.address.postalCode": {$regex: data.search, $options: 'i'}
                },
                {
                    "orderingParty.address.city": {$regex: data.search, $options: 'i'}
                },
                {
                    "orderingParty.address.country": {$regex: data.search, $options: 'i'}
                },
                {
                    "orderingParty.contact.phone": {$regex: data.search, $options: 'i'}
                },
                {
                    "orderingParty.contact.fax": {$regex: data.search, $options: 'i'}
                },
                {
                    "orderingParty.contact.email": {$regex: data.search, $options: 'i'}
                },
                {
                    "orderingParty.contact.website": {$regex: data.search, $options: 'i'}
                },
                {
                    "orderingParty.representative": {$regex: data.search, $options: 'i'}
                }
            ]
        });
    } else {
        selector.$and.push({
            "orderingParty.name": {$regex: '.*'}
        });
    }

    // order status selector
    if (data.orderStatus !== null) {
        selector.$and.push({orderStatus: data.orderStatus});
    }

    // ordering party verified selector
    if (data.verified !== null) {
        selector.$and.push({verified: data.verified});
    }

    // ordered date selector
    if (data.createdAt.from !== null) {
        orderDate.createdAt.$gte = data.createdAt.from;
    }
    if (data.createdAt.to !== null) {
        orderDate.createdAt.$lte = data.createdAt.to;
    }
    if (orderDate.createdAt.$gte || orderDate.createdAt.$lte) {
        selector.$and.push(orderDate);
    }

    return selector;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Sets orders sort
 * @param {Object} data - sort field and sort direction.
 * @return {Object} sortObject - The MongoDB sort.
 */
const setOrdersSort = data => {
    const field = data.field;
    const sort = data.sort;

    let sortObject = {};

    switch (field) {
        case 'name':
            sortObject = {
                "orderingParty.name": sort
            };
            break;
        case 'address':
            sortObject = {
                "orderingParty.address.street": sort
            };
            break;
        case 'email':
            sortObject = {
                "orderingParty.contact.email": sort
            };
            break;
        case 'createdAt':
            sortObject.createdAt = sort;
            break;
        case 'status':
            sortObject.orderStatus = sort;
            break;
        case 'verified':
            sortObject.verified = sort;
            break;
        default:
            break;
    }

    return sortObject;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Shows modal with orders report
 */
export const printReportOrders = () => {
    // Override reportModalOptions transition value
    reportModalOptions.transition = 'fade';
    // Override reportModalOptions onShow method
    reportModalOptions.onShow = () => {
        // Call Meteor method generateOrderPDF to generate order PDF
        Meteor.call('generateReport', 'Zamówienia', setOrdersSelector(ordersSelector.get()), setOrdersSort(ordersSort.get()), ordersSelector.get(), (error, result) => {
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
// - - - - - - - - - - - O R D E R S  V A R I A B L E S- - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Exported variables with current page and total pages for pagination module
export const ordersCurrentPage = new ReactiveVar();
export const ordersNumberOfPages = new ReactiveVar();
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Copied Semantic Calendar Options into two variables for two calendars purpose
let orderDateFromOptions = $.extend(true, {}, datePickerOptions);
let orderDateToOptions = $.extend(true, {}, datePickerOptions);
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
const ordersSelector = new ReactiveVar();
// Global sort
const ordersSort = new ReactiveVar();

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - O R D E R S - - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.orders.onCreated(function() {
    // Instance variable (this)
    const instance = this;
    // Set current page to first
    ordersCurrentPage.set(1);
    // Limit displaying records to 10
    instance.limit = new ReactiveVar(10);
    // Set selector to query all data
    instance.selector = new ReactiveVar({
        search: '',
        verified: null,
        orderStatus: null,
        createdAt: {
            from: null,
            to: null
        }
    });
    ordersSelector.set(instance.selector.get());
    // Sort records in descending order by createdAt field
    instance.sort = new ReactiveVar({field: 'createdAt', sort: -1});
    ordersSort.set(instance.sort.get());
    // Set loaded number of records to 10
    instance.loaded = new ReactiveVar(10);

    // Autorun function
    instance.autorun(() => {
        // get current reactive values
        const page = ordersCurrentPage.get();
        const limit = instance.limit.get();
        const selector = instance.selector.get();
        const sort = instance.sort.get();

        ordersSelector.set(selector);
        ordersSort.set(sort);

        // Subscribe to collections
        const ordersSubscribtion = instance.subscribe('orders', page, limit, setOrdersSelector(selector), setOrdersSort(sort));
        const ordersCountSubscription = instance.subscribe('ordersCount', setOrdersSelector(selector));

        // When subscribtion is ready set number of loaded records to current limit
        if (ordersSubscribtion.ready()) {
            instance.loaded.set(limit);
        }
        // When subscribtion is ready set total number of pages according to current limit
        if (ordersCountSubscription.ready()) {
            ordersNumberOfPages.set(getNumberOfPages('orders', limit));
        }
    });

    // Orders collection cursor
    instance.orders = () => {
        return orders.find({}, {limit: instance.loaded.get(), sort: setOrdersSort(instance.sort.get())});
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.orders.onRendered(function() {
    // Instance variable (this)
    const instance = this;
    // Override onChange function from orderDateFromOptions object
    orderDateFromOptions.onChange = date => {
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
    orderDateFromOptions.endCalendar = $('#orderDateToCalendar');
    // Override onChange function from orderDateToOptions object
    orderDateToOptions.onChange = date => {
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
    orderDateToOptions.startCalendar = $('#orderDateFromCalendar');

    // Initialize popups
    $('.copyEmail').popup();
    $('.sendButton').popup();
    $('.deleteButton').popup();
    // Initialize modals
    $('#modalDelete').modal(modalOptions);
    $('#modalReportPrint').modal(reportModalOptions);
    // Initialize dropdowns
    $('#orderStatus-dropdown').dropdown();
    $('#verified-dropdown').dropdown();
    // Initialize calendars
    $('#orderDateFromCalendar').calendar(orderDateFromOptions);
    $('#orderDateToCalendar').calendar(orderDateToOptions);
    // Sets button with 10 records per page to active
    $('#10recordsPerPage').addClass('active');

    // Initialize copying email string to clipboard
    const copyEmail = new Clipboard('.copyEmail', {
        target: function(trigger) {
            return trigger.parentElement;
        }
    });
    // Overrride success event on copyEmail Clipboard instance
    copyEmail.on('success', function(e) {
        e.clearSelection();
        pageSession.set('copyEmail', false);
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.orders.helpers({
    // Orders records
    orders: () => {
        return Template.instance().orders();
    },
    // is preparing indicator
    isPreparing: status => {
        return (status === 'preparing') ? true : false;
    },
    // format status to nice looking strings
    formatStatus: status => {
        switch (status) {
            case 'processing':
                return "Przetwarzanie";
            case 'preparing':
                return "Przygotowywanie do wysyłki";
            case 'sent':
                return 'Wysłano';
            default:
                return "Nieznany status";
        }
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
Template.orders.events({
    // Double click record to go to the orders details page
    "dblclick .record": (e, t) => {
        const orderId = $(e.target).closest('.record')[0].id;
        if (orderId !== '' && !pageSession.get('copyEmail')) {
            FlowRouter.go('ordersDetails', {id: orderId});
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
    // Click send button to change order status to 'sent'
    "click .sendButton": (e, t) => {
        e.stopPropagation();
        const orderId = $(e.target).closest('.record')[0].id;
        if (orderId !== '') {
            Meteor.call('changeOrderStatus', orderId, 'sent');
            notify('positive', 'Brawo!', 'Pomyślnie zmieniono status zamówienia na "Wysłano".');
        }
    },
    // Hover send button to show popup
    "mouseenter .sendButton": (e, t) => {
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
    // Click clearOrderDateFrom button to clear selected date
    "click #clearOrderDateFrom": (e, t) => {
        e.preventDefault();

        $('#orderDateFromCalendar').calendar('clear');
        $(e.currentTarget).blur();
    },
    // Click clearOrderDateTo button to clear selected date
    "click #clearOrderDateTo": (e, t) => {
        e.preventDefault();

        $('#orderDateToCalendar').calendar('clear');
        $(e.currentTarget).blur();
    },
    // Click records per page button to select new limit of loaded records
    "click .recordsPerPage": (e, t) => {
        e.preventDefault();

        $('.recordsPerPage').removeClass('active');
        t.limit.set(parseInt(e.currentTarget.value));
        $(e.currentTarget).addClass('active');

        ordersCurrentPage.set(1);
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
    // Action for changing order status value for filtering
    "change #orderStatus-dropdown": (e, t) => {
        const value = $('#orderStatus-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.orderStatus = value;

        t.selector.set(selector);
    },
    // Clear order status dropdown
    "click #clearOrderStatus": (e, t) => {
        const selector = t.selector.get();

        $('#orderStatus-dropdown').dropdown('restore defaults');

        selector.orderStatus = null;

        t.selector.set(selector);
    },
    // Action for changing verified value for filtering
    "change #verified-dropdown": (e, t) => {
        const value = $('#verified-dropdown').dropdown('get value');
        const selector = t.selector.get();

        selector.verified = stringToBoolean(value);

        t.selector.set(selector);
    },
    // Clear verified dropdown
    "click #clearVerified": (e, t) => {
        const selector = t.selector.get();

        $('#verified-dropdown').dropdown('restore defaults');

        selector.verified = null;

        t.selector.set(selector);
    },
});