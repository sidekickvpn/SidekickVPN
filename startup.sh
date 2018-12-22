#/bin/bash

umask 077
wg genkey | tee privatekey | wg pubkey > publickey
publickey=$(cat publickey)

# DEBUG
# echo $publickey
# hostname -I

# Add private key to wg0.conf
echo "PrivateKey = "$(cat privatekey) >> /etc/wireguard/wg0.conf

# echo "" >> /etc/wireguard/wg0.conf
# echo "[Peer]" >> /etc/wireguard/wg0.conf
# echo "PublicKey = 8Wv1tJv9fZYmxEaBPaAJUXd65PzVpFTCA2kYBPLKZzQ=" >> /etc/wireguard/wg0.conf
# echo "Endpoint = 10.90.53.137:51820" >> /etc/wireguard/wg0.conf
# echo "AllowedIPs = 192.168.2.2/24" >> /etc/wireguard/wg0.conf

# Create/Enable wg0 interface
wg-quick up wg0

# Begin logging packets
tcpdump -n -X -i wg0 -w logs/wg0_packets.pcap