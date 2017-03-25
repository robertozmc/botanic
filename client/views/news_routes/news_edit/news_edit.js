// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Dropzone Options
import {dropzoneOptions} from '../../../lib/modules/dropzone/dropzone_config.js';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Format date function
import {formatNewsTextToSave, formatNewsTextToShow} from '../../../lib/utils.js';

// -----------------------------------------------------------------------------
// - - - - - - - - - - N E W S  E D I T  F U N C T I O N S - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Edits news record
 * @param {Object} e - event object.
 * @param {Object} news - news object.
 */
const editNewsData = (e, news) => {
    // Prevent default submit action
    e.preventDefault();
    // Get form values
    const title = $('.ui.form').form('get value', 'title');
    let content = $('.ui.form').form('get value', 'content');

    // Format news text
    content = formatNewsTextToSave(content);

    // Changed news data
    const newsData = {
        title: title,
        content: content,
        author: news.author,
        createdAt: news.createdAt,
        editedAt: new Date()
    };
    // Call Meteor method editData
    Meteor.call('editData', 'news', news._id, newsData);
    // Display notification
    notify('positive', 'Brawo!', 'Pomyślnie edytowano newsa.');
    // Go to news page
    FlowRouter.go('news');
};

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - N E W S  V A R I A B L E S- - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Dropzone package
const Dropzone = require('dropzone');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Dropzone instance
let myDropzone;

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - N E W S  E D I T- - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.newsEdit.onCreated(function() {
    // Template instance (this)
    const instance = this;
    // News ID
    const newsId = FlowRouter.getParam('id');
    // News subscription
    instance.newsSubscription = new ReactiveVar(false);
    // Autorun
    instance.autorun(() => {
        // Subscribe to news colection
        instance.newsSubscription.set(instance.subscribe('newsRecord', newsId));
    });
    // News record
    instance.news = () => {
        return news.findOne();
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.newsEdit.onRendered(function() {
    // Template instance (this)
    const instance = this;
    // Autorun
    instance.autorun(() => {
        // If news subscribtion is ready
        if (instance.newsSubscription.get().ready()) {
            // News record
            const news = instance.news();
            // Meteor timeout to properly set all form values
            Meteor.setTimeout(() => {
                // Focus at title input field
                $('#title').focus();
                // Initialize form
                $('.ui.form').form({
                    fields: {
                        title: {
                            identifier: 'title',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić tytuł newsa'
                            }]
                        },
                        text: {
                            identifier: 'content',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić treść newsa'
                            }]
                        }
                    },
                    inline: true
                });
                // Initialize dropzone
                myDropzone = new Dropzone('#dropzone', dropzoneOptions);

                // Set form values
                $('#title').val(news.title);
                $('#content').val(formatNewsTextToShow(news.content));
            });
        }
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.newsEdit.events({
    // Click submit button to edit news record
    'click #submit': (e, t) => {
        if ($('.ui.form').form('is valid')) {
            editNewsData(e, t.news());
        }
    }
});