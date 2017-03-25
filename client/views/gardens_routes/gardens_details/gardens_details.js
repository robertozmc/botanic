// -----------------------------------------------------------------------------
// - - - - - - - - - - - - G A R D E N S  D E T A I L S- - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.gardensDetails.onCreated(function() {
    // Template instance (this)
    const instance = this;
    // Garden ID
    instance.gardenId = FlowRouter.getParam('id');
    // Garden subscription
    instance.gardenSubscription = new ReactiveVar(false);
    // Autorun
    instance.autorun(() => {
        // Subscribe to gardens colection
        instance.gardenSubscription.set(instance.subscribe('gardenRecord', instance.gardenId));
    });
    // Garden record
    instance.garden = () => {
        return gardens.findOne();
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.gardensDetails.helpers({
    // Garden Edit URL helper
    gardensEditPath: gardenId => {
        return FlowRouter.url('gardensEdit', {id: Template.instance().gardenId});
    },
    // Garden record helper
    garden: () => {
        return Template.instance().garden();
    }
});