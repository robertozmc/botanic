// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - R E S T   A P I - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const Api = new Restivus({
    apiPath: 'api/',
    useDefaultAuth: false,
    prettyJson: true
});

// Maps to: /api/collections/order
Api.addRoute('collections/order', {
    get: () => {
        const orderCollection = order.find().fetch();

        let results = [];

        orderCollection.forEach(record => {
            const data = {
                name: record.name,
                value: record.name
            };

            results.push(data);
        });

        return {
            success: true,
            results
        };
    }
});

Api.addRoute('collections/order/:query', {
    get: function() {
        const query = this.urlParams.query;

        const orderCollection = order.find({"name": {$regex: `${query}.*`}}).fetch();

        let results = [];

        orderCollection.forEach(record => {
            const data = {
                name: record.name,
                value: record.name
            };

            results.push(data);
        });

        return {
            success: true,
            results
        };
    }
});

// Maps to: /api/collections/family
Api.addRoute('collections/family', {
    get: () => {
        const familyCollection = family.find().fetch();

        let results = [];

        familyCollection.forEach(record => {
            const data = {
                name: record.name,
                value: record.name
            };

            results.push(data);
        });

        return {
            success: true,
            results
        };
    }
});

Api.addRoute('collections/family/:query', {
    get: function() {
        const query = this.urlParams.query;

        const familyCollection = family.find({"name": {$regex: `${query}.*`}}).fetch();

        let results = [];

        familyCollection.forEach(record => {
            const data = {
                name: record.name,
                value: record.name
            };

            results.push(data);
        });

        return {
            success: true,
            results
        };
    }
});

// Maps to: /api/collections/gardens
Api.addRoute('collections/gardens', {
    get: () => {
        const gardensCollection = gardens.find().fetch();

        let results = [];

        gardensCollection.forEach(record => {
            const data = {
                name: record.name,
                value: record._id
            };

            results.push(data);
        });

        return {
            success: true,
            results
        };
    }
});

Api.addRoute('collections/gardens/:query', {
    get: function() {
        const query = this.urlParams.query;

        const gardensCollection = gardens.find({"name": {$regex: `${query}.*`}}).fetch();

        let results = [];

        gardensCollection.forEach(record => {
            const data = {
                name: record.name,
                value: record._id
            };

            results.push(data);
        });

        return {
            success: true,
            results
        };
    }
});

// Maps to: /api/collections/plants
Api.addRoute('collections/plants', {
    get: () => {
        const plantsCollection = plants.find().fetch();

        let results = [];

        plantsCollection.forEach(record => {
            let name = '';
            if (record.generalInformations.name.genus !== null) {
                name = name.concat(record.generalInformations.name.genus);
            }

            if (record.generalInformations.name.hybrid) {
                name = name.concat(' ×');
            }

            if (record.generalInformations.name.species !== null) {
                name = name.concat(` ${(record.generalInformations.name.species).italics()}`);
            }

            if (record.generalInformations.name.variety !== null) {
                name = name.concat(` var. ${(record.generalInformations.name.variety).italics()}`);
            }

            if (record.generalInformations.name.subspecies !== null) {
                name = name.concat(` subsp. ${record.generalInformations.name.subspecies}`);
            }

            if (record.generalInformations.name.authorship !== null) {
                name = name.concat(` ${record.generalInformations.name.authorship}`);
            }

            if (record.generalInformations.name.cultivar !== null) {
                name = name.concat(` '${record.generalInformations.name.cultivar}'`);
            }

            const data = {
                name: name,
                value: record._id
            };

            results.push(data);
        });

        return {
            success: true,
            results
        };
    }
});

Api.addRoute('collections/plants/:query', {
    get: function() {
        const query = this.urlParams.query;

        const plantsCollection = plants.find({
            $or: [
                {'generalInformations.name.genus': {$regex: `${query}.*`, $options: 'i'}},
                {'generalInformations.name.species': {$regex: `${query}.*`, $options: 'i'}},
                {'generalInformations.name.variety': {$regex: `${query}.*`, $options: 'i'}},
                {'generalInformations.name.subspecies': {$regex: `${query}.*`, $options: 'i'}},
                {'generalInformations.name.cultivar': {$regex: `${query}.*`, $options: 'i'}},
                {'generalInformations.name.authorship': {$regex: `${query}.*`, $options: 'i'}},
                {'generalInformations.namePL': {$regex: `${query}.*`, $options: 'i'}}
            ]
        }).fetch();

        let results = [];

        plantsCollection.forEach(record => {
            let name = '';
            if (record.generalInformations.name.genus !== null) {
                name = name.concat(record.generalInformations.name.genus);
            }

            if (record.generalInformations.name.hybrid) {
                name = name.concat(' ×');
            }

            if (record.generalInformations.name.species !== null) {
                name = name.concat(` ${(record.generalInformations.name.species).italics()}`);
            }

            if (record.generalInformations.name.variety !== null) {
                name = name.concat(` var. ${(record.generalInformations.name.variety).italics()}`);
            }

            if (record.generalInformations.name.subspecies !== null) {
                name = name.concat(` subsp. ${record.generalInformations.name.subspecies}`);
            }

            if (record.generalInformations.name.authorship !== null) {
                name = name.concat(` ${record.generalInformations.name.authorship}`);
            }

            if (record.generalInformations.name.cultivar !== null) {
                name = name.concat(` '${record.generalInformations.name.cultivar}'`);
            }

            const data = {
                name: name,
                value: record._id
            };

            results.push(data);
        });

        return {
            success: true,
            results
        };
    }
});