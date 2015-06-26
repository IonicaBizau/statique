## Documentation
You can see below the API reference of this module.

### `Route(route, url)`
Creates a new route object.

#### Params
- **Function|String|Object** `route`: The route handler. Depending on the data type, it will be used for different scopes:
 - `Function`: All the requests will be handled by this function (called with the `request`, `response` and `form` objects).
 - `String`: The path to the file to be served.
 - `Object`: An object containing the `re` field (which will be parsed as regular expression) or the methods object.
- **String|RegExp** `url`: The route url (can be provided as string or `RegExp`).

#### Return
- **Route** The `Route` instance:
 - `handler` (Function|null): The route handler.
 - `file` (String): The path to the file to serve.
 - `methods` (Object): An object containing handlers depending on the request method.
 - `url` (String): The route url.
 - `re` (RegExp|null): The route regular expression.

### `Statique(options)`
Creates a new `Statique` server instance.

#### Params
- **String|Object** `options`: A string indicating the server root path or an object containing the following fields:
 - `root`: A string representing the absolute path to the public folder.
 - `cache`: How long the client is supposed to cache the files Statique serves (in seconds).

#### Return
- **Statique** The `Statique` instance.

### `addRoute(route, url)`
Adds a new route in the Statique instance.

#### Params
- **Function|String|Object** `route`: The route handler. Depending on the data type, it will be used for different scopes:
 - `Function`: All the requests will be handled by this function (called with the `request`, `response` and `form` objects).
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
- **Statique** The `Statique` instance.

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
- **Statique** The `Statique` instance.

### `getRoute(url)`
Gets the route by providing the `url` parameter.

#### Params
- **String** `url`: A string representing the url of the page that must be served.

#### Return
- **Object** The route object that contains the following fields:
 - `url`: The url found in route object
 - `reqUrl`: The url found in route object or the passed `url` parameter
 - `handler`: The handler that is called on that url
 - `data`: The original route from configuration

### `exists(req)`
Checks if a route exists.

#### Params
- **Request** `req`: The request object.

#### Return
- **Boolean** A boolean value that is `true` when the route was found. Otherwise it's `false`.

### `readFile(file, callback)`
Reads the file and callbacks the content.

#### Params
- **String** `file`: The relative path to the file.
- **Function** `callback`: The callback function.

#### Return
- **Stream** The read stream that was created.

### `serve(req, res)`
Serves the file by providing the request and response parameters.

#### Params
- **Request** `req`: The request object.
- **Response** `res`: The response object.

#### Return
- **Statique** The `Statique` instance.

### `sendRes(res, statusCode, mimeType, content, otherHeaders)`
This function is used for sending custom status messages and content
If the `content` parameter is not provided or is not a string, the response
will not be ended. However, the status code and the headers will be set.

#### Params
- **Response** `res`: The response object.
- **Number** `statusCode`: The response status code.
- **String** `mimeType`: The response mime type.
- **String** `content`: The content that you want to send via response.
- **Object** `otherHeaders`: Aditional headers that will be merged with. the basic ones. They have greater priority than basic headers.

#### Return
- **Statique** The `Statique` instance.

### `notFound(req, res)`
Sends the not found response.

#### Params
- **Request** `req`: The request object.
- **Response** `res`: The response object.

#### Return
- **Statique** The `Statique` instance.

### `serverError(req, res)`
Sends the internal server error response.

#### Params
- **Request** `req`: The request object.
- **Response** `res`: The response object.

#### Return
- **Statique** The `Statique` instance.

### `serveFile(path, statusCode, res, req, additionalHeaders, customRoot)`
Serves a file

#### Params
- **String|Object** `path`: The path to the file that should be served or the route object.
- **Number** `statusCode`: The response status code (default: 200).
- **Response** `res`: The response object.
- **Request** `req`: The request object.
- **Object** `additionalHeaders`: Additional headers that should be sent.
- **String** `customRoot`: Path to the custom root (e.g. "/").

#### Return
- **Statique** The `Statique` instance.

### `serveRoute(route, req, res)`
Serves a provided route.

#### Params
- **String** `route`: The route that should be served.
- **Request** `req`: The request object.
- **Response** `res`: The response object.

#### Return
- **Statique** The `Statique` instance.

### `redirect(res, newUrl)`
Redirects the user to the new url passed in the second argument.

#### Params
- **Response** `res`: The response object.
- **String** `newUrl`: The new url where the user should be redirected.

#### Return
- **Statique** The `Statique` instance.

### `error(req, res, errCode, errMessage)`
Sends an error to client

#### Params
- **Request** `req`: The request object.
- **Response** `res`: The response object.
- **Number** `errCode`: The error code.
- **String** `errMessage`: The error message.

#### Return
- **Statique** The `Statique` instance.

