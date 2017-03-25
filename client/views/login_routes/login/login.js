Template.login.onRendered(() => {
    $('#home').popup();
    $('#login').focus();
    $('.ui.form').form({
        fields: {
            login: {
                identifier: 'login',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić login'
                }]
            },
            password: {
                identifier: 'password',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić hasło'
                },
                {
                    type: 'minLength[6]',
                    prompt: 'Hasło musi posiadać przynajmniej {ruleValue} znaków'
                }]
            }
        },
        inline: true
    });
});

Template.login.helpers({
    // helper for path url
    path: type => {
        switch (type) {
            case 'register':
                return FlowRouter.url('register');
            case 'forgot':
                return FlowRouter.url('forgot');
            default:
                return false;
        }
    }
});

Template.login.events({
    "click #home": (e, t) => {
        FlowRouter.go('main');
    },
    "click #submit": (e, t) => {
        if ($('.ui.form').form('is valid')) {
            $('#submit').removeClass('negative');
            e.preventDefault();
            const loginValue = $('.ui.form').form('get value', 'login');
            const passwordValue = $('.ui.form').form('get value', 'password');

            Meteor.loginWithPassword(loginValue, passwordValue, error => {
    			if (error) {
                    // TODO: Dodać message pojawiajacy sie podczas bledu logowania z meteora
                    $('#submit').addClass('negative');
                    $('#submit').transition('shake');
    				return false;
    			} else {
                    FlowRouter.go('home');
                    return true;
                }
    		});
        } else {
            $('#submit').addClass('negative');
            $('#submit').transition('shake');
        }
    }
});