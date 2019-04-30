FROM node:10.15.1-alpine

WORKDIR /usr/app

RUN apk add -U wireguard-tools bash iptables ip6tables linux-headers gettext --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing/

# Backend
COPY node_server/package*.json ./
RUN npm install
RUN npm audit fix
COPY node_server ./

# Frontend
COPY frontend/package*.json ./frontend/
RUN npm --prefix ./frontend install
RUN npm --prefix ./frontend audit fix
COPY frontend frontend
RUN npm --prefix ./frontend run build
RUN mv ./frontend/build ./public

# User Addition CLI
COPY user-cli/package*.json ./user-cli/
RUN npm --prefix ./user-cli install
COPY ./user-cli ./user-cli
RUN npm --prefix ./user-cli link

# Config File and Startup script
COPY server_wg0.conf ./
COPY startup.sh ./

EXPOSE 51820/udp
EXPOSE 5000/tcp

CMD ["./startup.sh"]
