

<!-- Start index.js -->

## Statique

Le Statique
-----------
A node-static minimalist alternative.
Licensed under the MIT license. See the LICENSE file.

Documentation can be found in README and on GitHub:
http://github.com/IonicaBizau/node-statique

## server(options)

Sets the root of the public folder.

### Params: 

* **Object** *options* an object containing the following fields:

### Return:

* **Object** Statique object

## setRoutes(routes)

Sets the routes of the website.

### Params: 

* **Object** *routes* an object containing fields and values in the

### Return:

* **Object** Statique object

## getRoute(url)

Gets the route by providing an @url

### Params: 

* **String** *url* a string representing the url of the page that

### Return:

* **Object** the route object that contains the following fields:

## exists(req)

Checks if a route exists.

### Params: 

* **Object** *req* the request object

### Return:

* **Boolean** true, if the route was found, else false

## readFile(file, callback)

Reads the file and callbacks the content.

### Params: 

* **String** *file* the relative path to the file
* **Function** *callback* the callback function that will be called with an

### Return:

* **Buffer** the raw buffer

## serve(req, res)

Serves the HTML file according by providing the @req and @res parameters

### Params: 

* **Object** *req* the request object
* **Object** *res* the response object

### Return:

* **Object** the Statique instance

## sendRes(res, statusCode, mimeType, content, otherHeaders)

This function is used for sending custom status messages and content
If the @content parameter is not provided or is not a string, the response
will not be ended. The status code and the headers will be set

### Params: 

* **Object** *res* the response object
* **Number** *statusCode* the response status code
* **String** *mimeType* the response mime type
* **String** *content* the content that you want to send via response
* **Object** *otherHeaders* Aditional headers that will be merged with

### Return:

* **Object** the Statique instance

## serveRoute(route, req, res)

serveRoute
Serves a provided route.

### Params: 

* **String** *route* The route that should be served
* **Object** *req* The request object
* **Object** *res* The response object

### Return:

* **Object** The Statique instance

## redirect(res, newUrl)

redirect
Redirects the user to the new url passed in the second argument.

### Params: 

* **String** *res* The response object
* **String** *newUrl* The new url where the user should be redirected

### Return:

* **Object** Statique object

<!-- End index.js -->

