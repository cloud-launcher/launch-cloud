var fs = require('fs');
var DOWrapper = require('do-wrapper');

var api = new DOWrapper(process.env.DO_TOKEN);

promise(api.sizesGetAll.bind(api))
  .then(
    sizes => promise(fs.writeFile, 'sizes.json', JSON.stringify(sizes, null, '  ')),
    error => console.log('Error retrieving sizes', error.stack));

promise(api.regionsGetAll.bind(api))
  .then(
    regions => promise(fs.writeFile, 'regions.json', JSON.stringify(regions, null, ' ')),
    error => console.log('Error retrieving regions', error.stack));


function promise(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, (error, ...rest) => {
      if (error) reject(error);
      else resolve(...rest);
    });
  });
}