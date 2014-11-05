var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

module.exports = () => {
  var cloudConfigTemplate = hogan.compile(fs.readFileSync(path.join(baseDir, 'cloud-config')).toString()),
      bootstrapTemplate = hogan.compile(fs.readFileSync(path.join(baseDir, 'bootstrap.sh.template')).toString());

  var {cloudConfigTemplate, bootstrapTemplate} = loadTemplates({cloudConfig: 'cloud-config', bootstrap: 'bootstrap.sh.template'});

  function loadTemplates(templates) {
    return _.reduce(templates, (result, fileName, templateName) => {
      result[templateName + 'Template'] = hogan.compile(fs.readFileSync(path.join(baseDir, fileName)).toString());
      return result;
    }, {});
  }
};