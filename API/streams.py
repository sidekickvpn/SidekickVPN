import sys
from scapy.all import sniff
import time
import threading

from API import API


def incoming():
    client.set_callback(client.print_incoming_packets)

    client.read_packets(mode="in")
    # client.read_packets(mode="in", out="s", filename="pkts.pcap")
    # client.save_incoming_packets("pkts.pcap")
    # client.parse_incoming_pcap("pkts.pcap")


def outgoing():
    client.set_callback(client.print_outgoing_packets)

    client.read_packets(mode="out")
    # client.read_packets(mode="out", out="s", filename="pkts.pcap")
    # client.save_incoming_packets("pkts.pcap")
    # client.parse_incoming_pcap("pkts.pcap")


try:
    client = API()

    if len(sys.argv) < 2:
        client.set_client("8Wv1tJv9fZYmxEaBPaAJUXd65PzVpFTCA2kYBPLKZzQ=")
    else:
        client.set_client(sys.argv[1])

    print("Client set to: {}".format(client.public_key))

    # incoming_thread = threading.Thread(target=incoming, group=None)
    # outgoing_thread = threading.Thread(target=outgoing, group=None)

    # incoming_thread.start()
    # outgoing_thread.start()

    # incoming_thread.join()
    # outgoing_thread.join()
    client.set_callback(client.print_outgoing_packets)
    client.read_packets(mode="out")
    # client.save_incoming_packets("pkts.pcap")
    # client.parse_incoming_pcap("pkts.pcap")


except KeyboardInterrupt:
    print("Exiting gracefully...")
