var _ = require('lodash');

// Creates a machine launcher
// provider is a function that takes a

module.exports = (provider, log, concurrentLaunches) => {
  var launches = {inProgress: 0, next: 0},
      availableProviders = [];

  concurrentLaunches = concurrentLaunches || 10;

  for (var i = 0; i < concurrentLaunches; i++) availableProviders.push(provider);

  return { launch };

  // Currently can only have one of these running
  // machines is a generator function that yields machine definitions
  function launch(machines) {
    while (true) {
      var result = machines.next(),
          machine = result.value;

      var promise = new Promise
    }
  }


  function launch(machines, progress) {
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
        if (takeCount > 0) assignToProviders(takeCount);
      }

      function qLaunch() { setTimeout(launchMachines, 0); }

      function* assignToProviders(takeCount) {
        return map(zip(toGenerator(take(integers, takeCount), take(machines, takeCount), take(availableProviders, takeCount))), pair => {
          var index = pair[0],
              machine = pair[1],
              provider = pair[2];

          return {
            remaining: takeCount - index, // notify caller how many more values are safe to generate (ie. that we have available providers for)
            promise: new Promise((resolve, reject) => {
              launch(machine, provider)
                .then(result => {
                  var response = result.response,
                      provider = result.provider;

                  availableProviders.push(provider); // Promises should have an onFinally to avoid this duplication

                  machine.providerResponse = response;

                  resolve(machine);
                }, error => {
                  var provider = error.provider;

                  availableProviders.push(provider);

                  reject(error, machine);
                });
            })
          };
        });


        _.chain(q.splice(0, takeCount))
         .zip(availableProviders.splice(0, takeCount))
         .each(pair => {
            var machine = pair[0],
                provider = pair[1];

            launch(machine, provider)
              .then(result => {
                var response = result.response,
                    provider = result.provider;

                machine.response = response;

                progress.launched(machine);

                availableProviders.push(provider); // Promises should have an onFinally to avoid this duplication
                qLaunch();
              }, error => {
                progress.error(error);

                var provider = error.provider;

                availableProviders.push(provider);
                qLaunch();
              });
         });
      }

      function launch(machine, provider) {
        return new Promise((resolve, reject) => {
          provider.createMachine(machine)
                  .then(response => resolve({response, provider}),
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