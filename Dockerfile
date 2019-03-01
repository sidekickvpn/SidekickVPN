# FROM ubuntu:16.04
# FROM alpine:edge
FROM node:10.15.1-alpine

WORKDIR /usr/app

# ARG COMMIT_REF
# ARG BUILD_DATE

RUN apk add -U dnsmasq tcpdump wireguard-tools bash iptables linux-headers git rabbitmq-server --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing/

# Backend Dependencies
# COPY node_server/package.json node_server/package.json
# RUN npm --prefix node_server install

# Frontend Dependencies
# COPY frontend/package.json frontend/package.json
# RUN npm --prefix frontend install

# Copy Files
COPY node_server ./node_server
COPY frontend/dist ./frontend/dist
COPY server_wg0.conf /etc/wireguard/wgnet0.conf
COPY startup.sh .


# ENV APP_COMMIT_REF=${COMMIT_REF} APP_BUILD_DATE=${BUILD_DATE}

EXPOSE 51820/udp

ENTRYPOINT [ "./startup.sh && NODE_ENV=production npm --prefix node_server start" ]
CMD /bin/bash