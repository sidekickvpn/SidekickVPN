#!/bin.bash

docker-compose stop
cd vpntrafficanalysis
git pull origin master
docker-compose up
npm --prefix node_server start

            # mkdir -p ~/.ssh
            # echo "$DEPLOY_SERVER_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
            # chmod 600 ~/.ssh/id_rsa
            # eval "$(ssh-agent -s)"
            # ssh-add ~/.ssh/id_rsa
            # ssh-keyscan -H $DEPLOY_SERVER_IP >> ~/.ssh/known_hosts


ssh -v root@${DEPLOY_SERVER_IP} "docker login -u ${DOCKER_LOGIN} -p ${DOCKER_PWD}; \
              docker-compose -f docker-compose.circle-deploy.yml stop; \
              docker-compose -f docker-compose.circle-deploy.yml rm wireguard --force; \
              docker pull ${DOCKER_LOGIN}/${IMAGE_NAME}:latest; \
              docker-compose -f docker-compose.circle-deploy.yml up -d; \