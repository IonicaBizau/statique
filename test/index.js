// require Johnny's static
var JohhnysStatic = require("../index"),
    http = require('http');

// set static server: public folder
JohhnysStatic.setStaticServer({root: "./public"});

// set routes
JohhnysStatic.setRoutes({
    "/":       { "url": __dirname + "/html/indexaaaa.html" },
    "/test1/": { "url": __dirname + "/html/test1.html" },
    "/test2/": { "url": __dirname + "/html/test2.html" }
});

// create http server
http.createServer(function(req, res) {
    // safe serve
    if (JohhnysStatic.exists(req, res)) {
        // serve file
        JohhnysStatic.serve(req, res, function (err) {

            // not found error
            if (err.code === "ENOENT") {
                res.writeHead(404, {"Content-Type": "text/html"});
                res.end("404 - Not found.");
                return;
            }

            // other error
            res.end(JSON.stringify(err));
        });
        return;
    }

    // if the route doesn't exist, it's a 404!
    res.end("404 - Not found");
}).listen(8000);
