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

        if (url.slice (-1) === "/") {
            url = url.substring (0, url.length - 1);
        }

        return Statique._routes[url] || Statique._routes[url + "/"] || null;
    }
  , exists: function (req, res) {
        return Boolean (Statique.getRoute(Url.parse(req.url).pathname));
    }
  , readFile: function (file, callback) {
        return Fs.readFile (Statique._root + file, function (err, buffer) {
            if (err) { return callback (err); }
            callback (null, buffer.toString())
        });
    }
  , serve: function (req, res) {

        var parsedUrl = Url.parse (req.url)
          , route = Statique.getRoute (parsedUrl.pathname) || parsedUrl.pathname
          , stats = null
          , fileName = Statique._root + route
          ;

        try {
            stats = Fs.lstatSync (fileName);
        } catch (e) {
            Statique.sendRes (res, 404, "html", "404 - Not found");
            return;
        }

        if (stats.isFile()) {
            Statique.sendRes(res, 200, MIME_TYPES[Path.extname(route).substring(1)]);
            var fileStream = Fs.createReadStream(fileName);
            fileStream.pipe(res);
        }
    }
  , sendRes: function (res, statusCode, mimeType, content) {

        res.writeHead(statusCode, {
            "Content-Type": mimeType || "plain/text"
          , "Server": "Statique Server"
        });

        if (typeof content === "string") {
            res.end (content);
        }
    }
};

// export the module
module.exports = Statique;
