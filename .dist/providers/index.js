(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "provider-digitalocean/.dist/provider/server"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const DO = require("provider-digitalocean/.dist/provider/server");
    const digitalocean = DO();
    exports.digitalocean = digitalocean;
});

//# sourceMappingURL=index.js.map
