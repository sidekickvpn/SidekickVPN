import requests
from scapy.all import sniff
from multiprocessing.pool import ThreadPool


def capture_packet(pkt):
    print("Packet {}".format(pkt))


def sniff_packets(filters, iface, count, callback):
    """
    Monitor traffic with given filter on given interface for the given amount of packet counts.
    When a packet is received, the callback function is called.
    """
    print("Sniffing {}".format(iface))
    pkts = sniff(filter=filters, iface=iface,
                 count=count, prn=callback)
    print("finished sniffing on {}".format(iface))
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

    def read_packets(self, count):
        pool = ThreadPool(processes=2)
        r = requests.get(
            'http://localhost:5000/client/{}'.format(self.public_key))
        endpoints = r.json()["endpoints"][:-6]
        allowed_ips = r.json()["allowed_ips"][:-3]

        # sniff_packets("udp and ( src {} and dst port 51820 )".format(
        #     endpoints), "wlan0", count)
        # sniff_packets("( port not 22 ) and ( src {} or dst {} )".format(
        #     allowed_ips, allowed_ips), "wgnet0", count)

        encrypted_pkts = pool.apply_async(
            sniff_packets, ("udp and ( src {} and dst port 51820 )".format(endpoints), "wlan0", count, self.callback))
        unencrypted_pkts = pool.apply_async(
            sniff_packets, ("( port not 22 ) and ( src {} or dst {} )".format(allowed_ips, allowed_ips), "wgnet0", count, self.callback))

        pool.close()
        pool.join()
        return (encrypted_pkts.get(), unencrypted_pkts.get())
