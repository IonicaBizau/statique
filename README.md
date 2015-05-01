![Le Statique](http://i.imgur.com/fzIIqbG.png)

A Node.JS static server module with built-in cache options and route features.

[![](https://nodei.co/npm/statique.png?downloads)](https://www.npmjs.org/package/statique)

## Example

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
Http.createServer(server.serve.bind(server)).listen(8000);

// Output
console.log("Listening on 8000.");
```

## Documentation
### `Route(route, url)`
Creates a new route object.

#### Params
- **Function|String|Object** `route`: The route handler. Depending on the data type, it will be used for different scopes:  - `Function`: All the requests will be handled by this function (called with the `request`, `response` and `form` objects).
 - `String`: The path to the file to be served.
 - `Object`: An object containing the `re` field (which will be parsed as regular expression) or the methods object.
- **String|RegExp** `url`: The route url (can be provided as string or `RegExp`).

#### Return
- **Route** The `Route` instance:  - `handler` (Function|null): The route handler.
 - `file` (String): The path to the file to serve.
 - `methods` (Object): An object containing handlers depending on the request method.
 - `url` (String): The route url.
 - `re` (RegExp|null): The route regular expression.

### `Statique(options)`
Creates a new `Statique` server instance.

#### Params
- **String|Object** `options`: A string indicating the server root path or an object containing the following fields:
 - `root`: A string representing the absolute path to the public folder
 - `cache`: How long the client is supposed to cache the files Statique serves (in seconds)

#### Return
- **Object** Statique instance

### `addRoute(route, url)`
Adds a new route in the Statique instance.

#### Params
- **Function|String|Object** `route`: The route handler. Depending on the data type, it will be used for different scopes:  - `Function`: All the requests will be handled by this function (called with the `request`, `response` and `form` objects).
 - `String`: The path to the file to be served.
 - `Object`: An object containing the `re` field (which will be parsed as regular expression) or the methods object.
- **String|RegExp** `url`: The route url (can be provided as string or `RegExp`).

#### Return
- **Route** The `Route` instance which was added.

### `setRoutes(routes)`
Sets the routes of the website.

#### Params
- **Object** `routes`: An object containing fields and values in the following format:

```js
{
    "/": "/html/index.html"
  , "/foo/": { url: "/html/foo.html" }
  , "/another-foo": "/html/myfoo.html"
  , "/some/api": function (req, res) {
        res.end("Hello World!");
    }
}
```

See test file for more examples.

#### Return
- **Object** Statique instance

### `setErrors(errorRoutes)`
Sets the error custom pages.

#### Params
- **Object** `errorRoutes`: An object with the error codes and their paths to the HTML files:
```js
{
    500: "/html/errors/500.html"
  , 404: "/html/errors/not-found.html"
}
```

#### Return
- **Object** Statique instance

### `getRoute(url)`
Gets the route by providing the `url` parameter.

#### Params
- **String** `url`: A string representing the url of the page that must be served

#### Return
- **Object** The route object that contains the following fields:
 - `url`: The url found in route object
 - `reqUrl`: The url found in route object or the passed `url` parameter
 - `handler`: The handler that is called on that url
 - `data`: The original route from configuration

### `exists(req)`
Checks if a route exists.

#### Params
- **Object** `req`: The request object

#### Return
- **Boolean** A boolean value that is `true` when the route was found. Otherwise it's `false`.

### `readFile(file, callback)`
Reads the file and callbacks the content.

#### Params
- **String** `file`: The relative path to the file
- **Function** `callback`: The callback function

#### Return
- **Stream** The read stream that was created

### `serve(req, res)`
Serves the file by providing the request and response parameters.

#### Params
- **Object** `req`: The request object
- **Object** `res`: The response object

#### Return
- **Object** Statique instance

### `sendRes(res, statusCode, mimeType, content, otherHeaders)`
This function is used for sending custom status messages and content
If the `content` parameter is not provided or is not a string, the response
will not be ended. However, the status code and the headers will be set.

#### Params
- **Object** `res`: The response object
- **Number** `statusCode`: The response status code
- **String** `mimeType`: The response mime type
- **String** `content`: The content that you want to send via response
- **Object** `otherHeaders`: Aditional headers that will be merged with the basic ones. They have greater priority than basic headers.

#### Return
- **Object** Statique instance

### `notFound(req, res)`
Sends the not found response.

#### Params
- **Object** `req`: The request object
- **Object** `res`: The response object

#### Return
- **Object** Statique instance

### `serverError(req, res)`
Sends the internal server error response.

#### Params
- **Object** `req`: The request object
- **Object** `res`: The response object

#### Return
- **Object** Statique instance

### `serveFile(path, statusCode, res, req, additionalHeaders, customRoot)`
Serves a file

#### Params
- **String|Object** `path`: The path to the file that should be served or the route object.
- **Number** `statusCode`: The response status code (default: 200)
- **Object** `res`: The response object
- **Object** `req`: The request object
- **Object** `additionalHeaders`: Additional headers that should be sent
- **String** `customRoot`: Path to the custom root (e.g. "/")

#### Return
- **Object** Statique instance

### `serveRoute(route, req, res)`
Serves a provided route.

#### Params
- **String** `route`: The route that should be served
- **Object** `req`: The request object
- **Object** `res`: The response object

#### Return
- **Object** Statique instance

### `redirect(res, newUrl)`
Redirects the user to the new url passed in the second argument.

#### Params
- **String** `res`: The response object
- **String** `newUrl`: The new url where the user should be redirected

#### Return
- **Object** Statique instance

### `error(req, res, errCode, errMessage)`
Sends an error to client

#### Params
- **Object** `req`: The request object
- **Object** `res`: The response object
- **Number** `errCode`: The error code
- **String** `errMessage`: The error message

#### Return
- **Object** Statique instance


## Advanced Example

File structure:

```sh
$ tree
.
├── index.js
├── public
│   ├── css
│   │   └── style.css
│   ├── html
│   │   ├── errors
│   │   │   ├── 404.html
│   │   │   └── 500.html
│   │   ├── index.html
│   │   ├── test1.html
│   │   └── test2.html
│   └── images
│       ├── large.jpg
│       └── README.md
└── simple.js

5 directories, 10 files
```

For the file structure above, the following routes would serve files for each url:

```js
{
    "/": "/html/index.html"
  , "/test1/": { get: "/html/test1.html" }
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
        re: true
      , handler: function (req, res) {
            res.end("Hi");
        }
    }
  , "r1": {
        re: /anyletter\-[a-z]/i
      , handler: function (req, res) {
            res.end("Case insensitive is important. ;)");
        }
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
  , "/test1/": { get: "/html/test1.html" }
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
        re: true
      , handler: function (req, res) {
            res.end("Hi");
        }
    }
  , "r1": {
        re: /anyletter\-[a-z]/i
      , handler: function (req, res) {
            res.end("Case insensitive is important. ;)");
        }
    }
}).setErrors({
    404: "/html/errors/404.html"
  , 500: "/html/errors/500.html"
});

// create server
Http.createServer(server.serve.bind(server)).listen(8000, function (err) {
    // Output
    console.log("Listening on 8000.");
});
```

# How to contribute
1. File an issue in the repository, using the bug tracker, describing the
   contribution you'd like to make. This will help us to get you started on the
   right foot.
2. Fork the project in your account and create a new branch:
   `your-great-feature`.
3. Commit your changes in that branch.
4. Open a pull request, and reference the initial issue in the pull request
   message.

## Licence
See the [LICENSE](/LICENSE) file.
