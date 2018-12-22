FROM ubuntu:latest

WORKDIR /usr/app

RUN apt-get update
RUN apt-get install -y software-properties-common
RUN add-apt-repository --yes ppa:wireguard/wireguard
RUN apt-get update
RUN apt-get install -y wireguard-dkms wireguard-tools 
RUN apt-get install -y iproute2 iptables tcpdump

# Copy files to container
COPY server_wg0.conf /etc/wireguard/wg0.conf
COPY startup.sh .

CMD /bin/bash ./startup.sh