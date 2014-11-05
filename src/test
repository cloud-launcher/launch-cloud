var generators = require('../util/generators');

var {preorder, inorder, postorder, breadthFirst, gMap, gEach, toGenerator, toArray, makeNode, toNode, asNode} = generators;

function* test() {
  yield 1;
  yield 2;
  yield* toGenerator([4, 5, 6, 7]);
  //return null;
}

// gMap(toGenerator([1, 2, 3]), value => console.log(value));

// gMap(test(), value => {
//   if (typeof value == 'function') {
//     gMap(value(), v => console.log('v', v));
//   }
//   console.log('va', value);
// });

// console.log('\ndepth first, toGenerator');
// gMap(depthFirst(makeNode(1, toGenerator([makeNode(2, toGenerator([makeNode(4)])), makeNode(3)]))), value => console.log('value', value));

// console.log('\ndpeth firs 2');
// gMap(depthFirst(makeNode(1, [makeNode(2, [makeNode(4)]), makeNode(3)])), value => console.log('value', value));

var addition = () => {
  return makeNode('+', function* () {
    yield makeNode(1);
    return makeNode('*', function* () {
      yield makeNode(2);
      return makeNode(3);
    });
  });
};

console.log(asNode(makeNode, 1, makeNode('+', [makeNode(3), makeNode(4)])));

console.log('\npreorder addition');
gEach(preorder(addition()), value => console.log('log', value));
console.log(toArray(preorder(addition())));

console.log('\ninorder addition');
gEach(inorder(addition()), value => console.log('log', value));
console.log(toArray(inorder(addition())));

console.log('\npostorder addition');
gEach(postorder(addition()), value => console.log('log', value));
console.log(toArray(postorder(addition())));

console.log('\nbreadthFirst addition');
gEach(breadthFirst(addition()), value => console.log('log', value));
console.log(toArray(breadthFirst(addition())));

console.log('\ndepthFirst addition2');
var addition2 = toGenerator(['+', toGenerator([1]), toGenerator([2])]);
gMap(inorder(addition2), value => console.log('log', value));

var treeNode = () => {
  return makeNode('root', [
          makeNode('+', [makeNode(1), makeNode(2)]),
          makeNode('names', [
            makeNode('five', [makeNode(5)]),
            makeNode('six',  [makeNode(6)])
          ])
        ]);
};

console.log('\ntreeNode');
print(inorder(treeNode()));
gMap(inorder(treeNode()), value => console.log('tr', value));


// var basicTree = {
//   'root': {
//     'one': 1
//   }
// };

// console.log('\nbasic tree');

// var basicTreeNode = toNode(basicTree, '@');

// console.log(basicTreeNode.next());
// console.log(basicTreeNode.next());
// console.log(basicTreeNode.next());
// console.log(basicTreeNode.next());


var tree = {
  'root': {
    '+': [1, 2, {'*': [3, 4]}],
    'middle': {
      'goes': {
        'deep': ['into', 'the', {'tree': true}]
      }
    },
    'names': {
      'five': 5,
      'six': 6
    }
  }
};

// Children are ordered
var tree2 = {
  'root': [
    {'+': [1, 2, {'*': [3, 4]}]},
    {'middle': {'goes': {'deep': ['into', 'the', {'tree': true}]}}},
    {'names': [{'five': 5, 'six': 6}]}
  ]
};

var tree2 = {
  'root': [
    {'+': [
      1,
      2,
      {'*': [3, 4]}]},
    {'middle': {
      'goes': {
        'deep': [
          'into',
          'the',
          {'tree': true}]}}},
    {'names': [
      {'five': 5},
      {'six': 6}]}]
};

var tree2 = {
  'root': [
    {'+': [
      1,
      2,
      {'*': [3, 4]}
    ]},
    {'middle': {
      'goes': {
        'deep': [
          'into',
          'the',
          {'tree': true}]
        }
      }
    },
    {'names': [
      {'five': 5},
      {'six': 6}
    ]}
  ]
};


console.log('\ntree');
console.log(toNode(tree));

var treeNode = toNode(tree, 'root');

console.log(treeNode.next());
console.log(treeNode.next());

gMap(toNode(tree), value => console.log('tree', value));

gMap(toNode(tree), value => {
  if (value && value.next && typeof value.next == 'function') {
    gMap(value, v => console.log('v', v));
  }
  console.log('va', value);
});

console.log('\ndepthFirst');
print(inorder(toNode(tree)));

console.log('\nbreadthFirst');
print(breadthFirst(toNode(tree)));

function print(generator, prefix) {
  prefix = prefix || 'print';
  gMap(generator, value => console.log(prefix, value));
}


function* toNode(obj, value) {
  value = value || '@@root';

  var generator = makeNode(value, () => childrenFunction(obj));
  while (true) {
    var result = generator.next();
    if (result.done) return result.value;
    else yield result.value;
  }

  function* childrenFunction(obj) {
    if (obj.length) {
      for (var i = 0; i < obj.length - 1; i++) yield makeNode(obj[i]);
      return makeNode(obj[i]);
    }
    else if (typeof obj == 'object') {
      var keys = Object.keys(obj);

      if (keys.length == 0) throw new Error('is this allowed?');

      for (var i = 0; i < keys.length - 1; i++) {
        var key = keys[i];
        var childValue = obj[key];

        yield makeNode(key, () => childrenFunction(childValue));

        // There should be a call to makeNode in here somehweret
        // var generator = toNode(childValue, key);
        // var generator = makeNode(key, () => childrenFunction(childValue));
        // while (true) {
        //   var result = generator.next();
        //   yield result.value;
        //   if (result.done) break;
        // }
      }

      var key = keys[i];
      var childValue = obj[key];

      return makeNode(key, () => childrenFunction(childValue));

      // There should be a call to makeNode in here somehwere?
      //var generator = toNode(childValue, key);
      // var generator = makeNode(key, () => childrenFunction(childValue));
      // while (true) {
      //   var result = generator.next();
      //   if (result.done) return result.value;
      //   else yield result.value;
      // }
    }
    else return makeNode(obj);
  }

  // how to handle arrays?

}


// var loop = generators.loop(clusterMachineGenerator(5));

// var result;

// for (var i = 0; i < 100; i++) {
//   result = loop.next();
//   console.log('result', result);
// }

var q = [
  clusterMachineGenerator(10, 'sfo1-'),
  clusterMachineGenerator(5, 'nyc3-'),
  clusterMachineGenerator(7, 'lon1-')
];

function* clusterMachineGenerator(machineCount, prefix) {
  prefix = prefix || '';
  for (var i = 0; i < machineCount; i++) yield generateMachine(i);

  function generateMachine(number) {
    return { id: prefix + i.toString() };
  }
}

function* generator2() {
  var loop = generators.loopUntilEmpty(q),
      queue = loop.next().value;
  var generatorResult;
  do {
    generatorResult = loop.next();

    if (generatorResult.done) return;
    else {
      var machineGenerator = generatorResult.value,
          machineResult = machineGenerator.next();

      if (machineResult.done) queue.remove(machineGenerator);
      else yield machineResult.value;
    }
  } while (!generatorResult.done);
}

var gen = generator2();

var i = 0,
    result;
do {
  // if (i == 21) q.remove(0);
  // if (i == 30) q.add(1, clusterMachineGenerator(4));
  result = gen.next();
  if (!result.done) console.log(i++, result.value);
} while (!result.done);