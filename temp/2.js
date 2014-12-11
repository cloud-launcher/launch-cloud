function launchCloud(manifest, launcher) {
  return new Promise(resolve, reject) {
    launcher.launch(generateMachines(manifest))
            .then(
              result => {

              },
              error => {

              }
            );
  }
}

domain,
locations,
configuration: [

]