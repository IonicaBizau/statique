// Dependencies
var Url = require("url")
  , Fs  = require("fs")
  , Path = require("path")
  , Events = require("events")
  , Debug = require("bug-killer")
  , RegexpParser = require("regex-parser")
  , Mime = require("mime")
  ;

/**
 * Le Statique
 * -----------
 * Another Node.JS static server module.
 * Licensed under the MIT license. See the LICENSE file.
 *
 * Documentation can be found in README and on GitHub:
 * http://github.com/IonicaBizau/node-statique
 */
var Statique = module.exports = function (options) {
    var self = this;
    self._routes = {};
    self._regexpRoutes = [];

    for (var foo in self) {
        if (typeof self[foo] !== "function") { continue; }
        self[foo] = self[foo].bind(self);
    }

    return self.server(options);
};

/**
 * Sets the root of the public folder.
 *
 * @name server
 * @function
 * @param {Object} options an object containing the following fields:
 *  - root: string representing the absolute path to the public folder.
 *  - cache: the number of seconds of cache
 * @return {Object} Statique object
 */
Statique.prototype.server = function (options) {

    var self = this;

    if (typeof options === "string") {
        options = {
            root: options
        }
    }
    if (options.root.slice(-1) !== "/") {
        options.root += "/";
    }

    self._root = options.root;
    self._cache = typeof options.cache === "number" ? options.cache : 3600;

    return self;
};

/**
 * Sets the routes of the website.
 *
 * @name setRoutes
 * @function
 * @param {Object} routes an object containing fields and values in the
 * following format:
 *  {
 *      "/":       "/html/index.html"
 *    , "/foo/":   { url: "/html/foo.html" }
 *    , "/another-foo": "/html/myfoo.html"
 *    , "/some/api": function (req, res) {
 *          res.end("Hello World!");
 *      }
 *  }
 *  See test file for more examples.
 * @return {Object} Statique object
 */
Statique.prototype.setRoutes = function (routes) {

    var self = this;

    self._routes = routes;
    self._regexpRoutes = [];

    for (var r in routes) {
        var cRoute = routes[r];
        if ((cRoute.type || "").toLowerCase() === "regexp") {
            if ((cRoute.regexp || {}).constructor.name !== "RegExp") {
                cRoute.regexp = RegexpParser.parse(r);
            }
            self._regexpRoutes.push(cRoute);
            delete cRoute[r];
        }
    }

    return self;
};

/**
 * Sets the error pages
 *
 * @name setErrors
 * @function
 * @param {Object} errorRoutes An object with the error codes and their paths to the HTML files
 * @return {Object} Statique object
 */
Statique.prototype.setErrors = function (errorRoutes) {
    var self = this;
    self._errors = errorRoutes;
    return self;
};

/**
 * Gets the route by providing an @url
 *
 * @name getRoute
 * @function
 * @param {String} url a string representing the url of the page that
 * must be served
 * @return {Object} the route object that contains the following fields:
 *  - url
 *  - handler
 *  - _data (original route from config)
 */
Statique.prototype.getRoute = function (url) {

    var self = this
      , route = {}
      ;

    // remove slash at the end of the string
    if (url.slice (-1) === "/") {
        url = url.substring(0, url.length - 1);
    }

    // get the route that was set in the configuration
    var routeObj = self._routes[url] || self._routes[url + "/"] || null;
    route.url = (routeObj || {}).url || routeObj;
    route.reqUrl = route.url || url;
    route._data = routeObj;

    // Handle regexp routes
    for (var i = 0, cRegexpRoute; i < self._regexpRoutes.length; ++i) {
        cRegexpRoute = self._regexpRoutes[i];
        if (cRegexpRoute.regexp.test(url)) {
            for (var k in cRegexpRoute) {
                route[k] = cRegexpRoute[k];
            }
            break;
        }
    }

    // handle url as function
    if (typeof route.url === "function") {
        route.handler = route.url;
        delete route.url;
    }

    if (routeObj && typeof routeObj.handler === "function") {
        routeObj.handler = routeObj.handler;
    }

    return route;
};

/**
 * Checks if a route exists.
 *
 * @name exists
 * @function
 * @param {Object} req the request object
 * @return {Boolean} true, if the route was found, else false
 */
Statique.prototype.exists = function (req) {
    return Boolean(this.getRoute(Url.parse(req.url).pathname));
};

/**
 * Reads the file and callbacks the content.
 *
 * @name readFile
 * @function
 * @param {String} file the relative path to the file
 * @param {Function} callback the callback function that will be called with an
 * err (first argument) and the content of the file (second argument)
 * @return {Buffer} the raw buffer
 */
Statique.prototype.readFile = function (file, callback) {
    var self = this;
    return Fs.readFile(self._root + file, function (err, buffer) {
        if (err) { return callback(err); }
        callback(null, buffer.toString())
    });
};

/**
 * Serves the HTML file by providing the @req and @res parameters
 *
 * @name serve
 * @function
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @return {Object} the Statique instance
 */
Statique.prototype.serve = function (req, res) {
    return this.serveRoute(undefined, req, res);
};

/**
 * This function is used for sending custom status messages and content
 * If the @content parameter is not provided or is not a string, the response
 * will not be ended. The status code and the headers will be set
 *
 * @name sendRes
 * @function
 * @param {Object} res the response object
 * @param {Number} statusCode the response status code
 * @param {String} mimeType the response mime type
 * @param {String} content the content that you want to send via response
 * @param {Object} otherHeaders Aditional headers that will be merged with
 * the basic ones. They have greater priority than basic headers.
 * @return {Object} the Statique instance
 */
Statique.prototype.sendRes = function (res, statusCode, mimeType, content, otherHeaders) {

    var self = this
      , headers = {
            "Content-Type": mimeType || "plain/text"
          , "Server": "Statique Server"
        }
      ;

    for (var h in otherHeaders) {
        headers[h] = otherHeaders[h] === undefined ? headers[h] : otherHeaders[h];
    }

    res.writeHead(statusCode, headers);

    if (typeof content === "string") {
        res.end(content);
    }

    return self;
};

/**
 * Serves a file
 *
 * @name serveFile
 * @function
 * @param {String|Object} path The path to the file that should be served or the
 * route object
 * @param {Number} statusCode The response status code (default: 200)
 * @param {Object} res The response object
 * @param {Object} req The request object
 * @param {Object} additionalHeaders Additional headers that should be sent
 * @param {String} customRoot Path to the custom root (e.g. "/")
 * @return {Object} Statique object
 */
Statique.prototype.serveFile = function (path, statusCode, res, req, additionalHeaders, customRoot) {

    var self = this;
    res = Object(res);
    req = Object(req);
    req.headers = req.headers || {};

    if (typeof path === "string") {
        path = {
            reqUrl: path
        };
    }

    var fullPath = (customRoot ? customRoot : self._root) + (path.url || path.reqUrl);

    try {
        stats = Fs.lstatSync(fullPath);
    } catch (e) {
        self.error(req, res, 404, "Not found");
        return self;
    }

    // no file, no fun
    if (!stats.isFile()) { return self; }

    // cache stuff
    var mtime = Date.parse(stats.mtime)
      , clientETag = req.headers['if-none-match']
      , clientMTime = Date.parse(req.headers['if-modified-since'])
      , contentType = Mime.lookup(path.reqUrl)
      , headers = {
            "Etag": JSON.stringify([stats.ino, stats.size, mtime].join('-'))
          , "Date": (new Date()).toUTCString()
          , "Last-Modified": (new Date(stats.mtime)).toUTCString()
          , "Content-Type": contentType
          , "Content-Length": stats.size
        }
      ;

    // file is cached
    if ((clientMTime  || clientETag) &&
        (!clientETag  || clientETag === headers['Etag']) &&
        (!clientMTime || clientMTime >= mtime)) {
        // 304 response should not contain entity headers
        ['Content-Encoding',
         'Content-Language',
         'Content-Length',
         'Content-Location',
         'Content-MD5',
         'Content-Range',
         'Content-Type',
         'Expires',
         'Last-Modified'].forEach(function(entityHeader) {
            delete headers[entityHeader];
        });

        for (var aH in additionalHeaders) {
            headers[aH] = additionalHeaders[aH] || headers[aH];
        }

        self.sendRes(res, 304, contentType, null, headers);
        res.end();
        return self;
    }

    // Set cache-control  header
    headers["cache-control"] = "max-age=" + self._cache;
    for (var aH in additionalHeaders) {
        headers[aH] = additionalHeaders[aH] || headers[aH];
    }

    // file should cached
    self.sendRes(res, statusCode || 200, contentType, stats.size ? null : "", headers)

    if (stats.size) {
        var fileStream = Fs.createReadStream(fullPath);
        fileStream.pipe(res);
    }

    return self;
};

/**
 * Serves a provided route.
 *
 * @name serveRoute
 * @function
 * @param {String} route The route that should be served
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @return {Object} The Statique instance
 */
Statique.prototype.serveRoute = function (route, req, res) {

    var self = this
      , parsedUrl = Url.parse(req.url)
      , routeToServe = self.getRoute(
            route || parsedUrl.pathname
        ) || parsedUrl.pathname
      , stats = null
      , method = req.method.toLowerCase()
      , form = {
            data: ""
          , error: ""
          , _emitter: new Events.EventEmitter()
        }
      ;

    req.on("data", function (chunk) {
        form.data += chunk;
    });

    req.on("error", function (err) {
        form.error += err;
    });

    req.on("end", function () {
        form._emitter.emit("done", form);
    });

    if (routeToServe.url && typeof routeToServe.url[method] === "function") {
        try {
            routeToServe.url[method](req, res, form._emitter);
        } catch (e) {
            self.error(req, res, 500, "Internal Server Error");
            Debug.log(e.stack, "error");
        }
        return self;
    }

    if (typeof routeToServe.handler === "function") {
        try {
            routeToServe.handler(req, res, form._emitter);
        } catch (e) {
            self.error(req, res, 500, "Internal Server Error");
            Debug.log(e.stack, "error");
        }
        return self;
    }

    return self.serveFile(routeToServe, null, res, req);
};

/**
 * Redirects the user to the new url passed in the second argument.
 *
 * @name redirect
 * @function
 * @param {String} res The response object
 * @param {String} newUrl The new url where the user should be redirected
 * @return {Object} Statique object
 */
Statique.prototype.redirect = function (res, newUrl) {
    var self = this;
    return self.sendRes(res, 301, "text", "Redirecting", {
        "location": newUrl
    });
};

/**
 * Sends an error to client
 *
 * @name error
 * @function
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Number} errCode The error code
 * @param {String} errMessage The error message
 * @return {Object} Statique object
 */
Statique.prototype.error = function (req, res, errCode, errMessage) {
    var self = this
      , configErrors = Object(self._errors)
      , errPage = configErrors[errCode]
      ;

    if (errPage) {
        return self.serveFile(errPage, errCode, res, req, {
            "cache-control": "no-cache"
        });
    }

    return self.sendRes(res, errCode, "text", errMessage);
};
