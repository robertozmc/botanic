const pageSession = new ReactiveDict();

Template.breadcrumb.onRendered(function() {
    getBreadcrumbData(this.data);
});

Template.breadcrumb.helpers({
    homePath: () => {
        return FlowRouter.url('home');
    },
    mainSection: () => {
        return pageSession.get('mainSection');
    },
    secondSection: () => {
        return pageSession.get('secondSection');
    },
    currentSection: () => {
        return pageSession.get('currentSection');
    }
});

const getBreadcrumbData = data => {
    const mainSection = data.mainSection;
    const secondSection = data.secondSection;
    const currentSection = data.currentSection;

    switch (mainSection) {
        case 'account':
            pageSession.set('mainSection', {
                url: FlowRouter.url('account'),
                name: 'Konto'
            });
            break;
        case 'orders':
            pageSession.set('mainSection', {
                url: FlowRouter.url('orders'),
                name: 'Zamówienia'
            });
            switch (currentSection) {
                case 'details':
                    pageSession.set('currentSection', 'Szczegóły zamówienia');
                    break;
                default:
                    pageSession.set('currentSection', 'Sekcja domyślna');
                    break;
            }
            break;
        case 'plants':
            pageSession.set('mainSection', {
                url: FlowRouter.url('plants'),
                name: 'Rośliny'
            });
            switch (currentSection) {
                case 'add':
                    pageSession.set('currentSection', 'Dodaj nową roślinę');
                    break;
                case 'details':
                    pageSession.set('currentSection', 'Szczegóły rośliny');
                    break;
                case 'edit':
                    pageSession.set('currentSection', 'Edytuj roślinę');
                    break;
                default:
                    pageSession.set('currentSection', 'Sekcja domyślna');
                    break;
            }
            break;
        case 'seeds':
            pageSession.set('mainSection', {
                url: FlowRouter.url('seeds'),
                name: 'Nasiona'
            });
            switch (currentSection) {
                case 'add':
                    pageSession.set('currentSection', 'Dodaj zebrane nasiona');
                    break;
                case 'details':
                    pageSession.set('currentSection', 'Szczegóły zebranych nasion');
                    break;
                case 'edit':
                    pageSession.set('currentSection', 'Edytuj zebrane nasiona');
                    break;
                default:
                    pageSession.set('currentSection', 'Sekcja domyślna');
                    break;
            }
            break;
        case 'gardens':
            pageSession.set('mainSection', {
                url: FlowRouter.url('gardens'),
                name: 'Ogrody botaniczne'
            });
            switch (currentSection) {
                case 'add':
                    pageSession.set('currentSection', 'Dodaj nowy ogród');
                    break;
                case 'details':
                    pageSession.set('currentSection', 'Szczegóły ogrodu');
                    break;
                case 'edit':
                    pageSession.set('currentSection', 'Edytuj ogród');
                    break;
                default:
                    pageSession.set('currentSection', 'Sekcja domyślna');
                    break;
            }
            break;
        case 'news':
            pageSession.set('mainSection', {
                url: FlowRouter.url('news'),
                name: 'News'
            });
            switch (currentSection) {
                case 'add':
                    pageSession.set('currentSection', 'Dodaj news');
                    break;
                case 'details':
                    pageSession.set('currentSection', 'Podgląd news\'a');
                    break;
                case 'edit':
                    pageSession.set('currentSection', 'Edytuj news');
                    break;
                default:
                    pageSession.set('currentSection', 'Sekcja domyślna');
                    break;
            }
            break;
        case 'photos':
            pageSession.set('mainSection', {
                url: FlowRouter.url('photos'),
                name: 'Galeria zdjęć'
            });
            switch (currentSection) {
                case 'add':
                    pageSession.set('currentSection', 'Dodaj nowy album');
                    break;
                case 'album':
                    pageSession.set('currentSection', 'Podgląd albumu');
                    break;
                case 'albumAdd':
                    pageSession.set('secondSection', 'Podgląd albumu');
                    pageSession.set('currentSection', 'Dodaj zdjęcia do albumu');
                    break;
                case 'albumEdit':
                    pageSession.set('currentSection', 'Edytuj album');
                    break;
                default:
                    pageSession.set('currentSection', 'Sekcja domyślna');
                    break;
            }
            break;
        case 'users':
            pageSession.set('mainSection', {
                url: FlowRouter.url('users'),
                name: 'Użytkownicy'
            });
            break;
        default:
            pageSession.set('mainSection', {
                url: FlowRouter.url('notFound'),
                name: 'Nie znaleziono'
            });
            break;
    }
};