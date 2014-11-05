var generators = require('../util/generators');

module.exports = definition => {
  var manifest = createManifest(definition);

  return {machineGenerator};

  function machineGenerator() {
    clusterMachineGenerators
    return generators.loopUntilEmpty(clusterMachineGenerators);
  }

  function createManifest(definition) {
    var containers = definition.containers,
        containerManifest = _.map(containers, parseContainer);
  }

  function parseContainer(container, name) {
    return {
      name,
      construct: () => {
        //return
      }
    };
  }

  function launch() {

  }
};


// function* generator(q) {
//   var next = 0;

//   q.onRemoved(index => {
//     if (next > index) {
//       next = next == 0 ? q.length - 1 : next - 1;
//     }
//   });

//   q.onAdded(index => {
//     if (index <= next) {
//       //next =
//     }
//   });

//   while (q.length > 0) {
//     yield q[next];
//     next = (next + 1) % q.length;
//   }
// }

// for (var result of generator(q)) {
//   if (result.done) remove this generator;
//   else yield result;
// }



// cloudSchema = {
//   domain: '',
//   locations: {providerName: [locations]},
//   configuration: {roleName: machineCount},
//   defaultSize: {roleName: 'machineSize' || roleName: {providerName: 'machineSize'}},
//   roles: {roleName: roleDefinition},
//   containers: {containerName: containerDefinition}
// }


// manifest = {
//   locations: [{
//     id: ''
//     name: ''
//     provider: '',

//     machines: [{
//       id,
//       location: 'location',
//       size: '',
//       image: '',
//       keys: [],
//       userData: 'cloud-config goes here'
//     }]
//   }]
// }