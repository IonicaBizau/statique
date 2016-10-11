
[![statique](http://i.imgur.com/fzIIqbG.png)](#)

# `$ statique`

 [![Patreon](https://img.shields.io/badge/Support%20me%20on-Patreon-%23e6461a.svg)][paypal-donations] [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![AMA](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Travis](https://img.shields.io/travis/IonicaBizau/statique.svg)](https://travis-ci.org/IonicaBizau/statique/) [![Version](https://img.shields.io/npm/v/statique.svg)](https://www.npmjs.com/package/statique) [![Downloads](https://img.shields.io/npm/dt/statique.svg)](https://www.npmjs.com/package/statique) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> A Node.JS static server module with built-in cache options and route features.

## :cloud: Installation

You can install the package globally and use it as command line tool:


```sh
$ npm i -g statique
```


Then, run `statique --help` and see what the CLI tool can do.


```
$ statique --help
Usage: statique [options]

Options:
  -r, --root <root>      The server public directory.
  -c, --cache <seconds>  The cache value in seconds.
  -p, --port <port>      The port where the server will run.
  -h, --help             Displays this help.
  -v, --version          Displays version information.

Examples:
  statique # opens the server on port 9000 serving files from the current dir
  statique -p 5000 -r path/to/public -c 0 # without cache

Documentation can be found at https://github.com/IonicaBizau/statique
```

## :clipboard: Example


Here is an example how to use this package as library. To install it locally, as library, you can do that using `npm`:

```sh
$ npm i --save statique
```



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

## :memo: Documentation

For full API reference, see the [DOCUMENTATION.md][docs] file.

## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## :moneybag: Donations

Another way to support the development of my open-source modules is
to [set up a recurring donation, via Patreon][patreon]. :rocket:

[PayPal donations][paypal-donations] are appreciated too! Each dollar helps.

Thanks! :heart:

## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`bac-results`](https://github.com/IonicaBizau/bac-results)—A daemon to email the user when the baccalaureate results are posted on the official website.
 - [`xhr-form-submitter-test`](https://github.com/IonicaBizau/xhr-form-submitter.js)—Test application for XHR form submitter JavaScript library

## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[patreon]: https://www.patreon.com/ionicabizau
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2013#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
