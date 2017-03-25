// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Get Number Of Pages Function and String To Boolean Function
import {getNumberOfPages} from '../../../lib/utils.js';

// -----------------------------------------------------------------------------
// - - - - - - - I N D E X  P L A N T A R U M  V A R I A B L E S - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Exported variables with current page and total pages for pagination module
export const arboretumCurrentPage = new ReactiveVar();
export const arboretumNumberOfPages = new ReactiveVar();
export const medicinalPlantsSectorCurrentPage = new ReactiveVar();
export const medicinalPlantsSectorNumberOfPages = new ReactiveVar();
export const decorativeDepartmentCurrentPage = new ReactiveVar();
export const decorativeDepartmentNumberOfPages = new ReactiveVar();
export const systematicsCurrentPage = new ReactiveVar();
export const systematicsNumberOfPages = new ReactiveVar();
export const pharmacognosyCurrentPage = new ReactiveVar();
export const pharmacognosyNumberOfPages = new ReactiveVar();
export const greenhouseCurrentPage = new ReactiveVar();
export const greenhouseNumberOfPages = new ReactiveVar();
export const moorCurrentPage = new ReactiveVar();
export const moorNumberOfPages = new ReactiveVar();
export const duneCurrentPage = new ReactiveVar();
export const duneNumberOfPages = new ReactiveVar();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.indexPlantarum.onCreated(function() {
    // Template instance (this)
    const instance = this;
    // Set current pages to first
    arboretumCurrentPage.set(1);
    medicinalPlantsSectorCurrentPage.set(1);
    decorativeDepartmentCurrentPage.set(1);
    systematicsCurrentPage.set(1);
    pharmacognosyCurrentPage.set(1);
    greenhouseCurrentPage.set(1);
    moorCurrentPage.set(1);
    duneCurrentPage.set(1);

    // Limit displaying records to 10
    instance.limit = 10;

    // Set selectors
    instance.arboretumSelector = {
        $and: [{
            'gardenInformations.place': {
                $eq: 'arboretum'
            }
        }, {
            'gardenInformations.quantity': {
                $gt: 0
            }
        }]
    };
    instance.medicinalPlantsSectorSelector = {
        $and: [{
            'gardenInformations.place': {
                $eq: 'medicinalPlantsSector'
            }
        }, {
            'gardenInformations.quantity': {
                $gt: 0
            }
        }]
    };
    instance.decorativeDepartmentSelector = {
        $and: [{
            'gardenInformations.place': {
                $eq: 'decorativeDepartment'
            }
        }, {
            'gardenInformations.quantity': {
                $gt: 0
            }
        }]
    };
    instance.systematicsSelector = {
        $and: [{
            'gardenInformations.place': {
                $eq: 'systematics'
            }
        }, {
            'gardenInformations.quantity': {
                $gt: 0
            }
        }]
    };
    instance.pharmacognosySelector = {
        $and: [{
            'gardenInformations.place': {
                $eq: 'pharmacognosy'
            }
        }, {
            'gardenInformations.quantity': {
                $gt: 0
            }
        }]
    };
    instance.greenhouseSelector = {
        $and: [{
            'gardenInformations.place': {
                $eq: 'greenhouse'
            }
        }, {
            'gardenInformations.quantity': {
                $gt: 0
            }
        }]
    };
    instance.moorSelector = {
        $and: [{
            'gardenInformations.place': {
                $eq: 'moor'
            }
        }, {
            'gardenInformations.quantity': {
                $gt: 0
            }
        }]
    };
    instance.duneSelector = {
        $and: [{
            'gardenInformations.place': {
                $eq: 'dune'
            }
        }, {
            'gardenInformations.quantity': {
                $gt: 0
            }
        }]
    };

    // Sort records
    instance.sort = {
        'generalInformations.name.genus': 1
    };

    // Set loaded number of records to 10
    instance.loaded = 10;

    instance.autorun(() => {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // A R B O R E T U M

        // Get current reactive values
        let page = arboretumCurrentPage.get();
        const limit = instance.limit;
        let selector = instance.arboretumSelector;
        const sort = instance.sort;

        // Subscribe to plants collection
        const arboretumSubscription = instance.subscribe('plants', page, limit, selector, sort);
        const arboretumCountSubscription = instance.subscribe('arboretumCount', selector);

        // When subscribtion is ready set number of loaded records to current limit
        if (arboretumSubscription.ready()) {
            instance.loaded = limit;
        }
        // When subscribtion is ready set total number of pages according to current limit
        if (arboretumCountSubscription.ready()) {
            arboretumNumberOfPages.set(getNumberOfPages('arboretum', limit));
        }

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // M E D I C I N A L  P L A N T S  S E C T O R

        // Get current reactive values
        page = medicinalPlantsSectorCurrentPage.get();
        selector = instance.medicinalPlantsSectorSelector;

        // Subscribe to plants collection
        const medicinalPlantsSectorSubscription = instance.subscribe('plants', page, limit, selector, sort);
        const medicinalPlantsSectorCountSubscription = instance.subscribe('medicinalPlantsSectorCount', selector);

        // When subscribtion is ready set number of loaded records to current limit
        if (medicinalPlantsSectorSubscription.ready()) {
            instance.loaded = limit;
        }
        // When subscribtion is ready set total number of pages according to current limit
        if (medicinalPlantsSectorCountSubscription.ready()) {
            medicinalPlantsSectorNumberOfPages.set(getNumberOfPages('medicinalPlantsSector', limit));
        }

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // D E C O R A T I V E  D E P A R T M E N T

        // Get current reactive values
        page = decorativeDepartmentCurrentPage.get();
        selector = instance.decorativeDepartmentSelector;

        // Subscribe to plants collection
        const decorativeDepartmentSubscription = instance.subscribe('plants', page, limit, selector, sort);
        const decorativeDepartmentCountSubscription = instance.subscribe('decorativeDepartmentCount', selector);

        // When subscribtion is ready set number of loaded records to current limit
        if (decorativeDepartmentSubscription.ready()) {
            instance.loaded = limit;
        }
        // When subscribtion is ready set total number of pages according to current limit
        if (decorativeDepartmentCountSubscription.ready()) {
            decorativeDepartmentNumberOfPages.set(getNumberOfPages('decorativeDepartment', limit));
        }

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // S Y S T E M A T I C S

        // Get current reactive values
        page = systematicsCurrentPage.get();
        selector = instance.systematicsSelector;

        // Subscribe to plants collection
        const systematicsSubscription = instance.subscribe('plants', page, limit, selector, sort);
        const systematicsCountSubscription = instance.subscribe('systematicsCount', selector);

        // When subscribtion is ready set number of loaded records to current limit
        if (systematicsSubscription.ready()) {
            instance.loaded = limit;
        }
        // When subscribtion is ready set total number of pages according to current limit
        if (systematicsCountSubscription.ready()) {
            systematicsNumberOfPages.set(getNumberOfPages('systematics', limit));
        }

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // P H A R M A C O N O S Y

        // Get current reactive values
        page = pharmacognosyCurrentPage.get();
        selector = instance.pharmacognosySelector;

        // Subscribe to plants collection
        const pharmacognosySubscription = instance.subscribe('plants', page, limit, selector, sort);
        const pharmacognosyCountSubscription = instance.subscribe('pharmacognosyCount', selector);

        // When subscribtion is ready set number of loaded records to current limit
        if (pharmacognosySubscription.ready()) {
            instance.loaded = limit;
        }
        // When subscribtion is ready set total number of pages according to current limit
        if (pharmacognosyCountSubscription.ready()) {
            pharmacognosyNumberOfPages.set(getNumberOfPages('pharmacognosy', limit));
        }

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // G R E E N H O U S E

        // Get current reactive values
        page = greenhouseCurrentPage.get();
        selector = instance.greenhouseSelector;

        // Subscribe to plants collection
        const greenhouseSubscription = instance.subscribe('plants', page, limit, selector, sort);
        const greenhouseCountSubscription = instance.subscribe('greenhouseCount', selector);

        // When subscribtion is ready set number of loaded records to current limit
        if (greenhouseSubscription.ready()) {
            instance.loaded = limit;
        }
        // When subscribtion is ready set total number of pages according to current limit
        if (greenhouseCountSubscription.ready()) {
            greenhouseNumberOfPages.set(getNumberOfPages('greenhouse', limit));
        }

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // M O O R

        // Get current reactive values
        page = moorCurrentPage.get();
        selector = instance.moorSelector;

        // Subscribe to plants collection
        const moorSubscription = instance.subscribe('plants', page, limit, selector, sort);
        const moorCountSubscription = instance.subscribe('moorCount', selector);

        // When subscribtion is ready set number of loaded records to current limit
        if (moorSubscription.ready()) {
            instance.loaded = limit;
        }
        // When subscribtion is ready set total number of pages according to current limit
        if (moorCountSubscription.ready()) {
            moorNumberOfPages.set(getNumberOfPages('moor', limit));
        }

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // D U N E

        // Get current reactive values
        page = duneCurrentPage.get();
        selector = instance.duneSelector;

        // Subscribe to plants collection
        const duneSubscription = instance.subscribe('plants', page, limit, selector, sort);
        const duneCountSubscription = instance.subscribe('duneCount', selector);

        // When subscribtion is ready set number of loaded records to current limit
        if (duneSubscription.ready()) {
            instance.loaded = limit;
        }
        // When subscribtion is ready set total number of pages according to current limit
        if (duneCountSubscription.ready()) {
            duneNumberOfPages.set(getNumberOfPages('dune', limit));
        }
    });

    // Plants collection cursor (arboretum)
    instance.arboretum = () => {
        return plants.find(instance.arboretumSelector, {limit: instance.loaded, sort: instance.sort});
    };

    // Plants collection cursor (medicinalPlantsSector)
    instance.medicinalPlantsSector = () => {
        return plants.find(instance.medicinalPlantsSectorSelector, {limit: instance.loaded, sort: instance.sort});
    };

    // Plants collection cursor (decorativeDepartment)
    instance.decorativeDepartment = () => {
        return plants.find(instance.decorativeDepartmentSelector, {limit: instance.loaded, sort: instance.sort});
    };

    // Plants collection cursor (systematics)
    instance.systematics = () => {
        return plants.find(instance.systematicsSelector, {limit: instance.loaded, sort: instance.sort});
    };

    // Plants collection cursor (pharmacognosy)
    instance.pharmacognosy = () => {
        return plants.find(instance.pharmacognosySelector, {limit: instance.loaded, sort: instance.sort});
    };

    // Plants collection cursor (greenhouse)
    instance.greenhouse = () => {
        return plants.find(instance.greenhouseSelector, {limit: instance.loaded, sort: instance.sort});
    };

    // Plants collection cursor (moor)
    instance.moor = () => {
        return plants.find(instance.moorSelector, {limit: instance.loaded, sort: instance.sort});
    };

    // Plants collection cursor (dune)
    instance.dune = () => {
        return plants.find(instance.duneSelector, {limit: instance.loaded, sort: instance.sort});
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.indexPlantarum.onRendered(function() {

    // Initialize messages closing event
    $('.message .close').on('click', function() {
        $(this).closest('.message').transition('fade');
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.indexPlantarum.helpers({
    // Localized text on page
    text: () => {
        return Session.get('localization');
    },
    arboretumPlants: () => {
        return Template.instance().arboretum();
    },
    medicinalPlantsSectorPlants: () => {
        return Template.instance().medicinalPlantsSector();
    },
    decorativeDepartmentPlants: () => {
        return Template.instance().decorativeDepartment();
    },
    systematicsPlants: () => {
        return Template.instance().systematics();
    },
    pharmacognosyPlants: () => {
        return Template.instance().pharmacognosy();
    },
    greenhousePlants: () => {
        return Template.instance().greenhouse();
    },
    moorPlants: () => {
        return Template.instance().moor();
    },
    dunePlants: () => {
        return Template.instance().dune();
    }
});