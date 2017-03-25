// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - R O U T E R - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Route groups

const publicRoutes = FlowRouter.group({
    name: 'publicRoutes',
    triggersEnter: [(context, redirect) => {
        Session.set('isPublicRoute', true);
    }]
});

const loginRoutes = FlowRouter.group({
    triggersEnter: [(context, redirect) => {
        Session.set('isPublicRoute', true);
        if (Meteor.userId()) {
            FlowRouter.go('home');
        }
    }]
});

const privateRoutes = FlowRouter.group({
    triggersEnter: [(context, redirect) => {
        Session.set('isPublicRoute', false);
        if (!Meteor.userId()) {
            FlowRouter.go('login');
        }
    }]
});

const adminRoutes = FlowRouter.group({
    triggersEnter: [(context, redirect) => {
        if (!Meteor.userId()) {
            FlowRouter.go('login');
        }
    }]
});

const newsRoutes = FlowRouter.group({
    triggersEnter: [(context, redirect) => {
        if (!Meteor.userId()) {
            FlowRouter.go('login');
        }
    }]
});

const galleryRoutes = FlowRouter.group({
    triggersEnter: [(context, redirect) => {
        if (!Meteor.userId()) {
            FlowRouter.go('login');
        }
    }]
});

const ordersRoutes = FlowRouter.group({
    triggersEnter: [(context, redirect) => {
        if (!Meteor.userId()) {
            FlowRouter.go('login');
        }
    }]
});

const seedsRoutes = FlowRouter.group({
    triggersEnter: [(context, redirect) => {
        if (!Meteor.userId()) {
            FlowRouter.go('login');
        }
    }]
});

const plantsRoutes = FlowRouter.group({
    triggersEnter: [(context, redirect) => {
        if (!Meteor.userId()) {
            FlowRouter.go('login');
        }
    }]
});

const gardensRoutes = FlowRouter.group({
    triggersEnter: [(context, redirect) => {
        if (!Meteor.userId()) {
            FlowRouter.go('login');
        }
    }]
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Public routes

publicRoutes.route('/', {
    name: 'main',
    subscriptions: function() {
        this.register('news', Meteor.subscribe('news'));
    },
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'main', footer: 'footer'});
    },
    triggersExit: [context => {
        Session.set('previousPage', context.path);
    }]
});

publicRoutes.route('/newsDetails/:id', {
    name: 'newsDetailsMain',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'newsDetailsMain', footer: 'footer'});
    }
});

publicRoutes.route('/informations', {
    name: 'informations',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'informations', footer: 'footer'});
    }
});

publicRoutes.route('/activity', {
    name: 'activity',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'activity', footer: 'footer'});
    }
});

publicRoutes.route('/history', {
    name: 'history',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'history', footer: 'footer'});
    }
});

publicRoutes.route('/visit', {
    name: 'visit',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'visit', footer: 'footer'});
    }
});

publicRoutes.route('/map', {
    name: 'map',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'map', footer: 'footer'});
    }
});

publicRoutes.route('/gallery', {
    name: 'gallery',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'gallery', footer: 'footer'});
    }
});

publicRoutes.route('/projects_sponsors', {
    name: 'projectsSponsors',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'projectsSponsors', footer: 'footer'});
    }
});

publicRoutes.route('/index_seminum', {
    name: 'indexSeminum',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'indexSeminum', footer: 'footer'});
    }
});

publicRoutes.route('/index_plantarum', {
    name: 'indexPlantarum',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'indexPlantarum', footer: 'footer'});
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Login routes

loginRoutes.route('/login', {
    name: 'login',
    action: () => {
        BlazeLayout.render('layout', {content: 'login'});
    }
});

loginRoutes.route('/register', {
    name: 'register',
    action: () => {
        BlazeLayout.render('layout', {content: 'register'});
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Private routes

privateRoutes.route('/home', {
    name: 'home',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'home'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
    }]
});

privateRoutes.route('/account', {
    name: 'account',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'account'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
    }]
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Admin routes

adminRoutes.route('/users', {
    name: 'users',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'users'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', false);
    }]
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// News routes

newsRoutes.route('/news', {
    name: 'news',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'news'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', false);
    }],
    triggersExit: [context => {
        Session.set('previousPage', context.path);
    }]
});

newsRoutes.route('/news/add', {
    name: 'newsAdd',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'newsAdd'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
        Session.set('previousPage', '/news');
    }]
});

newsRoutes.route('/news/edit/:id', {
    name: 'newsEdit',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'newsEdit'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
        Session.set('previousPage', '/news');
    }]
});

newsRoutes.route('/news/details/:id', {
    name: 'newsDetails',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'newsDetails'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
        Session.set('previousPage', '/news');
    }]
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Gallery routes

galleryRoutes.route('/photos', {
    name: 'photos',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'photos'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', false);
    }],
});

galleryRoutes.route('/photos/album/:id', {
    name: 'photosAlbumDetails',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'photosAlbumDetails'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
    }]
});

galleryRoutes.route('/photos/add', {
    name: 'photosAdd',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'photosAdd'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
    }]
});

galleryRoutes.route('/photos/album/add/:id', {
    name: 'photosAlbumAdd',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'photosAlbumAdd'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
    }]
});

galleryRoutes.route('/photos/album/edit/:id', {
    name: 'photosAlbumEdit',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'photosAlbumEdit'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
    }]
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Orders routes

ordersRoutes.route('/orders', {
    name: 'orders',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'orders'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', false);
    }],
    triggersExit: [context => {
        Session.set('previousPage', context.path);
    }]
});

ordersRoutes.route('/orders/details/:id', {
    name: 'ordersDetails',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'ordersDetails'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
        Session.set('previousPage', '/orders');
    }]
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Seeds routes

seedsRoutes.route('/seeds', {
    name: 'seeds',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'seeds'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', false);
    }],
    triggersExit: [context => {
        Session.set('previousPage', context.path);
    }]
});

seedsRoutes.route('/seeds/add', {
    name: 'seedsAdd',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'seedsAdd'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
        Session.set('previousPage', '/seeds');
    }]
});

seedsRoutes.route('/seeds/edit/:id', {
    name: 'seedsEdit',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'seedsEdit'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
        Session.set('previousPage', '/seeds');
    }]
});

seedsRoutes.route('/seeds/details/:id', {
    name: 'seedsDetails',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'seedsDetails'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
        Session.set('previousPage', '/seeds');
    }]
});
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Plants routes

plantsRoutes.route('/plants', {
    name: 'plants',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'plants'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', false);
    }],
    triggersExit: [context => {
        Session.set('previousPage', context.path);
    }]
});

plantsRoutes.route('/plants/add', {
    name: 'plantsAdd',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'plantsAdd'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
        Session.set('previousPage', '/plants');
    }]
});

plantsRoutes.route('/plants/edit/:id', {
    name: 'plantsEdit',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'plantsEdit'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
        Session.set('previousPage', '/plants');
    }]
});

plantsRoutes.route('/plants/details/:id', {
    name: 'plantsDetails',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'plantsDetails'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
        Session.set('previousPage', '/plants');
    }]
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Gardens routes

gardensRoutes.route('/gardens', {
    name: 'gardens',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'gardens'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', false);
    }],
    triggersExit: [context => {
        Session.set('previousPage', context.path);
    }]
});

gardensRoutes.route('/gardens/add', {
    name: 'gardensAdd',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'gardensAdd'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
        Session.set('previousPage', '/gardens');
    }]
});

gardensRoutes.route('/gardens/edit/:id', {
    name: 'gardensEdit',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'gardensEdit'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
        Session.set('previousPage', '/gardens');
    }]
});

gardensRoutes.route('/gardens/details/:id', {
    name: 'gardensDetails',
    action: () => {
        BlazeLayout.render('layout', {header: 'header', content: 'gardensDetails'});
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
        Session.set('previousPage', '/gardens');
    }]
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Import route

FlowRouter.route('/import', {
    name: 'import',
    // TODO: wywalić ostatecznie, potrzebne tylko do podgladu czy sie dobrze importuje
    subscriptions: function() {
        this.register('order', Meteor.subscribe('order'));
        this.register('family', Meteor.subscribe('family'));
        this.register('gardens', Meteor.subscribe('gardens'));
        this.register('plants', Meteor.subscribe('plants'));
    },
    triggersEnter: [(context, redirect) => {
        Session.set('isAddEditDetailsView', true);
    }],
    action: () => {
        BlazeLayout.render('layout', {content: 'import'});
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Not found route

FlowRouter.notFound = {
    name: 'notFound',
    action: () => {
        Session.set('isPublicRoute', true);
        BlazeLayout.render('layout', {content: 'notFound'});
    }
};