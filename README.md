![](http://i.imgur.com/Az6vZ06.png)

A Node.JS static server module with built-in cache options and route features.

[![](https://nodei.co/npm/statique.png)](https://www.npmjs.org/package/statique)

# Example

```js
// Dependencies
var Statique = require("statique")
  , Http = require('http')
  ;

// Create *Le Statique* server
var server = new Statique({
    root: __dirname + "/public"
  , cache: 36000
}).setRoutes({
    "/": "/html/index.html"
});

// Create server
Http.createServer(server.serve).listen(8000);

// Output
console.log("Listening on 8000.");
```

# Methods

## `server(options)`
Creates the server instance. This method is called internally.

### Params
- **Object** `options`: An object containing the following fields:
 - `root`: A string representing the absolute path to the public folder
 - `cache`: How long the client is supposed to cache the files Statique serves (in seconds)

### Return
- **Object** Statique instance

## `setRoutes(routes)`
Sets the routes of the website.

### Params
- **Object** `routes`: An object containing fields and values in the following format:

```js
{
    "/":       "/html/index.html"
  , "/foo/":   { url: "/html/foo.html" }
  , "/another-foo": "/html/myfoo.html"
  , "/some/api": function (req, res) {
        res.end("Hello World!");
    }
}
```

See test file for more examples.

### Return
- **Object** Statique instance

## `setErrors(errorRoutes)`
Sets the error custom pages.

### Params
- **Object** `errorRoutes`: An object with the error codes and their paths to the HTML files:
```js
{
    500: "/html/errors/500.html"
  , 404: "/html/errors/not-found.html"
}
```

### Return
- **Object** Statique instance

## `getRoute(url)`
Gets the route by providing the `url` parameter.

### Params
- **String** `url`: A string representing the url of the page that must be served

### Return
- **Object** The route object that contains the following fields:
 - `url`: The url found in route object
 - `reqUrl`: The url found in route object or the passed `url` parameter
 - `handler`: The handler that is called on that url
 - `_data`: The original route from configuration

## `exists(req)`
Checks if a route exists.

### Params
- **Object** `req`: The request object

### Return
- **Boolean** A boolean value that is `true` when the route was found. Otherwise it's `false`.

## `readFile(file, callback)`
Reads the file and callbacks the content.

### Params
- **String** `file`: The relative path to the file
- **Function** `callback`: The callback function

### Return
- **Stream** The read stream that was created

## `serve(req, res)`
Serves the file by providing the request and response parameters.

### Params
- **Object** `req`: The request object
- **Object** `res`: The response object

### Return
- **Object** Statique instance

## `sendRes(res, statusCode, mimeType, content, otherHeaders)`
This function is used for sending custom status messages and content
If the `content` parameter is not provided or is not a string, the response
will not be ended. However, the status code and the headers will be set.

### Params
- **Object** `res`: The response object
- **Number** `statusCode`: The response status code
- **String** `mimeType`: The response mime type
- **String** `content`: The content that you want to send via response
- **Object** `otherHeaders`: Aditional headers that will be merged with the basic ones. They have greater priority than basic headers.

### Return
- **Object** Statique instance

## `serveFile(path, statusCode, res, req, additionalHeaders, customRoot)`
Serves a file

### Params
- **String|Object** `path`: The path to the file that should be served or the route object.
- **Number** `statusCode`: The response status code (default: 200)
- **Object** `res`: The response object
- **Object** `req`: The request object
- **Object** `additionalHeaders`: Additional headers that should be sent
- **String** `customRoot`: Path to the custom root (e.g. "/")

### Return
- **Object** Statique instance

## `serveRoute(route, req, res)`
Serves a provided route.

### Params
- **String** `route`: The route that should be served
- **Object** `req`: The request object
- **Object** `res`: The response object

### Return
- **Object** Statique instance

## `redirect(res, newUrl)`
Redirects the user to the new url passed in the second argument.

### Params
- **String** `res`: The response object
- **String** `newUrl`: The new url where the user should be redirected

### Return
- **Object** Statique instance

## `error(req, res, errCode, errMessage)`
Sends an error to client

### Params
- **Object** `req`: The request object
- **Object** `res`: The response object
- **Number** `errCode`: The error code
- **String** `errMessage`: The error message

### Return
- **Object** Statique instance

# Advanced Example

File structure:

```sh
$ tree
.
├── index.js
└── public
    ├── css
    │   └── style.css
    ├── html
    │   ├── errors
    │   │   ├── 404.html
    │   │   └── 500.html
    │   ├── index.html
    │   ├── test1.html
    │   └── test2.html
    └── images
        ├── large.jpg
        └── README.md

5 directories, 9 files
```

For the file structure above, the following routes would serve files for each url:

```js
{
    "/":       "/html/index.html"
  , "/test1/": {url: "/html/test1.html"}
  , "/test2": "/html/test2.html"
  , "/some/api": function (req, res) {
        res.end("Hello World!");
    }
  , "/some/test1-alias": function (req, res) {
        Statique.serveRoute("/test1", req, res);
    }
  , "/method-test": {
        get: function (req, res) { res.end("GET"); }
      , post: function (req, res, form) {
            form.on("done", function (form) {
                console.log(form.data);
            });
            res.end();
        }
    }
  , "/crash": {
        get: function (req, res) { undefined.something; }
    }
}
```

This is the content for `index.js` file.

```js
// Dependencies
var Statique = require("../lib/index")
  , Http = require('http')
  ;

// Create *Le Statique* server
var server = new Statique({
    root: __dirname + "/public"
  , cache: 36000
}).setRoutes({
    "/": "/html/index.html"
  , "/test1/": {url: "/html/test1.html"}
  , "/test2": "/html/test2.html"
  , "/some/api": function (req, res) {
        res.end("Hello World!");
    }
  , "/buffer": function (req, res) {
        server.sendRes(res, 200, "text/plain", new Buffer("I am a buffer."));
    }
  , "/some/test1-alias": function (req, res) {
        server.serveRoute("/test1", req, res);
    }
  , "/method-test": {
        get: function (req, res) { res.end("GET"); }
      , post: function (req, res, form) {
            form.on("done", function (form) {
                console.log(form.data);
            });
            res.end();
        }
    }
  , "/crash": {
        get: function (req, res) { undefined.something; }
    }
  , "\/anynumber\-[0-9]": {
        type: "regexp"
      , handler: function (req, res) {
            res.end("Hi");
        }
    }
  , "r1": {
        type: "regexp"
      , regexp: /anyletter\-[a-z]/i
      , handler: function (req, res) {
            res.end("Case insensitive is important. ;)");
        }
    }
}).setErrors({
    404: "/html/errors/404.html"
  , 500: "/html/errors/500.html"
});

// create server
Http.createServer(server.serve).listen(8000);

// Output
console.log("Listening on 8000.");
```

# Test

```
npm install statique
cd node_modules/statique
npm test
```

# Changelog

## `1.0.0`
 - Improved `readFile` method (using file streams)
 - Buffer support for `sendRes` method
 - Better crash handling
 - Added tests
 - Send 404 error when requests on directories come
 - Updated docs
 - Simplified mime type setting
 - Fixed `stats` magic variable (bug)
 - Emit error events (the instance of Statique is an instance of `EventEmitter`). Now we can listening on errors using `server.on("serverError", foo)`.

## `0.4.0`
 - Support multiple instances
 - Upgraded to `regex-parser@1.0.0`

## `v0.3.7`
 - Regex routes
 - `customRoot` parameter to `serveFile` method

## `v0.3.6`
 - Added a `additionalHeaders` parameter to `serveFile` method
 - Added `req` (request object) as first parameter in `error` method.
 - Error pages are not cached anymore
 - The passed data in `setRoutes` is attached in `_data` field of the object returned by `getRoute` method.

## `v0.3.5`
 - Added `error` method
 - Added `serveFile` method
 - Added `bug-killer` as dependency and log errors
 - Try to call custom handlers and catch exceptions, logging them

## `v0.3.4`
 - Fixed `redirect` method

## `v0.3.3`
 - Implemented `redirect` method.

## `v0.3.2`
 - Custom headers in response using `sendRes` method
 - Implemented cache stuff, inspired from [`node-static` module](https://github.com/cloudhead/node-static).

## `v0.3.1`
 - Support for custom request methods
 - Get form data from post requests

## `v0.3.0`
 - Added useful comments that are used for generating the documentation
 - Support functions for routes (see test file)
 - Added `servRoute` that should serve a route passed in the first argument
 - Reinited `package.json` file (`npm init`)
 - Code clean up

## `v0.2.4`
 - Accept route objects that contain `url` field

## `v0.2.3`
 - Fixed `readFile` function (typo)
 - Minor fix in `getRoute` method

## `v0.2.2`
 - Added `serve` method
 - `sendRes` is used for sending custom content, statusCode and mime type.

## `v0.2.1`
 - Updated tests
 - Serve css and other files that are not provided in route object.

## `v0.2.0`
 - Deprecated `johnnys-node-static` module
 - Refactored the code
 - Removed `node-static` as dependency

## `v0.1.3`
 - Fixed route setting.

## `v0.1.2`
 - Fixed the bug related to the status code.

## `v0.1.1`
 - Added `serveAll` method.

## `v0.1.0`
 - Initial release.

# Thanks to
 - [Silviu Bogan](https://github.com/silviubogan) - that came with the idea to name the project *Statique*.
 - [`node-static` module](https://github.com/cloudhead/node-static) - I took the caching logic from there
 - all contributors that will contribute to this project

# Licence
See the [LICENSE](/LICENSE) file.
