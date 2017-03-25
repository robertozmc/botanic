// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - N E W S  D E T A I L S- - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.newsDetails.onCreated(function() {
    // Template instance (this)
    const instance = this;
    // News ID
    instance.newsId = FlowRouter.getParam('id');
    // News subscription
    instance.newsSubscription = new ReactiveVar(false);
    // Autorun
    instance.autorun(() => {
        // Subscribe to news colection
        instance.newsSubscription.set(instance.subscribe('newsRecord', instance.newsId));
    });
    // News record
    instance.news = () => {
        return news.findOne();
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.newsDetails.helpers({
    // News Edit URL helper
    newsEditPath: newsId => {
        return FlowRouter.url('newsEdit', {id: Template.instance().newsId});
    },
    // News record helper
    news: () => {
        return Template.instance().news();
    },
});