// require statique
var Statique = require("../index")

    // require http
  , http = require('http')
  ;

// set static server: public folder
Statique.server({root: __dirname + "/public"});

// set routes
Statique.setRoutes({
    "/":       "/html/index.html"
  , "/test1/": "/html/test1.html"
  , "/test2/": "/html/test2.html"
});

// create http server
http.createServer(function(req, res) {

    // serve file
    Statique.sendRes (req, res);

}).listen(8000);

// output
console.log("Listening on 8000.");
