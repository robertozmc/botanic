Template.register.onRendered(() => {
    $('#home').popup();
    $('#login').focus();
    $('.ui.form').form({
        fields: {
            login: {
                identifier: 'login',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić login'
                },
                {
                    type: 'doesntContain[admin]',
                    prompt: 'Login {value} jest niedozwolony'
                }]
            },
            name: {
                identifier: 'name',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić imię i nazwisko'
                }]
            },
            email: {
                identifier: 'email',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić adres e-mail'
                },
                {
                    type: 'email',
                    prompt: 'Proszę wprowadzić poprawny adres e-mail'
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
            },
            passwordConfirm: {
                identifier: 'passwordConfirm',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić potwierdzenie hasła'
                },
                {
                    type: 'match[password]',
                    prompt: 'Proszę wprowadzić takie samo hasło'
                }]
            }
        },
        inline: true
    });
});

Template.register.helpers({
    // helper for path url
    path: () => {
        return FlowRouter.url('login');
    }
});

Template.register.events({
    "click #home": (e, t) => {
        FlowRouter.go('main');
    },
    "click #submit": (e, t) => {
        if ($('.ui.form').form('is valid')) {
            $('#submit').removeClass('negative');
            e.preventDefault();
            const loginValue = $('.ui.form').form('get value', 'login');
            const nameValue = $('.ui.form').form('get value', 'name');
            const emailValue = $('.ui.form').form('get value', 'email');
            const passwordValue = $('.ui.form').form('get value', 'password');

            Accounts.createUser({
                username: loginValue,
    			email: emailValue,
    			password: passwordValue,
                name: nameValue
    		}, error => {
    			if (error) {
                    // TODO: Dodać message pojawiajacy sie podczas bledu przy rejestracji z meteora
                    switch (error.reason) {
                        case 'Login forbidden':
                            FlowRouter.go('login');
                            Meteor.call('log', 'info', 'New account created', loginValue);
                            break;
                    }
    				return false;
    			} else {
                    FlowRouter.go('login');
    				return true;
    			}
            });
        } else {
            $('#submit').addClass('negative');
            $('#submit').transition('shake');
        }
    }
});