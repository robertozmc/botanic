Template.layout.helpers({
    headerClass: () => {
        return Session.get('isPublicRoute') ? 'header-logged-out' : 'header-logged-in';
    },
    mainClass: () => {
        return Session.get('isPublicRoute') ? 'main-logged-out' : 'main-logged-in';
    },
    isPublicRoute: () => {
        return Session.get('isPublicRoute');
    },
    isAddEditDetailsView: () => {
        return Session.get('isAddEditDetailsView');
    }
});