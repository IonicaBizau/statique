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
  , "/test1/": {url: "/html/test1.html"}
  , "/test2": "/html/test2.html"
  , "/some/api": function (req, res) {
        res.end("Hello World!");
    }
  , "/buffer": function (req, res) {
        server.sendRes(res, 200, "text/plain", new Buffer("I am a buffer."));
    }
  , "/some/test1-alias": function (req, res) {
        server.serveRoute("/test1", req, res);
    }
  , "/method-test": {
        get: function (req, res) { res.end("GET"); }
      , post: function (req, res, form) {
            form.on("done", function (form) {
                console.log(form.data);
            });
            res.end();
        }
    }
  , "/crash": {
        get: function (req, res) { undefined.something; }
    }
  , "\/anynumber\-[0-9]": {
        type: "regexp"
      , handler: function (req, res) {
            res.end("Hi");
        }
    }
  , "r1": {
        type: "regexp"
      , regexp: /anyletter\-[a-z]/i
      , handler: function (req, res) {
            res.end("Case insensitive is important. ;)");
        }
    }
}).setErrors({
    404: "/html/errors/404.html"
  , 500: "/html/errors/500.html"
});

// create server
Http.createServer(server.serve).listen(8000);

// Output
console.log("Listening on 8000.");
