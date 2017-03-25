// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Semantic Modal Options
import {modalOptions} from '../../../lib/modules/modal/modal_config.js';

// -----------------------------------------------------------------------------
// - - - - - - - - P L A N T S  D E T A I L S  F U N C T I O N S - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Generate Plant Label PDF
 */
const printLabel = plantId => {
    // Override labelPrintModalOptions transition value
    labelPrintModalOptions.transition = 'fade';
    // Override labelPrintModalOptions onShow method
    labelPrintModalOptions.onShow = () => {
        // Call Meteor method generateOrderPDF to generate order PDF
        Meteor.call('generatePlantLabelPDF', plantId, (error, result) => {
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
    // Override labelPrintModalOptions onHidden method
    labelPrintModalOptions.onHidden = () => {
        // Clear source of PDF display frame
        $('#pdfFrame').attr('src', null);
        // Override labelPrintModalOptions onShow method
        labelPrintModalOptions.onShow = () => {};
        // Override labelPrintModalOptions transition value
        labelPrintModalOptions.transition = 'scale';
    };
    // Show modal
    $('#modalLabelPrint').modal(labelPrintModalOptions).modal('show');
};

// -----------------------------------------------------------------------------
// - - - - - - - - P L A N T S  D E T A I L S  V A R I A B L E S - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Copied Semantic Modal Options into one variable for modal purpose
let labelPrintModalOptions = $.extend(true, {}, modalOptions);

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - P L A N T S  D E T A I L S- - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.plantsDetails.onCreated(function() {
    // Template instance (this)
    const instance = this;
    // Plant ID
    instance.plantId = FlowRouter.getParam('id');
    // Plant subscription
    instance.plantSubscription = new ReactiveVar(false);
    // Autorun
    instance.autorun(() => {
        // Subscribe to plants colection
        instance.plantSubscription.set(instance.subscribe('plantRecord', instance.plantId));
    });
    // Plant record
    instance.plant = () => {
        return plants.findOne();
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.plantsDetails.onRendered(function() {
    // Initialize modal
    $('#modalLabelPrint').modal(labelPrintModalOptions);
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.plantsDetails.helpers({
    // Plant Edit URL helper
    plantsEditPath: plantId => {
        return FlowRouter.url('plantsEdit', {id: Template.instance().plantId});
    },
    // Plant record helper
    plant: () => {
        return Template.instance().plant();
    },
    // Garden URL helper
    gardenURL: gardenId => {
        return FlowRouter.url('gardensDetails', {id: gardenId});
    },
    // Format division helper
    formatDivision: division => {
        switch (division) {
            case 'angiosperm':
                return 'Okrytonasienne';
            case 'gymnosperm':
                return 'Nagonasienne';
            default:
                return 'Nie określono';
        }
    },
    // Format clade helper
    formatClade: clade => {
        switch (clade) {
            case 'monocotyledon':
                return 'Jednoliścienne';
            case 'dicotyledon':
                return 'Dwuliścienne';
            default:
                return 'Nie określono';
        }
    },
    // Format continent helper
    formatContinent: continent => {
        switch (continent) {
            case 'africa':
                return 'Afryka';
            case 'northAfrica':
                return 'Afryka - Północ';
            case 'southAfrica':
                return 'Afryka - Południe';
            case 'eastAfrica':
                return 'Afryka - Wschód';
            case 'westAfrica':
                return 'Afryka - Zachód';
            case 'centralAfrica':
                return 'Afryka - Centralna';
            case 'asia':
                return 'Azja';
            case 'northAsia':
                return 'Azja - Północ';
            case 'southAsia':
                return 'Azja - Południe';
            case 'eastAsia':
                return 'Azja - Wschód';
            case 'westAsia':
                return 'Azja - Zachód';
            case 'centralAsia':
                return 'Azja - Centralna';
            case 'australia':
                return 'Australia';
            case 'northAustralia':
                return 'Australia - Północ';
            case 'southAustralia':
                return 'Australia - Południe';
            case 'eastAustralia':
                return 'Australia - Wschód';
            case 'westAustralia':
                return 'Australia - Zachód';
            case 'centralAustralia':
                return 'Australia - Centralna';
            case 'northAmerica':
                return 'Ameryka Północna';
            case 'northNorthAmerica':
                return 'Ameryka Północna - Północ';
            case 'southNorthAmerica':
                return 'Ameryka Północna - Południe';
            case 'eastNorthAmerica':
                return 'Ameryka Północna - Wschód';
            case 'westNorthAmerica':
                return 'Ameryka Północna - Zachód';
            case 'centralNorthAmerica':
                return 'Ameryka Północna - Centralna';
            case 'southAmerica':
                return 'Ameryka Południowa';
            case 'northSouthAmerica':
                return 'Ameryka Południowa - Północ';
            case 'southSouthAmerica':
                return 'Ameryka Południowa - Południe';
            case 'eastSouthAmerica':
                return 'Ameryka Południowa - Wschód';
            case 'westSouthAmerica':
                return 'Ameryka Południowa - Zachód';
            case 'centralSouthAmerica':
                return 'Ameryka Południowa - Centralna';
            case 'europe':
                return 'Europa';
            case 'northEurope':
                return 'Europa - Północ';
            case 'southEurope':
                return 'Europa - Południe';
            case 'eastEurope':
                return 'Europa - Wschód';
            case 'westEurope':
                return 'Europa - Zachód';
            case 'centralEurope':
                return 'Europa - Centralna';
            case 'atlanticOcean':
                return 'Ocean Atlantycki';
            case 'indianOcean':
                return 'Ocean Indyjski';
            case 'pacificOcean':
                return 'Ocean Spokojny';
            default:
                return 'Nie określono';
        }
    },
    // Format type of protection helper
    formatTypeOfProtection: typeOfProtection => {
        switch (typeOfProtection) {
            case 'fullProtection':
                return 'Ochrona ścisła';
            case 'partialProtection':
                return 'Ochrona częściowa';
            case 'noProtection':
                return 'Brak ochrony';
            default:
                return 'Nie określono';
        }
    },
    // Format import type helper
    formatimportType: importType => {
        switch (importType) {
            case 'seeds':
                return 'Nasiona';
            case 'seedling':
                return 'Sadzonka';
            default:
                return 'Nie określono';
        }
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.plantsDetails.events({
    // Click printLabel button to generate plant label PDF
    'click #printLabelButton': (e, t) => {
        printLabel(t.plantId);
    }
});