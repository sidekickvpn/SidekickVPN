#!/bin/bash

umask 077
wg genkey | tee privatekey | wg pubkey > publickey
publickey=$(cat publickey)
sysctl -w net.ipv4.ip_forward=1

# DEBUG
echo Public Key: $publickey
echo Hostname: $(hostname -i || ip addr | awk '/inet/ { print $2 }')

# Add private key to wgnet0.conf
echo "PrivateKey = "$(cat privatekey) >> /etc/wireguard/wgnet0.conf
echo "" >> /etc/wireguard/wg0.conf

echo "server=1.1.1.1" >> /etc/dnsmasq.conf
echo "server=8.8.8.8" >> /etc/dnsmasq.conf
echo "server=8.8.4.4" >> /etc/dnsmasq.conf
echo "interace=$VPN_NAME" >> /etc/dnsmasq.conf

# Create/Enable wg0 interface
wg-quick up $VPN_NAME

# Start node server
node node_server/app.js
