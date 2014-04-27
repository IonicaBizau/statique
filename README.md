Statique
========

Simplified version of node-static module.

![](https://nodei.co/npm/statique.png)

## Documentation

<table>
  <thead>
    <tr>
      <th>Function</th>
      <th>Description</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>server</code></td>
      <td>Sets the static server.</td>
      <td>See the example below</td>
    </tr>
    <tr>
      <td><code>setRoutes</code></td>
      <td>Sets the routes object.</td>
      <td>See the example below</td>
    </tr>
    <tr>
      <td><code>getRoute</code></td>
      <td>Get a route providing an url</td>
      <td>See the example below</td>
    </tr>
    <tr>
      <td><code>exists</code></td>
      <td>Verifies if the route does exist and returns <code>true</code> or <code>false</code>.</td>
      <td>See the example below</td>
    </tr>
    <tr>
      <td><code>readFile</code></td>
      <td>Reads a file from root providing the file path</td>
      <td></td>
    </tr>
    <tr>
      <td><code>serve</code></td>
      <td>Serves the file specified in routes object.</td>
      <td></td>
    </tr>
    <tr>
      <td><code>sendRes</code></td>
      <td>Sends a custom content, status code and MIME type</td>
      <td></td>
    </tr>
  </tbody>
</table>

## Example

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
var Statique = require ("statique")
  , http = require('http')
  ;

// statique config
Statique
    .server({root: __dirname + "/public"})
    .setRoutes({
        "/":       "/html/index.html"
      , "/test1/": "/html/test1.html"
      , "/test2/": "/html/test2.html"
    })
  ;

// create server
http.createServer(function(req, res) {
    Statique.serve (req, res);
}).listen(8000);

// output
console.log("Listening on 8000.");
```

## Test

```
npm install statique
npm test # or ./test.sh
```

## Changelog

### v0.2.1
 - Updated tests
 - Serve css and other files that are not provided in route object.

### v0.2.0
 - Deprecated `johnnys-node-static` module
 - Refactored the code
 - Removed `node-static` as dependency

### v0.1.3
 - Fixed route setting.

### v0.1.2
 - Fixed the bug related to the status code.

### v0.1.1
 - Added `serveAll` method.

### v0.1.0
 - Initial release.

## Licence
See LICENSE file.
