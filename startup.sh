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

# Setup DNS
echo "server=1.1.1.1" >> /etc/dnsmasq.conf
echo "server=8.8.8.8" >> /etc/dnsmasq.conf
echo "server=8.8.4.4" >> /etc/dnsmasq.conf
echo "interace=${VPN_NAME}" >> /etc/dnsmasq.conf


# Setup WireGuard conf file
envsubst < server_wg0.conf > /etc/wireguard/${VPN_NAME}.conf

# Turn off existing interface, if it exists
wg-quick down $VPN_NAME

# Create/Enable wg0 interface
wg-quick up $VPN_NAME

# Generate mongo secret
MONGO_SECRET=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 50 ; echo '')
export MONGO_SECRET

# Generate admin account password
ADMIN_PWD=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 200 ; echo '')
export ADMIN_PWD

echo "Sleeping for 10 sec to let MongoDB startup"
sleep 10

# Add admin account
./user-cli/bin/user-cli admin

# Start node server
node app.js
