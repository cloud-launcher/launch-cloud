import computeManagement from 'azure-mgmt-compute';

module.exports = azureProvider;

function azureProvider(config) {
  const client = computeManagement.createComputeManagementClient(computeManagement.createCertificateCloudCredentials({
    subscriptionId: config.subscriptionId,
    pem: config.pem
  }));

  return {
    name: 'azure',
    target: 'coreos',
    createMachine,
    destroyMachine
  };

  function createMachine(machineDescription) {
    var {id, location, size, image, keys, userData} = machineDescription;

    return getHostedService(location)
            .then(serviceResult => new Promise((resolve, reject) => {
              client.virtualMachines.createDeployment(config.serviceName, {
                name,
                deploymentSlot: 'Production',
                label,
                roles: [{
                  roleName: id,
                  roleType: 'PersistentVMRole',
                  label: id,
                  oSVirtualHardDisk: {
                    sourceImageName: 'coreos image name',
                    mediaLink: '.vhd goes here?'
                  },
                  dataVirtualHardDisks: [],
                  configurationSets: [{}] // ssh keys and cloud-config?
                }]
              }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
              });
            }));
  }

  function destroyMachine(machine) {
    return getHostedService(location)
            .then(serviceResult => new Promise((resolve, reject) => {
              client
              .virtualMachines
              .deleteMethod(
                serviceName,
                deploymentName,
                virtualMachineName,
                deleteFromStorage,
                (err, result) => {
                  if (err) reject(err);
                  else resolve(result);
                });
            }));
  }

  function apiCallbackHandler(resolve, reject) {
    return (error, data) => {
      if (error) reject(error, data);
      else resolve(data);
    };
  }

  // Will likely need to cache these based on location...
  function createHostedService(config) {
    return new Promise((resolve, reject) => {
      client.hostedServices.create({
        serviceName: config.serviceName,
        label: config.clusterName,
        location: config.location
      }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

azureProvider.name = 'azure';
azureProvider.target = 'coreos';