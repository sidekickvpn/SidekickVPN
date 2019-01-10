import sys
from subprocess import call
from scapy.all import sniff
import requests

from API import API


# Incoming encrypted traffic from clients: udp and port 51820
# Outgoing unencrypted traffic to internet: tcp
# Outgoing encrypted traffic to clients: udp and src port 51820


# r = requests.get(
#     "http://localhost:5000/client/8Wv1tJv9fZYmxEaBPaAJUXd65PzVpFTCA2kYBPLKZzQ=")

# endpoint = r.json()["endpoints"][:-6]
# allowed_ips = r.json()["allowed_ips"][:-3]

# Incoming encrypted traffic from specific client: udp and ( src <endpoint> and dst port 51820 )
# sniff(filter="udp and ( src {} and dst port 51820 )".format(
#     endpoint), iface=sys.argv[1], prn=lambda x: x.show())


# Outgoing unencrypted traffic for specific client: ( port not 22 ) and ( src <allowed-ips> or dst <allowed-ips> )
# sniff(filter="( port not 22 ) and ( src {} or dst {} )".format(
#     allowed_ips, allowed_ips), iface="wgnet0", prn=lambda x: x.show())

# sniff(iface="wlp2s0", prn=lambda x: x.show())
# sniff(filter="udp and port 51820", iface=sys.argv[1], prn=lambda x: x.sprintf(
# "{IP:%IP.src% -> %IP.dst%\n}{Raw:%Raw.load%\n}"))


client = API()
client.get_client("8Wv1tJv9fZYmxEaBPaAJUXd65PzVpFTCA2kYBPLKZzQ=")

results = client.read_packets(12)

print(results)
