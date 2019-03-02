FROM node:10.15.1-alpine

WORKDIR /usr/app

RUN apk add -U dnsmasq tcpdump wireguard-tools bash iptables linux-headers git rabbitmq-server --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing/

# Backend Dependencies
COPY node_server/package.json package.json
RUN npm install


# Copy Files
COPY node_server ./
COPY frontend/build ./public
COPY server_wg0.conf /etc/wireguard/wgnet0.conf
COPY startup.sh .
COPY loop.sh .

EXPOSE 51820/udp
EXPOSE 5000/tcp

CMD ["./startup.sh", "&&", "npm", "start", "&&", "./loop.sh"]

