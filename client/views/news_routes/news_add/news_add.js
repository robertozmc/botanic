// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Semantic Modal Options
import {modalOptions} from '../../../lib/modules/modal/modal_config.js';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Dropzone Options
import {dropzoneOptions} from '../../../lib/modules/dropzone/dropzone_config.js';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// formatNewsTextToSave function
import {formatNewsTextToSave} from '../../../lib/utils.js';

// -----------------------------------------------------------------------------
// - - - - - - - - - - - N E W S  A D D  F U N C T I O N S - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Adds news record
 */
const addNewsData = () => {
    const authorId = Meteor.userId();
    const authorRecord = Meteor.users.findOne(authorId);

    const title = $('.ui.form').form('get value', 'title');
    let content = $('.ui.form').form('get value', 'content');

    content = formatNewsTextToSave(content);

    const newsData = {
        title: title,
        content: content,
        author: {
            id: authorId,
            name: authorRecord.name
        },
        createdAt: new Date(),
        editedAt: null
    };

    // Call Meteor method addNewData to add news data to database
    Meteor.call('addNewData', 'news', newsData);
    // Display notification
    notify('positive', 'Brawo!', 'Pomyślnie dodano news do bazy.');
    // Go to news page
    FlowRouter.go('news');
};
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Shows news overview
 */
const showOverview = e => {
    e.preventDefault();

    const title = $('.ui.form').form('get value', 'title');
    let content = $('.ui.form').form('get value', 'content');

    pageSession.set('title', title);
    pageSession.set('createdAt', new Date());

    content = formatNewsTextToSave(content);

    document.getElementById('newsAddModalContent').innerHTML = content;

    $('#newsAddModal').modal('show');
};

// -----------------------------------------------------------------------------
// - - - - - - - - - - - S E E D S  V A R I A B L E S- - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Dropzone package
const Dropzone = require('dropzone');
// reactive page session
const pageSession = new ReactiveDict();

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - N E W S  A D D- - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.newsAdd.onRendered(function() {
    // Template instance (this)
    const instance = this;
    // Override modalOptions onHidden method
    modalOptions.onHidden = () => {
    };
    // Initialize modals
    $('#newsAddModal').modal(modalOptions);
    $('#newsAddHelpModal').modal(modalOptions);
    // Initialize form
    $('.ui.form').form({
        on: blur,
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
    instance.dropzone = new Dropzone('#dropzone', dropzoneOptions);
    // Get not saved news data
    if (Session.get('newsAddSavedTitle') !== '') {
        $('#title').val(Session.get('newsAddSavedTitle'));
    }
    if (Session.get('newsAddSavedText') !== '') {
        $('#content').text(Session.get('newsAddSavedText'));
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.newsAdd.events({
    // Keyup on title input field to save its content to Session variable
    "keyup #title": (e, t) => {
        Session.set('newsAddSavedTitle', e.target.value);
    },
    // Keyup on content input field to save its content to Session variable
    "keyup #content": (e, t) => {
        Session.set('newsAddSavedText', e.target.value);
    },
    // Click submit button to add news record
    "click #submit": (e, t) => {
        if ($('.ui.form').form('is valid')) {
            addNewsData();
        }
    }
});

// -----------------------------------------------------------------------------
// - - - - - - - - - - T E X T  E D I T O R  T O O L B A R - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.textEditorToolbar.onRendered(() => {
    // Initialize dropdown
    $('#header').dropdown();
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.textEditorToolbar.events({
    // Click bold button to insert bold markup
    "click #bold": (e, t) => {
        e.preventDefault();
        $('#content').insertAtCaret('<b></b>');
    },
    // Click italic button to insert italic markup
    "click #italic": (e, t) => {
        e.preventDefault();
        $('#content').insertAtCaret('<i></i>');
    },
    // Click underline button to insert underline markup
    "click #underline": (e, t) => {
        e.preventDefault();
        $('#content').insertAtCaret('<u></u>');
    },
    // Click strikethrough button to insert strikethrough markup
    "click #strikethrough": (e, t) => {
        e.preventDefault();
        $('#content').insertAtCaret('<del></del>');
    },
    // Click header button to insert header markup
    "click #header": (e, t) => {
        e.preventDefault();
        $('#header').dropdown('show');
    },
    // Click h1 button to insert h1 markup
    "click #h1": (e, t) => {
        e.preventDefault();
        e.stopPropagation();
        $('#content').insertAtCaret('<h1></h1>');
        $('#header').dropdown('hide');
    },
    // Click h2 button to insert h2 markup
    "click #h2": (e, t) => {
        e.preventDefault();
        e.stopPropagation();
        $('#content').insertAtCaret('<h2></h2>');
        $('#header').dropdown('hide');
    },
    // Click h3 button to insert h3 markup
    "click #h3": (e, t) => {
        e.preventDefault();
        e.stopPropagation();
        $('#content').insertAtCaret('<h3></h3>');
        $('#header').dropdown('hide');
    },
    // Click h4 button to insert h4 markup
    "click #h4": (e, t) => {
        e.preventDefault();
        e.stopPropagation();
        $('#content').insertAtCaret('<h4></h4>');
        $('#header').dropdown('hide');
    },
    // Click h5 button to insert h5 markup
    "click #h5": (e, t) => {
        e.preventDefault();
        e.stopPropagation();
        $('#content').insertAtCaret('<h5></h5>');
        $('#header').dropdown('hide');
    },
    // Click h6 button to insert h6 markup
    "click #h6": (e, t) => {
        e.preventDefault();
        e.stopPropagation();
        $('#content').insertAtCaret('<h6></h6>');
        $('#header').dropdown('hide');
    },
    // Click quote button to insert quote markup
    "click #quote": (e, t) => {
        e.preventDefault();
        $('#content').insertAtCaret('<blockquote></blockquote>');
    },
    // Click linkify button to insert link markup
    "click #linkify": (e, t) => {
        e.preventDefault();
        $('#content').insertAtCaret('<a href=""></a>');
    },
    // Click orderedList button to insert orderedList markup
    "click #orderedList": (e, t) => {
        e.preventDefault();
        $('#content').insertAtCaret('<ol>\n    <li></li>\n</ol>');
    },
    // Click unorderedList button to insert unorderedList markup
    "click #unorderedList": (e, t) => {
        e.preventDefault();
        $('#content').insertAtCaret('<ul>\n    <li></li>\n</ul>');
    },
    // Click alignLeft button to insert alignLeft markup
    "click #alignLeft": (e, t) => {
        e.preventDefault();
        $('#content').insertAtCaret('<p style="text-align:left"></p>');
    },
    // Click alignCenter button to insert alignCenter markup
    "click #alignCenter": (e, t) => {
        e.preventDefault();
        $('#content').insertAtCaret('<p style="text-align:center"></p>');
    },
    // Click alignRight button to insert alignRight markup
    "click #alignRight": (e, t) => {
        e.preventDefault();
        $('#content').insertAtCaret('<p style="text-align:right"></p>');
    },
    // Click alignJustify button to insert alignJustify markup
    "click #alignJustify": (e, t) => {
        e.preventDefault();
        $('#content').insertAtCaret('<p style="text-align:justify"></p>');
    },
    // Click overview button to display news overview
    "click #overview": (e, t) => {
        showOverview(e);
    },
    // Click help button to show help modal
    "click #help": (e, t) => {
        e.preventDefault();
        $('#newsAddHelpModal').modal('show');
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.newsAddModal.helpers({
    // Title helper
    title: () => {
        return pageSession.get('title');
    },
    // CreatedAt helper
    createdAt: () => {
        return pageSession.get('createdAt');
    }
});