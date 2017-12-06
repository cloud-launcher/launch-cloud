(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "path", "url", "hjson", "minimist", "promise-callback", "launch-cloud-core", "./providers", "request", "lodash"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs = require("fs");
    const path = require("path");
    const url_1 = require("url");
    const hjson_1 = require("hjson");
    const minimist = require("minimist");
    const promise_callback_1 = require("promise-callback");
    const launch_cloud_core_1 = require("launch-cloud-core");
    const providers = require("./providers");
    const request_1 = require("request");
    const lodash_1 = require("lodash");
    const args = minimist(process.argv.slice(2));
    if (args._.length === 0) {
        console.log('Usage: launch-cloud <path_to_your_cloud_description.json>');
        process.exit(1);
    }
    const proxies = {
        // dockerHubApiRoot: 'http://localhost:3408',
        // discoveryEtcdApiRoot: 'http://localhost:3409'
        dockerHubApiRoot: 'http://104.154.35.244',
        discoveryEtcdApiRoot: 'http://23.236.50.60',
        githubRawRoot: 'https://raw.githubusercontent.com'
    };
    const log = (...args) => console.log(...args), api = launch_cloud_core_1.default({
        providers,
        providerConfigs: {
            amazon: {},
            digitalocean: {},
            google: {},
            microsoft: {},
            rackspace: {}
        },
        log,
        request: request_1.default,
        proxies: {}
    });
    const cloudFile = args._[0];
    log('Launching', cloudFile, '...');
    readCloudFile(cloudFile)
        .then(parseCloudFile)
        .then(cloud => {
        // maybe only do this for the providers being used
        lodash_1.default.each(providers, provider => {
            lodash_1.default.each(provider.credentialSchema, (schema, name) => {
                provider.credentials[name] = process.env[schema.environmentVariable];
            });
        });
        return cloud;
    })
        .then(cloud => api.launch(cloud))
        .catch(e => console.log('Launch Failed', e.stack));
    function readCloudFile(cloudFile) {
        console.log('Reading cloudFile');
        const filePath = path.resolve(cloudFile);
        return promise_callback_1.default(fs.readFile, filePath)
            .then(contents => { console.log(contents); return contents; }, result => handleNonLocalFile(result.error, cloudFile));
        function handleNonLocalFile(error, cloudFile) {
            if (error.code === 'ENOENT') {
                const parsed = new url_1.URL(cloudFile);
                if (!parsed.host) {
                    parsed.protocol = 'https';
                    parsed.host = 'raw.githubusercontent.com';
                    parsed.pathname = cloudFile.endsWith('json') ? cloudFile : `${cloudFile}/master/cloud.hjson`;
                }
                const requestUrl = url_1.format(parsed);
                // const requestUrl = parsed.format();
                console.log(`cloudFile not found locally. Checking Github...${requestUrl}`);
                return promise_callback_1.default(request_1.default, requestUrl)
                    .then(result => { return result[1]; });
            }
        }
    }
    function parseCloudFile(contents) {
        console.log('Parsing cloudFile');
        return new Promise((resolve, reject) => {
            try {
                resolve(hjson_1.default.parse(contents.toString()));
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
});

//# sourceMappingURL=index.js.map
