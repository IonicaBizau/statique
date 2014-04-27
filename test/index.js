// dependencies
var Statique = require("../index")
  , http = require('http')
  ;

// statique config
Statique
    .server({root: __dirname + "/public"})
    .setRoutes({
        "/":       "/html/index.html"
      , "/test1/": "/html/test1.html"
      , "/test2/": "/html/test2.html"
    })
  ;

// create server
http.createServer(function(req, res) {
    Statique.sendRes (req, res);
}).listen(8000);

// output
console.log("Listening on 8000.");
