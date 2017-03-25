Template.account.onRendered(() => {
    $('#form-name').form({
        fields: {
            name: {
                identifier: 'name',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić imię i nazwisko'
                }]
            }
        },
        inline: true
    });
    $('#form-email').form({
        fields: {
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
            }
        },
        inline: true
    });
    $('#form-password').form({
        on: 'blur',
        fields: {
            passwordOld: {
                identifier: 'passwordOld',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić stare hasło'
                },
                {
                    type: 'minLength[6]',
                    prompt: 'Hasło musi posiadać przynajmniej {ruleValue} znaków'
                }]
            },
            passwordNew: {
                identifier: 'passwordNew',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić nowe hasło'
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
                    type: 'match[passwordNew]',
                    prompt: 'Proszę wprowadzić takie samo hasło'
                }]
            }
        },
        inline: true
    });
});

Template.account.helpers({
    user: () => {
        return Meteor.user();
    }
});

Template.account.events({
    "click #buttonName": (e, t) => {
        if ($('#form-name').form('is valid')) {
            $('#buttonName').removeClass('negative');
            e.preventDefault();
            const value = $('#form-name').form('get value', 'name');

            if (value !== Meteor.user().name) {
                Meteor.call('changeUserData', 'name', value);
                notify('positive', 'Brawo!', 'Pomyślnie zmieniono imię i nazwisko użytkownika.');
            } else {
                notify('negative', 'Błąd!', 'Wprowadzone dane są identyczne z tymi w bazie.');
            }
        } else {
            $('#buttonName').addClass('negative');
            $('#buttonName').transition('shake');
        }
    },
    "click #buttonEmail": (e, t) => {
        if ($('#form-email').form('is valid')) {
            $('#buttonEmail').removeClass('negative');
            e.preventDefault();
            const value = $('#form-email').form('get value', 'email');

            if (Meteor.user().emails) {
                if (value !== Meteor.user().emails[0].address) {
                    Meteor.call('changeUserData', 'email', value);
                    notify('positive', 'Brawo!', 'Pomyślnie zmieniono adres e-mail użytkownika.');
                } else {
                    notify('negative', 'Błąd!', 'Wprowadzone dane są identyczne z tymi w bazie.');
                }
            } else {
                Meteor.call('changeUserData', 'email', value);
                notify('positive', 'Brawo!', 'Pomyślnie zmieniono adres e-mail użytkownika.');
            }
        } else {
            $('#buttonEmail').addClass('negative');
            $('#buttonEmail').transition('shake');
        }
    },
    "click #buttonPassword": (e, t) => {
        if ($('#form-password').form('is valid')) {
            $('#buttonPassword').removeClass('negative');
            e.preventDefault();
            const oldPasswordValue = $('#form-password').form('get value', 'passwordOld');
            const newPasswordValue = $('#form-password').form('get value', 'passwordNew');

            Accounts.changePassword(oldPasswordValue, newPasswordValue, error => {
                if (error) {
                    notify('negative', 'Błąd!', 'Wprowadzone hasło jest identyczne z poprzednim.');
                }
            });
            Meteor.call('log', 'info', `Changed his password`, Meteor.userId());
        } else {
            $('#buttonPassword').addClass('negative');
            $('#buttonPassword').transition('shake');
        }
    },
    "click #buttonDelete": (e, t) => {
        e.preventDefault();

        Meteor.call('removeLoggedUserAccount');
        notify('positive', 'Brawo!', 'Pomyślnie usunięto konto użytkownika.');
        Meteor.logout(() => {
            FlowRouter.go('login');
        });
    }
});