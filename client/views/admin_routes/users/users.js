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
// - - - - - - - - - - - U S E R S  F U N C T I O N S- - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Deletes record
 * @param {Object} e - event object.
 */
const deleteRecord = e => {
    // Override modalOptions onApprove function
    modalOptions.onApprove = () => {
        // User ID from event target
        const userId = e.target.parentElement.parentElement.id;
        // Meteor Call for removing data function
        Meteor.call('removeUserAccount', userId);
        // Show sidebar notification
        notify('positive', 'Brawo!', 'Pomyślnie usunięto użytkownika.');
    };
    // Override modalOptions onHidden function
    modalOptions.onHidden = () => {
    };
    // Show modal with changed options
    $('#modalDelete').modal(modalOptions).modal('show');
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Sets users selector
 * @param {Object} data - selector data.
 * @return {Object} selector - The MongoDB selector.
 */
const setUsersSelector = data => {
    let selector = {$and: []};
    let createdDate = {createdAt: {}};

    if (data.search !== '') {
        selector.$and.push({
            $or: [{
                    name: {$regex: data.search, $options: 'i'}
                },
                {
                    username: {$regex: data.search, $options: 'i'}
                }
            ]
        });
    } else {
        selector.$and.push({
            name: {$regex: '.*'}
        });
    }

    // roles selector
    if (data.roles !== null) {
        const roles = data.roles;
        let rolesSelector = {$or: []};

        roles.forEach(role => {
            rolesSelector.$or.push({roles: role});
        });

        selector.$and.push(rolesSelector);
    }

    // status selector
    if (data.verified !== null) {
        selector.$and.push({"emails.0.verified": data.verified});
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
 * Sets users sort
 * @param {Object} data - sort field and sort direction.
 * @return {Object} sortObject - The MongoDB sort.
 */
const setUsersSort = data => {
    const field = data.field;
    const sort = data.sort;

    let sortObject = {};

    switch (field) {
        case 'name':
            sortObject.name = sort;
            break;
        case 'username':
            sortObject.username = sort;
            break;
        case 'email':
            sortObject = {
                "emails.0.address": sort
            };
            break;
        case 'verified':
            sortObject = {
                "emails.0.verified": sort
            };
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
 * Shows modal with users report
 */
export const printReportUsers = () => {
    // Override reportModalOptions transition value
    reportModalOptions.transition = 'fade';
    // Override reportModalOptions onShow method
    reportModalOptions.onShow = () => {
        // Call Meteor method generateOrderPDF to generate order PDF
        Meteor.call('generateReport', 'Użytkownicy', setUsersSelector(usersSelector.get()), setUsersSort(usersSort.get()), usersSelector.get(), (error, result) => {
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
// - - - - - - - - - - - U S E R S  V A R I A B L E S- - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Exported variables with current page and total pages for pagination module
export const usersCurrentPage = new ReactiveVar();
export const usersNumberOfPages = new ReactiveVar();
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Copied Semantic Calendar Options into two variables for two calendars purpose
let createdDateFromOptions = $.extend(true, {}, datePickerOptions);
let createdDateToOptions = $.extend(true, {}, datePickerOptions);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Copied Semantic Modal Options into one variable for modal purpose
let reportModalOptions = $.extend(true, {}, modalOptions);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Require Clipboard package
const Clipboard = require('clipboard');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Global selector
const usersSelector = new ReactiveVar();
// Global sort
const usersSort = new ReactiveVar();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.users.onCreated(function() {
    // Instance variable (this)
    const instance = this;
    // Set current page to first
    usersCurrentPage.set(1);
    // Limit displaying records to 10
    instance.limit = new ReactiveVar(10);
    // Set selector to query all data
    instance.selector = new ReactiveVar({
        search: '',
        roles: null,
        verified: null,
        createdAt: {
            from: null,
            to: null
        }
    });
    usersSelector.set(instance.selector.get());
    // Sort records in descending order by createdAt field
    instance.sort = new ReactiveVar({field: 'createdAt', sort: -1});
    usersSort.set(instance.sort.get());
    // Set loaded number of records to 10
    instance.loaded = new ReactiveVar(10);
    // Set subsReady variables
    instance.subsReady = new ReactiveVar(false);

    // Autorun function
    instance.autorun(() => {
        // Get current reactive values
        const page = usersCurrentPage.get();
        const limit = instance.limit.get();
        const selector = instance.selector.get();
        const sort = instance.sort.get();

        usersSelector.set(selector);
        usersSort.set(sort);

        // Subscribe to collections
        const usersSubscribtion = instance.subscribe('users', page, limit, setUsersSelector(selector), setUsersSort(sort));
        const usersCountSubscription = instance.subscribe('usersCount', setUsersSelector(selector));

        // When subscribtion is ready set number of loaded records to current limit
        if (usersSubscribtion.ready()) {
            instance.loaded.set(limit);
            instance.subsReady.set(true);
            instance.rolesReady.set(false);
        }
        // When subscribtion is ready set total number of pages according to current limit
        if (usersCountSubscription.ready()) {
            usersNumberOfPages.set(getNumberOfPages('users', limit));
        }
    });

    // Users collection cursor
    instance.users = () => {
        return Meteor.users.find({}, {limit: instance.loaded.get(), sort: setUsersSort(instance.sort.get())});
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.users.onRendered(function () {
    // Instance variable (this)
    const instance = this;
    // rolesReady flag
    instance.rolesReady = new ReactiveVar(false);

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
    $('.verifyButton').popup();
    $('.deleteButton').popup();
    // Initialize modal
    $('#modalDelete').modal(modalOptions);
    $('#modalReportPrint').modal(reportModalOptions);
    // Initialize dropdowns
    $('#permissions-dropdown').dropdown();
    $('#verified-dropdown').dropdown();
    // Initialize calendars
    $('#createdDateFromCalendar').calendar(createdDateFromOptions);
    $('#createdDateToCalendar').calendar(createdDateToOptions);
    // Sets button with 10 records per page to active
    $('#10recordsPerPage').addClass('active');

    const copyEmail = new Clipboard('.copyEmail', {
        target: function(trigger) {
            return trigger.parentElement;
        }
    });

    copyEmail.on('success', function(e) {
        e.clearSelection();
    });

    instance.autorun(() => {
        if (instance.subsReady.get()) {
            const cursor = instance.users();

            if (cursor) {
                cursor.forEach((user) => {
                    if (user.roles) {
                        const userId = user._id;
                        Meteor.setTimeout(() => {
                            // Initialize roles dropdowns
                            $('.roles').dropdown();
                            // Set user roles to dropdown
                            $(`#${userId} div.dropdown`).dropdown('set selected', user.roles);
                        });
                    }
                });
                // Set rolesReady flag to true for let change user roles
                Meteor.setTimeout(() => {
                    instance.rolesReady.set(true);
                }, 1000);
            }
        }
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.users.helpers({
    // helper for list of users in db
    users: () => {
        return Template.instance().users();
    },
    // helper that returns true if given user is the same as the logged one
    isYou: (id) => {
        return id === Meteor.userId();
    },
    // helper for disabling main admin roles select field
    isMainAdmin: (username) => {
        return username === 'admin' ? 'disabled' : '';
    },
    // helper for setting status and color on user record
    isVerified: (id) => {
        const user = Meteor.users.findOne(id, {fields: {emails: 1}});

        if (user) {
            if (user.emails) {
                const verified = user.emails[0].verified;

                if (verified === true) {
                    return "positive";
                } else if (verified === false) {
                    return "negative";
                } else {
                    return false;
                }
            } else {
                return false;
            }
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
Template.users.events({
    "click .copyEmail": (e, t) => {
        notify('positive', 'Brawo!', 'Pomyślnie skopiowano adres e-mail.');
    },
    "mouseenter .copyEmail": (e, t) => {
        $(e.target).popup('show');
    },
    "change .roles": (e, t) => {
        if (t.rolesReady.get()) {
            const user = e.target.parentElement.parentElement.parentElement.id;

            if (user) {
                let roles = e.target.value;

                roles = roles.split(",");
                Meteor.call('changeUserRoles', user, roles);
            }
        }
    },
    "click .verifyButton": (e, t) => {
        const userId = e.target.parentElement.parentElement.id;

        Meteor.call('verifyUser', userId);
    },
    "mouseenter .verifyButton": (e, t) => {
        $(e.target).popup('show');
    },
    "click .deleteButton": (e, t) => {
        deleteRecord(e);
    },
    "mouseenter .deleteButton": (e, t) => {
        $(e.target).popup('show');
    },
    // Click records per page button to select new limit of loaded records
    "click .recordsPerPage": (e, t) => {
        e.preventDefault();

        $('.recordsPerPage').removeClass('active');
        t.limit.set(parseInt(e.currentTarget.value));
        $(e.currentTarget).addClass('active');

        usersCurrentPage.set(1);
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
    // action for changing roles value for filtering
    "change #permissions-dropdown": (e, t) => {
        let value = $('#permissions-dropdown').dropdown('get value');
        const selector = t.selector.get();

        if (value === '') {
            value = null;
        } else {
            value = value.split(',');
        }

        selector.roles = value;

        t.selector.set(selector);
    },
    // clear import garden dropdown
    "click #clearPermissions": (e, t) => {
        $('#permissions-dropdown').dropdown('restore defaults');
    },
    // action for changing verified value for filtering
    "change #verified-dropdown": (e, t) => {
        let value = $('#verified-dropdown').dropdown('get value');
        const selector = t.selector.get();

        value = stringToBoolean(value);

        selector.verified = value;

        t.selector.set(selector);
    },
    // clear confirmed dropdown
    "click #clearVerified": (e, t) => {
        $('#verified-dropdown').dropdown('restore defaults');
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
});