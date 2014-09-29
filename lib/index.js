// Dependencies
var Api = require("./api");

/**
 * Le Statique
 * -----------
 * A Node.JS static server module with built-in cache options and route features
 * Licensed under the MIT license. See the LICENSE file.
 *
 * Documentation can be found in README and on GitHub:
 * http://github.com/IonicaBizau/node-statique
 */
var Statique = module.exports = function (options) {
    var self = this;
    self._routes = {};
    self._regexpRoutes = [];
    Api(self);
    return self.server(options);
};
