johnnys-node-static
===================

Simplified version of node-static module.

![](https://nodei.co/npm/johnnys-node-static.png)

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
      <td><code>setStaticServer</code></td>
      <td>Sets the static server.</td>
      <td></td>
    </tr>
    <tr>
      <td><code>setRoutes</code></td>
      <td>Sets the routes object.</td>
      <td></td>
    </tr>
    <tr>
      <td><code>exists</code></td>
      <td>Verifies if the route does exist and returns <code>true</code> or <code>false</code>.</td>
      <td></td>
    </tr>
    <tr>
      <td><code>serve</code></td>
      <td>Serves the file specified in routes object.</td>
      <td></td>
    </tr>
    <tr>
      <td><code>serveAll</code></td>
      <td>Serves any file from root.</td>
      <td></td>
    </tr>
  </tbody>
</table>

## Example

File structure:
```
root/
├── index.js
└── public/
    └── html/
        ├── index.html
        ├── test1.html
        └── test2.html
```

For the file structure above, the following routes would serve files for each url:

```JSON
{
    "/":       { "url": "/html/index.html" },
    "/test1/": { "url": "/html/test1.html" },
    "/test2/": { "url": "/html/test2.html" }
}
```

This is the content for `index.js` file.

```JS
// require Johnny's static
var JohnnysStatic = require("johnnys-node-static"),
    http = require('http');

// set static server: public folder
JohnnysStatic.setStaticServer({root: "./public"});

// set routes
JohnnysStatic.setRoutes({
    "/":       { "url": "/html/index.html" },
    "/test1/": { "url": "/html/test1.html" },
    "/test2/": { "url": "/html/test2.html" }
});

// create http server
http.createServer(function(req, res) {
    // safe serve
    if (JohnnysStatic.exists(req, res)) {
        // serve file
        JohnnysStatic.serve(req, res, function (err) {
            // not found error
            if (err.code === "ENOENT") {
                res.end("404 - Not found.");
                return;
            }

            // other error
            res.end(JSON.stringify(err));
        });
        return;
    }

    // if the route doesn't exist, it's a 404!
    res.end("404 - Not found");
}).listen(8000);
```

## Test

```
npm install johnnys-node-static
npm test # or ./test.sh
```

## Changelog

### v0.1.3
 - Fixed route setting.

### v0.1.2
 - Fixed the bug related to the status code.

### v0.1.1
 - Added `serveAll` method.

### v0.1.0
 - Initial release.

## Licence

See LICENCE file.
