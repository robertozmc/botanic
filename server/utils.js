// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - S E R V E R   U T I L S - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import {logger} from '../server/server.js';

// Overide of Meteor functions

// Function that specify action when creating an user
Accounts.onCreateUser((options, user) => {
    user.name = options.name;

    return user;
});

// Function that changes behaviour of validation of login attempts
Accounts.validateLoginAttempt(attemptInfo => {
    if (attemptInfo.type == 'resume') return true;

    if (attemptInfo.methodName == 'createUser') return false;

    if (attemptInfo.methodName == 'login' && attemptInfo.allowed && attemptInfo.user.username != 'admin') {
        let verified = false;

        attemptInfo.user.emails.forEach((value, index) => {
            if (value.verified) {
                verified = true;
            }
        });

        if (!verified) {
            throw new Meteor.Error(403, 'Waiting for acceptation');
        }
    }

    if (attemptInfo.methodName == 'login' && attemptInfo.allowed && attemptInfo.user.username == 'admin') {
        return true;
    }

    return true;
});

export const adminAccountCreation = () => {
    const admin = Meteor.users.find({username: 'admin'}).count();

    if (!admin) {
        const id = Accounts.createUser({
            username: 'admin',
            password: 'password'
        });

        Roles.addUsersToRoles(id, 'admin');

        logger.log('info', 'Automatic admin account created');
    }
};

export const stringToBoolean = string => {
    let value;

    if (string === 'true') {
        value = true;
    } else if (string === 'false') {
        value = false;
    } else {
        value = null;
    }

    return value;
};