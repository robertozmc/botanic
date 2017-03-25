// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.visit.helpers({
    // Localization text helper
    text: () => {
        return Session.get('localization');
    }
});