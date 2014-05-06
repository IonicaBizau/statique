// dependencies
var Statique = require("../index")
  , http = require('http')
  ;

// statique config
Statique
    .server({root: __dirname + "/public"})
    .setRoutes({
        "/":       "/html/index.html"
      , "/test1/": {url: "/html/test1.html"}
      , "/test2/": "/html/test2.html"
    })
  ;

// create server
http.createServer(function(req, res) {
    if (req.url === "/500") {
        return Statique.sendRes (res, 500, "html", "This is supposed to be a 500 Internal server error page");
    }
    Statique.serve (req, res);
}).listen(8000);

// output
console.log("Listening on 8000.");
