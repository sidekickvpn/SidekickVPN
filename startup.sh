#!/bin/bash

umask 077
wg genkey | tee privatekey | wg pubkey > publickey
publickey=$(cat publickey)
sysctl -w net.ipv4.ip_forward=1

# DEBUG
echo Public Key: $publickey
echo Hostname: $(hostname -i)

# Add private key to wgnet0.conf
echo "PrivateKey = "$(cat privatekey) >> /etc/wireguard/wgnet0.conf
echo "" >> /etc/wireguard/wg0.conf
echo "[Peer]" >> /etc/wireguard/wg0.conf
echo "PublicKey = 8Wv1tJv9fZYmxEaBPaAJUXd65PzVpFTCA2kYBPLKZzQ=" >> /etc/wireguard/wg0.conf
echo "AllowedIPs = 192.168.89.0/24" >> /etc/wireguard/wg0.conf

echo "server=1.1.1.1" >> /etc/dnsmasq.conf
echo "server=8.8.8.8" >> /etc/dnsmasq.conf
echo "server=8.8.4.4" >> /etc/dnsmasq.conf
echo "interace=wg0" >> /etc/dnsmasq.conf

# Create/Enable wg0 interface
wg-quick up wgnet0
