var auth = require('./auth'),
    controllers = require('../app/controllers');

module.exports = function(app) {
    app.get('/register', controllers.users.getRegister);
    app.post('/register', controllers.users.postRegister);
    
    app.get('/', function(req, res) {
        console.log("-------------------GET ROUTE /");
        res.render('index');
    });

    app.get('*', function(req, res) {
        res.render('index');
    });
};