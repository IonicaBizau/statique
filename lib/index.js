// Dependencies
var Api = require("./api")
  , Events = require("events")
  , EventEmitter = Events.EventEmitter
  , Debug = require("bug-killer")
  ;

/*!
 * Le Statique
 * -----------
 * A Node.JS static server module with built-in cache options and route features
 * Licensed under the MIT license. See the LICENSE file.
 *
 * Documentation can be found in README and on GitHub:
 * http://github.com/IonicaBizau/node-statique
 */
var Statique = module.exports = function (options) {
    var self = new EventEmitter();
    self._routes = {};
    self._regexpRoutes = [];
    Api(self);
    self.on("serverError", function (req, res, err) {
        Debug.log(req.url + ": " + err.stack, "error");
    });
    return self.server(options);
};
