#!/bin.bash

cd vpntrafficanalysis
git pull origin master
npm --prefix node_server start
PUBLIC_IP=$1 VPN_IP=$2 MONGO_URI=$3 MONGO_SECRET=$4 NODE_ENV=production VPN_NAME=$5 npm --prefix $HOME/vpntrafficanalysis/node_server/ start