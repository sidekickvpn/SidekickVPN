import sys
from scapy.all import sniff
import time
import threading

from API import API

try:
    client = API()

    if len(sys.argv) < 2:
        client.set_client("8Wv1tJv9fZYmxEaBPaAJUXd65PzVpFTCA2kYBPLKZzQ=")
    else:
        client.set_client(sys.argv[1])

    print("Client set to: {}".format(client.public_key))

    # Use RabbitMQ to publish packets to Queue
    client.set_callback(client.publish_pkt)
    client.read_plain_pkts()


except KeyboardInterrupt:
    print("Exiting gracefully...")
