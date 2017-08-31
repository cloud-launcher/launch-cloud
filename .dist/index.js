#!/usr/bin/env node

"use strict";
var $__fs__,
    $__path__,
    $__url__,
    $__hjson__,
    $__minimist__,
    $__promise_45_callback__,
    $__launch_45_cloud_45_core__,
    $__providers__,
    $__request__,
    $__lodash__;
var fs = ($__fs__ = require("fs"), $__fs__ && $__fs__.__esModule && $__fs__ || {default: $__fs__}).default;
var path = ($__path__ = require("path"), $__path__ && $__path__.__esModule && $__path__ || {default: $__path__}).default;
var url = ($__url__ = require("url"), $__url__ && $__url__.__esModule && $__url__ || {default: $__url__}).default;
var hjson = ($__hjson__ = require("hjson"), $__hjson__ && $__hjson__.__esModule && $__hjson__ || {default: $__hjson__}).default;
var minimist = ($__minimist__ = require("minimist"), $__minimist__ && $__minimist__.__esModule && $__minimist__ || {default: $__minimist__}).default;
var promise = ($__promise_45_callback__ = require("promise-callback"), $__promise_45_callback__ && $__promise_45_callback__.__esModule && $__promise_45_callback__ || {default: $__promise_45_callback__}).default;
var core = ($__launch_45_cloud_45_core__ = require("launch-cloud-core"), $__launch_45_cloud_45_core__ && $__launch_45_cloud_45_core__.__esModule && $__launch_45_cloud_45_core__ || {default: $__launch_45_cloud_45_core__}).default;
var providers = ($__providers__ = require("./providers"), $__providers__ && $__providers__.__esModule && $__providers__ || {default: $__providers__}).default;
var request = ($__request__ = require("request"), $__request__ && $__request__.__esModule && $__request__ || {default: $__request__}).default;
var _ = ($__lodash__ = require("lodash"), $__lodash__ && $__lodash__.__esModule && $__lodash__ || {default: $__lodash__}).default;
require('./traceur-runtime');
var args = minimist(process.argv.slice(2));
if (args._.length === 0) {
  console.log('Usage: launch-cloud <path_to_your_cloud_description.json>');
  process.exit(1);
}
var proxies = {
  dockerHubApiRoot: 'http://104.154.35.244',
  discoveryEtcdApiRoot: 'http://23.236.50.60',
  githubRawRoot: 'https://raw.githubusercontent.com'
};
var log = (function() {
  var $__11;
  for (var args = [],
      $__10 = 0; $__10 < arguments.length; $__10++)
    args[$__10] = arguments[$__10];
  return ($__11 = console).log.apply($__11, $traceurRuntime.spread(args));
}),
    api = core({
      providers: providers,
      providerConfigs: {
        amazon: {},
        digitalocean: {},
        google: {},
        microsoft: {},
        rackspace: {}
      },
      log: log,
      request: request,
      proxies: {}
    });
var cloudFile = args._[0];
log('Launching', cloudFile, '...');
readCloudFile(cloudFile).then(parseCloudFile).then((function(cloud) {
  _.each(providers, (function(provider) {
    _.each(provider.credentialSchema, (function(schema, name) {
      provider.credentials[name] = process.env[schema.environmentVariable];
    }));
  }));
  return cloud;
})).then((function(cloud) {
  return api.launch(cloud);
})).catch((function(e) {
  return console.log('Launch Failed', e.stack);
}));
function readCloudFile(cloudFile) {
  console.log('Reading cloudFile');
  var filePath = path.resolve(cloudFile);
  return promise(fs.readFile, filePath).then((function(contents) {
    console.log(contents);
    return contents;
  }), (function(result) {
    return handleNonLocalFile(result.error, cloudFile);
  }));
  function handleNonLocalFile(error, cloudFile) {
    if (error.code === 'ENOENT') {
      var parsed = url.parse(cloudFile);
      if (!parsed.host) {
        parsed.protocol = 'https';
        parsed.host = 'raw.githubusercontent.com';
        parsed.path = cloudFile.endsWith('json') ? cloudFile : (cloudFile + "/master/cloud.hjson");
      }
      var requestUrl = parsed.format();
      console.log(("cloudFile not found locally. Checking Github..." + requestUrl));
      return promise(request, requestUrl).then((function(result) {
        return result[1];
      }));
    }
  }
}
function parseCloudFile(contents) {
  console.log('Parsing cloudFile');
  return new Promise((function(resolve, reject) {
    try {
      resolve(hjson.parse(contents.toString()));
    } catch (ex) {
      reject(ex);
    }
  }));
}

//# sourceMappingURL=index.js.map