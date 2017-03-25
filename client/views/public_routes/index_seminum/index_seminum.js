// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Semantic Modal Options
import {modalOptions} from '../../../lib/modules/modal/modal_config.js';

// -----------------------------------------------------------------------------
// - - - - - - - - - I N D E X  S E M I N U M  F U N C T I O N S - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Showing modal
 * @param {Object} e - event object.
 */
const showModal = e => {
    // Override orderModalOptions onApprove function
    orderModalOptions.onApprove = () => {
        if ($('#orderInformationsForm').form('is valid')) {
            const name           = $('#orderInformationsForm').form('get value', 'name');
            const subname        = $('#orderInformationsForm').form('get value', 'subname');
            const street         = $('#orderInformationsForm').form('get value', 'street');
            const number         = $('#orderInformationsForm').form('get value', 'number');
            const postalCode     = $('#orderInformationsForm').form('get value', 'postalCode');
            const city           = $('#orderInformationsForm').form('get value', 'city');
            const country        = $('#orderInformationsForm').form('get value', 'country');
            const phone          = $('#orderInformationsForm').form('get value', 'phone');
            const fax            = $('#orderInformationsForm').form('get value', 'fax');
            const email          = $('#orderInformationsForm').form('get value', 'email');
            const website        = $('#orderInformationsForm').form('get value', 'website');
            const representative = $('#orderInformationsForm').form('get value', 'representative');
            const order          = indexSeminumTemplateInstance.seeds.get();
            const orderStatus    = 'processing';

            const orderData = {
                orderingParty: {
                    name: name !== '' ? name : null,
                    subname: subname !== '' ? subname : null,
                    address: {
                        street: street !== '' ? street : null,
                        number: number !== '' ? number : null,
                        postalCode: postalCode !== '' ? postalCode : null,
                        city: city !== '' ? city : null,
                        country: country !== '' ? country : null
                    },
                    contact: {
                        phone: phone !== '' ? phone : null,
                        fax: fax !== '' ? fax : null,
                        email: email !== '' ? email : null,
                        website: website !== '' ? website : null
                    },
                    representative: representative !== '' ? representative : null
                },
                order,
                orderStatus,
                createdAt: new Date(),
                editedAt: null
            };

            Meteor.call('addSeedsOrder', orderData, (error, result) => {
                if (error) {
                    // TODO: This shouldn't be called, but who knows
                    console.log(error);

                    return false;
                } else {
                    // Set ordering process to initial state
                    isOrdering.set(false);
                    $('tr.seminumRow').removeClass('positive');
                    seedsToOrder.set([]);
                    // Display order number information
                    orderNumber.set(result);
                    // Make order number information closeable
                    Meteor.setTimeout(() => {
                        $('.message .close').on('click', function() {
                            $(this).closest('.message').transition('fade');
                        });
                    }, 500);

                    return true;
                }
            });
        } else {
            return false;
        }
    };
    // Override orderModalOptions onHidden function
    orderModalOptions.onHidden = () => {};
    // Override orderModalOptions onVisible function
    orderModalOptions.onVisible = () => {
        // Meteor timeout to correctly focus carret on input field
        Meteor.setTimeout(() => {
            // Change carret position to input field
            $('#name').focus();
        });
    };
    // Show modal with changed options
    $('#indexSeminumModal').modal(orderModalOptions).modal('show');
};

// -----------------------------------------------------------------------------
// - - - - - - - - I N D E X  S E M I N U M  V A R I A B L E S - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Copied Semantic Modal Options into one variable for modal purpose
let orderModalOptions = $.extend(true, {}, modalOptions);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Order number
let orderNumber = new ReactiveVar(false);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// isOrdering flag
let isOrdering = new ReactiveVar(false);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Seeds to order array
let seedsToOrder = new ReactiveVar([]);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// indexSeminum template instance
let indexSeminumTemplateInstance = new ReactiveVar();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.indexSeminum.onCreated(function() {
    // Instance variable (this)
    const instance = this;
    indexSeminumTemplateInstance = instance;
    // Sort
    const sort = {
        "plant.division": -1,
        "plant.clade": -1,
        "plant.family": 1,
        "plant.name.genus": 1
    };
    // Current year
    instance.year = new ReactiveVar(parseInt(new Date().getFullYear()) - 1);
    // Selected seeds
    instance.seeds = seedsToOrder;
    // Warning flag
    instance.warning = new ReactiveVar(false);
    // Ordering flag
    instance.isOrdering = isOrdering;
    // Checking order status flag
    instance.isCheckingOrderStatus = new ReactiveVar(false);
    // Order number
    instance.orderNumber = orderNumber;
    // Order status
    instance.orderStatus = new ReactiveVar(false);
    // Autorun
    instance.autorun(() => {
        // Selector
        const selector = {
            years: {
                $elemMatch: {
                    year: instance.year.get(),
                    quantity: {
                        $gt: 0
                    }
                }
            }
        };

        // Subscribe to collections
        instance.subscribe('indexSeminum', selector, sort);
    });
    // Index seminum collection cursor
    instance.indexSeminum = () => {
        return indexSeminum.find({}, {sort: sort});
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.indexSeminum.onRendered(function() {
    // Initialize modal
    $('#indexSeminumModal').modal(orderModalOptions);
    // Initialize forms
    $('#orderInformationsForm').form({
        fields: {
            name: {
                identifier: 'name',
                rules: [{
                    type: 'empty',
                    prompt: Session.get('localization').indexSeminum.modal.formNameEmptyPrompt
                },
                {
                    type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻ0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9-.,:/ ]+$/]',
                    prompt: Session.get('localization').indexSeminum.modal.formNameRegexPrompt
                }]
            },
            subname: {
                identifier: 'subname',
                optional: true,
                rules: [{
                    type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻ0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9-.,:/ ]+$/]',
                    prompt: Session.get('localization').indexSeminum.modal.formSubnameRegexPrompt
                }]
            },
            street: {
                identifier: 'street',
                rules: [{
                    type: 'empty',
                    prompt: Session.get('localization').indexSeminum.modal.formStreetEmptyPrompt
                },
                {
                    type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9-.,/ ]+$/]',
                    prompt: Session.get('localization').indexSeminum.modal.formStreetRegexPrompt
                }]
            },
            number: {
                identifier: 'number',
                rules: [{
                    type: 'empty',
                    prompt: Session.get('localization').indexSeminum.modal.formStreetNumberEmptyPrompt
                }]
            },
            postalCode: {
                identifier: 'postalCode',
                rules: [{
                    type: 'empty',
                    prompt: Session.get('localization').indexSeminum.modal.formPostalCodeEmptyPrompt
                }]
            },
            city: {
                identifier: 'city',
                rules: [{
                    type: 'empty',
                    prompt: Session.get('localization').indexSeminum.modal.formCityEmptyPrompt
                },
                {
                    type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻ0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9-\' ]+$/]',
                    prompt: Session.get('localization').indexSeminum.modal.formCityRegexPrompt
                }]
            },
            country: {
                identifier: 'country',
                rules: [{
                    type: 'empty',
                    prompt: Session.get('localization').indexSeminum.modal.formCountryEmptyPrompt
                },
                {
                    type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻ0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9-\' ]+$/]',
                    prompt: Session.get('localization').indexSeminum.modal.formCountryRegexPrompt
                }]
            },
            website: {
                identifier: 'website',
                optional: true,
                rules: [{
                    type: 'url',
                    prompt: Session.get('localization').indexSeminum.modal.formWebsiteUrlPrompt
                }]
            },
            email: {
                identifier: 'email',
                optional: true,
                rules: [{
                    type: 'email',
                    prompt: Session.get('localization').indexSeminum.modal.formEmailPrompt
                }]
            }
        },
        inline: true
    });
    // Initialize messages closing event
    $('.message .close').on('click', function() {
        $(this).closest('.message').transition('fade');
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onDestroyed
Template.indexSeminum.onDestroyed(function() {
    // Instance variable (this)
    const instance = this;
    // Remove green color from every index seminum row
    $('tr.seminumRow').removeClass('positive');
    // Set isOrdering flag to false
    isOrdering.set(false);
    // Set orderNumber flag to false
    orderNumber.set(false);
    // Set orderStatus to false
    instance.orderStatus.set(false);
    // Set seedsToOrder to empty array
    seedsToOrder.set([]);
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.indexSeminum.helpers({
    // Localized text on page
    text: () => {
        return Session.get('localization');
    },
    // Warning flag helper
    warning: () => {
        return Template.instance().warning.get();
    },
    // Ordering flag helper
    isOrdering: () => {
        return Template.instance().isOrdering.get();
    },
    // Checking order status flag helper
    isCheckingOrderStatus: () => {
        return Template.instance().isCheckingOrderStatus.get();
    },
    // Is limit reached helper
    isLimitReached: recordId => {
        const selectedSeeds = Template.instance().seeds.get();
        const index = selectedSeeds.indexOf(recordId);
        if (selectedSeeds.length >= 25) {
            if (index === -1) {
                return 'disabled';
            }
        }
    },
    // Order number helper
    orderNumber: () => {
        return Template.instance().orderNumber.get();
    },
    // Order status helper
    orderStatus: () => {
        return Template.instance().orderStatus.get();
    },
    // Order exists helper
    orderExists: () => {
        return Template.instance().orderStatus.get() !== 'notExists' ? true : false;
    },
    // Order state helper
    state: (type, status) => {
        switch (type) {
            case 'processing':
                switch (status) {
                    case 'processing':
                        return 'active';
                    case 'preparing':
                        return 'completed';
                    case 'sent':
                        return 'completed';
                    default:
                        return false;
                }
                break;
            case 'preparing':
                switch (status) {
                    case 'processing':
                        return 'disabled';
                    case 'preparing':
                        return 'active';
                    case 'sent':
                        return 'completed';
                    default:
                        return false;
                }
                break;
            case 'sent':
                switch (status) {
                    case 'processing':
                        return 'disabled';
                    case 'preparing':
                        return 'disabled';
                    case 'sent':
                        return 'completed';
                    default:
                        return false;
                }
                break;
            default:
                return false;
        }
    },
    // Index Seminum records helper
    indexSeminum: () => {
        return Template.instance().indexSeminum();
    },
    // Format division name helper
    formatDivision: division => {
        switch (division) {
            case 'angiosperm':
                return 'Angiospermae';
            case 'gymnosperm':
                return 'Gymnospermae';
            default:
                return '';
        }
    },
    // Format clade name helper
    formatClade: clade => {
        switch (clade) {
            case 'monocotyledon':
                return 'Monocotyledoneae';
            case 'dicotyledon':
                return 'Dicotyledoneae';
            default:
                return '';
        }
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.indexSeminum.events({
    // Click order button to order seeds
    'click #orderButton': (e, t) => {
        // if isOrdering is false
        if (!t.isOrdering.get()) {
            // set isOrdering to true
            t.isOrdering.set(true);
        }
        // update current year
        t.year.set(parseInt(new Date().getFullYear()) - 1);
    },
    // Click accept button to accept selected seeds and show modal
    'click #acceptButton': (e, t) => {
        if (t.seeds.get().length > 0) {
            if (t.warning.get()) {
                t.warning.set(false);
            }
            // Show ordering form modal
            showModal(e);
        } else {
            // Show error message to select at least one seed to order
            t.warning.set(true);
        }
    },
    // Click cancel button to cancel ordering plants
    'click #cancelButton': (e, t) => {
        // if isOrdering is true
        if (t.isOrdering.get()) {
            // set isOrdering to false
            t.isOrdering.set(false);
            // remove warning message
            if (t.warning.get()) {
                t.warning.set(false);
            }
            // clear selected seeds
            t.seeds.set([]);

            // hide checkmarks (set order envoirment)
            $('tr.seminumRow').removeClass('positive');
        }
    },
    // Change checkbox state
    'change .checkbox': (e, t) => {
        // value of checkmark
        const checked = e.target.checked;
        // index seminum record id
        const seedId = e.target.parentElement.parentElement.parentElement.id;
        // selected seeds
        let selectedSeeds = t.seeds.get();
        // if is checked
        if (checked) {
            // add to selected seeds
            selectedSeeds.push(seedId);
            // update selected seeds
            t.seeds.set(selectedSeeds);
            // Mark row with green color
            $(e.target.parentElement.parentElement.parentElement).addClass('positive');
        } else {
            // if isn't checked
            // unselected seed index in selectedSeeds array
            const index = selectedSeeds.indexOf(seedId);
            // remove from selected seeds
            selectedSeeds.splice(index, 1);
            // update selected seeds
            t.seeds.set(selectedSeeds);
            // Remove mark green color
            $(e.target.parentElement.parentElement.parentElement).removeClass('positive');
        }
    },
    // Click checkOrderStatusButton to display checkOrderStatusForm
    'click #checkOrderStatusButton': (e, t) => {
        // Set isCheckingOrderStatus flag to true
        t.isCheckingOrderStatus.set(true);
        // Metor timeout to correctly initialize form validation
        Meteor.setTimeout(() => {
            // Change carret position to input field
            $('#orderNumber').focus();
            // Initialize form validation
            $('#checkOrderStatusForm').form({
                fields: {
                    orderNumber: {
                        identifier: 'orderNumber',
                        rules: [{
                            type: 'empty',
                            prompt: Session.get('localization').indexSeminum.checkOrderStatus.emptyPrompt
                        }, {
                            type: 'exactLength[17]',
                            prompt: Session.get('localization').indexSeminum.checkOrderStatus.lengthPrompt
                        }, {
                            type: 'regExp[/^[A-Za-z0-9][A-Za-z0-9]+$/]',
                            prompt: Session.get('localization').indexSeminum.checkOrderStatus.regexPrompt
                        }]
                    }
                },
                inline: true
            });
            // Change default form submit action
            $('#checkOrderStatusForm').submit(() => {
                // if form is valid
                if ($('#checkOrderStatusForm').form('is valid')) {
                    // Get order number from input field
                    const orderId = $('#checkOrderStatusForm').form('get value', 'orderNumber');
                    // Call to Meteor method checkOrderStatus
                    Meteor.call('checkOrderStatus', orderId, (error, result) => {
                        // If error is returned
                        if (error) {
                            // TODO: This shouldn't be called, but who knows
                            console.log(error);
                        } else {
                            // Set orderStatus to returned value
                            t.orderStatus.set(result);
                        }
                    });
                } else {
                    // If form isn't valid
                    // Set orderStatus to false
                    t.orderStatus.set(false);
                }

                return false;
            });
        });
    },
    // Click cancelCheckingOrderStatusButton to cancel checking order status
    'click #cancelCheckingOrderStatusButton': (e, t) => {
        // Set isCheckingOrderStatus flag to false
        t.isCheckingOrderStatus.set(false);
        // Set orderStatus to false
        t.orderStatus.set(false);
    },
    // Click checkOrderStatusButton2 to check order status
    'click #checkOrderStatusButton2': (e, t) => {
        // if form is valid
        if ($('#checkOrderStatusForm').form('is valid')) {
            // Get order number from input field
            const orderId = $('#checkOrderStatusForm').form('get value', 'orderNumber');
            // Call to Meteor method checkOrderStatus
            Meteor.call('checkOrderStatus', orderId, (error, result) => {
                // If error is returned
                if (error) {
                    // TODO: This shouldn't be called, but who knows
                    console.log(error);
                } else {
                    // Set orderStatus to returned value
                    t.orderStatus.set(result);
                }
            });
        } else {
            // If form isn't valid
            // Set orderStatus to false
            t.orderStatus.set(false);
        }
    }
});