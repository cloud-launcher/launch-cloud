module.exports = config => {
  return { name: 'dummy', createMachine, destroyMachine };

  function createMachine(machineDescription, resolve, reject) {
    setTimeout(() => resolve({id:machineDescription.id}), 500);
  }

  function destroyMachine(machineID, resolve, reject) {
    setTimeout(() => resolve(machineID), 500);
  }
};