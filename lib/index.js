// Dependencies
var Abs = require("abs")
  , Events = require("events")
  , EventEmitter = Events.EventEmitter
  , Fs  = require("fs")
  , Logger = require("bug-killer")
  , Domain = require("domain")
  , Mime = require("mime")
  , RegexParser = require("regex-parser")
  , Ul = require("ul")
  , Url = require("url")
  , Util = require("util")
  , Utils = require("./utils")
  ;

/**
 * Route
 * Creates a new route object.
 *
 * @name Route
 * @function
 * @param {Function|String|Object} route The route handler. Depending on the data type, it will be used for different scopes:
 *
 *  - `Function`: All the requests will be handled by this function (called with the `request`, `response` and `form` objects).
 *  - `String`: The path to the file to be served.
 *  - `Object`: An object containing the `re` field (which will be parsed as regular expression) or the methods object.
 *
 * @param {String|RegExp} url The route url (can be provided as string or `RegExp`).
 * @return {Route} The `Route` instance:
 *
 *  - `handler` (Function|null): The route handler.
 *  - `file` (String): The path to the file to serve.
 *  - `methods` (Object): An object containing handlers depending on the request method.
 *  - `url` (String): The route url.
 *  - `re` (RegExp|null): The route regular expression.
 *
 */
function Route(route, url) {

    var self = this;
    self.handler = null;
    self.file = "";
    self.methods = {};
    self.url = url || route.url || "";
    self.re = null;

    switch (typeof route) {
        case "function":
            self.handler = route;
            break;
        case "string":
            self.file = route;
            break;
        case "object":
            if (route.re) {
                var m = Ul.merge(route, self);
                Object.keys(m).forEach(function (c) {
                    self[c] = m[c];
                });
                if (route.re.constructor !== RegExp) {
                    self.re = RegexParser(typeof route.re === "string" ? route.re : url);
                }
            } else {
                self.methods = route;
            }
            break;
        default:
            Logger.log("The route should be a function, string or an object.", "warn");
            break;
    }

    if (self.url.constructor === RegExp) {
        self.re = self.url;
    } else {
        self.url = Utils.normalizeUrl(self.url);
    }
}

/**
 * Statique
 * Creates a new `Statique` server instance.
 *
 * @name Statique
 * @function
 * @param {String|Object} options A string indicating the server root path or an object containing the following fields:
 *
 *  - `root`: A string representing the absolute path to the public folder.
 *  - `cache`: How long the client is supposed to cache the files Statique serves (in seconds).
 *
 * @return {Statique} The `Statique` instance.
 */
Util.inherits(Statique, EventEmitter);
function Statique(options) {

    // Create the instance
    var self = this;

    // Init routes
    self.routes = {};
    self.re = [];

    // Listen for errors
    self.on("serverError", function (req, res, err) {
        Logger.log(req.url + ": " + err.stack, "error");
    });

    // The root path
    if (typeof options === "string") {
        options = {
            root: options
        };
    }

    // Merge the defaults
    options = Ul.merge(options, {
        root: process.cwd() + "/public"
      , cache: 36000
    });

    options.root = Abs(options.root) + "/";

    // Append the root and cache values
    self.root = options.root;
    self.cache = options.cache;

    // Add routes
    if (options.routes) {
        self.setRoutes(options.routes);
    }

    return self;
}

/**
 * addRoute
 * Adds a new route in the Statique instance.
 *
 * @name addRoute
 * @function
 * @param {Function|String|Object} route The route handler. Depending on the data type, it will be used for different scopes:
 *
 *  - `Function`: All the requests will be handled by this function (called with the `request`, `response` and `form` objects).
 *  - `String`: The path to the file to be served.
 *  - `Object`: An object containing the `re` field (which will be parsed as regular expression) or the methods object.
 *
 * @param {String|RegExp} url The route url (can be provided as string or `RegExp`).
 * @return {Route} The `Route` instance which was added.
 */
Statique.prototype.addRoute = function (route, url) {

    var self = this
      , nRoute = new Route(route, url)
      ;

    if (nRoute.re) {
        self.re.push(nRoute);
    } else {
        self.routes[nRoute.url] = nRoute;
    }

    return nRoute;
};

/**
 * setRoutes
 * Sets the routes of the website.
 *
 * @name setRoutes
 * @function
 * @param {Object} routes An object containing fields and values in the
 * following format:
 *
 * ```js
 * {
 *     "/": "/html/index.html"
 *   , "/foo/": { url: "/html/foo.html" }
 *   , "/another-foo": "/html/myfoo.html"
 *   , "/some/api": function (req, res) {
 *         res.end("Hello World!");
 *     }
 * }
 * ```
 *
 * See test file for more examples.
 * @return {Statique} The `Statique` instance.
 */
Statique.prototype.setRoutes = function (routes) {

    var self = this;

    self.routes = {};
    self.re = [];

    Object.keys(routes).forEach(function (k) {
        self.addRoute(routes[k], k);
    });

    return self;
};

/**
 * setErrors
 * Sets the error custom pages.
 *
 * @name setErrors
 * @function
 * @param {Object} errorRoutes An object with the error codes and their paths to the HTML files:
 *
 * ```js
 * {
 *     500: "/html/errors/500.html"
 *   , 404: "/html/errors/not-found.html"
 * }
 * ```
 *
 * @return {Statique} The `Statique` instance.
 */
Statique.prototype.setErrors = function (errorRoutes) {
    this.errors = errorRoutes;
    return this;
};

/**
 * getRoute
 * Gets the route by providing the `url` parameter.
 *
 * @name getRoute
 * @function
 * @param {String} url A string representing the url of the page that
 * must be served.
 * @return {Object} The route object that contains the following fields:
 *
 *  - `url`: The url found in route object
 *  - `reqUrl`: The url found in route object or the passed `url` parameter
 *  - `handler`: The handler that is called on that url
 *  - `data`: The original route from configuration
 */
Statique.prototype.getRoute = function (url) {

    var self = this
      , route = {}
      , i = 0
      , cRe = null
      ;

    url = Utils.normalizeUrl(url);

    // Get the route that was set in the configuration
    var routeObj = self.routes[url];
    if (routeObj) {
        return routeObj;
    }

    // Handle regexp routes
    for (; i < self.re.length; ++i) {
        cRe = self.re[i];
        if (cRe.re.test(url)) {
            return cRe;
        }
    }

    return null;
};

/**
 * exists
 * Checks if a route exists.
 *
 * @name exists
 * @function
 * @param {Request} req The request object.
 * @return {Boolean} A boolean value that is `true` when the route was
 * found. Otherwise it's `false`.
 */
Statique.prototype.exists = function (req) {
    return Boolean(this.getRoute(Url.parse(req.url).pathname));
};

/**
 * readFile
 * Reads the file and callbacks the content.
 *
 * @name readFile
 * @function
 * @param {String} file The relative path to the file.
 * @param {Function} callback The callback function.
 * @return {Stream} The read stream that was created.
 */
Statique.prototype.readFile = function (file, callback) {

    var self = this
      , stream = Fs.createReadStream(self.root + file)
      , content = ""
      , error = ""
      ;

    stream.on("data", function (c) { content += c.toString(); });
    stream.on("error", function (c) { callback(c); });
    stream.on("end", function () {
        callback(error, content);
    });

    return stream;
};

/**
 * serve
 * Serves the file by providing the request and response parameters.
 *
 * @name serve
 * @function
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @return {Statique} The `Statique` instance.
 */
Statique.prototype.serve = function (req, res) {
    return this.serveRoute(undefined, req, res);
};

/**
 * sendRes
 * This function is used for sending custom status messages and content
 * If the `content` parameter is not provided or is not a string, the response
 * will not be ended. However, the status code and the headers will be set.
 *
 * @name sendRes
 * @function
 * @param {Response} res The response object.
 * @param {Number} statusCode The response status code.
 * @param {String} mimeType The response mime type.
 * @param {String} content The content that you want to send via response.
 * @param {Object} otherHeaders Aditional headers that will be merged with.
 * the basic ones. They have greater priority than basic headers.
 * @return {Statique} The `Statique` instance.
 */
Statique.prototype.sendRes = function (res, statusCode, mimeType, content, otherHeaders) {

    var self = this
      , lMimeType = null
      ;

    if (Mime.extensions[lMimeType = Mime.lookup(String(mimeType))] === mimeType) {
        mimeType = lMimeType;
    }

    var headers = {
        "Content-Type": mimeType || "plain/text"
      , "Server": "Statique Server"
    };

    for (var h in otherHeaders) {
        headers[h] = otherHeaders[h] === undefined ? headers[h] : otherHeaders[h];
    }

    res.writeHead(statusCode, headers);

    if (typeof content === "string" || content instanceof Buffer) {
        res.end(content);
    }

    return self;
};

/**
 * notFound
 * Sends the not found response.
 *
 * @name notFound
 * @function
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @return {Statique} The `Statique` instance.
 */
Statique.prototype.notFound = function (req, res) {
    return this.error(req, res, 404, "Not found");
};

/**
 * serverError
 * Sends the internal server error response.
 *
 * @name serverError
 * @function
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @return {Statique} The `Statique` instance.
 */
Statique.prototype.serverError = function (req, res) {
    return this.error(req, res, 500, "Internal Server Error");
};

/**
 * serveFile
 * Serves a file
 *
 * @name serveFile
 * @function
 * @param {String|Object} path The path to the file that should be served or the
 * route object.
 * @param {Number} statusCode The response status code (default: 200).
 * @param {Response} res The response object.
 * @param {Request} req The request object.
 * @param {Object} additionalHeaders Additional headers that should be sent.
 * @param {String} customRoot Path to the custom root (e.g. "/").
 * @return {Statique} The `Statique` instance.
 */
Statique.prototype.serveFile = function (path, statusCode, res, req, additionalHeaders, customRoot) {

    var self = this;

    res = res || {};
    req = req || {};

    req.headers = req.headers || {};

    if (typeof path === "string") {
        path = {
            reqUrl: path
        };
    }

    var fullPath = (customRoot ? customRoot : self.root) + (path.url || path.reqUrl)
      , stats = null
      ;

    try {
        stats = Fs.lstatSync(fullPath);
    } catch (e) {
        self.notFound(req, res);
        return self;
    }

    if (!stats.isFile()) {
        self.notFound(req, res);
        return self;
    }

    // Cache stuff
    var mtime = Date.parse(stats.mtime)
      , clientETag = req.headers["if-none-match"]
      , clientMTime = Date.parse(req.headers["if-modified-since"])
      , contentType = Mime.lookup(path.reqUrl)
      , headers = {
            "Etag": JSON.stringify([stats.ino, stats.size, mtime].join("-"))
          , "Date": (new Date()).toUTCString()
          , "Last-Modified": (new Date(stats.mtime)).toUTCString()
          , "Content-Type": contentType
          , "Content-Length": stats.size
        }
      , aH = null
      ;

    // File is cached
    if ((clientMTime  || clientETag) &&
        (!clientETag  || clientETag === headers.Etag) &&
        (!clientMTime || clientMTime >= mtime)) {
        // 304 response should not contain entity headers
        ["Content-Encoding",
         "Content-Language",
         "Content-Length",
         "Content-Location",
         "Content-MD5",
         "Content-Range",
         "Content-Type",
         "Expires",
         "Last-Modified"].forEach(function(entityHeader) {
            delete headers[entityHeader];
        });

        for (aH in additionalHeaders) {
            headers[aH] = additionalHeaders[aH] || headers[aH];
        }

        self.sendRes(res, 304, contentType, null, headers);
        res.end();
        return self;
    }

    // Set cache-control  header
    headers["cache-control"] = "max-age=" + self.cache;
    for (aH in additionalHeaders) {
        headers[aH] = additionalHeaders[aH] || headers[aH];
    }

    // file should cached
    self.sendRes(res, statusCode || 200, contentType, stats.size ? null : "", headers);

    if (stats.size) {
        var fileStream = Fs.createReadStream(fullPath);
        fileStream.pipe(res);
    }

    return self;
};

/**
 * serveRoute
 * Serves a provided route.
 *
 * @name serveRoute
 * @function
 * @param {String} route The route that should be served.
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @return {Statique} The `Statique` instance.
 */
Statique.prototype.serveRoute = function (route, req, res) {

    var self = this
      , parsedUrl = Url.parse(req.url)
      , url = route || parsedUrl.pathname
      , routeToServe = self.getRoute(url)
      , stats = null
      , method = (req.method || "get").toLowerCase()
      , form = {
            data: ""
          , error: ""
          , emitter: new Events.EventEmitter()
        }
      , d = null
      ;

    req.on("data", function (chunk) {
        form.data += chunk;
    });

    req.on("error", function (err) {
        form.error += err;
    });

    req.on("end", function () {
        form.emitter.emit("done", form);
    });

    d = Domain.create();
    d.on("error", function(err) {
        self.emit("serverError", req, res, err);
        self.serverError(req, res);
    });

    // Add request and response objects
    d.add(req);
    d.add(res);

    if (!routeToServe) {
        return self.serveFile(url, null, res, req);
    }

    // Handle custom methods
    var meth = routeToServe.methods[method];
    if (meth) {
        if (typeof meth === "string") {
            self.serveFile(meth, null, res, req);
        } else if (typeof meth === "function") {
            d.run(function() {
                meth(req, res, form.emitter);
            });
        }
        return self;
    }

    // Call the handler
    if (typeof routeToServe.handler === "function") {
        d.run(function() {
            routeToServe.handler(req, res, form.emitter);
        });
        return self;
    }

    // Serve the provided file
    return self.serveFile(routeToServe.file, null, res, req);
};

/**
 * redirect
 * Redirects the user to the new url passed in the second argument.
 *
 * @name redirect
 * @function
 * @param {Response} res The response object.
 * @param {String} newUrl The new url where the user should be redirected.
 * @return {Statique} The `Statique` instance.
 */
Statique.prototype.redirect = function (res, newUrl) {
    return this.sendRes(res, 301, "text", "Redirecting", {
        "location": newUrl
    });
};

/**
 * error
 * Sends an error to client
 *
 * @name error
 * @function
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @param {Number} errCode The error code.
 * @param {String} errMessage The error message.
 * @return {Statique} The `Statique` instance.
 */
Statique.prototype.error = function (req, res, errCode, errMessage) {

    var self = this
      , configErrors = Object(self.errors)
      , errPage = configErrors[errCode]
      ;

    if (errPage) {
        return self.serveFile(errPage, errCode, res, req, {
            "cache-control": "no-cache"
        });
    }

    return self.sendRes(res, errCode, "text", errMessage);
};

module.exports = Statique;
