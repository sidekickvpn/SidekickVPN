# FROM ubuntu:16.04
FROM alpine:edge

WORKDIR /usr/app

ARG COMMIT_REF
ARG BUILD_DATE

RUN apk add -U dnsmasq tcpdump wireguard-tools bash iptables linux-headers --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing/
# RUN apt-get update && \
#   apt-get install -y software-properties-common debconf-utils iptables curl && \
#   add-apt-repository --yes ppa:wireguard/wireguard && \
#   apt-get update && \
#   echo resolvconf resolvconf/linkify-resolvconf boolean false | debconf-set-selections && \
#   apt-get install -y iproute2 wireguard-dkms wireguard-tools curl resolvconf

COPY server_wg0.conf /etc/wireguard/wg0.conf
COPY startup.sh .

# ENV APP_COMMIT_REF=${COMMIT_REF} APP_BUILD_DATE=${BUILD_DATE}

EXPOSE 51820/udp

CMD /bin/bash