import requests
from scapy.all import sniff, UDP, TCP
from multiprocessing.pool import ThreadPool
import queue
from pcap import parse_packet
import io


def capture_packet(pkt):
    print("Packet {}".format(pkt))


def match_packets(backlog_queue):
    def get_packet(pkt):
        if pkt.haslayer(UDP):
            backlog_queue.put(pkt)
        elif pkt.haslayer(TCP):
            if not backlog_queue.empty():
                udp = backlog_queue.get()
                summary = io.StringIO()
                parse_packet(udp, summary)
                print("Encrypted: {}".format(summary.getvalue()))

                summary = io.StringIO()
                parse_packet(pkt, summary)
                print("Unencrypted: {}".format(summary.getvalue()))
            else:
                summary = io.StringIO()
                parse_packet(pkt, summary)
                print("Standalone TCP: {}".format(summary.getvalue()))

    return get_packet


def sniff_packets(filters, iface, callback):
    """
    Monitor traffic with given filter on given interface for the given amount of packet counts.
    When a packet is received, the callback function is called.
    """
    print("Sniffing {}".format(iface))

    backlog_queue = queue.Queue()
    pkts = sniff(filter=filters, iface=iface,
                 prn=callback(backlog_queue))

    print("finished sniffing on {}".format(iface))
    print(pkts)
    return pkts


class API:
    def __init__(self):
        self.public_key = ""
        self.callback = capture_packet

    def set_client(self, public_key):
        """ Set public key of clients """
        self.public_key = public_key

    def set_callback(self, callback):
        """ Set callback to call when sniffing packets """
        self.callback = callback

    def read_packets(self):
        r = requests.get(
            'http://localhost:5000/client/{}'.format(self.public_key))
        endpoints = r.json()["endpoints"][:-6]
        allowed_ips = r.json()["allowed_ips"][:-3]

        pkts = sniff_packets("(udp and ( src {} and dst port 51820 )) or (( port not 22 ) and ( src {} or dst {} ))".format(
            endpoints, allowed_ips, allowed_ips), "wgnet0", self.callback)

        return pkts

    def read_encrypted(self):
        r = requests.get(
            'http://localhost:5000/client/{}'.format(self.public_key))
        endpoints = r.json()["endpoints"][:-6]
        # encrypted_pkts = pool.apply_async(
        #     sniff_packets, ("udp and ( src {} and dst port 51820 )".format(endpoints), "wlan0", count, self.callback))
        pkts = sniff_packets("udp and ( src {} and dst port 51820 )".format(
            endpoints), "wlan0", self.callback)

        return pkts

    def read_unencrypted(self):
        # pool = ThreadPool(processes=2)
        r = requests.get(
            'http://localhost:5000/client/{}'.format(self.public_key))
        allowed_ips = r.json()["allowed_ips"][:-3]

        # unencrypted_pkts = pool.apply_async(
        #     sniff_packets, ("( port not 22 ) and ( src {} or dst {} )".format(allowed_ips, allowed_ips), "wgnet0", count, self.callback))
        pkts = sniff_packets("( port not 22 ) and ( src {} or dst {} )".format(
            allowed_ips, allowed_ips), "wgnet0", self.callback)

        # pool.close()
        # pool.join()
        # return (encrypted_pkts.get(), unencrypted_pkts.get())
        return pkts
