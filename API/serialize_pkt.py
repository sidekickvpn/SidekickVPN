from scapy.all import IP


class SerializePkt:
    def __init__(self, pkt):
        self.contents = bytes(pkt)

    def __call__(self):
        """Get the original scapy packet."""
        pkt = IP(self.contents)
        return pkt
