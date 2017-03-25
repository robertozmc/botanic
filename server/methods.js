// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - M E T H O D S - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------
import fs from 'fs';
import Future from 'fibers/future';

import {logger} from '../server/server.js';
import {formatGardenData, formatQuery, geocode, formatAddress, insertGardenToCollection} from '../server/import/import_methods.js';
import {formatOrderAndFamilyName, getAPIData, formatPlantData, formatPlantRecord} from '../server/import/import_methods.js';
import {stringToBoolean} from './utils.js';

// Meteor methods
Meteor.methods({
    // Client: Log from client
    log: (level, info, user) => {
        const loggedUserRecord = Meteor.users.findOne(user);
        logger.log(level, `User: ${loggedUserRecord.username} | ${info}`);
    },
    // Admin: Change user roles
    changeUserRoles: (user, roles) => {
        const loggedUserRecord = Meteor.users.findOne(Meteor.userId());
        const userRecord = Meteor.users.findOne(user);

        if (!_.isEqual(userRecord.roles, roles)) {
            Roles.setUserRoles(user, roles);
            logger.log('info', `User: ${loggedUserRecord.username} | Roles of user ${userRecord.username} set to ${roles}`);
            return true;
        } else {
            return false;
        }
    },
    // Admin: Change user status (verified = true/false)
    verifyUser: user => {
        const loggedUserRecord = Meteor.users.findOne(Meteor.userId());
        const userRecord = Meteor.users.findOne(user);
        const verified = userRecord.emails[0].verified;

        Meteor.users.update(user, {$set: {'emails.0.verified': !verified}});

        logger.log('info', `User: ${loggedUserRecord.username} | Status of user ${userRecord.username} changed to ${!verified}`);
    },
    // Admin: Remove user account
    removeUserAccount: user => {
        const loggedUserRecord = Meteor.users.findOne(Meteor.userId());
        const userRecord = Meteor.users.findOne(user);
        Meteor.users.remove(user);
        logger.log('info', `User: #{loggedUserRecord.username} | Removed ${userRecord.username} account`);
    },
    // User: Remove own account
    removeLoggedUserAccount: () => {
        const loggedUserRecord = Meteor.users.findOne(Meteor.userId());
        Meteor.users.remove(Meteor.userId());
        logger.log('info', `User: ${loggedUserRecord.username} | Removed his account`);
    },
    // User: Change own data (name, email)
    changeUserData: (field, value) => {
        const user = Meteor.userId();
        const loggedUserRecord = Meteor.users.findOne(user);

        switch (field) {
            case 'name':
                Meteor.users.update(user, {$set: {name: value}});
                return true;
            case 'email':
                if (Meteor.user().emails) {
                    Meteor.users.update(user, {$set: {'emails.0.address': value}});
                } else {
                    const emails = [{
                        address: value
                    }];

                    Meteor.users.update(user, {$set: {emails: emails}});
                }
                return true;
            default:
                return false;
        }
        logger.log('info', `User: #{loggedUserRecord.username} | Updated ${field} with value: ${value}`);
    },
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Collections data manipulation

    // User: Add new data record to collection
    addNewData: (type, data) => {
        const loggedUserRecord = Meteor.users.findOne(Meteor.userId());
        switch (type) {
            case 'plants':
                plants.insert(data);
                break;
            case 'seeds':
                seeds.insert(data);
                break;
            case 'gardens':
                gardens.insert(data);
                break;
            case 'news':
                news.insert(data);
                break;
            case 'order':
                order.insert(data);
                break;
            case 'family':
                family.insert(data);
                break;
            default:
                break;
        }
        logger.log('info', `User: ${loggedUserRecord.username} | Added new record to ${type} collection`);
    },
    // User: Edit data record from collection
    editData: (type, id, data) => {
        const loggedUserRecord = Meteor.users.findOne(Meteor.userId());
        switch (type) {
            case 'plants':
                plants.update(id, data);
                break;
            case 'seeds':
                seeds.update(id, data);
                break;
            case 'gardens':
                gardens.update(id, data);
                break;
            case 'news':
                news.update(id, data);
                break;
            case 'order':
                order.update(id, data);
                break;
            case 'family':
                family.update(id, data);
                break;
            default:
                break;
        }
        logger.log('info', `User: ${loggedUserRecord.username} | Edited record from ${type} collection`);
    },
    // User: Remove data record from collection
    removeData: (type, id) => {
        const loggedUserRecord = Meteor.users.findOne(Meteor.userId());
        switch (type) {
            case 'plants':
                plants.remove(id);
                break;
            case 'seeds':
                seeds.remove(id);
                break;
            case 'gardens':
                gardens.remove(id);
                break;
            case 'news':
                news.remove(id);
                break;
            case 'orders':
                orders.remove(id);
                break;
            default:
                break;
        }
        logger.log('info', `User: ${loggedUserRecord.username} | Removed record from ${type} collection`);
    },
    // Plants: Edit plant record
    // TODO: Implement this (make it return a value instead of undefined due to Meteor nature)
    // editPlantRecord: data => {
    //     const plantName = data.generalInformations.name;
    //     // GBIF API (http://www.gbif.org/developer/summary)
    //     let apiURL = encodeURI(`http://api.gbif.org/v1/species/match?name=${plantName.genus} ${plantName.species} ${plantName.variety} ${plantName.subspecies} ${plantName.authorship}`);
    //     // api response variable
    //     let apiResponse = null;
    //     // Get API data
    //     getAPIData(apiURL).then(response => {
    //         // if api found plant
    //         if (response.data.matchType !== 'NONE' && response.data.rank !== 'GENUS' && response.data.status === 'ACCEPTED') {
    //             apiResponse = response.data.scientificName;
    //         }
    //
    //         getPlantName(apiResponse).then(name => {
    //             return name;
    //         });
    //     });
    // },
    // Orders: Add new seeds order
    addSeedsOrder: data => {
        // dla kazdego zamowionego nasiona odjac po jednej sztuce z kolekcji index seminum
        data.order.forEach(id => {
            const indexSeminumRecord = indexSeminum.findOne(id);

            if (indexSeminumRecord) {
                indexSeminum.update({
                    $and: [{
                        _id: id
                    }, {
                        years: {
                            $elemMatch: {
                                year: parseInt(new Date().getFullYear()) - 1
                            }
                        }
                    }]
                }, {
                    $inc: {
                        'years.$.quantity': -1
                    }
                });
            }
        });

        // Check if given ordering party data is already in gardens collection
        let selector = {};
        let address = {};
        let contact = {};

        // Check if name and subname exists
        if (data.orderingParty.name !== null) {
            selector.name = data.orderingParty.name;
        }
        if (data.orderingParty.subname !== null) {
            selector.subname = data.orderingParty.subname;
        }
        // Check if address exists
        if (data.orderingParty.address.street !== null) {
            address.street = data.orderingParty.address.street;
        }
        if (data.orderingParty.address.number !== null) {
            address.number = data.orderingParty.address.number;
        }
        if (data.orderingParty.address.postalCode !== null) {
            address.postalCode = data.orderingParty.address.postalCode;
        }
        if (data.orderingParty.address.city !== null) {
            address.city = data.orderingParty.address.city;
        }
        if (data.orderingParty.address.country !== null) {
            address.country = data.orderingParty.address.country;
        }
        // Check if contact exists
        if (data.orderingParty.contact.phone !== null) {
            contact.phone = data.orderingParty.contact.phone;
        }
        if (data.orderingParty.contact.fax !== null) {
            contact.fax = data.orderingParty.contact.fax;
        }
        if (data.orderingParty.contact.email !== null) {
            contact.email = data.orderingParty.contact.email;
        }
        if (data.orderingParty.contact.website !== null) {
            contact.website = data.orderingParty.contact.website;
        }
        // Check if representative exists
        if (data.orderingParty.representative !== null) {
            selector.representative = data.orderingParty.representative;
        }

        if (!_.isEmpty(address)) {
            selector.address = address;
        }

        if (!_.isEmpty(contact)) {
            selector.contact = contact;
        }

        const gardenRecord = gardens.findOne(selector);

        if (gardenRecord) {
            data.verified = true;
        } else {
            data.verified = false;
        }

        return orders.insert(data);
    },
    // Orders: Change order status
    changeOrderStatus: (order, status) => {
        const loggedUserRecord = Meteor.users.findOne(Meteor.userId());

        orders.update(order, {$set: {orderStatus: status, editedAt: new Date()}});

        logger.log('info', `User: ${loggedUserRecord.username} | Changed order: ${order} status to ${status}`);
    },
    // Orders: Check order status
    checkOrderStatus: id => {
        const orderRecord = orders.findOne(id);

        if (orderRecord) {
            return orderRecord.orderStatus;
        } else {
            return 'notExists';
        }
    },
    // indexSeminum: update index seminum collection
    updateIndexSeminum: data => {
        // plant record
        const plantRecord = plants.findOne(data.plant.id);
        // index seminum record
        const indexSeminumRecord = indexSeminum.findOne({'plant.id': data.plant.id});

        if (indexSeminumRecord) {
            // update record
            const indexSeminumRecord2 = indexSeminum.findOne({
                $and: [{
                    _id: indexSeminumRecord._id
                }, {
                    years: {
                        $elemMatch: {
                            year: new Date(data.date).getFullYear()
                        }
                    }
                }]
            });

            if (indexSeminumRecord2) {
                indexSeminum.update({
                    $and: [{
                        _id: indexSeminumRecord._id
                    }, {
                        years: {
                            $elemMatch: {
                                year: new Date(data.date).getFullYear()
                            }
                        }
                    }]
                }, {
                    $inc: {
                        'years.$.quantity': data.quantity
                    }
                });
            } else {
                const years = {
                    year: new Date(data.date).getFullYear(),
                    quantity: data.quantity
                };

                indexSeminum.update({
                    _id: indexSeminumRecord._id
                }, {
                    $push: {
                        years: years
                    }
                });
            }
        } else {
            // create new record
            const record = {
                plant: {
                    id: plantRecord._id,
                    name: plantRecord.generalInformations.name,
                    division: plantRecord.generalInformations.division,
                    clade: plantRecord.generalInformations.clade,
                    family: plantRecord.generalInformations.family.name
                },
                years: [{
                    year: new Date(data.date).getFullYear(),
                    quantity: data.quantity
                }],
                createdAt: new Date(),
                editedAt: null
            };
            // insert new record to indexSeminum collection
            indexSeminum.insert(record);
        }
    },
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // - - -  - - - - - - - I M P O R T  M E T H O D S - - - - - - - - - - - - -
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Import Order
    importOrder: orderData => {
        const loggedUserRecord = Meteor.users.findOne(Meteor.userId());
        // For each record in orderData
        orderData.forEach(record => {
            record.name = formatOrderAndFamilyName(record.name);
            record.createdAt = new Date();
            record.editedAt = null;
            order.insert(record);

            logger.log('info', `User: ${loggedUserRecord.username} | Imported new record to order collection`);
        });
    },

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Import Family
    importFamily: familyData => {
        const loggedUserRecord = Meteor.users.findOne(Meteor.userId());
        // For each record in familyData
        familyData.forEach(record => {
            record.name = formatOrderAndFamilyName(record.name);
            record.createdAt = new Date();
            record.editedAt = null;
            family.insert(record);

            logger.log('info', `User: ${loggedUserRecord.username} | Imported new record to family collection`);
        });
    },

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Import Gardens
    importGardens: gardensData => {
        // for every garden data in gardensData array
        gardensData.forEach(record => {
            // Format garden data first
            formatGardenData(record).then(garden => {
                const query = formatQuery(garden);
                geocode(query).then(data => {
                    formatAddress(data).then(address => {
                        insertGardenToCollection(garden, address);
                    }, address => {
                        address = {
                            street: garden.street,
                            number: null,
                            postalCode: garden.postalCode,
                            city: garden.city,
                            country: garden.country
                        };

                        insertGardenToCollection(garden, address);
                    });
                }, error => {
                    console.log(error);
                });
            });
        });
    },
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Import Plants
    importPlants: plantsData => {
        const loggedUserRecord = Meteor.users.findOne(Meteor.userId());

        plantsData.forEach(record => {
            // GBIF API (http://www.gbif.org/developer/summary)
            let apiURL = encodeURI(`http://api.gbif.org/v1/species/match?name=${record.species}`);
            // api response variable
            let apiResponse = null;
            getAPIData(apiURL).then(response => {
                // if API found the plant
                if (response.data.matchType !== 'NONE' && response.data.rank !== 'GENUS') {
                    if (response.data.status === 'SYNONYM') {
                        apiURL = encodeURI(`http://api.gbif.org/v1/species/match?name=${response.data.species}`);
                        getAPIData(apiURL).then(response2 => {
                            if (response2.data.status === 'ACCEPTED') {
                                apiResponse = response2.data;
                            } else {
                                apiResponse = response.data;
                            }

                            // format plant data
                            formatPlantData(apiResponse, record).then(result => {
                                // format plant record
                                formatPlantRecord(result, record).then(plant => {
                                    // insert plant into collection
                                    plants.insert(plant);
                                    logger.log('info', `User: ${loggedUserRecord.username} | Imported new record to plants collection`);
                                });
                            });
                        });
                    } else {
                        // change api response variable to that response
                        apiResponse = response.data;

                        // format plant data
                        formatPlantData(apiResponse, record).then(result => {
                            // format plant record
                            formatPlantRecord(result, record).then(plant => {
                                // insert plant into collection
                                plants.insert(plant);
                                logger.log('info', `User: ${loggedUserRecord.username} | Imported new record to plants collection`);
                            });
                        });
                    }
                } else {
                    // format plant data
                    formatPlantData(apiResponse, record).then(result => {
                        // format plant record
                        formatPlantRecord(result, record).then(plant => {
                            // insert plant into collection
                            plants.insert(plant);
                            logger.log('info', `User: ${loggedUserRecord.username} | Imported new record to plants collection`);
                        });
                    });
                }
            }, error => {
                console.log(error);
                // if API returns an error, insert plant with data from old database
                formatPlantData(apiResponse, record).then(result => {
                    formatPlantRecord(result, record).then(plant => {
                        plants.insert(plant);
                        logger.log('info', `User: ${loggedUserRecord.username} | Imported new record to plants collection (GBIF API Error Occured)`);
                    });
                });
            });
        });
    },
    // Generate Order PDF
    generateOrderPDF: orderId => {
        const loggedUserRecord = Meteor.users.findOne(Meteor.userId());
        // Webshot package for taking screenshot of orderPDFPage
        const webshot = require('webshot');
        // Future instance
        const future = new Future();
        // File name
        const fileName = `Zamówienie_nr_${orderId}.pdf`;
        // Generate html strings
        const semantic = Assets.getText('semantic/semantic.css');

        // Compile layout template
        SSR.compileTemplate('layout', Assets.getText('order/layout.html'));

        // Helpers
        Template.layout.helpers({
            // Get DOCTYPE
            getDocType: () => {
                return "<!DOCTYPE html>";
            }
        });

        // Compile order template
        SSR.compileTemplate('order', Assets.getText('order/order.html'));

        // Order record
        const order = orders.findOne(orderId);
        // Ordered plants array
        let orderPlants = [];
        // Index of orders
        let index = 1;
        // For each seed order
        order.order.forEach(id => {
            let plant = indexSeminum.findOne(id);
            plant.index = index;
            orderPlants.push(plant);
            index++;
        });
        // Data passed to SSR rendering
        const data = {
            order,
            orderPlants,
            logoURL: Meteor.absoluteUrl('images/logo2.png'),
            cutURL: Meteor.absoluteUrl('images/cut.png'),
            generated: moment(new Date()).format('DD.MM.YYYY, HH:mm:ss'),
            ordered: moment(order.createdAt).format('DD.MM.YYYY, HH:mm:ss')
        };
        // Render HTML
        const htmlString = SSR.render('layout', {
            semantic,
            template: 'order',
            data
        });

        // Webshot options
        const options = {
            paperSize: {
                format: "Letter",
                orientation: 'portrait',
                margin: "1cm"
            },
            siteType: 'html'
        };

        // Commence webshot
        logger.log('info', `User: ${loggedUserRecord.username} | Generated PDF of order: ${order._id}`);
        webshot(htmlString, fileName, options, error => {
            fs.readFile(fileName, (error, data) => {
                if (error) {
                    logger.log('error', `User: ${loggedUserRecord.username} | Error while generating PDF of order: ${order._id} | ${error}`);
                    return false;
                }

                fs.unlinkSync(fileName);
                future.return(data);
            });
        });

        let pdfData = future.wait();
        let base64String = new Buffer(pdfData).toString('base64');

        return base64String;
    },
    // Generate Plant Label PDF
    generatePlantLabelPDF: plantId => {
        const loggedUserRecord = Meteor.users.findOne(Meteor.userId());
        // Webshot package for taking screenshot of orderPDFPage
        const webshot = require('webshot');
        // Future instance
        const future = new Future();
        // File name
        const fileName = `Tabliczka_nr_${plantId}.pdf`;
        // Generate html strings
        const semantic = Assets.getText('semantic/semantic.css');

        // Compile layout template
        SSR.compileTemplate('layout', Assets.getText('plant/layout.html'));

        // Helpers
        Template.layout.helpers({
            // Get DOCTYPE
            getDocType: () => {
                return "<!DOCTYPE html>";
            }
        });

        // Compile plant template
        SSR.compileTemplate('plant', Assets.getText('plant/label.html'));

        Template.plant.helpers({
            // Format plant type
            formatType: type => {
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
            }
        });

        // Plant record
        const plant = plants.findOne(plantId);

        // Data passed to SSR rendering
        const data = {
            plant,
            logoURL: Meteor.absoluteUrl('images/symbol.png')
        };
        // Render HTML
        const htmlString = SSR.render('layout', {
            semantic,
            template: 'plant',
            data
        });

        // Webshot options
        const options = {
            paperSize: {
                format: "Letter",
                orientation: 'portrait',
                margin: "1cm"
            },
            siteType: 'html'
        };

        // Commence webshot
        logger.log('info', `User: ${loggedUserRecord.username} | Generated label PDF of plant: ${plant._id}`);
        webshot(htmlString, fileName, options, error => {
            fs.readFile(fileName, (error, data) => {
                if (error) {
                    logger.log('error', `User: ${loggedUserRecord.username} | Error while generating label PDF of plant: ${plant._id} | ${error}`);
                    return false;
                }

                fs.unlinkSync(fileName);
                future.return(data);
            });
        });

        let pdfData = future.wait();
        let base64String = new Buffer(pdfData).toString('base64');

        return base64String;
    },
    // Generate PDF Report
    generateReport: (type, selector, sort, description) => {
        const loggedUserRecord = Meteor.users.findOne(Meteor.userId());
        // Webshot package for taking screenshot of orderPDFPage
        const webshot = require('webshot');
        // Future instance
        const future = new Future();
        // File name
        const fileName = `Raport_${type}.pdf`;
        // Generate html strings
        const semantic = Assets.getText('semantic/semantic.css');

        // Compile layout template
        SSR.compileTemplate('layout', Assets.getText('report/layout.html'));

        // Helpers
        Template.layout.helpers({
            // Get DOCTYPE
            getDocType: () => {
                return "<!DOCTYPE html>";
            }
        });

        // Compile plant template
        SSR.compileTemplate('report', Assets.getText('report/report.html'));

        // Helpers
        Template.report.helpers({
            // isType helper
            isType: (type, givenType) => {
                return type === givenType;
            },
            // Format date helper
            formatDate: date => {
                return date ? moment(date).format('DD.MM.YYYY') : 'Brak';
            },
            // Format date and time helper
            formatDateTime: date => {
                return date ? moment(date).format('DD.MM.YYYY, HH:mm:ss') : 'Brak';
            },
            // Format date to pretty string helper
            formatPrettyDate: date => {
                return moment(date).format('LL');
            },
            // Check if status is not null helper
            isNotNull: (status, givenStatus) => {
                status = stringToBoolean(status);
                switch (status) {
                    case null:
                        return status === givenStatus;
                    default:
                        return null;
                }
            },
            // Check if status is true helper
            isTrue: status => {
                return status ? 'Tak' : 'Nie';
            },
            // Format order status helper
            formatOrderStatus: orderStatus => {
                switch (orderStatus) {
                    case 'processing':
                        return "Przetwarzanie";
                    case 'preparing':
                        return "Przygotowywanie do wysyłki";
                    case 'sent':
                        return 'Wysłano';
                    default:
                        return "Nieznany status";
                }
            },
            // Format unit helper
            formatUnit: unit => {
                switch (unit) {
                    case 'piece':
                        return "Sztuk";
                    case 'weight':
                        return "Gramów";
                    default:
                        return "Nie określono";
                }
            },
            // Format usage helper
            formatUsage: usage => {
                switch (usage) {
                    case 'seminum':
                        return "Seminum";
                    case 'lab':
                        return "Laboratorium";
                    default:
                        return "Nie określono";
                }
            },
            // Format plant type helper
            formatType: type => {
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
            },
            // Format place in garden helper
            formatPlaceShorthand: place => {
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
            },
            // Format division helper
            formatDivision: division => {
                switch (division) {
                    case 'angiosperm':
                        return 'Okrytonasienne';
                    case 'gymnosperm':
                        return 'Nagonasienne';
                    default:
                        return null;
                }
            },
            // Format clade helper
            formatClade: clade => {
                switch (clade) {
                    case 'monocotyledon':
                        return 'Jednoliścienne';
                    case 'dicotyledon':
                        return 'Dwuliścienne';
                    default:
                        return null;
                }
            },
            // Format region of living helper
            formatRegionOfLiving: region => {
                switch (region) {
                    case 'africa':
                        return 'Afryka';
                    case 'northAfrica':
                        return 'Afryka - Północ';
                    case 'southAfrica':
                        return 'Afryka - Południe';
                    case 'eastAfrica':
                        return 'Afryka - Wschód';
                    case 'westAfrica':
                        return 'Afryka - Zachód';
                    case 'centralAfrica':
                        return 'Afryka - Centralna';
                    case 'asia':
                        return 'Azja';
                    case 'northAsia':
                        return 'Azja - Północ';
                    case 'southAsia':
                        return 'Azja - Południe';
                    case 'eastAsia':
                        return 'Azja - Wschód';
                    case 'westAsia':
                        return 'Azja - Zachód';
                    case 'centralAsia':
                        return 'Azja - Centralna';
                    case 'australia':
                        return 'Australia';
                    case 'northAustralia':
                        return 'Australia - Północ';
                    case 'southAustralia':
                        return 'Australia - Południe';
                    case 'eastAustralia':
                        return 'Australia - Wschód';
                    case 'westAustralia':
                        return 'Australia - Zachód';
                    case 'centralAustralia':
                        return 'Australia - Centralna';
                    case 'northAmerica':
                        return 'Ameryka Północna';
                    case 'northNorthAmerica':
                        return 'Ameryka Północna - Północ';
                    case 'southNorthAmerica':
                        return 'Ameryka Północna - Południe';
                    case 'eastNorthAmerica':
                        return 'Ameryka Północna - Wschód';
                    case 'westNorthAmerica':
                        return 'Ameryka Północna - Zachód';
                    case 'centralNorthAmerica':
                        return 'Ameryka Północna - Centralna';
                    case 'southAmerica':
                        return 'Ameryka Południowa';
                    case 'northSouthAmerica':
                        return 'Ameryka Południowa - Północ';
                    case 'southSouthAmerica':
                        return 'Ameryka Południowa - Południe';
                    case 'eastSouthAmerica':
                        return 'Ameryka Południowa - Wschód';
                    case 'westSouthAmerica':
                        return 'Ameryka Południowa - Zachód';
                    case 'centralSouthAmerica':
                        return 'Ameryka Południowa - Centralna';
                    case 'europe':
                        return 'Europa';
                    case 'northEurope':
                        return 'Europa - Północ';
                    case 'southEurope':
                        return 'Europa - Południe';
                    case 'eastEurope':
                        return 'Europa - Wschód';
                    case 'westEurope':
                        return 'Europa - Zachód';
                    case 'centralEurope':
                        return 'Europa - Centralna';
                    case 'atlanticOcean':
                        return 'Ocean Atlantycki';
                    case 'indianOcean':
                        return 'Ocean Indyjski';
                    case 'pacificOcean':
                        return 'Ocean Spokojny';
                    default:
                        return 'Nieznane miejsce';
                }
            },
            // Format type of protection helper
            formatTypeOfProtection: type => {
                switch (type) {
                    case 'fullProtection':
                        return 'Ochrona ścisła';
                    case 'partialProtection':
                        return 'Ochrona częściowa';
                    case 'noProtection':
                        return 'Brak ochrony';
                    default:
                        return null;
                }
            },
            // Format place in garden helper
            formatPlace: place => {
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
            },
            // Format import type helper
            formatImportType: type => {
                switch (type) {
                    case 'seeds':
                        return 'Nasiona';
                    case 'seedlings':
                        return 'Sadzonka';
                    default:
                        return null;
                }
            },
            // Get garden name with given id helper
            getGardenName: gardenId => {
                const garden = gardens.findOne(gardenId);

                return garden.name;
            },
            // Format user roles helper
            formatRoles: role => {
                switch (role) {
                    case 'admin':
                        return 'Admin';
                    case 'orders':
                        return 'Zamówienia';
                    case 'gardens':
                        return 'Ogrody';
                    case 'plants':
                        return 'Rośliny';
                    case 'seeds':
                        return 'Nasiona';
                    case 'news':
                        return 'News';
                    case 'gallery':
                        return 'Galeria';
                    default:
                        return false;
                }
            },
            // Format user status
            formatStatus: status => {
                switch (status) {
                    case true:
                        return 'Zatwierdzony';
                    case false:
                        return 'Niezatwierdzony';
                    default:
                        return false;
                }
            }
        });

        // Cursor data
        let cursor;
        let cursorCount;

        switch (type) {
            case 'Zamówienia':
                cursor = orders.find(selector, {sort: sort});
                cursorCount = orders.find(selector).count();
                break;
            case 'Rośliny':
                cursor = plants.find(selector, {sort: sort});
                cursorCount = plants.find(selector).count();
                break;
            case 'Nasiona':
                cursor = seeds.find(selector, {sort: sort});
                cursorCount = seeds.find(selector).count();
                break;
            case 'Ogrody botaniczne':
                cursor = gardens.find(selector, {sort: sort});
                cursorCount = gardens.find(selector).count();
                break;
            case 'News':
                cursor = news.find(selector, {sort: sort});
                cursorCount = news.find(selector).count();
                break;
            case 'Użytkownicy':
                cursor = Meteor.users.find(selector, {sort: sort});
                cursorCount = Meteor.users.find(selector).count();
                break;
            default:
                cursor = null;
                cursorCount = null;
        }

        // Data passed to SSR rendering
        const data = {
            cursor,
            cursorCount,
            type,
            description,
            generated: moment(new Date()).format('DD.MM.YYYY, HH:mm:ss')
        };
        // Render HTML
        const htmlString = SSR.render('layout', {
            semantic,
            template: 'report',
            data
        });

        // Webshot options
        const options = {
            paperSize: {
                format: "Letter",
                orientation: 'portrait',
                margin: "1cm"
            },
            siteType: 'html'
        };

        // Commence webshot
        logger.log('info', `User: ${loggedUserRecord.username} | Generated report PDF`);
        webshot(htmlString, fileName, options, error => {
            fs.readFile(fileName, (error, data) => {
                if (error) {
                    logger.log('error', `User: ${loggedUserRecord.username} | Error while generating report PDF | ${error}`);
                    return false;
                }

                fs.unlinkSync(fileName);
                future.return(data);
            });
        });

        let pdfData = future.wait();
        let base64String = new Buffer(pdfData).toString('base64');

        return base64String;
    }
});