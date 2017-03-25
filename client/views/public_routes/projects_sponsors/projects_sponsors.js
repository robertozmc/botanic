Template.projectsSponsors.onRendered(() => {
    $('.ui.accordion').accordion();
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.projectsSponsors.helpers({
    // Localized text on page
    text: () => {
        return Session.get('localization');
    }
});