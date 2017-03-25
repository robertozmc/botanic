// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - C L I E N T - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/**
* API Settings for Semantic UI
*/
$.fn.api.settings.api = {
    'get order': '/api/collections/order/{query}',
    'get family': '/api/collections/family/{query}',
    'get gardens': '/api/collections/gardens/{query}',
    'get plants': '/api/collections/plants/{query}'
};

/**
* Meteor Startup
*/
Meteor.startup(() => {
    moment.locale('pl');
    Session.set('localization', localizationPL);
});