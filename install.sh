#/bin/bash

# Default values
net_name="wg0"
server_port=51820

usage() {
  echo "Usage: $0 -c <client vpn ip> -p <server public key> -i <server public ip> [-n <network name>]"
}

# Parse arguments
while getopts "c:p:i:n:" opt; do
  case $opt in
    c)
      client_ip=$OPTARG
      ;;
    p)
      server_public=$OPTARG
      ;;
    i)
      server_ip=$OPTARG
      ;;
    n)
      net_name=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      usage
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      usage
      exit 1
      ;;
  esac
done

# Ensure client VPN ip was given
if [ -z "$client_ip" ];
then
  echo "Client VPN ip is required"
  usage
  exit 1
fi

# Ensure server public key was given

if [ -z "$server_public" ];
then
  echo "Server public key required"
  usage
  exit 1
fi

# Ensure server public ip was given
if [ -z "$server_ip" ];
then
  echo "Server public ip required"
  usage
  exit 1
fi

# Generate keys
umask 077
wg genkey | tee privatekey | wg pubkey > publickey
publickey=$(cat publickey)

# Genrate config file
cat > $(echo $net_name).conf <<EOF
[Interface]
Address = ${client_ip}/24
PrivateKey = $(cat privatekey)
DNS = $server_ip

[Peer]
PublicKey = $server_public
AllowedIPs = 0.0.0.0/0
Endpoint = ${server_ip}:${server_port}
PersistentKeepalive = 25
EOF
