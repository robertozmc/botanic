// -----------------------------------------------------------------------------
// - - - - - - - - - - N E W S  E D I T  F U N C T I O N S - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Edits news record
 * @param {Object} e - event object.
 * @param {Object} garden - garden object.
 */
const editGardenData = (e, garden) => {
    // Prevents default from submit action
    e.preventDefault();
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

    // Changed garden data
    const gardenData = {
        name: name,
        subname: subname !== '' ? subname : null,
        address: {
            street: street,
            number: number,
            postalCode: postalCode,
            city: city,
            country: country
        },
        contact: {
            phone: phone !== '' ? phone : null,
            fax: fax !== '' ? phone : null,
            email: email !== '' ? email : null,
            website: website !== '' ? website : null
        },
        representative: representative !== '' ? representative : null,
        createdAt: garden.createdAt,
        editedAt: new Date()
    };
    // Call Meteor method editData
    Meteor.call('editData', 'gardens', garden._id, gardenData);
    // Display notification
    notify('positive', 'Brawo!', 'Pomyślnie edytowano ogród.');
    // Go to gardens page
    FlowRouter.go('gardens');
};

// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - N E W S  E D I T- - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.gardensEdit.onCreated(function() {
    // Template instance (this)
    const instance = this;
    // Garden ID
    const gardenId = FlowRouter.getParam('id');
    // Garden subscription
    instance.gardenSubscription = new ReactiveVar(false);

    // Autorun
    instance.autorun(() => {
        // Subscribe to gardens colection
        instance.gardenSubscription.set(instance.subscribe('gardenRecord', gardenId));
    });
    // Garden record
    instance.garden = () => {
        return gardens.findOne();
    };
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onRendered
Template.gardensEdit.onRendered(function() {
    // Template instance (this)
    const instance = this;
    // Autorun
    instance.autorun(() => {
        // If garden subscribtion is ready
        if (instance.gardenSubscription.get().ready()) {
            // Garden record
            const garden = instance.garden();
            // Meteor timeout to properly set all form values
            Meteor.setTimeout(() => {
                // Focus at name input field
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
                                type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻ0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9\\-.,:/ ]+$/]',
                                prompt: 'Nazwy własne piszemy wielką literą, dozwolone znaki specjalne (.,:-/)'
                            }]
                        },
                        subname: {
                            identifier: 'subname',
                            optional: true,
                            rules: [{
                                type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻ0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9\\-.,:/ ]+$/]',
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
                                type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9\\-.,/ ]+$/]',
                                prompt: 'Dozwolone znaki specjalne (.,-/)'
                            }]
                        },
                        number: {
                            identifier: 'number',
                            rules: [{
                                type: 'empty',
                                prompt: 'Proszę wprowadzić numer budynku'
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
                                type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻ0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9\\- ]+$/]',
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
                                type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻ0-9][A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9\\- ]+$/]',
                                prompt: 'Nazwy państw piszemy wielką literą, dozwolone znaki specjalne (-)'
                            }]
                        },
                        phone: {
                            identifier: 'phone',
                            optional: true,
                            rules: [{
                                type: 'regExp[/^[0-9+ ]+$/]',
                                prompt: 'Dozwolone cyfry oraz znaki specjalne (+)'
                            }]
                        },
                        fax: {
                            identifier: 'fax',
                            optional: true,
                            rules: [{
                                type: 'regExp[/^[0-9+ ]+$/]',
                                prompt: 'Dozwolone cyfry oraz znaki specjalne (+)'
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
                        },
                        representative: {
                            identifier: 'representative',
                            optional: true,
                            rules: [{
                                type: 'regExp[/^[A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż.\\- ]+$/]',
                                prompt: 'Dozwolone litery oraz znaki specjalne (.-)'
                            }]
                        }
                    },
                    inline: true
                });

                // Set form values
                $('#name').val(garden.name);
                $('#subname').val(garden.subname);
                $('#street').val(garden.address.street);
                $('#number').val(garden.address.number);
                $('#postalCode').val(garden.address.postalCode);
                $('#city').val(garden.address.city);
                $('#country').val(garden.address.country);
                $('#phone').val(garden.contact.phone);
                $('#fax').val(garden.contact.fax);
                $('#email').val(garden.contact.email);
                $('#website').val(garden.contact.website);
                $('#representative').val(garden.representative);
            });
        }
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.gardensEdit.events({
    // Click submit button to edit garden record
    'click #submit': (e, t) => {
        if ($('.ui.form').form('is valid')) {
            editGardenData(e, t.garden());
        }
    }
});