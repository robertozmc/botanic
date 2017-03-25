// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - A C T I V I T Y - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.activity.onRendered(() => {
    $('.ui.accordion').accordion();
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.activity.helpers({
    // Localization text helper
    text: () => {
        return Session.get('localization');
    }
});