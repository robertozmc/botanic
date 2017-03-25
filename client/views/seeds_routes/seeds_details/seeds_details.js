// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - S E E D S  D E T A I L S- - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.seedsDetails.onCreated(function() {
    // Template instance (this)
    const instance = this;
    // Seed ID
    instance.seedId = FlowRouter.getParam('id');
    // Seed subscription
    instance.seedSubscription = new ReactiveVar(false);
    // Autorun
    instance.autorun(() => {
        // Subscribe to seeds colection
        instance.seedSubscription.set(instance.subscribe('seedRecord', instance.seedId));
    });
    // Seed record
    instance.seed = () => {
        return seeds.findOne();
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.seedsDetails.helpers({
    // Seed Edit URL helper
    seedsEditPath: seedId => {
        return FlowRouter.url('seedsEdit', {id: Template.instance().seedId});
    },
    // Seed record helper
    seed: () => {
        return Template.instance().seed();
    },
    plantURL: plantId => {
        return FlowRouter.url('plantsDetails', {id: plantId});
    }
});