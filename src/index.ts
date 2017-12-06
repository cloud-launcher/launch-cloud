import * as fs from 'fs';
import * as path from 'path';
import {URL, format} from 'url';

import hjson from 'hjson';
import * as minimist from 'minimist';
import promise from 'promise-callback';

import core from 'launch-cloud-core';

import * as providers from './providers';

import request from 'request';

import _ from 'lodash';

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

const log = (...args) => console.log(...args),
      api = core({
        providers,
        providerConfigs: {
          amazon: {},
          digitalocean: {},
          google: {},
          microsoft: {},
          rackspace: {}
        },
        log,
        request,
        proxies: {}
      });


const cloudFile = args._[0];

log('Launching', cloudFile, '...');
readCloudFile(cloudFile)
  .then(parseCloudFile)
  .then(cloud => {
    // maybe only do this for the providers being used
    _.each(providers, provider => {
      _.each(provider.credentialSchema, (schema, name) => {
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

  return promise(fs.readFile, filePath)
          .then(
            contents => {console.log(contents); return contents;},
            result => handleNonLocalFile(result.error, cloudFile));

  function handleNonLocalFile(error, cloudFile) {
    if (error.code === 'ENOENT') {
      const parsed = new URL(cloudFile);

      if (!parsed.host) {
        parsed.protocol = 'https';
        parsed.host = 'raw.githubusercontent.com';
        parsed.pathname = cloudFile.endsWith('json') ? cloudFile : `${cloudFile}/master/cloud.hjson`;
      }

      const requestUrl = format(parsed);
      // const requestUrl = parsed.format();

      console.log(`cloudFile not found locally. Checking Github...${requestUrl}`);

      return promise(request, requestUrl)
              .then(result => {return result[1]; });
    }
  }
}

function parseCloudFile(contents) {
  console.log('Parsing cloudFile');
  return new Promise((resolve, reject) => {
    try {
      resolve(hjson.parse(contents.toString()));
    }
    catch (ex) { reject(ex); }
  });
}