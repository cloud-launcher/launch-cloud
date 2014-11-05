var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

var baseDir = path.join(__dirname, '..'),
    cloudMachines = JSON.parse(fs.readFileSync(path.join(baseDir, 'cloud.machines')).toString());

var providers = {};

_.each(cloudMachines, machine => {
  var provider = providers[machine.provider] || require('./providers/' + machine.provider)({token: process.env.DO_TOKEN});

  provider.destroyMachine(machine, data => console.log('destroyed', machine.id), (error, data) => console.log('error', error));
});