// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Report functions
import {printReportOrders} from '../../../views/orders_routes/orders/orders.js';
import {printReportPlants} from '../../../views/plants_routes/plants/plants.js';
import {printReportSeeds} from '../../../views/seeds_routes/seeds/seeds.js';
import {printReportGardens} from '../../../views/gardens_routes/gardens/gardens.js';
import {printReportNews} from '../../../views/news_routes/news/news.js';
import {printReportUsers} from '../../../views/admin_routes/users/users.js';


const pageSession = new ReactiveDict();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// onCreated
Template.basicControlPanel.onCreated(function() {
    // Template instance (this)
    const instance = this;
    // Current path
    instance.currentPath = FlowRouter.current().route.name;
    // addPath
    instance.addPath = new ReactiveVar();

    switch (instance.currentPath) {
        case 'plants':
            instance.addPath.set(FlowRouter.url('plantsAdd'));
            break;
        case 'seeds':
            instance.addPath.set(FlowRouter.url('seedsAdd'));
            break;
        case 'gardens':
            instance.addPath.set(FlowRouter.url('gardensAdd'));
            break;
        case 'news':
            instance.addPath.set(FlowRouter.url('newsAdd'));
            break;
        default:
            instance.addPath.set(FlowRouter.url('notFound'));
            break;
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Helpers
Template.basicControlPanel.helpers({
    addPath: () => {
        return Template.instance().addPath.get();
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Events
Template.basicControlPanel.events({
    // Click report button to generate report PDF
    'click #reportButton': (e, t) => {
        switch (t.currentPath) {
            case 'orders':
                printReportOrders();
                break;
            case 'plants':
                printReportPlants();
                break;
            case 'seeds':
                printReportSeeds();
                break;
            case 'gardens':
                printReportGardens();
                break;
            case 'news':
                printReportNews();
                break;
            case 'users':
                printReportUsers();
                break;
            default:
                return false;
        }
    }
});