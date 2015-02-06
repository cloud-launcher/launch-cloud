var cloud = require('./cloud/cloud');

cloud({test: 'config'})
  .launch()
    .then(
      value => console.log('launched', value),
      error => console.log('launchError', error));

return;


var request = require('request'),
    uuid = require('uuid'),
    g = require('generator-trees').g,
    _ = require('lodash');

var doProvider = require('./providers/digitalocean')({token: process.env.DO_TOKEN});
var dummyProvider = require('./providers/dummy');

(function (provider, log) {
  var launcher = require('./machineLauncher')(provider, log);

  log(provider, launcher, 'sup');

  launchCluster(provider, log)
    .then(machines => console.log('launched', machines.length, 'machines'),
          error    => console.log('error', error, error.stack));

  function launchCluster(provider, log) {
    console.log(provider);
    return new Promise((resolve, reject) => {
      request('https://discovery.etcd.io/new', (error, response, discovery_url) => {
        if (error) {
          console.log('Error getting discovery url!');
          return false;
        }

        log('seed', discovery_url);

        var create = (count, role) => {
          var location = 'sfo1',
              size = '512mb',
              image = 'coreos-alpha',
              then = () => {};

          var launch = () => {
            return _.map(_.range(count), i => {

              var id = uuid.v4();

              var machine = {
                provider: provider.name,
                location,
                role,
                image,
                size,
                id,
                requested: new Date().getTime()
              };

              var metadata = _.map(machine, (value, key) => key + '=' + value).join(',');

              return {
                id,
                provider: provider.name,
                location,
                size,
                image
              };
            });
          };

          // This will cause launch to fire at the end of the chain
          //setImmediate(launch);

          var chain = (() => {
            return fn => {
              fn();
              return chain;
            };
          })();

          chain.at = l => chain(() => location = l);
          chain.size = s => chain(() => size = s);
          chain.then = t => chain(() => then = t);
          chain.launch = launch;

          return chain;
        };

        var machines = _.flatten([
          create(1, 'core').at('sfo1').launch(),
          create(0, 'benchmarker').at('sfo1').launch(),
          create(0, 'influxdb').at('sfo1').size('2gb').launch(),
          create(0, 'grafana').at('sfo1').launch(),
          create(0, 'broadcaster').at('sfo1').launch()
        ]);

        // how do we generate the machines on demand instead of all up front?
        launcher.launch(toGenerator(machines)).then(machines => {
          console.log('All machines launched!');
          fs.writeFileSync(path.join(baseDir, 'cloud.machines'), JSON.stringify(machines));
          resolve(machines);
        }, error => reject(error))
        .catch(error => reject(error));
      });
    });
  }
// })(doProvider);
})(dummyProvider, (...args) => console.log(new Date(), ...args));

function launch(cloud, credentials) {

}