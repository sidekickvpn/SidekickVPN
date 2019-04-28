# Network Variables
export VPN_NET_INTERFACE="eth0"
export VPN_NAME="wgnet0"
export VPN_PORT="51820"
export VPN_IP="192.168.10.1"
export PORT="5000"
export PUBLIC_IP="<public-ip>"


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

# Generate admin account password
export ADMIN_PWD=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 200 ; echo '')

# Substitute variables into docker-compose file
envsubst < raw-docker-compose.yml > docker-compose.yml

# Alias for user-cli tool
alias user-cli="docker exec -it vpntrafficanalysis_sidekick_1 ./user-cli/bin/user-cli"

# Build Application image
docker-compose build

# Run VPN and Application
docker-compose up