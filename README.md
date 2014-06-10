![](http://i.imgur.com/Az6vZ06.png)

Another Node.JS static server module.

![](https://nodei.co/npm/statique.png)

# Methods
## `server(options)`

Sets the root of the public folder.

### Params:

* **Object** `options`: an object containing the following fields:

### Return:

* **Object** Statique object

## `setRoutes(routes)`

Sets the routes of the website.

### Params:

* **Object** `routes`: an object containing fields and values in the following format:

### Return:

* **Object** Statique object

## `getRoute(url)`

Gets the route by providing an @url

### Params:

* **String** `url`: a string representing the url of the page that must be served

### Return:

* **Object** the route object that contains the following fields:

## `exists(req)`

Checks if a route exists.

### Params:

* **Object** `req`: the request object

### Return:

* **Boolean** true, if the route was found, else false

## `readFile(file, callback)`

Reads the file and callbacks the content.

### Params:

* **String** `file`: the relative path to the file
* **Function** `callback`: the callback function that will be called with an err

### Return:

* **Buffer** the raw buffer

## `serve(req, res)`

Serves the HTML file according by providing the @req and @res parameters

### Params:

* **Object** `req`: the request object
* **Object** `res`: the response object

### Return:

* **Object** the Statique instance

## `sendRes(res, statusCode, mimeType, content)`

This function is used for sending custom status messages and content
If the @content parameter is not provided or is not a string, the response
will not be ended. The status code and the headers will be set

### Params:

* **Object** `res`: the response object
* **Number** `statusCode`: the response status code
* **String** `mimeType`: the response mime type
* **String** `content`: the content that you want to send via response

### Return:

* **Object** the Statique instance

## `serveRoute(route, req, res)`

serveRoute
Serves a provided route.

### Params:

* **String** `route`: The route that should be served
* **Object** `req`: The request object
* **Object** `res`: The response object

### Return:

* **Object** The Statique instance

# Example

File structure:
```sh
$ tree
root
├── index.js
└── public
    ├── css
    │   └── style.css
    └── html
        ├── index.html
        ├── test1.html
        └── test2.html

3 directories, 5 files
```

For the file structure above, the following routes would serve files for each url:

```JSON
{
    "/":       "/html/index.html"
  , "/test1/": "/html/test1.html"
  , "/test2/": "/html/test2.html"
}
```

This is the content for `index.js` file.

```js
// dependencies
var Statique = require("../index")
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
    })
  ;
// create server
http.createServer(function(req, res) {
    if (req.url === "/500") {
        return Statique.sendRes(res, 500, "html", "This is supposed to be a 500 Internal server error page");
    }
    Statique.serve(req, res);
}).listen(8000);

// output
console.log("Listening on 8000.");
```

# Test

```
npm install statique
npm test # or ./test.sh
```

# Changelog

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

# Licence
See LICENSE file.
