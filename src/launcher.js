var _ = require('lodash');

module.exports = (provider, log) => {
  var concurrentLaunches = 10,
      launches = {inProgress: 0, next: 0},
      availableProviders = [];

  for (var i = 0; i < concurrentLaunches; i++) availableProviders.push(provider);

  return { launch };

  // Currently can only have one of these running
  function launch(machines) {
    return new Promise((launchResolve, reject) => {
      var q = machines();
      launchMachines();

      function launchMachines() {
        if (machines.remaining == 0) {
          if (availableProviders.length == concurrentLaunches) return launchResolve(machines);
          else {
            qLaunch();
            return;
          }
        }

        var takeCount = Math.min(availableProviders.length, q.length);

        _.chain(q.splice(0, takeCount))
         .zip(availableProviders.splice(0, takeCount))
         .each(pair => {
            var machine = pair[0],
                provider = pair[1];

            launch(machine, provider)
              .then(result => {
                var response = result.response,
                    provider = result.provider;

                console.log('launched', machine.id);
                machine.response = response;
                availableProviders.push(provider);
                qLaunch();
              }, error => {
                var provider = error.provider;
                console.log(error.error);
                availableProviders.push(provider);
                qLaunch();
              });
          });

         function qLaunch() { setTimeout(launchMachines, 0); }
      }

      function launch(machine, provider) {
        return new Promise((resolve, reject) => {
          provider.createMachine(machine,
                                 response => resolve({response, provider}),
                                 error => reject({error, provider}));
        });
      }
    });
  }
};

// var

// for (var )

// function take(generator, count) {
//   var ret = [];
//   for (var i = 0; i < count; i++) {
//     ret.push(generator.next());
//   }
//   return ret;
// }

// launch(function*() {

// });

// function* (clusters) {
//   var clusterGenerators = yield* clusters();

//   for (var machineGenerator of queue()) {
//     var result = machineGenerator.next();
//     if (result.done) removeGenerator(generator); // what is notifyGenerators?
//     yield result.value;
//   });

//   var next = 0;
//   function* queue() {
//     while (q.length > 0) {
//       var generator = q[next];
//       yield generator;
//       next
//     }
//   }

//   function removeGenerator(generator) {

//   }
// }

// function* gMap(array, transform) {
//   for (var i = 0; i < array.length; i++) {
//     yield transform(array[i]);
//   }
// }

// function* aToG(array) {
//   for (var i = 0; i < array.length; i++) {
//     yield array[i];
//   }
// }

module.exports.name = 'digitalocean';