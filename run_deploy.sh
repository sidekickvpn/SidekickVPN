#!/bin.bash

docker-compose stop
cd vpntrafficanalysis
git pull origin master
docker-compose up
npm --prefix node_server start
