sysctl -w net.ipv4.ip_forward=1

echo "server=1.1.1.1" >> /etc/dnsmasq.conf
echo "server=8.8.8.8" >> /etc/dnsmasq.conf
echo "server=8.8.4.4" >> /etc/dnsmasq.conf
echo "interace=${VPN_NAME}" >> /etc/dnsmasq.conf

docker-compose -f ./docker-compose.circle-deploy.yml up