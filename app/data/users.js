var User = require('mongoose').model('User');

module.exports = {
    create: function(user, callback) {
        User.create(user, callback);
    },
    update: function(conditions, update, options, callback) {
        User.update(conditions, update, options, callback);
    },
    findByUsername: function(username, callback) {
        User.findOne({username: username}, callback);
    }
};