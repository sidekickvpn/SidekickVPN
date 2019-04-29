export VPN_NET_INTERFACE="wlp2s0"
export VPN_NAME="wgnet0"
export VPN_PORT="51820"
export VPN_IP="192.168.10.1"
export PORT="5000"
export PUBLIC_IP="10.124.27.83"

export ADMIN_PWD=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 200 ; echo '')

echo $ADMIN_PWD

# Substitute variables into docker-compose file
envsubst < raw-docker-compose.yml > docker-compose.yml

# Alias for user-cli tool
alias user-cli="docker exec -it vpntrafficanalysis_sidekick_1 ./user-cli/bin/user-cli"

# Build Application image
docker-compose build

# Run VPN and Application
docker-compose up