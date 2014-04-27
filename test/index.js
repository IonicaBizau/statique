// require Johnny's static
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

    // safe serve
    if (Statique.exists(req, res)) {

        // serve file
        Statique.sendRes (req, res, function (err) {

            // not found error
            if (err.code === "ENOENT") {

                // write head
                res.writeHead(404, {"Content-Type": "text/html"});

                // send response
                res.end("404 - Not found.");

                // return
                return;
            }

            // other error
            res.end(JSON.stringify(err));
        });

        // return
        return;
    }

    // if the route doesn't exist, it's a 404!
    res.end("404 - Not found");

}).listen(8000);

// output
console.log("Listening on 8000.");
