<!-- Please do not edit this file. Edit the `blah` field in the `package.json` instead. If in doubt, open an issue. -->








[![statique](http://i.imgur.com/fzIIqbG.png)](#)











# `$ statique`

 [![Support me on Patreon][badge_patreon]][patreon] [![Buy me a book][badge_amazon]][amazon] [![PayPal][badge_paypal_donate]][paypal-donations] [![Ask me anything](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Travis](https://img.shields.io/travis/IonicaBizau/statique.svg)](https://travis-ci.org/IonicaBizau/statique/) [![Version](https://img.shields.io/npm/v/statique.svg)](https://www.npmjs.com/package/statique) [![Downloads](https://img.shields.io/npm/dt/statique.svg)](https://www.npmjs.com/package/statique) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/@johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

<a href="https://www.buymeacoffee.com/H96WwChMy" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy Me A Coffee"></a>







> A Node.JS static server module with built-in cache options and route features.

















## :cloud: Installation

You can install the package globally and use it as command line tool:


```sh
# Using npm
npm install --global statique

# Using yarn
yarn global add statique
```


Then, run `statique --help` and see what the CLI tool can do.


```
$ statique --help
Usage: statique [options]

A Node.JS static server module with built-in cache options and route features.

Options:
  -p, --port <port>    The port where the server will run.
  -c, --cache <cache>  The cache value in seconds.
  -r, --root <root>    The server public directory.
  -h, --help           Displays this help.
  -v, --version        Displays version information.

Examples:
  $ statique # opens the server on port 9000 serving files from the current dir
  $ statique -p 5000 -r path/to/public -c 0 # without cache

Documentation can be found at https://github.com/IonicaBizau/statique.
```













## :clipboard: Example



Here is an example how to use this package as library. To install it locally, as library, you can use `npm install statique` (or `yarn add statique`):



```js
// Dependencies
var Statique = require("statique/lib/index")
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
  , "/anynumber-[0-9]": {
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












## :question: Get Help

There are few ways to get help:



 1. Please [post questions on Stack Overflow](https://stackoverflow.com/questions/ask). You can open issues with questions, as long you add a link to your Stack Overflow question.
 2. For bug reports and feature requests, open issues. :bug:
 3. For direct and quick help, you can [use Codementor](https://www.codementor.io/johnnyb). :rocket:







## :memo: Documentation

For full API reference, see the [DOCUMENTATION.md][docs] file.












## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## :sparkling_heart: Support my projects
I open-source almost everything I can, and I try to reply to everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications *for free*! You can even change the source code and redistribute (even resell it).

However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:


 - Starring and sharing the projects you like :rocket:
 - [![Buy me a book][badge_amazon]][amazon]—I love books! I will remember you after years if you buy me one. :grin: :book:
 - [![PayPal][badge_paypal]][paypal-donations]—You can make one-time donations via PayPal. I'll probably buy a ~~coffee~~ tea. :tea:
 - [![Support me on Patreon][badge_patreon]][patreon]—Set up a recurring monthly donation and you will get interesting news about what I'm doing (things that I don't share with everyone).
 - **Bitcoin**—You can send me bitcoins at this address (or scanning the code below): `1P9BRsmazNQcuyTxEqveUsnf5CERdq35V6`

    ![](https://i.imgur.com/z6OQI95.png)


Thanks! :heart:
























## :scroll: License

[MIT][license] © [Ionică Bizău][website]






[license]: /LICENSE
[website]: https://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
[badge_patreon]: https://ionicabizau.github.io/badges/patreon.svg
[badge_amazon]: https://ionicabizau.github.io/badges/amazon.svg
[badge_paypal]: https://ionicabizau.github.io/badges/paypal.svg
[badge_paypal_donate]: https://ionicabizau.github.io/badges/paypal_donate.svg
[patreon]: https://www.patreon.com/ionicabizau
[amazon]: http://amzn.eu/hRo9sIZ
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
