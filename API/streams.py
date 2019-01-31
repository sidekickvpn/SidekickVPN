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

    # client.set_callback(client.print_response_packets)
    # client.read_packets(mode="response")
    # client.save_incoming_packets("pkts.pcap")
    # client.parse_incoming_pcap("pkts.pcap")

    # Save to file
    # client.set_callback(client.collect_outgoing_pkts)
    # client.read_packets(mode="out")
    # print(client.data)

    # Read from file
    # client.set_callback(client.print_outgoing_packets)
    # client.parse_pcap(filename="packets.pcap")

    # for encrypted, unencrypted in client.get_packets():
    #     print(encrypted, unencrypted)

    # Use RabbitMQ to publish packets to Queue
    client.set_callback(client.publish_pkt)
    client.read_plain_pkts()


except KeyboardInterrupt:
    print("Exiting gracefully...")
