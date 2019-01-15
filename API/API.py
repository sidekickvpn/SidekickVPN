import io
import socket
from multiprocessing.pool import ThreadPool

from scapy.all import TCP, UDP, rdpcap, sniff, wrpcap

import requests
from pcap import parse_packet


class API:
    def __init__(self):
        self.public_key = ""
        self.callback = self.capture_packet
        self.pkt_stack = []
        self.data = []

        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        self.local_ip = s.getsockname()[0]
        s.close()

    def set_client(self, public_key):
        """ Set public key of clients """
        self.public_key = public_key

    def set_callback(self, callback):
        """ Set callback to call when sniffing packets """
        self.callback = callback

    def read_packets(self, mode="i", out="r", filename="output.pcap"):
        """
        Monitor traffic with given filter on given interface.
        When a packet is received, the callback function is called.

        Arg: mode - Incoming vs. Outgoing traffic
            For incoming use 'i', 'in', or 'incoming'
            For outgoing use 'o', 'out', or 'outgoing'

        Arg: out - How to output the results (read real-time or save to file)
            For reading use 'r' or don't give arguement
            For saving use 's'

        Arg: filname - Name of output file if saving sniffed packets
        """
        # r = requests.get("http://localhost:5000/config")
        # local_ip = r.json()["local_ip"]
        r = requests.get(
            "http://localhost:5000/client/{}".format(self.public_key))
        endpoints = r.json()["endpoints"][:-6]

        print("Sniffing started")

        sniff_filter = ""
        if mode == "i" or mode == "in" or mode == "incoming":
            sniff_filter = "((tcp and src {}) or (udp and src {})) and port not 22".format(
                self.local_ip, endpoints)
        elif mode == "o" or mode == "out" or mode == "outgoing":
            sniff_filter = "((tcp and dst {}) or (udp and dst {})) and port not 22".format(
                self.local_ip, endpoints)

        pkts = sniff(filter=sniff_filter, prn=self.callback())
        # pkts = self.sniff_packets(
        #     "((tcp and src 10.90.10.100) or (udp and src 10.42.0.1)) and port not 22")

        if out == "s":
            wrpcap(filename, pkts)

        print("Finished sniffing")
        # print(self.pkt_stack)
        print(pkts)
        return pkts

    def capture_packet(self):
        def get_packet(pkt):
            self.pkt_stack.append(pkt)
        return get_packet

    def print_incoming_packets(self):
        def get_packet(pkt):
            if pkt.haslayer(UDP):
                self.pkt_stack.append(pkt)

            elif pkt.haslayer(TCP):
                if len(self.pkt_stack) > 0:
                    udp = self.pkt_stack.pop()
                    summary = io.StringIO()
                    parse_packet(udp, summary)
                    print("Encrypted: {}".format(summary.getvalue()))
                    # pkt.show()

                    summary = io.StringIO()
                    parse_packet(pkt, summary)
                    print("Unencrypted: {}".format(summary.getvalue()))
                    print("-" * 20)
                    # pkt.show()
                else:
                    summary = io.StringIO()
                    parse_packet(pkt, summary)
                    print("Standalone TCP: {}".format(summary.getvalue()))
                    # pkt.show()
        return get_packet

    def print_outgoing_packets(self):
        def get_packet(pkt):
            if pkt.haslayer(TCP):
                self.pkt_stack.append(pkt)

            elif pkt.haslayer(UDP):
                if len(self.pkt_stack) > 0:
                    tcp = self.pkt_stack.pop()
                    summary = io.StringIO()
                    parse_packet(tcp, summary)
                    print("Unencrypted: {}".format(summary.getvalue()))
                    # pkt.show()

                    summary = io.StringIO()
                    parse_packet(pkt, summary)
                    print("Encrypted: {}".format(summary.getvalue()))
                    print("-" * 20)
                    # pkt.show()
                else:
                    summary = io.StringIO()
                    parse_packet(pkt, summary)
                    print("Standalone UDP: {}".format(summary.getvalue()))
                    # pkt.show()
        return get_packet

    # def save_incoming_packets(self, filename):
    #     """
    #     Similar to read_incoming_packets, but saves to pcap file
    #     """
    #     r = requests.get("http://localhost:5000/config")
    #     local_ip = r.json()["local_ip"]

    #     r = requests.get(
    #         "http://localhost:5000/client/{}".format(self.public_key))
    #     endpoints = r.json()["endpoints"][:-6]

    #     print("Sniffing started")
    #     pkts = sniff(filter="((tcp and src {}) or (udp and src {})) and port not 22".format(
    #         local_ip, endpoints))

    #     wrpcap(filename, pkts)
    #     print("Finished sniffing")
    #     print(self.pkt_stack)
    #     print(pkts)
    #     return pkts

    def parse_pcap(self, filename):
        """
        Reads pcap file created by read_packets and parses
        """
        pkts = rdpcap(filename)
        for pkt in pkts:
            self.callback()(pkt)

    def get_packets(self):
        for pair in self.data:
            yield (pair.encrypted, pair.unencrypted)

    def collect_incoming_pkts(self):
        """
        Callback function for read_incoming_pkts and parse_incoming_pcap.

        Saves pairs of encrypted to unencrypted packet of a list of dicts in self.data

        Example: [{encrypted: "...", unencrypted: "..."}, ...]
        """
        def get_packet(pkt):
            if pkt.haslayer(UDP):
                self.pkt_stack.append(pkt)

            elif pkt.haslayer(TCP):
                pair = {}
                if len(self.pkt_stack) > 0:
                    udp = self.pkt_stack.pop()
                    pair["encrypyted"] = udp
                    pair["unencrypyted"] = pkt
                else:
                    pair["encrypyted"] = None
                    pair["unencrypyted"] = pkt
                self.data.append(pair)

        return get_packet

    def collect_outgoing_pkts(self):
        """
        Callback function for read_incoming_pkts and parse_incoming_pcap.

        Saves pairs of encrypted to unencrypted packet of a list of dicts in self.data

        Example: [{encrypted: "...", unencrypted: "..."}, ...]
        """
        def get_packet(pkt):
            if pkt.haslayer(TCP):
                self.pkt_stack.append(pkt)

            elif pkt.haslayer(UDP):
                pair = {}
                if len(self.pkt_stack) > 0:
                    tcp = self.pkt_stack.pop()
                    pair["unencrypyted"] = tcp
                    pair["encrypyted"] = pkt
                else:
                    pair["encrypyted"] = None
                    pair["unencrypyted"] = pkt
                self.data.append(pair)

        return get_packet
