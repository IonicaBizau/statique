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
      , "/test2": "/html/test2.html"
      , "/some/api": function (req, res) {
            res.end("Hello World!");
        }
      , "/some/test1-alias": function (req, res) {
            Statique.serveRoute("/test1", req, res);
        }
      , "/method-test": {
            get: function (req, res) { res.end("GET"); }
          , post: function (req, res) { res.end("POST"); }
        }
    })
  ;
// create server
http.createServer(function(req, res) {
    if (req.url === "/500") {
        return Statique.sendRes(res, 500, "html", "This is supposed to be a 500 Internal server error page");
    }
    Statique.serve(req, res);
}).listen(8000);

// output
console.log("Listening on 8000.");
