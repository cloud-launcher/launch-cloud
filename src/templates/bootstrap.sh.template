#!/bin/bash

#DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd /home/core

(
  SWAPSIZE=4G
  SWAPFILE=/${SWAPSIZE}iB.swap
  sudo /usr/bin/fallocate -l ${SWAPSIZE} ${SWAPFILE};
  sudo /usr/bin/chmod 600 ${SWAPFILE};
  sudo /usr/bin/chattr +C ${SWAPFILE};
  sudo /usr/sbin/mkswap ${SWAPFILE};
  sudo /usr/sbin/losetup -f ${SWAPFILE};
  sudo /usr/sbin/swapon $(/usr/sbin/losetup -j ${SWAPFILE} | /usr/bin/cut -d : -f 1);
) &

source util.sh

function set {
  until etcdctl set $1 $2; do echo 'etcd not ready...sleeping' && sleep 1; done
}

setEtcd /machines/$(hostname)/stats/on $(TIME="@$(grep btime /proc/stat | cut -d ' ' -f2)" && date --date=$TIME -Is)
setEtcd /machines/$(hostname)/stats/joindate $(date -Is)
#until etcdctl set /machines/$(hostname)/"$(date)" 1; do echo 'etcd not ready...sleeping' && sleep 1; done

waitForFleet()

{{#services}}
fleetSubmit {{fileName}}
{{/services}}

{{#services}}
fleetStart {{name}}
{{/services}}