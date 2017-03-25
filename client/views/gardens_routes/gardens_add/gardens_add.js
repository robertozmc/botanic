// -----------------------------------------------------------------------------
// - - - - - - - - - - - G A R D E N S  A D D  F U N C T I O N S - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Adds garden data
 */
const addGardenData = () => {
    // Get form values
    const name           = $('.ui.form').form('get value', 'name');
    const subname        = $('.ui.form').form('get value', 'subname');
    const street         = $('.ui.form').form('get value', 'street');
    const number         = $('.ui.form').form('get value', 'number');
    const postalCode     = $('.ui.form').form('get value', 'postalCode');
    const city           = $('.ui.form').form('get value', 'city');
    const country        = $('.ui.form').form('get value', 'country');
    const phone          = $('.ui.form').form('get value', 'phone');
    const fax            = $('.ui.form').form('get value', 'fax');
    const email          = $('.ui.form').form('get value', 'email');
    const website        = $('.ui.form').form('get value', 'website');
    const representative = $('.ui.form').form('get value', 'representative');

    // Create garden data
    const gardenData = {
        name,
        subname,
        address: {
            street,
            number,
            postalCode,
            city,
            country
        },
        contact: {
            phone,
            fax,
            email,
            website
        },
        representative,
        createdAt: new Date(),
        editedAt: null
    };

    // Call Meteor method addNewData to add garden data to database
    Meteor.call('addNewData', 'gardens', gardenData);
    // Display notification
    notify('positive', 'Brawo!', 'Pomyślnie dodano ogród do bazy.');
    // Go to gardens page
    FlowRouter.go('gardens');
};

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - G A R D E N S  A D D- - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.gardensAdd.onRendered(() => {
    // Focus caret at name input field
    $('#name').focus();
    // Initialize form
    $('.ui.form').form({
        fields: {
            name: {
                identifier: 'name',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić nazwę ogrodu'
                },
                {
                    type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻ0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9-.,:/ ]+$/]',
                    prompt: 'Nazwy własne piszemy wielką literą, dozwolone znaki specjalne (.,:-/)'
                }]
            },
            subname: {
                identifier: 'subname',
                optional: true,
                rules: [{
                    type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻ0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9-.,:/ ]+$/]',
                    prompt: 'Nazwy własne piszemy wielką literą, dozwolone znaki specjalne (.,:-/)'
                }]
            },
            street: {
                identifier: 'street',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić nazwę ulicy'
                },
                {
                    type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9-.,/ ]+$/]',
                    prompt: 'Dozwolone znaki specjalne (.,-/)'
                }]
            },
            number: {
                identifier: 'number',
                optional: true,
                rules: [{
                    type: 'minLength[1]',
                    prompt: 'Numer budynku musi posiadać przynajmniej {ruleValue} znak'
                }]
            },
            postalCode: {
                identifier: 'postalCode',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić kod pocztowy'
                }]
            },
            city: {
                identifier: 'city',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić miasto'
                },
                {
                    type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻ0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9- ]+$/]',
                    prompt: 'Nazwy miast piszemy wielką literą, dozwolone znaki specjalne (-)'
                }]
            },
            country: {
                identifier: 'country',
                rules: [{
                    type: 'empty',
                    prompt: 'Proszę wprowadzić kraj'
                },
                {
                    type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻ0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9- ]+$/]',
                    prompt: 'Nazwy państw piszemy wielką literą, dozwolone znaki specjalne (-)'
                }]
            },
            website: {
                identifier: 'website',
                optional: true,
                rules: [{
                    type: 'url',
                    prompt: 'Proszę wprowadzić poprawny URL'
                }]
            },
            email: {
                identifier: 'email',
                optional: true,
                rules: [{
                    type: 'email',
                    prompt: 'Proszę wprowadzić poprawny adres e-mail'
                }]
            }
        },
        inline: true
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.gardensAdd.events({
    // Click submit button to add new garden record to database
    'click #submit': (e, t) => {
        if ($('.ui.form').form('is valid')) {
            addGardenData();
        }
    }
});