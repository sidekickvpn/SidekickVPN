#!/bin/bash
set -euo pipefail

wg-quick up wgnet0

VPN_IP=$(grep -Po 'Endpoint\s=\s\K[^:]*' /etc/wireguard/wgnet0.conf)

function finish {
    echo "$(date): Shutting down vpn"
    wg-quick down wgnet0
}

# Our IP address should be the VPN endpoint for the duration of the
# container, so this function will give us a true or false if our IP is
# actually the same as the VPN's
function has_vpn_ip {
    curl --silent --show-error --retry 10 --fail http://checkip.dyndns.com/ | \
        grep $VPN_IP
}

# If our container is terminated or interrupted, we'll be tidy and bring down
# the vpn
trap finish TERM INT

# Every minute we check to our IP address
while [[ has_vpn_ip ]]; do
    sleep 60;
done

echo "$(date): VPN IP address not detected"