# FROM ubuntu:latest

# WORKDIR /usr/app

# RUN apt-get update
# RUN apt-get install -y software-properties-common
# RUN add-apt-repository --yes ppa:wireguard/wireguard
# RUN apt-get update
# RUN apt-get install -y wireguard-dkms wireguard-tools 
# RUN apt-get install -y iproute2 iptables tcpdump
# RUN apt-get install -y linux-headers-$(uname -r)

# # Copy files to container
# COPY server_wg0.conf /etc/wireguard/wg0.conf
# COPY startup.sh .

# CMD /bin/bash ./startup.sh
FROM alpine:latest
WORKDIR /usr/app

ARG COMMIT_REF
ARG BUILD_DATE

RUN apk add -U tcpdump wireguard-dkms wireguard-tools bash iptables linux-headers --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing/

COPY server_wg0.conf /etc/wireguard/wg0.conf
COPY startup.sh .

ENV APP_COMMIT_REF=${COMMIT_REF} APP_BUILD_DATE=${BUILD_DATE}

EXPOSE 51820/udp
CMD /bin/bash ./startup.sh