function Utils() {}
Utils.prototype.normalizeUrl = function (url) {
    if (url && url !== "/" && url.slice(-1) === "/") {
        url = url.slice(0, -1);
    }
    return url;
}

module.exports = new Utils();
