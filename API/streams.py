import sys
from subprocess import call
from multiprocessing.pool import ThreadPool
from scapy.all import sniff
import requests
import time

from API import API, match_packets
from pcap import parse_packet


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

# pool = ThreadPool(processes=2)
try:
    # with open("logs.txt", "w+") as logs:
    # def append_log(pkt):
    #     # logs.write(str(pkt))
    #     parse_packet(pkt, logs)
    #     logs.write('\n\n')

    def parse(pkt):
        parse_packet(pkt)
        print("\n")

    client = API()
    client.set_client("8Wv1tJv9fZYmxEaBPaAJUXd65PzVpFTCA2kYBPLKZzQ=")
    client.set_callback(match_packets)

    # results.append(pool.apply_async(client.read_encrypted))
    # results.append(pool.apply_async(client.read_unencrypted))
    client.read_packets()

except KeyboardInterrupt:
    print("Exiting gracefully...")
