#!/bin/bash

function setEtcd() {
  until etcdctl set $1 $2; do echo 'etcd not ready...sleeping' && sleep 1; done
}

function waitForFleet() {
  until fleetctl list-units; do echo 'fleet not ready...sleeping' && sleep 1; done
}

function fleetSubmit() {
  until fleetctl submit $1; do echo 'fleet not ready...sleeping' && sleep 1; done
}

function fleetStart() {
  until fleetctl start {{name}}; do echo 'fleect not ready...sleeping' && sleep 1; done
}