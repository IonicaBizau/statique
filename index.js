// global
var static = require('node-static');
var staticServer;

// routes object
var routes = {};
var objToExport = {};

// set the static server
objToExport.setStaticServer = function (options) {
    return staticServer = new(static.Server)(options.root);
};

// set routes
objToExport.setRoutes = function (routesObj, callback) {
    // set routes object
    routes = routesObj;

    // if callback is defined, call it!
    callback ? callback(null, routes) : "";

    // also, return routes
    return routes;
};

function getRoute (url) {

    // verify if it doesn't end with '/'
    if (url.slice(-1) !== "/") {
        // if yes, add '/'
        url += "/";
    }

    // get route
    var route = routes[url];

    // and return it
    return route;
}

// route exists
// TODO Options?
objToExport.exists = function (req, res) {

    // get the route object from routes
    var route = getRoute(req.url);

    // if it exists
    if (route && route.url) {
        // return true
        return true;
    }

    // else, return false
    return false;
}

// serve
// TODO options
objToExport.serve = function (req, res, callback) {

    // force callback to be a function
    callback = callback || function () {};

    // get route
    var route = getRoute(req.url);

    // callback some result
    var promise = staticServer.serveFile(route.url, "", {}, req, res);

    // if an error appears
    promise.on("error", callback);
    return promise;
};

// serve any file
objToExport.serveAll = function (req, res, callback) {
    staticServer.serve(req, res, callback);
};

module.exports = objToExport;
