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
 * Le Statique
 * -----------
 * A node-static minimalist alternative.
 * Licensed under the MIT license. See the LICENSE file.
 *
 *
 * Documentation can be found in README and on GitHub:
 * http://github.com/IonicaBizau/node-statique
 */
var Statique = module.exports = {};

/**
 * Sets the root of the public folder.
 *
 * @param {Object} options an object containing the following fields:
 *  - root: string representing the absolute path to the public folder.
 * @return {Object} Statique object
 */
Statique.server = function (options) {
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
 * Sets the routes of the website.
 *
 * @param {Object} routes an object containing fields and values in the following format:
 *  {
 *      "/":       "/html/index.html"
 *    , "/foo/":   { url: "/html/foo.html" }
 *    , "/another-foo": "/html/myfoo.html"
 *    , "/some/api": function (req, res) {
 *          res.end("Hello World!");
 *      }
 *  }

 * @return {Object} Statique object
 */
Statique.setRoutes = function (routes) {
    Statique._routes = routes;
    return Statique;
};

/**
 * Gets the route by providing an @url
 *
 * @param {String} url a string representing the url of the page that must be served
 * @return {String} the route to the HTML page
 */
Statique.getRoute = function (url) {

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
 * Checks if a route exists.
 *
 * @param {Object} req the request object
 * @return {Boolean} true, if the route was found, else false
 */
Statique.exists = function (req) {
    return Boolean (Statique.getRoute(Url.parse(req.url).pathname));
};

/**
 * Reads the file and callbacks the content.
 *
 * @param {String} file the relative path to the file
 * @param {Function} callback the callback function that will be called with an err
 * (first argument) and the content of the file (second argument)
 * @return {Buffer} the raw buffer
 */
Statique.readFile = function (file, callback) {
    return Fs.readFile (Statique._root + file, function (err, buffer) {
        if (err) { return callback (err); }
        callback (null, buffer.toString())
    });
};

/**
 * Serves the HTML file according by providing the @req and @res parameters
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @return {Object} the Statique instance
 */
Statique.serve = function (req, res) {
    return Statique.serveRoute(undefined, req, res);
};

/**
 * This function is used for sending custom status messages and content
 * If the @content parameter is not provided or is not a string, the response
 * will not be ended. The status code and the headers will be set
 *
 * @param {Object} res the response object
 * @param {Number} statusCode the response status code
 * @param {String} mimeType the response mime type
 * @param {String} content the content that you want to send via response
 * @return {Object} the Statique instance
 */
Statique.sendRes = function (res, statusCode, mimeType, content) {

    res.writeHead(statusCode, {
        "Content-Type": mimeType || "plain/text"
      , "Server": "Statique Server"
    });

    if (typeof content === "string") {
        res.end (content);
    }

    return Statique;
};

/**
 * serveRoute
 * Serves a provided route.
 *
 * @name serveRoute
 * @function
 * @param {String} route The route that should be served
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @return {Object} The Statique instance
 */
Statique.serveRoute = function (route, req, res) {

    var parsedUrl = Url.parse (req.url)
      , routeToServe = Statique.getRoute (route || parsedUrl.pathname) || parsedUrl.pathname
      , stats = null
      , fileName = Statique._root + routeToServe
      ;

    if (typeof routeToServe === "function") {
        routeToServe(req, res);
        return Statique;
    }

    try {
        stats = Fs.lstatSync (fileName);
    } catch (e) {
        Statique.sendRes (res, 404, "html", "404 - Not found");
        return Statique;
    }

    if (stats.isFile()) {
        Statique.sendRes(res, 200, MIME_TYPES[Path.extname(routeToServe).substring(1)]);
        var fileStream = Fs.createReadStream(fileName);
        fileStream.pipe(res);
    }

    return Statique;
};
