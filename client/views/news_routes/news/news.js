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
// - - - - - - - - - - - - N E W S  F U N C T I O N S- - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Deletes record
 * @param {Object} e - event object.
 */
const deleteRecord = e => {
    // Override modalOptions onApprove function
    modalOptions.onApprove = () => {
        // News ID from event target
        const newsId = $(e.target).closest('.record')[0].id;
        // Meteor Call for removing data function
        Meteor.call('removeData', 'news', newsId);
        // Show sidebar notification
        notify('positive', 'Brawo!', 'Pomyślnie usunięto news.');
    };
    // Override modalOptions onHidden function
    modalOptions.onHidden = () => {};
    // Show modal with changed options
    $('#modalDelete').modal(modalOptions).modal('show');
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Sets news selector
 * @param {Object} data - selector search value and publish dates.
 * @return {Object} selector - The MongoDB selector.
 */
const setNewsSelector = data => {
    let selector = {$and: []};
    let createdAt = {createdAt: {}};

    if (data.search !== '') {
        selector.$and.push({
            $or: [{
                    title: {$regex: data.search, $options: 'i'}
                },
                {
                    content: {$regex: data.search, $options: 'i'}
                },
                {
                    "author.name": {$regex: data.search, $options: 'i'}
                }
            ]
        });
    } else {
        selector.$and.push({
            title: {$regex: '.*'}
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
 * Sets news sort
 * @param {Object} data - sort field and sort direction.
 * @return {Object} sortObject - The MongoDB sort.
 */
const setNewsSort = data => {
    const field = data.field;
    const sort = data.sort;

    let sortObject = {};

    switch (field) {
        case 'createdAt':
            sortObject.createdAt = sort;
            break;
        case 'title':
            sortObject.title = sort;
            break;
        case 'author':
            sortObject = {
                "author.name": sort
            };
            break;
        default:
            break;
    }

    return sortObject;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Shows modal with news report
 */
export const printReportNews = () => {
    // Override reportModalOptions transition value
    reportModalOptions.transition = 'fade';
    // Override reportModalOptions onShow method
    reportModalOptions.onShow = () => {
        // Call Meteor method generateOrderPDF to generate order PDF
        Meteor.call('generateReport', 'News', setNewsSelector(newsSelector.get()), setNewsSort(newsSort.get()), newsSelector.get(), (error, result) => {
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
// - - - - - - - - - - - - N E W S  V A R I A B L E S- - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Exported variables with current page and total pages for pagination module
export const newsCurrentPage = new ReactiveVar();
export const newsNumberOfPages = new ReactiveVar();
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Copied Semantic Calendar Options into two variables for two calendars purpose
let dateFromOptions = $.extend(true, {}, datePickerOptions);
let dateToOptions = $.extend(true, {}, datePickerOptions);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Copied Semantic Modal Options into one variable for modal purpose
let reportModalOptions = $.extend(true, {}, modalOptions);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Global selector
const newsSelector = new ReactiveVar();
// Global sort
const newsSort = new ReactiveVar();

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - - N E W S - - - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.news.onCreated(function() {
    // Instance variable (this)
    const instance = this;
    // Set current page to first
    newsCurrentPage.set(1);
    // Limit displaying records to 10
    instance.limit = new ReactiveVar(10);
    // Set selector to query all data
    instance.selector = new ReactiveVar({
        search: '',
        dateFrom: null,
        dateTo: null
    });
    newsSelector.set(instance.selector.get());
    // Sort records in descending order by createdAt field
    instance.sort = new ReactiveVar({field: 'createdAt', sort: -1});
    newsSort.set(instance.sort.get());
    // Set loaded number of records to 10
    instance.loaded = new ReactiveVar(10);

    // Autorun function
    instance.autorun(() => {
        // Get current reactive values
        const page = newsCurrentPage.get();
        const limit = instance.limit.get();
        const selector = instance.selector.get();
        const sort = instance.sort.get();

        newsSelector.set(selector);
        newsSort.set(sort);

        // Subscribe to collections
        const newsSubscribtion = instance.subscribe('news', page, limit, setNewsSelector(selector), setNewsSort(sort));
        const newsCountSubscription = instance.subscribe('newsCount', setNewsSelector(selector));

        // When subscribtion is ready set number of loaded records to current limit
        if (newsSubscribtion.ready()) {
            instance.loaded.set(limit);
        }
        // When subscribtion is ready set total number of pages according to current limit
        if (newsCountSubscription.ready()) {
            newsNumberOfPages.set(getNumberOfPages('news', limit));
        }
    });

    // News collection cursor
    instance.news = () => {
        return news.find({}, {limit: instance.loaded.get(), sort: setNewsSort(instance.sort.get())});
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.news.onRendered(function() {
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
    $('.editButton').popup();
    $('.deleteButton').popup();
    // Initialize modals
    $('#modalDelete').modal(modalOptions);
    $('#modalReportPrint').modal(reportModalOptions);
    // Initialize calendars
    $('#dateFromCalendar').calendar(dateFromOptions);
    $('#dateToCalendar').calendar(dateToOptions);
    // Sets button with 10 records per page to active
    $('#10recordsPerPage').addClass('active');
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.news.helpers({
    // News records
    news: () => {
        return Template.instance().news();
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
Template.news.events({
    // Double click record to go to the news details page
    "dblclick .record": (e, t) => {
        const newsId = $(e.target).closest('.record')[0].id;
        if (newsId !== '') {
            FlowRouter.go('newsDetails', {id: newsId});
        }
    },
    // Click edit button to go to the news edit page
    "click .editButton": (e, t) => {
        e.stopPropagation();

        const newsId = $(e.target).closest('.record')[0].id;
        if (newsId !== '') {
            FlowRouter.go('newsEdit', {id: newsId});
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

        newsCurrentPage.set(1);
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