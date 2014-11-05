var DOWrapper = require('do-wrapper');


module.exports = digitalocean;


function digitalocean(config) {
  return {
    name: 'digitalocean',
    target: 'coreos',
    createMachine,
    destroyMachine
  };

  function createMachine(machineDescription, resolve, reject) {
    var api = new DOWrapper(config.token);

    var {id, location, size, image, keys, userData} = machineDescription;
    api.dropletsCreateNewDroplet(id, location, size, image, {ssh_keys: keys, user_data: userData}, apiCallbackHandler(resolve, reject));
  }

  function destroyMachine(machine, resolve, reject) {
    var api = new DOWrapper(config.token);

    api.dropletsDeleteDroplet(machine.response.droplet.id, apiCallbackHandler(resolve, reject));
  }

  function apiCallbackHandler(resolve, reject) {
    return (error, data) => {
      if (error) reject(error, data);
      else resolve(data);
    };
  }
}

digitalocean.name = 'digitalocean';
digitalocean.target = 'coreos';