![](http://i.imgur.com/Az6vZ06.png)

Another Node.JS static server module.

![](https://nodei.co/npm/statique.png)

# Methods
## `server(options)`
Sets the root of the public folder.

### Params:
* **Object** *options* an object containing the following fields:
 - root: string representing the absolute path to the public folder.
 - cache: the number of seconds of cache

### Return:
* **Object** Statique object

## `setRoutes(routes)`
Sets the routes of the website.

### Params:
* **Object** *routes* an object containing fields and values in the
  following format:
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
### Return:
* **Object** Statique object

## `getRoute(url)`
Gets the route by providing an @url

### Params:
* **String** *url* a string representing the url of the page that
  must be served

### Return:
* **Object** the route object that contains the following fields:
  - url
  - handler

## `exists(req)`
Checks if a route exists.

### Params:
* **Object** *req* the request object

### Return:
* **Boolean** true, if the route was found, else false

## `readFile(file, callback)`
Reads the file and callbacks the content.

### Params:
* **String** *file* the relative path to the file
* **Function** *callback* the callback function that will be called with an
  err (first argument) and the content of the file (second argument)

### Return:
* **Buffer** the raw buffer

## `serve(req, res)`
Serves the HTML file according by providing the @req and @res parameters

### Params:
* **Object** *req* the request object
* **Object** *res* the response object

### Return:
* **Object** the Statique instance

## `sendRes(res, statusCode, mimeType, content, otherHeaders)`
This function is used for sending custom status messages and content
If the @content parameter is not provided or is not a string, the response
will not be ended. The status code and the headers will be set

### Params:
* **Object** *res* the response object
* **Number** *statusCode* the response status code
* **String** *mimeType* the response mime type
* **String** *content* the content that you want to send via response
* **Object** *otherHeaders* Aditional headers that will be merged with
  the basic ones. They have greater priority than basic headers.

### Return:
* **Object** the Statique instance

## `serveRoute(route, req, res)`
serveRoute
Serves a provided route.

### Params:
* **String** *route* The route that should be served
* **Object** *req* The request object
* **Object** *res* The response object

### Return:
* **Object** The Statique instance

## `redirect(res, newUrl)`
Redirects the user to the new url passed in the second argument.

### Params:
* **String** *res* The response object
* **String** *newUrl* The new url where the user should be redirected

### Return:
* **Object** Statique object

## `setErrors(errorRoutes)`
Sets the error pages

### Params:
* **Object** *errorRoutes* An object with the error codes and their paths to the HTML files

### Return:
* **Object** Statique object

## `serveFile(path, statusCode, res, req)`
Serves a file

### Params:
* **String|Object** *path* The path to the file that should be served or the route object
* **Number** *statusCode* The response status code (default: 200)
* **Object** *res* The response object
* **Object** *req* The request object
* **Object** *additionalheaders* Additional headers that should be sent

### Return:
* **Object** Statique object

## `error(res, errCode, errMessage)`
Sends an error to client

### Params:
* **Object** *req* The request object
* **Object** *res* The response object
* **Number** *errCode* The error code
* **String** *errMessage* The error message

### Return:
* **Object** Statique object

# Example

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
// dependencies
var Statique = require("statique")
  , http = require('http')
  ;

// statique config
Statique
    .server({root: __dirname + "/public"})
    .setRoutes({
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
    })
    .setErrors({
        404: "/html/errors/404.html"
      , 500: "/html/errors/500.html"
    });
  ;
// create server
http.createServer(Statique.serve).listen(8000);

// output
console.log("Listening on 8000.");
```

# Test

```
npm install statique
npm test # or ./test.sh
```

# Changelog

## `v0.3.7`
 - Regex routes

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
See LICENSE file.
