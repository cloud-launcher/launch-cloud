configuration:

  role_name: count

  ex.
    website: 1
    benchmarker: 1

or

  role_name: {
    sub_role1: count,
    sub_role2: count
  }

or

  role_name: [{
    sub_role1: count,
    sub_role2: count
  },{
    sub_role1: count,
    sub_role3: count
  }]


function* consumeConfiguration(configuration) {
  for (var roleName in configuration) {
    var option = configuration[roleName];

    if (isNumber(option)) {
      for (var i = 0; i < option; i++) yield makeMachine(roleName, i);
    }
    else {
      if (!isArray(option)) option = [option];

      for (var i = 0; i < option.length; i++) {
        var bundle = option[i];

        yield* makeBundle(bundle, roleName, i);
      }
    }
  }

  function isNumber(value) { return typeof value == 'number'; }

  function isArray(value) {

  }

  function makeMachine(roleName) {
    var role = roles[roleName];

    if (!role) throw Error('Role not found!', roleName);

    each(role, element => {

    })
  }

  function* makeBundle(configuration, outerRoleName, index) {

  }

  function
}