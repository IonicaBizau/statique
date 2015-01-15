// Dependencies
var Api = require("./api")
  , Path = require("path")
  , Events = require("events")
  , EventEmitter = Events.EventEmitter
  , Debug = require("bug-killer")
  , Ul = require("ul")
  ;

/**
 * Statique
 * Creates a new `Statique` server instance.
 *
 * @name Statique
 * @function
 * @param {String|Object} options A string indicating the server root path or an object containing the following fields:
 *
 *  - `root`: A string representing the absolute path to the public folder
 *  - `cache`: How long the client is supposed to cache the files Statique serves (in seconds)
 *
 * @return {Object} Statique instance
 */
var Statique = module.exports = function (options) {

    // Create the instance
    var self = new EventEmitter();

    // Init routes
    self.routes = {};
    self.regexpRoutes = [];

    // Append the API methods
    Api.call(self);

    // Listen for errors
    self.on("serverError", function (req, res, err) {
        Debug.log(req.url + ": " + err.stack, "error");
    });

    // The root path
    if (typeof options === "string") {
        options = {
            root: options
        };
    }

    // Merge the defaults
    options = Ul.merge({
        root: process.cwd()
      , cache: 36000
    }, options);
    options.root = Path.resolve(options.root) + "/";

    // Append the root and cache values
    self.root = options.root;
    self.cache = options.cache;

    return self;
};
