import fs from 'fs';
import path from 'path';
import hjson from 'hjson';
import minimist from 'minimist';

import core from 'launch-cloud-core';

import DOWrapper from 'do-wrapper';

require('./traceur-runtime');

const args = minimist(process.argv.slice(2));

if (args._.length === 0) {
  console.log('Usage: launch-cloud <path_to_your_cloud_description.json>');
  process.exit(1);
}

const api = core({
  providerApis: {
    amazon: null,
    digitalocean: DOWrapper,
    google: null,
    microsoft: null,
    rackspace: null
  },
  providerConfigs: {
    amazon: {},
    digitalocean: {},
    google: {},
    microsoft: {},
    rackspace: {}
  }
}, (...args) => console.log(...args));



const cloudFilePath = path.resolve(args._[0]);

console.log('Launching', cloudFilePath, '...');
readCloudFile(cloudFilePath)
  .then(cloud => api.launch(cloud))
  .catch(e => console.log('launch error:', e.stack));
  // .then(description => launcher().launch(description));

// promise(fs.readFile, cloudFilePath)
//   .then(
//     contents => {
//       const cloudDescription = hjson.parse(contents.toString());


//       console.log('description:', cloudDescription);
//       process.exit(0);
//     },
//     error => {
//       console.log('Error:', error, arguments);
//       process.exit(1);
//     });

// async function* f() {
//   yield 1;
// }

// (async function() {
//   var list = [];
//   var g = f();
//   for (var i on g) {
//     list.push(i);
//   }
//   assert.deepEqual(list, [1]);

//   done();
// })().catch(done);

// function done() {
//   console.log('arguments', arguments);
// }



// readCloudFile(cloudFilePath)
//   .then(parseCloudFile)
//   .then(validateCloud)
//   .then(generatePlan)
//   .then(executePlan)
//   .catch(e => console.log('error', e.stack));

function readCloudFile(path) {
  console.log('Reading cloudFile');
  return promise(fs.readFile, path);
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

// function validateCloud(cloudDescription) {
//   console.log('Validating cloud description', cloudDescription);
//   const {domain, root, authorizations, locations, configuration, roles, containers} = cloudDescription;
//   return validateDomain(cloudDescription)
//           .then(validateRoot)
//           .then(validateAuthorizations)
//           .then(validateLocations)
//           .then(validateContainers)
//           .then(validateRoles)
//           .then(validateConfiguration)
//           .then(() => { return cloudDescription; });

//   function validateDomain() {
//     console.log('Validating Domain');
//     return new Promise((resolve, reject) => {
//       resolve();
//     });
//   }

//   function validateRoot() {
//     console.log('Validating Root');
//     return new Promise((resolve, reject) => {
//       resolve();
//     });
//   }

//   function validateAuthorizations() {
//     console.log('Validating Authorizations');
//     return new Promise((resolve, reject) => {
//       resolve();
//     });
//   }

//   function validateLocations() {
//     console.log('Validating Locations');
//     return new Promise((resolve, reject) => {
//       _.each(locations, (locations, providerName) => {
//         const provider = providers[providerName];

//         if (!provider) reject(new Error(['No provider with name', providerName].join(' ')));

//         _.each(locations, location => {
//           if (!_.contains(provider.$locations, location)) reject(new Error(['Provider', providerName, 'has no location', location].join(' ')));
//         });
//       });

//       resolve();
//     });
//   }

//   function validateContainers() {
//     console.log('Validating Containers');
//     return Promise
//               .all(_.map(containers, (containerDescription, name) => {
//                 const [namespace, image] = containerDescription.container.split('/'),
//                       [repository, tag] = image.split(':');

//                 return checkDockerRegistry(namespace, repository, tag);
//               }));

//     function checkDockerRegistry(namespace, repository, tag) {
//       tag = tag || 'latest';
//       const url = `https://registry.hub.docker.com/v1/repositories/${namespace}/${repository}/tags/${tag}`;
//       // console.log(`Looking for container ${namespace}/${repository}:${tag} at ${url}`);
//       return new Promise((resolve, reject) => {
//         request(url, (error, response, body) => {
//           if (error) reject(new Error(['Error checking Docker registry', error].join(' ')));
//           else {
//             if (response.statusCode === 200) {
//               console.log(`Found ${namespace}/${repository}:${tag}`);
//               resolve();
//             }
//             else reject(new Error(`Did not find ${namespace}/${repository}:${tag} on Docker registry!`));
//           }
//         });
//       });
//     }
//   }

//   function validateRoles() {
//     return new Promise((resolve, reject) => {
//       resolve();
//     });
//   }

//   function validateConfiguration() {
//     return new Promise((resolve, reject) => {
//       resolve();
//     });
//   }
// }

// function generatePlan(cloudDescription) {
//   return new Promise((resolve, reject) => {
//     const plan = {cloudDescription};
//     console.log('generate', plan);
//     resolve(plan);
//   });
// }

// function executePlan(plan) {
//   return new Promise((resolve, reject) => {
//     console.log('execute', plan);
//     resolve(true);
//   });
// }

// pipe([
//   readCloudFile(cloudFilePath)
//   ,validate()
//   ,generatePlan()
//   ,async(() => pipe([
//     ratelimit('provider', providerLimits)
//     ,generateMachine()
//     ,launchMachine()
//   ]))
// ]);

function promise(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, (error, ...rest) => {
      if (error) reject(error);
      else resolve(...rest);
    });
  });
}

// function launchCloud(cloud) {
//   return new Promise((resolve, reject) => {

//   });
// }

// function readCloudFile(path) {
//   return transform((_, encoding, callback) => {
//     promise(fs.readFile, path)
//       .then(
//         contents => callback(null, contents),
//         error => callback(new Error(error), null));
//   });
// }

// function validate() {
//   return transform((cloudDescription, encoding, callback) => {
//     if (cloudDescription) callback(null, cloudDescription);
//     else callback(new Error('Validation Error'), null);
//   });
// }

// function generatePlan() {
//   return transform((cloudDescription, encoding, callback) => {
//     callback(null, cloudDescription);
//   });
// }

// function async(flow) {
//   return transform((obj, encoding, callback) => {

//   });
// }


// function async(flowConstructor) {
//   return transform((obj, encoding, callback, s) => {
//     const flow = flowConstructor();
//     flow.push(obj);

//     flow.on('error', error => {});
//     flow.on('finish', () => callback(null, null));

//     flow.read();
//   });
// }

// function transform(fn) {
//   const s = stream.Transform();
//   s._transform = (...args) => fn(s, ...args);
//   return rs;
// }


// var cloud = require('./cloud/cloud');

// cloud({test: 'config'})
//   .launch()
//     .then(
//       value => console.log('launched', value),
//       error => console.log('launchError', error));

//return;


// var request = require('request'),
//     uuid = require('uuid'),
//     g = require('generator-trees').g,
//     _ = require('lodash');

// var doProvider = require('./providers/digitalocean')({token: process.env.DO_TOKEN});
// var dummyProvider = require('./providers/dummy');

// (function (provider, log) {
//   var launcher = require('./machineLauncher')(provider, log);

//   log(provider, launcher, 'sup');

//   launchCluster(provider, log)
//     .then(machines => console.log('launched', machines.length, 'machines'),
//           error    => console.log('error', error, error.stack));

//   function launchCluster(provider, log) {
//     console.log(provider);
//     return new Promise((resolve, reject) => {
//       request('https://discovery.etcd.io/new', (error, response, discovery_url) => {
//         if (error) {
//           console.log('Error getting discovery url!');
//           return false;
//         }

//         log('seed', discovery_url);

//         var create = (count, role) => {
//           var location = 'sfo1',
//               size = '512mb',
//               image = 'coreos-alpha',
//               then = () => {};

//           var launch = () => {
//             return _.map(_.range(count), i => {

//               var id = uuid.v4();

//               var machine = {
//                 provider: provider.name,
//                 location,
//                 role,
//                 image,
//                 size,
//                 id,
//                 requested: new Date().getTime()
//               };

//               var metadata = _.map(machine, (value, key) => key + '=' + value).join(',');

//               return {
//                 id,
//                 provider: provider.name,
//                 location,
//                 size,
//                 image
//               };
//             });
//           };

//           // This will cause launch to fire at the end of the chain
//           //setImmediate(launch);

//           var chain = (() => {
//             return fn => {
//               fn();
//               return chain;
//             };
//           })();

//           chain.at = l => chain(() => location = l);
//           chain.size = s => chain(() => size = s);
//           chain.then = t => chain(() => then = t);
//           chain.launch = launch;

//           return chain;
//         };

//         var machines = _.flatten([
//           create(1, 'core').at('sfo1').launch(),
//           create(0, 'benchmarker').at('sfo1').launch(),
//           create(0, 'influxdb').at('sfo1').size('2gb').launch(),
//           create(0, 'grafana').at('sfo1').launch(),
//           create(0, 'broadcaster').at('sfo1').launch()
//         ]);

//         // how do we generate the machines on demand instead of all up front?
//         launcher.launch(toGenerator(machines)).then(machines => {
//           console.log('All machines launched!');
//           fs.writeFileSync(path.join(baseDir, 'cloud.machines'), JSON.stringify(machines));
//           resolve(machines);
//         }, error => reject(error))
//         .catch(error => reject(error));
//       });
//     });
//   }
// // })(doProvider);
// })(dummyProvider, (...args) => console.log(new Date(), ...args));

// function launch(cloud, credentials) {

// }