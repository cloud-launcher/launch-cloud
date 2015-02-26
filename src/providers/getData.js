import fs from 'fs';
import DOWrapper from 'do-wrapper';
import _ from 'lodash';

var api = new DOWrapper(process.env.DO_TOKEN);

Promise.all([
  promise(api.sizesGetAll.bind(api))
    .then(transformSizes)
,
  promise(api.regionsGetAll.bind(api))
    .then(transformRegions)
])
.then(makeProfile)
.then(
  profile => promise(fs.writeFile, 'profile.json', JSON.stringify(profile, null, '  ')),
  error => console.log('Error creating profile', error.stack)
);

function promise(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, (error, ...rest) => {
      if (error) reject(error);
      else resolve(...rest);
    });
  });
}

function transformSizes(sizes) {
  return new Promise((resolve, reject) => {
    resolve(_.transform(sizes.sizes, (sizes, size) => {
      const {slug: id, memory, vcpus, disk, transfer, price_monthly, price_hourly, regions} = size;
      sizes[id] = {
        id,
        memory,
        cpus: vcpus,
        disk,
        transfer,
        price_monthly,
        price_hourly,
        regions
      };
    }, {}));
  });
}

function transformRegions(regions) {
  return new Promise((resolve, reject) => {
    resolve(_.transform(_.where(regions.regions, {available: true}), (regions, region) => {
      const {slug: id, name, sizes, available} = region;
      regions[id] = {
        id,
        vicinity: name,
        sizes
      };
    }, {}));
  });
}

function makeProfile(values) {
  const [sizes, regions] = values;
  return {
    sizes,
    regions
  };
}