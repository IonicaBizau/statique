process.on('uncaughtException', function(err) {
    process.stderr.write('Caught exception: ' + err);
});

var Vows = require("vows"),
    Request = require("request"),
    Assert = require("assert"),
    Statique = require("../../lib/");

var sServer = new Statique({
    root: __dirname + "/../fixtures"
}).setRoutes({
    "/crash": {
        get: function (req, res) { undefined.something; }
    }
  , "/": "index.html"
});


var suite = Vows.describe("statique");
var TEST_PORT = 8080;
var TEST_SERVER = "http://localhost:" + TEST_PORT;
var server;
var callback;

var headers = {
    "requesting headers": {
        topic: function() {
            request.head(TEST_SERVER + "/index.html", this.callback);
        }
    }
};

suite.addBatch({
    "once an http server is listening with a callback": {
        topic: function() {
            server = require("http").createServer(function (req, res) {
                sServer.serve(req, res);
            }).listen(TEST_PORT, this.callback)
        },
        "should be listening": function() {
            Assert.isTrue(true);
        }
    }
}).addBatch({
    "streaming a 404 page": {
        topic: function() {
            var callback = this.callback;
            Request.get(TEST_SERVER + "/not-found", function (err, res, body) {
                res.statusCode = 404;
                callback.call(this, err, res, "Custom 404 Stream.");
            });
        },
        "should respond with 404": function(error, response, body) {
            Assert.equal(response.statusCode, 404);
        },
        "should respond with the streamed content": function(error, response, body) {
            Assert.equal(body, "Custom 404 Stream.");
        }
    }
}).addBatch({
    "serving empty.css": {
        topic: function() {
            Request.get(TEST_SERVER + "/empty.css", this.callback);
        },
        "should respond with 200": function(error, response, body) {
            Assert.equal(response.statusCode, 200);
        },
        "should respond with text/css": function(error, response, body) {
            Assert.equal(response.headers["content-type"], "text/css");
        },
        "should respond with empty string": function(error, response, body) {
            Assert.equal(body, "");
        }
    }
}).addBatch({
    "serving hello.txt": {
        topic: function() {
            Request.get(TEST_SERVER + "/hello.txt", this.callback);
        },
        "should respond with 200": function(error, response, body) {
            Assert.equal(response.statusCode, 200);
        },
        "should respond with text/plain": function(error, response, body) {
            Assert.equal(response.headers["content-type"], "text/plain");
        },
        "should respond with hello world": function(error, response, body) {
            Assert.equal(body, "hello world");
        }
    }
}).addBatch({
    "serving index.html from the cache": {
        topic: function() {
            Request.get(TEST_SERVER + "/index.html", this.callback);
        },
        "should respond with 200": function(error, response, body) {
            Assert.equal(response.statusCode, 200);
        },
        "should respond with text/html": function(error, response, body) {
            Assert.equal(response.headers["content-type"], "text/html");
        }
    }
}).addBatch({
    "requesting with If-None-Match": {
        topic: function() {
            var _this = this;
            Request.get(TEST_SERVER + "/index.html", function(error, response, body) {
                Request({
                    method: "GET"
                 , uri: TEST_SERVER + "/index.html"
                 , headers: {
                        "if-none-match": response.headers["etag"]
                    }
                }
              , _this.callback);
            });
        },
        "should respond with 304": function(error, response, body) {
            Assert.equal(response.statusCode, 304);
        }
    },
    "requesting with If-None-Match and If-Modified-Since": {
        topic: function() {
            var _this = this;
            Request.get(TEST_SERVER + "/index.html", function(error, response, body) {
                var modified = Date.parse(response.headers["last-modified"]);
                var oneDayLater = new Date(modified + (24 * 60 * 60 * 1000)).toUTCString();
                var nonMatchingEtag = "1111222233334444";
                Request({
                        method: "GET",
                        uri: TEST_SERVER + "/index.html",
                        headers: {
                            "if-none-match": nonMatchingEtag,
                            "if-modified-since": oneDayLater
                        }
                    },
                    _this.callback);
            });
        },
        "should respond with a 200": function(error, response, body) {
            Assert.equal(response.statusCode, 200);
        }
    }
}).addBatch({
    "requesting POST": {
        topic: function() {
            Request.post(TEST_SERVER + "/index.html", this.callback);
        },
        "should respond with 200": function(error, response, body) {
            Assert.equal(response.statusCode, 200);
        },
        "should not be empty": function(error, response, body) {
            Assert.isNotEmpty(body);
        }
    }
}).addBatch({
    "requesting HEAD": {
        topic: function() {
            Request.head(TEST_SERVER + "/index.html", this.callback);
        },
        "should respond with 200": function(error, response, body) {
            Assert.equal(response.statusCode, 200);
        },
        "head must has no body": function(error, response, body) {
            Assert.isEmpty(body);
        }
    }
}).addBatch({
    "serving subdirectory index": {
        topic: function() {
            Request.get(TEST_SERVER + "/there/", this.callback); // with trailing slash
        },
        "should respond with 404": function(error, response, body) {
            Assert.equal(response.statusCode, 404);
        },
        "should respond with text/html": function(error, response, body) {
            Assert.equal(response.headers["content-type"], "text");
        }
    }
}).addBatch({
    "adding custom error pages": {
        topic: function () {
            sServer.setErrors({
                404: "/errors/404.html"
              , 500: "/errors/500.html"
            });
            throw new Error("Hi");
            var _this = this;
            setTimeout(function () {
                _this.callback();
            }, 1000);
        },
        //"should wait a second until custom error pages are added": function () {
        //    Assert.equal(true, true);
        //}
    }
}).addBatch({
    "streaming a 404 custom page": {
        topic: function() {
            var callback = this.callback;
            Request.get(TEST_SERVER + "/not-found", function (err, res, body) {
                callback.call(this, err, res, "Custom 404 Stream.");
            });
        },
        "should respond with 404": function(error, response, body) {
            Assert.equal(response.statusCode, 404);
        },
        "should respond with the streamed content": function(error, response, body) {
            Assert.equal(body, "Custom 404 Stream.");
        },
        "should respond with text/html": function(error, response, body) {
            Assert.equal(response.headers["content-type"], "text/html");
        }
    },
    "streaming a 500 custom page": {
        topic: function() {
            var callback = this.callback;
            Request.get(TEST_SERVER + "/crash", function (err, res, body) {
                callback.call(this, err, res, "Custom 500 Stream.");
            });
        },
        "should respond with 500": function(error, response, body) {
            Assert.equal(response.statusCode, 500);
        },
        "should respond with the streamed content": function(error, response, body) {
            Assert.equal(body, "Custom 500 Stream.");
        },
        "should respond with text/html": function(error, response, body) {
            Assert.equal(response.headers["content-type"], "text/html");
        },
    }
}).addBatch({
    "reading file (Statique.readFile)": {
        topic: function() {
            var callback = this.callback;
            sServer.readFile("hello.txt", this.callback);
        },
        "content should be 'hello world'": function(err, content) {
            Assert.equal(content, "hello world");
        }
    }
}).export(module);
