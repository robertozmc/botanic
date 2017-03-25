// -----------------------------------------------------------------------------
// - - - - - - - - - - - M A I N  N E W S  D E T A I L S - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.mainNews.onCreated(function() {
    // Template instance (this)
    const instance = this;
    // News subscription
    instance.newsSubscription = new ReactiveVar(false);
    // Limit
    instance.limit = new ReactiveVar(2);
    // Sort
    const sort = {
        createdAt: -1
    };
    // Autorun
    instance.autorun(() => {
        // Subscribe to news colection
        instance.newsSubscription.set(instance.subscribe('newsMain', instance.limit.get()));
    });
    // News record
    instance.news = () => {
        return news.find({}, {sort: sort, limit: instance.limit.get()});
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.mainNews.helpers({
    text: () => {
        return Session.get('localization');
    },
    news: () => {
        return Template.instance().news();
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.mainNews.events({
    // Click loadMore button to load 2 more news
    'click #loadMoreButton': (e, t) => {
        const limit = t.limit.get();
        t.limit.set(limit + 2);
        $('#loadMoreButton').goTo();
    }
});