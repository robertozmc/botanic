// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// GeoCoder
import {geoCoder} from '../../server/server.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Order and Family

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * Formats order and family names
 * @param {Object} string - initial order or family name.
 */
export const formatOrderAndFamilyName = string => {
    if (string.includes(",")) {
        let formatedString = "";
        let words = string.split(", ");

        words.forEach(word => {
            const formatedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

            if (formatedString === "") {
                formatedString = formatedWord;
            } else {
                formatedString += `, ${formatedWord}`;
            }
        });

        return formatedString;
    } else if (string.includes("(")) {
        let formatedString = "";
        let words = string.split(" (");

        words.forEach(word => {
            if (word.includes(")")) {
                word = word.replace(")", "");
            }

            const formatedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

            if (formatedString === "") {
                formatedString = formatedWord;
            } else {
                formatedString += ` (${formatedWord})`;
            }
        });

        return formatedString;
    } else {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Gardens

/**
* Format garden data
* @param {String} garden record
* @return {Promise} garden record
*/
export const formatGardenData = record => {
    return new Promise((resolve, reject) => {
        // Format name
        switch (record.id) {
            case '1':
                record.name = 'Pochodzenie nieznane';
                break;
            case '2':
                record.name = 'Natura';
                break;
            case '233':
                record.name = "Kolekcja prywatna";
                break;
            case '237':
                record.name = "Sklep";
                break;
            default:
                break;
        }

        if (!record.name) {
            record.name = null;
        }

        // Format subname
        if (!record.subname) {
            record.subname = null;
        }

        // Format street
        if (record.street) {
            if (record.street.includes('ul.')) {
                record.street = record.street.replace('ul. ', '');
            }
        } else {
            record.street = null;
        }

        // Format postal code
        if (!record.postalCode) {
            record.postalCode = null;
        }

        // Format city
        if (!record.city) {
            record.city = null;
        }

        // Format country
        if (!record.country) {
            record.country = null;
        }

        // Format phone
        if (!record.phone) {
            record.phone = null;
        }

        // Format fax
        if (!record.fax) {
            record.fax = null;
        }

        // Format email
        if (!record.email) {
            record.email = null;
        }

        // Format website
        if (!record.website) {
            record.website = null;
        }

        // Format representative
        if (!record.representative) {
            record.representative = null;
        }

        resolve(record);
    });
};

/**
* Format geocoding query
* @param {String} record
* @return {String} query
*/
export const formatQuery = record => {
    // Geocode query
    let query = '';
    // Don't search for these records
    if (record.id === '1' || record.id === '2' || record.id === '233' || record.id === '237') {
        return '';
    }
    // Add garden name to query string
    if (record.name !== null) {
        query = query.concat(`${record.name} `);
    }
    // Add garden street to query string
    if (record.street !== null) {
        query = query.concat(`${record.street} `);
    }
    // Add garden postal code to query string
    if (record.postalCode !== null) {
        query = query.concat(`${record.postalCode} `);
    }
    // Add garden city to query string
    if (record.city !== null) {
        query = query.concat(`${record.city} `);
    }
    // Add garden country to query string
    if (record.country !== null) {
        query = query.concat(`${record.country}`);
    }

    return query;
};

/**
* Geocoding address
* @param {String} address
* @return {Promise} data
*/
export const geocode = address => {
    return new Promise((resolve, reject) => {
        if (address !== '') {
            geoCoder.geocode(address, (error, data) => {
                if (error) {
                    Meteor.setTimeout(function() {
                        geoCoder.geocode(address, (error, data) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(data);
                            }
                        });
                    }, 1000);
                } else {
                    resolve(data);
                }
            });
        } else {
            resolve([]);
        }
    });
};

/**
* Format garden address
* @param {String} record
* @return {Promise} address
*/
export const formatAddress = data => {
    return new Promise((resolve, reject) => {
        if (data[0]) {
            // if geocode did found the place
            address = {
                street: data[0].streetName ? data[0].streetName : null,
                number: data[0].streetNumber ? data[0].streetNumber : null,
                postalCode: data[0].zipcode ? data[0].zipcode : null,
                city: data[0].city ? data[0].city : null,
                country: data[0].country ? data[0].country : null
            };
            resolve(address);
        } else {
            reject({});
        }
    });
};

/**
* Inserting garden record to gardens collection
* @param {Object} record
* @param {String} streetAndNumber
*/
export const insertGardenToCollection = (record, address) => {
    const loggedUserRecord = Meteor.users.findOne(Meteor.userId());

    let gardenData = {
        id: record.id,
        name: record.name,
        subname: record.subname,
        address: {
            street: address.street,
            number: address.number,
            postalCode: address.postalCode,
            city: address.city,
            country: address.country
        },
        contact: {
            phone: record.phone,
            fax: record.fax,
            email: isValidEmail(record.email) ? record.email : null,
            website: isValidURL(record.website) ? record.website : null
        },
        representative: record.representative,
        createdAt: new Date(),
        editedAt: null
    };

    gardens.insert(gardenData);

    logger.log('info', `User: ${loggedUserRecord.username} | Imported new record to gardens collection`);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Plants

export const getAPIData = url => {
    return new Promise((resolve, reject) => {
        try {
            const result = HTTP.get(url);

            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
};

export const formatPlantData = (response, record) => {
    return new Promise((resolve, reject) => {

        let plantData = {};
        let place = [];

        // if API found the plant
        if (response !== null) {
            plantData.genus = getGenus(response.scientificName);
            plantData.species = getSpecies(response.scientificName);
            plantData.variety = getVariety(response.scientificName);
            plantData.subspieces = getSubspecies(response.scientificName);
            plantData.hybrid = false;

            if (response.scientificName.includes('var.')) {
                // authorship when variety
                plantData.authorship = getAuthorship('variety', response.scientificName);
            } else if (response.scientificName.includes('subsp.')) {
                // authorship when subspecies
                plantData.authorship = getAuthorship('subspecies', response.scientificName);
            } else {
                if (response.scientificName.includes('×')) {
                    // set hybrid to true
                    plantData.hybrid = true;
                    // authorship when hybrid
                    plantData.authorship = getAuthorship('hybrid', response.scientificName);
                } else {
                    // authorship when normal
                    plantData.authorship = getAuthorship('normal', response.scientificName);
                }
            }

            plantData.order = getOrder(response.order, record.order);
            plantData.family = getFamily(response.family, record.family);
        } else {
            // if API not found the plant
            plantData.genus = null;
            plantData.species = null;
            plantData.variety = null;
            plantData.subspieces = null;
            plantData.hybrid = null;

            plantData.order = getOrder(null, record.order);
            plantData.family = getFamily(null, record.family);
        }

        plantData.cultivar = getCultivar(record.species);

        if (isTrue(record.angiosperm)) {
            plantData.division = 'angiosperm';
        } else if (isTrue(record.gymnosperm)) {
            plantData.division = 'gymnosperm';
        } else {
            plantData.division = null;
        }

        if (isTrue(record.monocotyledon)) {
            plantData.clade = 'monocotyledon';
        } else if (isTrue(record.dicotyledon)) {
            plantData.clade = 'dicotyledon';
        } else {
            plantData.clade = null;
        }

        if (isTrue(record.partialProtection)) {
            plantData.typeOfProtection = 'partialProtection';
        } else if (isTrue(record.fullProtection)) {
            plantData.typeOfProtection = 'fullProtection';
        } else {
            plantData.typeOfProtection = 'noProtection';
        }

        if (isTrue(record.greenhouse)) {
            place.push('greenhouse');
        }

        if (isTrue(record.decorativeDepartment)) {
            place.push('decorativeDepartment');
        }

        if (isTrue(record.arboretum)) {
            place.push('arboretum');
        }

        if (isTrue(record.moor)) {
            place.push('moor');
        }

        if (isTrue(record.systematics)) {
            place.push('systematics');
        }

        if (isTrue(record.dune)) {
            place.push('dune');
        }

        if (isTrue(record.pharmacognosy)) {
            place.push('pharmacognosy');
        }

        plantData.place = place;

        if (isTrue(record.importSeedlings)) {
            plantData.importType = 'seedling';
        } else if (isTrue(record.importSeeds)) {
            plantData.importType = 'seeds';
        } else {
            plantData.importType = null;
        }

        plantData.continent = getContinent(record.continent);

        // resolve
        resolve(plantData);
    });
};

export const formatPlantRecord = (result, record) => {
    return new Promise((resolve, reject) => {
        const plant = {
            id: record.id ? record.id : null,
            id1: record.id1 ? record.id1 : null,
            catalogNumber: record.catalogNumber ? record.catalogNumber : null,
            generalInformations: {
                name: {
                    genus: result.genus,
                    species: result.species,
                    subspecies: result.subspieces,
                    cultivar: result.cultivar,
                    variety: result.variety,
                    authorship: result.authorship,
                    hybrid: result.hybrid
                },
                oldName: record.species ? record.species : null,
                namePL: record.namePL ? record.namePL : null,
                division: result.division,
                clade: result.clade,
                order: result.order,
                family: result.family,
                type: getType(record.type),
                regionOfLiving: {
                    continent: result.continent,
                    description: record.continent ? record.continent : null
                },
                habitat: record.habitat ? record.habitat : null,
                typeOfProtection: result.typeOfProtection,
                // endangered: no record with that field
                endangered: isTrue(record.endangered),
                rawMaterial: record.rawMaterial ? record.rawMaterial : null,
                // abilityToSow: no record with that field
                abilityToSow: record.abilityToSow ? parseInt(record.abilityToSow) : null,
                // abilityToPropagate: no record with that field
                abilityToPropagate: record.abilityToPropagate ? parseInt(record.abilityToPropagate) : null
            },
            gardenInformations: {
                place: result.place,
                quantity: record.quantity ? parseInt(record.quantity) : null,
                importType: result.importType,
                importYear: getImportYear(record.importYear),
                importGarden: getImportGarden(record.importGarden),
                researchAtPharmacy: isTrue(record.researchAtPharmacy),
                herbarium: isTrue(record.herbarium),
                confirmed: isTrue(record.confirmed),
            },
            characteristic: {
                pharmacopoeial: isTrue(record.pharmacopoeial),
                medicinal: isTrue(record.medicinal),
                poisonous: isTrue(record.poisonous),
                edible: isTrue(record.edible),
                spice: isTrue(record.spice),
                appropriable: isTrue(record.appropriable),
                ornamental: isTrue(record.ornamental),
                bulb: isTrue(record.bulb),
                evergreen: isTrue(record.evergreen),
            },
            note: record.note ? record.note : null,
            createdAt: new Date(),
            editedAt: null,
            state: [
                {
                    quantity: record.quantity ? parseInt(record.quantity) : null,
                    date: new Date()
                }
            ]
        };

        resolve(plant);
    });
};

// TODO: make it use with edit plants
// export const getPlantName = string => {
//     return new Promise((resolve, reject) => {
//         if (string !== null) {
//             const genus = getGenus(string);
//             const species = getSpecies(string);
//             const variety = getVariety(string);
//             const subspecies = getSubspecies(string);
//             let authorship;
//             let hybrid = false;
//
//             if (string.includes('var.')) {
//                 // authorship when variety
//                 authorship = getAuthorship('variety', string);
//             } else if (string.includes('subsp.')) {
//                 // authorship when subspecies
//                 authorship = getAuthorship('subspecies', string);
//             } else {
//                 if (string.includes('×')) {
//                     // set hybrid to true
//                     hybrid = true;
//                     // authorship when hybrid
//                     authorship = getAuthorship('hybrid', string);
//                 } else {
//                     // authorship when normal
//                     authorship = getAuthorship('normal', string);
//                 }
//             }
//
//             resolve({
//                 genus,
//                 species,
//                 variety,
//                 subspecies,
//                 authorship,
//                 hybrid
//             });
//         } else {
//             resolve(null);
//         }
//     });
// };

/**
* Getting plant genus from string
* @param {String} string
* @return {String} genus
*/
const getGenus = string => {
    let genus = string.split(' ');
    genus = genus[0].replace('×', '');
    return genus;
};

/**
* Getting plant species from string
* @param {String} string
* @return {String} species
*/
const getSpecies = string => {
    let species = string.split(' ');
    species = species[1].replace('×', '');
    return species;
};

/**
* Getting plant variety from string
* @param {String} string
* @return {String} variety
*/
const getVariety = string => {
    if (string.includes('var.')) {
        const position = string.indexOf('var.');
        string = string.slice(position);
        const variety = string.split(' ');

        return variety[1];
    } else {
        return null;
    }
};

/**
* Getting plant subspecies from string
* @param {String} string
* @return {String} subspecies
*/
const getSubspecies = string => {
    let position;
    let subspecies;

    if (string.includes('ssp.')) {
        position = string.indexOf('ssp.');
        string = string.slice(position);
        subspecies = string.split(' ');

        return subspecies[1];
    } else if (string.includes('subsp.'))  {
        position = string.indexOf('subsp.');
        string = string.slice(position);
        subspecies = string.split(' ');

        return subspecies[1];
    } else {
        return null;
    }
};

/**
* Getting plant cultivar from string
* @param {String} string
* @return {String} cultivar
*/
const getCultivar = string => {
    if (string.includes("'")) {
        const cultivar = string.split("'");

        return cultivar[1];
    } else {
        return null;
    }
};

/**
* Getting plant authorship from string
* @param {String} type
* @param {String} string
* @return {String} authorship
*/
const getAuthorship = (type, string) => {

    let genusAndSpecies;
    let position;

    switch (type) {
        case 'normal':
            genusAndSpecies = string.split(' ');
            genusAndSpecies = `${genusAndSpecies[0]} ${genusAndSpecies[1]} `;
            return string.replace(genusAndSpecies, '');
        case 'variety':
            position = string.indexOf('var.');
            string = string.slice(position);
            let variety = string.split(' ');
            variety = `${variety[0]} ${variety[1]} `;

            return string.replace(variety, '');
        case 'subspecies':
            position = string.indexOf('subsp.');
            string = string.slice(position);
            let subspecies = string.split(' ');
            subspecies = `${subspecies[0]} ${subspecies[1]} `;

            return string.replace(subspecies, '');
        case 'hybrid':
            genusAndSpecies = string.split(' ');
            genusAndSpecies = `${genusAndSpecies[0]} ${genusAndSpecies[1]} `;
            return string.replace(genusAndSpecies, '');
        default:
            return null;
    }
};

/**
* Getting plant order
* @param {String} orderFromApi
* @param {String} orderId
* @return {String} order
*/
const getOrder = (orderFromApi, orderId) => {
    // order record searched with order id from old database
    let orderRecord = order.findOne({id: orderId}, {fields: {name: 1}});

    if (orderRecord && (orderRecord.name === orderFromApi || orderFromApi === null)) {
        // returns order from old database
        return {
            id: orderRecord._id,
            name: orderRecord.name
        };
    } else {
        if (!orderRecord && orderFromApi === null) {
            return {
                id: null,
                name: null
            };
        } else {
            // search for order record with the same name as order from api
            orderRecord = order.findOne({name: orderFromApi}, {fields: {name: 1}});
            // if order with that name exists
            if (orderRecord) {
                // return this order
                return {
                    id: orderRecord._id,
                    name: orderRecord.name
                };
            } else {
                // if order with that name not exists
                // insert this order into collection
                const orderId = order.insert({
                    name: orderFromApi,
                    createdAt: new Date(),
                    editedAt: null
                });
                // and return it
                return {
                    id: orderId,
                    name: orderFromApi
                };
            }
        }
    }
};

/**
* Getting plant family
* @param {String} familyFromApi
* @param {String} familyId
* @return {String} family
*/
const getFamily = (familyFromApi, familyId) => {
    // family record searched with family id from old database
    let familyRecord = family.findOne({id: familyId}, {fields: {name: 1}});

    // if family from old database equals family from api
    if (familyRecord && (familyFromApi === familyRecord.name || familyFromApi === null)) {
        // returns family from old database
        return {
            id: familyRecord._id,
            name: familyRecord.name
        };
    } else {
        if (!familyRecord && familyFromApi === null) {
            return {
                id: null,
                name: null
            };
        } else {
            // if family from old database not equals family from api
            // search for family record with the same name as family from api
            familyRecord = family.findOne({name: familyFromApi}, {fields: {name: 1}});

            // if family with that name exists
            if (familyRecord) {
                // return this family
                return {
                    id: familyRecord._id,
                    name: familyRecord.name
                };
            } else {
                // if family with that name not exists
                // insert this family into collection
                const familyId = family.insert({
                    name: familyFromApi,
                    createdAt: new Date(),
                    editedAt: null
                });
                // and return it
                return {
                    id: familyId,
                    name: familyFromApi
                };
            }
        }
    }
};

/**
* Getting plant type from string
* @param {String} type
* @return {String} type
*/
const getType = type => {
    switch (type) {
        case '1':
            return 'tree';
        case '2':
            return 'shrub';
        case '3':
            return 'littleShrub';
        case '4':
            return 'perennialVine';
        case '5':
            return 'perennial';
        case '6':
            return 'biennial';
        case '7':
            return 'annual';
        case '8':
            return 'annualVine';
        default:
            return null;
    }
};

/**
* Getting plant import year from string
* @param {String} importYear
* @return {Integer} importYear
*/
const getImportYear = importYear => {
    if (importYear === '' || importYear === '0' || importYear === null || importYear === undefined || importYear.length !== 4) {
        return null;
    } else {
        return parseInt(importYear);
    }
};

/**
* Getting plant import garden id
* @param {String} importGarden
* @return {Integer} importGarden
*/
const getImportGarden = importGarden => {
    if (importGarden) {
        const gardenRecord = gardens.findOne({id: importGarden});

        return gardenRecord._id;
    } else {
        return null;
    }
};

/**
* Getting continent from string
* @param {String} string
* @return {Array} continent
*/
const getContinent = string => {
    let continent = [];

    const africa = /afry/gi;
    const asia = /azj/gi;
    const australia = /austral/gi;
    const northAmerica = /(?=.*amery)(?=.*pół)/gi;
    const southAmerica = /(?=.*amery)(?=.*poł)/gi;
    const europe = /europ/gi;
    const atlanticOcean = /(?=.*ocean)(?=.*atlant)/gi;
    const indianOcean = /(?=.*ocean)(?=.*indyj)/gi;
    const pacificOcean = /(?=.*ocean)(?=.*spoko)/gi;

    // Africa
    if (africa.test(string)) {
        continent.push('africa');
    }
    // Asia
    if (asia.test(string)) {
        continent.push('asia');
    }
    // Australia
    if (australia.test(string)) {
        continent.push('australia');
    }
    // North America
    if (northAmerica.test(string)) {
        continent.push('northAmerica');
    }
    // South America
    if (southAmerica.test(string)) {
        continent.push('southAmerica');
    }
    // Europe
    if (europe.test(string)) {
        continent.push('europe');
    }
    // Atlantic Ocean
    if (atlanticOcean.test(string)) {
        continent.push('atlanticOcean');
    }
    // Indian Ocean
    if (indianOcean.test(string)) {
        continent.push('indianOcean');
    }
    // Pacific Ocean
    if (pacificOcean.test(string)) {
        continent.push('pacificOcean');
    }

    return continent;
};

// isTrue
const isTrue = value => {
    if (value === '0') {
        return false;
    } else if (value === '1' || value === 'sz') {
        return true;
    } else {
        return null;
    }
};