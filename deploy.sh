# Network Variables
export VPN_NET_INTERFACE="wlp2s0"
export VPN_NAME="wgnet0"
export VPN_PORT="51820"
export VPN_IP="192.168.10.1"
export PORT="5000"
export PUBLIC_IP="192.168.0.101"

# Install Wireguard, dnsmasq (DNS server), ufw (Firewall), and envsubst (To put above variables into docker-comose file)
add-apt-repository ppa:wireguard/wireguard
apt-get update
apt-get install wireguard dnsmasq ufw envsubst

# Configure Firewall
ufw allow 22/tcp # SSH
ufw allow 51820/udp # Wireguard
ufw allow 5000/tcp # Application
ufw deny 27017 # Ensure DB is localhost only
ufw enable

# IP Forwarding
sysctl -w net.ipv4.ip_forward=1

# Setup DNS Server (Change the IP (1.1.1.1) or add new "server=" lines to change/add DNS servers to use)
echo "server=1.1.1.1" >> /etc/dnsmasq.conf
echo "interace=wgnet0" >> /etc/dnsmasq.conf

# Generate MongoDB password (Firewall blocks external connections, so this is an extra layer of protection)
# export MONGO_USER="sidekickvpndb"
# MONGO_PWD=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 50 ; echo '')
# export MONGO_PWD

# Generate admin account password
export ADMIN_PWD=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 200 ; echo '')

echo $ADMIN_PWD

# Substitute variables into docker-compose file
envsubst < raw-docker-compose.yml > docker-compose.yml

# Build Application image
docker-compose build

# Run VPN and Application
docker-compose up