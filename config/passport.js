const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./databaseLocal');
const LocalUser = connection.models.LocalUser;
const validPassword = require('../lib/passwordUtils').validPassword;

const customFields = {
    usernameField: 'username',
    passwordField: 'password'
};

const verifyCallback = (username, password, done) => {

    LocalUser.findOne({ username: username })
        .then((user) => {

            if (!user) { 
                return done(null, false) 
            }
            
            const isValid = validPassword(password, user.hash, user.salt);
            
            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {   
            done(err);
        });

}

const strategy  = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    LocalUser.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});

