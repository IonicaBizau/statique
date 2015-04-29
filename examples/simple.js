// Dependencies
var Statique = require("../lib/index")
  , Http = require('http')
  ;

// Create *Le Statique* server
var server = new Statique({
    root: __dirname + "/public"
  , cache: 36000
}).setRoutes({
    "/": "/html/index.html"
});

// Create server
Http.createServer(server.serve).listen(8000, function (err) {
    if (err) { throw err; }
    console.log("Listening on 8000.");
});
