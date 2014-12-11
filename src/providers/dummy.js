module.exports = config => {
  return { name: 'dummy', createMachine, destroyMachine };

  function createMachine(machineDescription) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({id:machineDescription.id}), 500);
    });
  }

  function destroyMachine(machineID) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(machineID), 500);
    });
  }
};