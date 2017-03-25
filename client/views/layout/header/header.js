Template.header.onRendered(() => {
    if (FlowRouter.current().route.group.name === 'publicRoutes') {
        Session.set('isPublicRoute', true);
    } else {
        Session.set('isPublicRoute', false);
    }

    const path = FlowRouter.current().route.name;

    switch (path) {
        case 'main':
            $('#header-main-page').addClass('active');
            break;
        case 'informations':
            $('#header-informations').addClass('active');
            break;
        case 'activity':
            $('#header-activity').addClass('active');
            break;
        case 'history':
            $('#header-history').addClass('active');
            break;
        case 'visit':
            $('#header-visit').addClass('active');
            break;
        case 'gallery':
            $('#header-gallery').addClass('active');
            break;
        case 'indexSeminum':
            $('#header-index-seminum').addClass('active');
            break;
        case 'indexPlantarum':
            $('#header-index-plantarum').addClass('active');
            break;
        case 'projectsSponsors':
            $('#header-projects-sponsors').addClass('active');
            break;
        default:
            break;
    }

    $('#polish').popup();
    $('#english').popup();
});

Template.header.helpers({
    text: () => {
        return Session.get('localization');
    },
    isPublicRoute: () => {
        return Session.get('isPublicRoute');
    },
    path: type => {
        switch (type) {
            case 'main':
                return FlowRouter.url('main');
            case 'informations':
                return FlowRouter.url('informations');
            case 'activity':
                return FlowRouter.url('activity');
            case 'history':
                return FlowRouter.url('history');
            case 'visit':
                return FlowRouter.url('visit');
            case 'gallery':
                return FlowRouter.url('gallery');
            case 'indexSeminum':
                return FlowRouter.url('indexSeminum');
            case 'indexPlantarum':
                return FlowRouter.url('indexPlantarum');
            case 'projectsSponsors':
                return FlowRouter.url('projectsSponsors');
            case 'home':
                return FlowRouter.url('home');
            case 'orders':
                return FlowRouter.url('orders');
            case 'plants':
                return FlowRouter.url('plants');
            case 'seeds':
                return FlowRouter.url('seeds');
            case 'gardens':
                return FlowRouter.url('gardens');
            case 'news':
                return FlowRouter.url('news');
            case 'photos':
                return FlowRouter.url('photos');
            case 'users':
                return FlowRouter.url('users');
            case 'account':
                return FlowRouter.url('account');
            default:
                return FlowRouter.url('notFound');
        }
    },
    user: () => {
        return Meteor.user();
    }
});

Template.header.events({
    "click .item": (e, t) => {
        if (Session.get('isPublicRoute')) {
            $('.item').removeClass('active');
            $(e.target).addClass('active');
        }
    },
    "click #polish": (e, t) => {
        Session.set('localization', localizationPL);
    },
    "mouseenter #polish": (e, t) => {
        $(e.target).popup('show');
    },
    "click #english": (e, t) => {
        Session.set('localization', localizationEN);
    },
    "mouseenter #english": (e, t) => {
        $(e.target).popup('show');
    },
    "click #logout": (e, t) => {
        Meteor.logout(() => {
            Session.set('isPublicRoute', true);
            FlowRouter.go('main');
            $('#main-page').addClass('active');
        });
    }
});