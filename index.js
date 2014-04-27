var Url = require ("url")
  , Fs  = require ("fs")
  , Path = require("path")
  ;

const MIME_TYPES = {
    "html": "text/html"
  , "jpeg": "image/jpeg"
  , "jpg":  "image/jpeg"
  , "png":  "image/png"
  , "js":   "text/javascript"
  , "css":  "text/css"
};

var Statique = {
    server: function (options) {
        if (typeof options === "string") {
            options = {
                root: options
            }
        }
        if (options.root.slice (-1) !== "/") {
            options.root += "/";
        }

        Statique._root = options.root;
        return Statique;
    }
  , setRoutes: function (routes) {
        Statique._routes = routes;
        return Statique;
    }
  , getRoute: function (url) {
        return Statique._routes[url] || Statique._routes[url + "/"] || null;
    }
  , exists: function (req, res) {
        return Boolean (Statique.getRoute(Url.parse(req.url).pathname));
    }
  , readFile: function (file, callback) {
        return fs.readFile (Statique._root + file, function (err, buffer) {
            if (err) { return callback (err); }
            callback (null, buffer.toString())
        });
    }
  , sendRes: function (req, res) {

        var parsedUrl = Url.parse (req.url)
          , route = Statique.getRoute (parsedUrl.pathname)
          , stats = null
          , fileName = Statique._root + route
          ;

        try {
            stats = Fs.lstatSync (fileName);
        } catch (e) {
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.end("404 Not found");
            return;
        }

        if (stats.isFile()) {
            res.writeHead(200, {
                "Content-Type": MIME_TYPES[Path.extname(route)] || MIME_TYPES["html"]
              , "Server": "Statique Server"
            });

            var fileStream = Fs.createReadStream(fileName);
            fileStream.pipe(res);
        }
    }
};

// export the module
module.exports = Statique;
