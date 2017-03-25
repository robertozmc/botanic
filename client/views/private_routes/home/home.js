// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - - - H O M E - - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.home.onCreated(function() {
    // Template instance (this)
    const instance = this;
    // Get logged user roles


});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.home.helpers({
    // User roles helper
    isRole: role => {
        // Get user
        const user = Meteor.user();
        // Get user roles
        const roles = user.roles;
        return _.indexOf(roles, role) !== -1;
    }
});