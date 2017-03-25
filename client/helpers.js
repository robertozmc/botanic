// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - H E L P E R S - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Format Date Helper
UI.registerHelper('formatDate', date => {
    return date ? moment(date).format('DD.MM.YYYY') : 'Brak';
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Format Date And Time Helper
UI.registerHelper('formatDateTime', datetime => {
    return datetime ? moment(datetime).format('DD.MM.YYYY, HH:mm:ss') : 'Brak';
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Format Pretty Date And Time Helper
UI.registerHelper('formatPrettyDateTime', datetime => {
    return datetime ? moment(datetime).format('LL, HH:mm:ss') : 'Brak';
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Format Link Helper
UI.registerHelper('linkify', website => {
    if (website) {
        if (!website.includes('http')) {
            return `<a href="http://${website}">${website}</a>`;
        } else {
            return `<a href="${website}">${website}</a>`;
        }
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Equals Helper
UI.registerHelper('equals', (a, b) => {
    return a === b;
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Get User Name Helper
UI.registerHelper('getUserName', userId => {
    Meteor.subscribe('userName', userId);

    const user = Meteor.users.findOne(userId);

    if (user) {
        return user.name;
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - S E E D S - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Format Unit Helper
UI.registerHelper('formatUnit', unit => {
    switch (unit) {
        case 'piece':
            return "Sztuk";
        case 'weight':
            return "Gramów";
        default:
            return "Nie określono";
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Format Usage Helper
UI.registerHelper('formatUsage', usage => {
    switch (usage) {
        case 'seminum':
            return "Seminum";
        case 'lab':
            return "Laboratorium";
        default:
            return "Nie określono";
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - P L A N T S - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Format Type Helper
UI.registerHelper('formatType', type => {
    switch (type) {
        case 'tree':
            return 'Drzewo';
        case 'shrub':
            return 'Krzew';
        case 'littleShrub':
            return 'Krzewinka';
        case 'annualVine':
            return 'Pnącze jednoroczne';
        case 'perennialVine':
            return 'Pnącze wieloletnie';
        case 'perennial':
            return 'Bylina';
        case 'annunal':
            return 'Roślina jednoroczna';
        case 'biennial':
            return 'Roślina dwuletnia';
        default:
            return 'Nieznany typ';
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Format Place Helper
UI.registerHelper('formatPlace', place => {
    switch (place) {
        case 'decorativeDepartment':
            return 'Dział Roślin Ozdobnych';
        case 'arboretum':
            return 'Arboretum';
        case 'moor':
            return 'Wrzosowisko';
        case 'dune':
            return 'Wydma';
        case 'pharmacognosy':
            return 'Farmakognozja';
        case 'systematics':
            return 'Dział Systematyki Roślin';
        case 'medicinalPlantsSector':
            return 'Dział Roślin Leczniczych';
        case 'greenhouse':
            return 'Szklarnia';
        default:
            return 'Nieznane miejsce';
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Format Place Shorthand Helper
UI.registerHelper('formatPlaceShorthand', place => {
    switch (place) {
        case 'decorativeDepartment':
            return 'DRO';
        case 'arboretum':
            return 'A';
        case 'moor':
            return 'Wrz';
        case 'dune':
            return 'Wyd';
        case 'pharmacognosy':
            return 'F';
        case 'systematics':
            return 'DSR';
        case 'medicinalPlantsSector':
            return 'DRL';
        case 'greenhouse':
            return 'Sz';
        default:
            return '?';
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Count Collection
UI.registerHelper('getCount', name => {
    return name ? Counter.get(name) : null;
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Get Previous Page
UI.registerHelper('previousPage', () => {
    return Session.get('previousPage') ? FlowRouter.url(Session.get('previousPage')) : '';
});