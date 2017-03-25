// -----------------------------------------------------------------------------
// - - - - - - - - - - - - - - - I M P O R T S - - - - - - - - - - - - - - - - -
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Admin account creation function
import {adminAccountCreation} from '../server/utils.js';

const winston = require('winston');
const winstonPapertrail = require('winston-papertrail').Papertrail;

const Papertrail = new winstonPapertrail({
    host: Meteor.settings.private.papertrail.host,
    port: Meteor.settings.private.papertrail.port,
    program: Meteor.settings.private.papertrail.program,
    level: Meteor.settings.private.papertrail.level
});

Papertrail.on('error', err => {
    // Handle, report, or silently ignore connection errors and failures
});

export const logger = new winston.Logger({
    transports: [Papertrail]
});

export const geoCoder = new GeoCoder({
    httpAdapter: 'https',
    apiKey: Meteor.settings.private.api.googleAPI
});

// code to run on server at startup
Meteor.startup(() => {
    // create admin account if there is not one
    adminAccountCreation();
});