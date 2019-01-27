import io
import socket
from multiprocessing.pool import ThreadPool

from scapy.all import TCP, UDP, rdpcap, sniff, wrpcap

from pcap import parse_packet
from query_wg import get_peer_info

""" 
Definitions:
Requests - Encrypted data from clients comes into server --> Unencrypted data is sent from server to internet
Response - Unencrypted data from internet comes into server --> Encrypted data is sent from server to client
"""


class API:
    """ API to read/save/parse Traffic comming in and out of the VPN """

    def __init__(self):
        self.public_key = ""
        self.callback = self.capture_packet
        self.pkt_stack = []
        self.data = []

        # Open a socket in order to get server's private IP dynamically
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

    def raw_print(self):
        """ Print each packet by itself """
        def get_packet(pkt):
            summary = io.StringIO()
            parse_packet(pkt, summary)
            print("Packet: {}".format(summary.getvalue()))
            print("-" * 20)

        return get_packet

    def read_packets(self, mode="i", out="r", filename="output.pcap"):
        """
        Monitor traffic with given filter on given interface.
        When a packet is received, the callback function is called.

        Keyword arguements:
        mode -- Request vs. Response traffic
                For request use 'req', or 'request'
                For response use 'res', or 'response'

        out --  How to output the results (read real-time or save to file)
                For reading use 'r' or don't give arguement
                For saving use 's'

        filename -- Name of output file if saving sniffed packets
        """
        peer_info = get_peer_info(self.public_key)

        endpoints = peer_info["endpoints"][:-6]
        print("endpoints: {}".format(endpoints))
        print("local IP: {}".format(self.local_ip))
        print("Sniffing started")

        sniff_filter = ""
        if mode == "req" or mode == "request":
            sniff_filter = "((tcp and src {}) or (udp and src {})) and port not 22".format(
                self.local_ip, endpoints)
        elif mode == "res" or mode == "response":
            sniff_filter = "((tcp and dst {}) or (udp and dst {})) and port not 22".format(
                self.local_ip, endpoints)

        pkts = sniff(filter=sniff_filter, prn=self.callback())
        if out == "s":
            wrpcap(filename, pkts)

        print("Finished sniffing")

        # Print packet count summary
        print(pkts)
        return pkts

    def capture_packet(self):
        """Adds packet to packet stack"""
        def get_packet(pkt):
            self.pkt_stack.append(pkt)
        return get_packet

    def print_request_packets(self):
        """ Callback to Pair encrypted request packets with their corresponding unencrypted packet """
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

    def print_response_packets(self):
        """ Callback to Pair unencrypted response packets with their corresponding encrypted packet """
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

    def parse_pcap(self, filename):
        """Reads pcap file created by read_packets and calls callback for each packet"""
        pkts = rdpcap(filename)
        for pkt in pkts:
            self.callback()(pkt)

    def get_packets(self):
        """ 
        Generator function to yeild each packet pair stored in self.data

        Use it after one of the collect pkt callbacks have stored packets in self.data
        """
        for pair in self.data:
            yield (pair["encrypted"], pair["unencrypted"])

    def collect_request_pkts(self):
        """
        Callback function for read_request_pkts and parse_request_pcap.

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
                    pair["encrypted"] = udp
                    pair["unencrypted"] = pkt
                else:
                    pair["encrypyted"] = None
                    pair["unencrypted"] = pkt
                self.data.append(pair)

        return get_packet

    def collect_response_pkts(self):
        """
        Callback function for read_request_pkts and parse_request_pcap.

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
                    pair["unencrypted"] = tcp
                    pair["encrypted"] = pkt
                else:
                    pair["encrypted"] = None
                    pair["unencrypted"] = pkt
                self.data.append(pair)

        return get_packet
