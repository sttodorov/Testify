var mongoose = require('mongoose');
  
module.exports = function(config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;

    db.once('open', function(err) {
        if (err) {
            console.log('Database could not be opened: ' + err);
            return;
        }
        console.log('Database up and running...')
    });
        
    db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
    });

    require('../app/data/models/user').init();
    require('../app/data/models/question').init();
    require('../app/data/models/test').init();
    require('../app/data/models/questionEntry').init();
    require('../app/data/models/testEntry').init();
};
