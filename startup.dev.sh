#!/bin/bash

umask 077

# Check if Private key was given
if [[ -z "${PRIVATE_KEY}" ]]; then
  wg genkey | tee privatekey | wg pubkey > publickey
  export PRIVATE_KEY=$(cat privatekey)
  publickey=$(cat publickey)
else
  echo $PRIVATE_KEY | wg pubkey > publickey
  publickey=$(cat publickey)
fi
# sysctl -w net.ipv4.ip_forward=1

echo Public Key: $publickey
# echo Hostname: $(hostname -i || ip addr | awk '/inet/ { print $2 }')

# Setup WireGuard conf file
envsubst < server_wg0.conf > /etc/wireguard/${VPN_NAME}.conf

# Setup DNS
# echo "server=1.1.1.1" >> /etc/dnsmasq.conf
# echo "server=8.8.8.8" >> /etc/dnsmasq.conf
# echo "server=8.8.4.4" >> /etc/dnsmasq.conf
# echo "interace=${VPN_NAME}" >> /etc/dnsmasq.conf

# Create/Enable wg0 interface
wg-quick up $VPN_NAME

# Start node server
if [[ -z "$1" ]]; then
  NODE_ENV=test npm test
else
  npm --prefix node_server run dev
fi
