#!/usr/bin/env node
"use strict";

// Dependencies
const Tilda = require("tilda")
  , Statique = require("../lib")
  , Logger = require("bug-killer")
  , CLP = require("clp")
  , Package = require("../package")
  , Abs = require("abs")
  , Http = require("http")
  , fs = require("fs")
  , path = require("path")
  ;

new Tilda(`${__dirname}/../package.json`, {
    options: [
        {
            name: "root"
          , opts: ["r", "root"]
          , desc: "The server public directory."
          , type: String
          , default: "."
        }
      , {
            name: "cache"
          , opts: ["c", "cache"]
          , desc: "The cache value in seconds."
          , type: Number
          , default: 36000
        }
      , {
            name: "port"
          , opts: ["p", "port"]
          , desc: "The port where the server will run."
          , type: Number
          , default: 900
        }
    ],
    examples: [
        "statique # opens the server on port 9000 serving files from the current dir"
      , "statique -p 5000 -r path/to/public -c 0 # without cache"
    ]
}).main(action => {

    const root = Abs(action.options.root.value)
        , cache = +action.options.cache.value
        , port = +action.options.port.value

    // Create *Le Statique* server
    const server = new Statique({
        root
      , cache
    });

    // Create server
    Http.createServer((req, res) => {
        Logger.log([req.method, req.url].join(" "));

        // Get the absolute path
        let p = path.join(server.root, req.url);

        // Check if it exists in the file system
        fs.stat(p, (error, stat) => {
            if (stat && stat.isDirectory()) {
                req.url = path.join(req.url, "index.html");
            }
            server.serve(req, res);
        });
    }).listen(port, err => {
        if (err) { return Logger.log(err); }
        Logger.log("Server is running on http://localhost:" + port);
    })
});
