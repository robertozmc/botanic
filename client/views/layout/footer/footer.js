Template.footer.helpers({
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
    email: () => {
        return 'orl@gumed.edu.pl';
    },
    year: () => {
        return moment().year();
    }
});

Template.footer.events({
    "click .item": (e, t) => {
        if (Session.get('isPublicRoute')) {
            $('.item').removeClass('active');
            $(`#header-${e.target.id}`).addClass('active');
        }
    },
    "click #symbol": (e, t) => {
        e.preventDefault();
        if (Meteor.userId()) {
            FlowRouter.go('home');
        } else {
            FlowRouter.go('login');
        }
    }
});