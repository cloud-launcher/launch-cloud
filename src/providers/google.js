import Google from 'googleapis';


module.exports = google;


function google(config) {
  const instances = Google.Compute.instances;

  return {
    name: 'google',
    target: 'coreos',
    createMachine,
    destroyMachine
  };

  function createMachine(machineDescription) {
    return new Promise((resolve, reject) => {
      const {id, location, size, image, keys, userData} = machineDescription;

      const clusterID = config.clusterID,
            zone = getZone(location);

      instances.insert({project, zone, resource}, apiCallbackHandler(resolve, reject));
    });
  }

  function destroyMachine(machine) {
    const {project, zone, instance} = machine;

    return new Promise((resolve, reject) => {
      instances.delete({project, zone, instance}, apiCallbackHandler(resolve, reject));
    });
  }

  function apiCallbackHandler(resolve, reject) {
    return (error, data) => {
      if (error) reject(error, data);
      else resolve(data);
    };
  }
}

google.name = 'google';
google.target = 'coreos';