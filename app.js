var express = require('express'),
  config = require('./config/config'),
  glob = require('glob');


var app = express();

// TO CHECK WHAT IS IN OBJECTS
// app.post('/',function name(req,res,next) {
//     req.body
// })

require('./config/express')(app, config);
require('./config/mongoose')(config);
require('./config/passport')();
require('./config/routes')(app);
require('./config/errors')(app);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

