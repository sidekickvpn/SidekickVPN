import sys
from scapy.all import sniff
import time

from API import API

try:
    client = API()

    if len(sys.argv) < 2:
        client.set_client("8Wv1tJv9fZYmxEaBPaAJUXd65PzVpFTCA2kYBPLKZzQ=")
    else:
        client.set_client(sys.argv[1])

    print("Client set to: {}".format(client.public_key))
    client.set_callback(client.collect_incoming_pkts)

    # client.read_incoming_packets()
    # client.save_incoming_packets("pkts.pcap")
    client.parse_incoming_pcap("pkts.pcap")

except KeyboardInterrupt:
    print("Exiting gracefully...")
