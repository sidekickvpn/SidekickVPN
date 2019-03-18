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

# DEBUG
echo Public Key: $publickey
# echo Hostname: $(hostname -i || ip addr | awk '/inet/ { print $2 }')

# Setup WireGuard conf file
envsubst < server_wg0.conf > /etc/wireguard/${VPN_NAME}.conf

# Create/Enable wg0 interface
wg-quick up $VPN_NAME

# Start node server
node app.js
