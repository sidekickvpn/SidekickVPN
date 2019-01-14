import requests
from scapy.all import sniff, UDP, TCP, wrpcap, rdpcap
from multiprocessing.pool import ThreadPool
from pcap import parse_packet
import io


class API:
    def __init__(self):
        self.public_key = ""
        self.callback = self.capture_packet
        self.pkt_stack = []
        self.data = []

    def set_client(self, public_key):
        """ Set public key of clients """
        self.public_key = public_key

    def set_callback(self, callback):
        """ Set callback to call when sniffing packets """
        self.callback = callback

    def read_incoming_packets(self):
        """
        Monitor traffic with given filter on given interface for the given amount of packet counts.
        When a packet is received, the callback function is called.
        """
        r = requests.get("http://localhost:5000/config")
        local_ip = r.json()["local_ip"]

        r = requests.get(
            "http://localhost:5000/client/{}".format(self.public_key))
        endpoints = r.json()["endpoints"][:-6]

        print("Sniffing started")
        pkts = sniff(filter="((tcp and src {}) or (udp and src {})) and port not 22".format(
            local_ip, endpoints), prn=self.callback())
        # pkts = self.sniff_packets(
        #     "((tcp and src 10.90.53.108) or (udp and src 10.90.53.137)) and port not 22")
        print("Finished sniffing")
        print(self.pkt_stack)
        print(pkts)
        return pkts

    def capture_packet(self):
        def get_packet(pkt):
            self.pkt_stack.append(pkt)
        return get_packet

    def print_packets(self):
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
                    # pkt.show()
                else:
                    summary = io.StringIO()
                    parse_packet(pkt, summary)
                    print("Standalone TCP: {}".format(summary.getvalue()))
                    # pkt.show()
        return get_packet

    def save_incoming_packets(self, filename):
        """
        Similar to read_incoming_packets, but saves to pcap file
        """
        r = requests.get("http://localhost:5000/config")
        local_ip = r.json()["local_ip"]

        r = requests.get(
            "http://localhost:5000/client/{}".format(self.public_key))
        endpoints = r.json()["endpoints"][:-6]

        print("Sniffing started")
        pkts = sniff(filter="((tcp and src {}) or (udp and src {})) and port not 22".format(
            local_ip, endpoints))

        wrpcap(filename, pkts)
        print("Finished sniffing")
        print(self.pkt_stack)
        print(pkts)
        return pkts

    def parse_incoming_pcap(self, filename):
        """
        Reads pcap file created by save_incoming_packets and parses similar to read_incoming_packets 
        """
        pkts = rdpcap(filename)
        for pkt in pkts:
            self.callback()(pkt)

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
