var auth = require('./auth'),
	controllers = require('../app/controllers');

module.exports = function(app) {
	app.get('/register', controllers.users.getRegister);
	app.post('/register', controllers.users.postRegister);

	app.get('/login', controllers.users.getLogin);
	app.post('/login', auth.login);
	app.get('/logout', auth.logout);

	app.get('/profile', auth.isAuthenticated, controllers.users.getProfile);
	app.get('/password', auth.isAuthenticated, controllers.users.getPassword);
	app.post('/password', auth.isAuthenticated, controllers.users.postPassword);

	app.get('/hostTest', auth.isAuthenticated, controllers.tests.getHostTest);
	app.post('/hostTest', auth.isAuthenticated, controllers.tests.postHostTest);

	app.get('/tests', auth.isAuthenticated, controllers.tests.getOpenAndFutureTests);
	app.get('/pastTests', auth.isAuthenticated, controllers.tests.getPastTests);
	app.post('/pastTests', auth.isAuthenticated, controllers.tests.joinTest);
	app.post('/tests', auth.isAuthenticated, controllers.tests.joinTest);

	app.get('/tests/:id', auth.isAuthenticated, controllers.tests.getTestSubmittion);
	app.post('/tests/:id', auth.isAuthenticated, controllers.tests.postTestSubmittion);

	app.get('/', function(req, res) {
		res.render('index');
	});

	app.get('*', function(req, res) {
		res.render('index');
	});
};