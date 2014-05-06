// Dependencies
var Url = require ("url")
  , Fs  = require ("fs")
  , Path = require("path")
  ;

// MIME types
const MIME_TYPES = {
    "html": "text/html"
  , "jpeg": "image/jpeg"
  , "jpg":  "image/jpeg"
  , "png":  "image/png"
  , "js":   "text/javascript"
  , "css":  "text/css"
};

/**
 *  Le Statique
 *  -----------
 *  A node-static minimalist alternative.
 *  Licensed under the MIT license. See the LICENSE file.
 *
 *
 *  Documentation can be found in README and on GitHub:
 *  http://github.com/IonicaBizau/node-statique
 */
var Statique = module.exports = {};

/**
 * Statique.server
 * Sets the root of the public folder.
 *
 * @param options: an object containing the following fields:
 *  - root: string representing the absolute path to the public folder.
 * @return: Statique object
 */
Statique.server: function (options) {
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
};

/**
 * setRoutes
 * Sets the routes of the website.
 *
 * @param routes: an object containing fields and values in the following format:
 *  {
 *      "/":       "/html/index.html"
 *    , "/foo/":   { url: "/html/foo.html" }
 *    , "/another-foo": "/html/myfoo.html"
 *  }
 *
 * @return: Statique object
 */
Statique.setRoutes: function (routes) {
    Statique._routes = routes;
    return Statique;
};

/**
 * getRoute
 * Gets the route by providing an @url
 *
 * @param url: a string representing the url of the page that must be served
 * @return: the route to the HTML page
 */
Statique.getRoute: function (url) {

    if (url.slice (-1) === "/") {
        url = url.substring (0, url.length - 1);
    }

    var route = Statique._routes[url] || Statique._routes[url + "/"] || null;
    if (route && route.constructor.name === "Object" && route.url) {
        route = route.url;
    }

    return route;
};

/**
 * exists
 * Checks if the url exists in the routes object
 *
 * @param req: the request object
 * @param res: the response object
 * @return: true, if the route was found, else false
 */
Statique.exists: function (req, res) {
    return Boolean (Statique.getRoute(Url.parse(req.url).pathname));
};

/**
 * readFile
 * Reads a file from the public folder
 *
 * @param file: the relative path to the file
 * @param callback: the callback function that will be called with an err
 * (first argument) and the content of the file (second argument)
 * @return
 */
Statique.readFile: function (file, callback) {
    return Fs.readFile (Statique._root + file, function (err, buffer) {
        if (err) { return callback (err); }
        callback (null, buffer.toString())
    });
};

/**
 * serve
 * Serves the HTML file according by providing the @req and @res parameters
 *
 * @param req: the request object
 * @param res: the response object
 * @return undefined
 */
Statique.serve: function (req, res) {

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
};

/**
 * sendRes
 * This function is used for sending custom status messages and content
 * If the @content parameter is not provided or is not a string, the response
 * will not be ended. The status code and the headers will be set
 *
 * @param res: the response object
 * @param statusCode: the status code (integer)
 * @param mimeType: the mime type
 * @param content: optional s
 * @return
 */
Statique.sendRes: function (res, statusCode, mimeType, content) {

    res.writeHead(statusCode, {
        "Content-Type": mimeType || "plain/text"
      , "Server": "Statique Server"
    });

    if (typeof content === "string") {
        res.end (content);
    }
};

