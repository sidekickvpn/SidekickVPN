# Install Wireguard
add-apt-repository ppa:wireguard/wireguard
apt-get update
apt-get install wireguard

# IP Forwarding
sysctl -w net.ipv4.ip_forward=1

# Setup DNS Server
echo "server=1.1.1.1" >> /etc/dnsmasq.conf
echo "interace=${VPN_NAME}" >> /etc/dnsmasq.conf

# Build Application image
docker-compose build

# Run VPN and Application
docker-compose up