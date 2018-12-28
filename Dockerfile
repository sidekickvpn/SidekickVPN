FROM alpine:edge
WORKDIR /usr/app

ARG COMMIT_REF
ARG BUILD_DATE

RUN apk add -U tcpdump wireguard-tools bash iptables linux-headers --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing/

COPY server_wg0.conf /etc/wireguard/wg0.conf
COPY startup.sh .

ENV APP_COMMIT_REF=${COMMIT_REF} APP_BUILD_DATE=${BUILD_DATE}

EXPOSE 51820/udp
CMD /bin/bash ./startup.sh