// Dependencies
var Statique = require("../index")
  , Http = require('http')
  ;

// Create *Le Statique* server
var server = new Statique({
    root: __dirname + "/public"
  , cache: 36000
}).setRoutes({
    "/": "/html/index.html"
});

// create server
Http.createServer(server.serve).listen(8000);

// Output
console.log("Listening on 8000.");
