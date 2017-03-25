// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Semantic Modal Options
import {modalOptions} from '../../../lib/modules/modal/modal_config.js';

// -----------------------------------------------------------------------------
// - - - - - - - - O R D E R S  D E T A I L S  F U N C T I O N S - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Deletes order record
 */
const deleteRecord = () => {
    // Override orderDeleteModalOptions onApprove method
    orderDeleteModalOptions.onApprove = () => {
        // Call Meteor method removeData to remove given order record
        Meteor.call('removeData', 'orders', orderId.get());
        // Go to orders view
        FlowRouter.go('orders');
        // Display notification
        notify('positive', 'Brawo!', 'Pomyślnie anulowano zamówienie.');
    };
    // Override orderDeleteModalOptions onHidden method
    orderDeleteModalOptions.onHidden = () => {};
    // Show modal with updated options
    $('#modalCancel').modal(orderDeleteModalOptions).modal('show');
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Generate Order PDF
 */
const printOrder = () => {
    // Override orderPrintModalOptions transition value
    orderPrintModalOptions.transition = 'fade';
    // Override orderPrintModalOptions onShow method
    orderPrintModalOptions.onShow = () => {
        // Call Meteor method generateOrderPDF to generate order PDF
        Meteor.call('generateOrderPDF', orderId.get(), (error, result) => {
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
    // Override orderPrintModalOptions onHidden method
    orderPrintModalOptions.onHidden = () => {
        // Clear source of PDF display frame
        $('#pdfFrame').attr('src', null);
        // Override orderPrintModalOptions onShow method
        orderPrintModalOptions.onShow = () => {};
        // Override orderPrintModalOptions transition value
        orderPrintModalOptions.transition = 'scale';
    };
    // Show modal
    $('#modalPrint').modal(orderPrintModalOptions).modal('show');
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Set index seminum selector
 * @param {Object} data - selector data.
 * @return {Object} selector - The MongoDB selector.
 */
const setSelector = data => {
    const selector = {
        _id: {
            $in: data.orders
        }
    };

    return selector;
};

// -----------------------------------------------------------------------------
// - - - - - - - - O R D E R S  D E T A I L S  V A R I A B L E S - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Copied Semantic Modal Options into two variables for two modals purpose
let orderDeleteModalOptions = $.extend(true, {}, modalOptions);
let orderPrintModalOptions = $.extend(true, {}, modalOptions);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Clipboard package require
const Clipboard = require('clipboard');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Global orderId value
let orderId = new ReactiveVar();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.ordersDetails.onCreated(function() {
    // Template instance (this)
    const instance = this;
    // Order ID
    instance.orderId = FlowRouter.getParam('id');
    // Set global orderId value
    orderId.set(instance.orderId);

    // Copy email flag
    instance.copyEmail = new ReactiveVar(false);
    // Ordered seeds
    instance.orderedSeeds = new ReactiveVar([]);
    // Index Seminum Selector
    instance.selector = new ReactiveVar({
        orders: []
    });

    // Autorun
    instance.autorun(() => {
        const selector = instance.selector.get();
        // Order subscription
        instance.subscribe('ordersRecord', instance.orderId);
        // Index seminum subscription
        instance.subscribe('indexSeminum', setSelector(selector), {});
    });

    // Orders collection record
    instance.order = () => {
        return orders.findOne();
    };

    // Index Seminum collection record
    instance.indexSeminum = id => {
        return indexSeminum.findOne(id);
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.ordersDetails.onRendered(function() {
    // Template instance (this)
    const instance = this;

    // Initialize popup
    $('.copyEmail').popup();
    // Initialize modals
    $('#modalCancel').modal(orderDeleteModalOptions);
    $('#modalPrint').modal(orderPrintModalOptions);

    // Copy email with Clipboard package
    const copyEmail = new Clipboard('.copyEmail', {
        target: function(trigger) {
            return trigger.parentElement;
        }
    });
    // Copy email event handler
    copyEmail.on('success', function(e) {
        // Clear text selection
        e.clearSelection();
        // Set copyEmail flag to false
        instance.copyEmail.set(false);
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.ordersDetails.helpers({
    // Order record
    order: () => {
        return Template.instance().order();
    },
    // Order state helper
    state: (type, status) => {
        switch (type) {
            case 'preparing':
                switch (status) {
                    case 'processing':
                        return 'link';
                    case 'preparing':
                        return 'completed';
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
                        return 'link';
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
    // index Seminum helper for ordered seeds list
    indexSeminum: id => {
        let orderedSeeds = Template.instance().orderedSeeds.get();
        if (_.indexOf(orderedSeeds, id) === -1) {
            orderedSeeds.push(id);
            Template.instance().selector.set({orders: orderedSeeds});
        }

        return Template.instance().indexSeminum(id);
    },
    // Plant URL helper for ordered seeds list
    plantURL: plantId => {
        return FlowRouter.url('plantsDetails', {id: plantId});
    },
    isContact: contact => {
        return contact.phone !== null || contact.fax !== null || contact.website !== null || contact.email !== null;
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.ordersDetails.events({
    // Click cancelButton to cancel order and remove it
    "click #cancelButton": (e, t) => {
        deleteRecord();
    },
    // Click printButton to open modal with print overview
    "click #printButton": (e, t) => {
        printOrder();
    },
    // Click copyEmail to copy an email
    "click .copyEmail": (e, t) => {
        // Set copyEmail flag to true
        t.copyEmail.set(true);
        // Display notification
        notify('positive', 'Brawo!', 'Pomyślnie skopiowano adres e-mail.');
    },
    // Hover over copyEmail to display popup
    "mouseenter .copyEmail": (e, t) => {
        $(e.target).popup('show');
    },
    // Click preparingButton to update order status to 'preparing'
    "click #preparingButton": (e, t) => {
        // Call Meteor method changeOrderStatus to change order status
        Meteor.call('changeOrderStatus', t.orderId, 'preparing');
        // Display notification
        notify('positive', 'Brawo!', 'Pomyślnie zmieniono status zamówienia na "Przygotowywanie do wysyłki".');
    },
    // Click sentButton to update order status to 'sent'
    "click #sentButton": (e, t) => {
        // Call Meteor method changeOrderStatus to change order status
        Meteor.call('changeOrderStatus', t.orderId, 'sent');
        // Display notification
        notify('positive', 'Brawo!', 'Pomyślnie zmieniono status zamówienia na "Wysłano".');
    },
    // Double click orderPlant to go to plant details view
    "dblclick .orderSeed": (e, t) => {
        // Plant ID
        const plantId = e.currentTarget.id;
        // If plantID
        if (plantId) {
            // Go to plantsDetails view
            FlowRouter.go('plantsDetails', {id: plantId});
        }
    }
});