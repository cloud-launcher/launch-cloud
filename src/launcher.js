import hjson from 'hjson';
import _ from 'lodash';
import request from 'request';

import providers from './providers';

module.exports = (out) => {
  return {launch};

  async function launch(text) {
    console.log('launch');
    await parse(text)
            .then(validate)
            .then(generatePlan)
            .then(executePlan);

    async function parse(text) {
      console.log('parse');
      return hjson.parse(text.toString());
      // return new Promise((resolve, reject) => {
      //   try {
      //     resolve(hjson.parse(description.toString()));
      //   }
      //   catch (ex) { reject(ex); }
      // });
    }

    function validate(description) {
      const {domain, root, authorizations, locations, configuration, roles, containers} = description;
      return validateDomain(description)
              .then(validateRoot)
              .then(validateAuthorizations)
              .then(validateLocations)
              .then(validateContainers)
              .then(validateRoles)
              .then(validateConfiguration)
              .then(() => { return description; });

      async function validateDomain() {
        console.log('Validating Domain');
      }

      function validateRoot() {
        console.log('Validating Root');
      }

      function validateAuthorizations() {
        console.log('Validating Authorizations');
      }

      function validateLocations() {
        console.log('Validating Locations');

        _.each(locations, (locations, providerName) => {
          const provider = providers[providerName];

          if (!provider) throw new Error(['No provider with name', providerName].join(' '));

          _.each(locations, location => {
            if (!_.contains(provider.$locations, location)) throw new Error(['Provider', providerName, 'has no location', location].join(' '));
          });
        });
      }

      async function validateContainers() {
        console.log('Validating Containers');
        //await ratelimit(3, )
        return Promise
                  .all(_.map(containers, (containerDescription, name) => {
                    const [namespace, image] = containerDescription.container.split('/'),
                          [repository, tag] = image.split(':');

                    return checkDockerRegistry(namespace, repository, tag);
                  }));

        async function checkDockerRegistry(namespace, repository, tag) {
          tag = tag || 'latest';
          const url = `https://registry.hub.docker.com/v1/repositories/${namespace}/${repository}/tags/${tag}`;
          // console.log(`Looking for container ${namespace}/${repository}:${tag} at ${url}`);

          await promise(request, url)
                  .then(
                    response => {
                      if (response.statusCode === 200) {
                        console.log(`Found ${namespace}/${repository}:${tag}`);
                      }
                      else throw new Error(`Did not find ${namespace}/${repository}:${tag} on Docker registry!`);
                    },
                    error => { throw new Error(['Error checking Docker registry', error].join(' ')); });
        }
      }

      function validateRoles() {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }

      function validateConfiguration() {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
    }

    function generatePlan() {
      console.log('generatePlan');
    }

    function executePlan() {
      console.log('executePlan');
    }
  }
};

async function ratelimit(count, gen) {
  // await
}

function promise(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, (error, ...rest) => {
      if (error) reject(error);
      else resolve(...rest);
    });
  });
}