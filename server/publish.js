// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - P U B L I S H - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Publish collections

import {logger} from '../server/server.js';

// Users
Meteor.publish('users', function(page, limit, selector, sort) {
    let isAdmin = Roles.userIsInRole(this.userId, 'admin');

    if (isAdmin) {
        let skip;

        if (parseInt(page) !== 1) {
            skip = (parseInt(page) - 1) * limit;
        } else {
            skip = 0;
        }

        return Meteor.users.find(selector, {fields: {"username": 1, "roles": 1, "emails": 1, "name": 1, "createdAt": 1}, sort: sort, skip: skip, limit: limit});
    } else {
        return null;
    }
});

// Users Counts
Meteor.publish('usersCount', function(selector) {
    return new Counter('usersCount', Meteor.users.find(selector));
});

Meteor.publish('userName', function(userId) {
    return Meteor.users.find(userId, {fields: {"name": 1}});
});

// User
Meteor.publish(null, function() {
    const userId = this.userId;
    const userRecord = Meteor.users.findOne(userId);
    if (userId) {
        logger.log('info', `User: ${userRecord.username} | Connected`);
    }

    this.ready();
    this.onStop(() => {
        if (userId) {
            logger.log('info', `User: ${userRecord.username} | Disconnected`);
        }
    });

    return Meteor.users.find(userId, {fields: {name: 1}});
});

// Order
Meteor.publish('order', function() {
    return order.find();
});

// Family
Meteor.publish('family', function() {
    return family.find();
});

// Plants
Meteor.publish('plants', function(page, limit, selector, sort) {
    let skip;

    if (parseInt(page) !== 1) {
        skip = (parseInt(page) - 1) * limit;
    } else {
        skip = 0;
    }

    return plants.find(selector, {sort: sort, skip: skip, limit: limit});
});

// Plant Record
Meteor.publish('plantRecord', function(plantId) {
    const cursor = plants.find(plantId);
    return plants.publishJoinedCursors(cursor);
});

// Plants Counts
Meteor.publish('plantsCount', function(selector) {
    return new Counter('plantsCount', plants.find(selector));
});

// Seeds Orders
Meteor.publish('orders', function(page, limit, selector, sort) {
    let skip;

    if (parseInt(page) !== 1) {
        skip = (parseInt(page) - 1) * limit;
    } else {
        skip = 0;
    }

    return orders.find(selector, {sort: sort, skip: skip, limit: limit});
});

// Seeds Orders Record
Meteor.publish('ordersRecord', function(orderId) {
    return orders.find(orderId);
});

// Orders Counts
Meteor.publish('ordersCount', function(selector) {
    return new Counter('ordersCount', orders.find(selector));
});

// Seeds
Meteor.publish('seeds', function(page, limit, selector, sort) {
    let skip;

    if (parseInt(page) !== 1) {
        skip = (parseInt(page) - 1) * limit;
    } else {
        skip = 0;
    }

    return seeds.find(selector, {sort: sort, skip: skip, limit: limit});
});

// Seeds Record
Meteor.publish('seedRecord', function(seedId) {
    return seeds.find(seedId);
});

// Seed Counts
Meteor.publish('seedsCount', function(selector) {
    return new Counter('seedsCount', seeds.find(selector));
});

// Gardens
Meteor.publish('gardens', function(page, limit, selector, sort) {
    let skip;

    if (parseInt(page) !== 1) {
        skip = (parseInt(page) - 1) * limit;
    } else {
        skip = 0;
    }

    return gardens.find(selector, {sort: sort, skip: skip, limit: limit});
});

// Garden Record
Meteor.publish('gardenRecord', function(gardenId) {
    return gardens.find(gardenId);
});

// Gardens Counts
Meteor.publish('gardensCount', function(selector) {
    return new Counter('gardensCount', gardens.find(selector));
});

// News
Meteor.publish('news', function(page, limit, selector, sort) {
    let skip;

    if (parseInt(page) !== 1) {
        skip = (parseInt(page) - 1) * limit;
    } else {
        skip = 0;
    }

    return news.find(selector, {sort: sort, skip: skip, limit: limit});
});

// News main page
Meteor.publish('newsMain', function(limit) {
    const sort = {
        createdAt: -1
    };

    return news.find({}, {sort: sort, limit: limit});
});

// News Record
Meteor.publish('newsRecord', function(newsId) {
    return news.find(newsId);
});

// News Counts
Meteor.publish('newsCount', function(selector) {
    return new Counter('newsCount', news.find(selector));
});

// Index Seminum
Meteor.publish('indexSeminum', function(selector, sort) {
    return indexSeminum.find(selector, {sort: sort});
});

// Arboretum Plants Counts
Meteor.publish('arboretumCount', function(selector) {
    return new Counter('arboretumCount', plants.find(selector));
});

// Medicinal Plants Sector Plants Counts
Meteor.publish('medicinalPlantsSectorCount', function(selector) {
    return new Counter('medicinalPlantsSectorCount', plants.find(selector));
});

// Decorative Department Counts
Meteor.publish('decorativeDepartmentCount', function(selector) {
    return new Counter('decorativeDepartmentCount', plants.find(selector));
});

// Systematics Plants Counts
Meteor.publish('systematicsCount', function(selector) {
    return new Counter('systematicsCount', plants.find(selector));
});

// Pharmacognosy Plants Counts
Meteor.publish('pharmacognosyCount', function(selector) {
    return new Counter('pharmacognosyCount', plants.find(selector));
});

// Greenhouse Plants Counts
Meteor.publish('greenhouseCount', function(selector) {
    return new Counter('greenhouseCount', plants.find(selector));
});

// Moor Plants Counts
Meteor.publish('moorCount', function(selector) {
    return new Counter('moorCount', plants.find(selector));
});

// Dune Plants Counts
Meteor.publish('duneCount', function(selector) {
    return new Counter('duneCount', plants.find(selector));
});