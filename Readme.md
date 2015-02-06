launches clouds {╯°□°}╯彡{益}

Pass `launch-cloud` your desired configuration to launch.

###Usage
    launch-cloud yourCloud.json

- [Installation](#installation)
- [Sample Configuration](#sample-configuration)
- [Concepts](#concepts)
- [Implementation Details](#implementation-details)
    - [Providers](#providers)
        - [Digital Ocean](#providers)
    - [DNS](#dns)
    - [Locations](#locations)

###Installation

    npm install -g launch-cloud


###Sample Configuration
````JSON
{
  domain: 'cloud-launcher.io',
  root: 'https://github.com/blakelapierre/launch-cloud',
  root: 'https://github.com/cloud-launcher_io',
  authorizations: ['ssh keys'],
  locations: {
    digitalocean: ['sfo1']
  },
  configuration: {
    bridge: 1,
    www: 1,
    api: 1,
    influxdb: 1
  },
  roles: {
    all: ['cadvisor']
  },
  containers: {
    'google/cadvisor': {
      container: 'google/cadvisor',
      linkTo: 'influxdb'
    },
    bridge: {
      container: 'cloud-launcher/bridge',
      linkTo: 'api'
    },
    www: {
      container: 'cloud-launcher/www',
      linkTo: 'api'
    },
    influxdb: {
      container
    }
  }
}

{
  domain: 'instachat.io',
  locations:{
    digitalocean: ['sfo1', 'nyc3', 'sgp1', 'lon1', 'ams3']
  },
  configuration: {
    website: 1,
    benchmarker: 1,
    mapper: 0,
    influxdb: 1,
    grafana: 1,
    elasticsearch: 0,
    broadcaster: 97,
    stunturn: 0
  },
  roles: {
    all: [{
      container: 'cadvisor',
      linkTo: 'influxdb'
    }],
    website: [{
      container: 'site',
      ports: {
        'http': 80,
        'https': 443
      }
    }],
    influxdb: [{
      container: 'influxdb'
    }],
    grafana: [{
      container: 'grafana',
      linkTo: 'influxdb'
    }]
  },
  defaultSize: {
    // by role
    influxdb: '2gb'
  },
  containers:{
    cadvisor: {
      dockerRepo: 'instantchat/cadvisor',
      requires: ['influxdb:data_in'], // Should be more general than this (containers should supply/require an interface, and something else works out dependencies)
      linkTo: [{
        'influxdb': {
          'to_influxdb': 'ipv4:data_in'
        }
      }],
      env:
    },
    benchmarker: {
      dockerRepo: 'instantchat/benchmarker'
    },
    mapper: {
      dockerRepo: 'instantchat/mapper'
    },
    site: {
      dockerRepo: 'instantchat/site'
    },
    grafana: {
      dockerRepo: 'instantchat/grafana',
      linkTo: [{
        'influxdb': {
          'grafana_influxdb_in': ':data_out'
        }
      }],
      env: {
        'INFLUXDB_HOST': '@influxdb:grafana_influxdb_in'
      }
    },
    influxdb: {
      dockerRepo: 'instantchat/influxdb',
      ports: {
        'data_in': 8086,
        'data_out': 8086,
        'site': 8083
      }
    }
  }
}
````


###Concepts

````
        ____________________________________________
        |                   Cloud                  |
        | ____________  ____________  ____________ |
        ||   Cluster  ||   Cluster  ||   Cluster  ||
        ||            ||            ||            ||
        ||------------||------------||------------||
        || Machine    || Machine    || Machine    ||
        ||  container ||  container ||  container ||
        ||  container ||  container ||  container ||
        ||------------||------------||------------||
        || Machine    || Machine    || Machine    ||
        ||  container ||  container ||  container ||
        ||  container ||  container ||  container ||
        ||------------||------------||------------||
        || Machine    || Machine    || Machine    ||
        ||  container ||  container ||  container ||
        ||  container ||  container ||  container ||
        |------------------------------------------|
        --------------------------------------------

               Fig 1. Nesting of Concepts
````

A Cloud is comprised of one or more Clusters. A cluster is a collection of Machines, preferrably in close geographical proximity. Ideally, they exist in the same datacenter connected via a low-latency, high-bandwidth network. They may be virtual machines and may all exist on the same physical machine. Machines run containers, the deployable units of your system.

By default, it is assumed that Clusters are replicated units of the same system, geographically separated for high-availability in face of physical infrastructure failure and low-latency, high-bandwidth communication with end users. Clusters may be dynamically modified separately from the other Clusters after launch to compensate for varying load or other activities.



###Implementation Details


####Providers

*A provider needs to implement two functions.*

Each function should return a Promise that will either be `resolved` or `rejected`:

    createMachine(description)
    destroyMachine(machine)

The Promise returned by createMachine will `resolve` to a reference to the `machine` and can be passed to `destroyMachine`.


Provider      | Implementation
--------------|---------------
Digital Ocean | [/src/providers/digitalocean.js](/src/providers/digitalocean.js)
Amazon        | Not Implemented
Azure         | Not Implemented
Google        | Not Implemented
Rackspace     | Not Implemented



####DNS

The DNS service (should be pluggable on the backend) should implement the functions:

    setRecord(type, data)
    setA(data)
    ...



####Locations

    digitalocean: [
      'sfo1',
      'nyc3',
      'sgp1',
      'lon1',
      'ams3'
    ]

    amazon: [
      'ap-northeast-1',
      'ap-southeast-1',
      'ap-southeast-2',
      'eu-central-1',
      'eu-west-1',
      'sa-east-1',
      'us-east-1',
      'us-west-1',
      'us-west-2'
    ]

    azure: [
      'Central US',
      'East US',
      'East US 2',
      'US Gov Iowa',
      'US Gov Virginia',
      'North Central US',
      'South Central US',
      'West US',
      'North Europe',
      'East Asia',
      'Southeast Asia',
      'Japan East',
      'Japan West',
      'Brazil South',
      'Austrailia East',
      'Australia Southeast'
    ]

    google: [
      'us-central1:a',
      'us-central1:b',
      'us-central1:f',
      'europe-west1:b',
      'europe-west1:c',
      'asia-east1:a',
      'asia-east1:b',
      'asia-east1:c'
    ]

    rackspace: [
      'dfw',
      'ord',
      'iad',
      'lon',
      'syd',
      'hkg'
    ]