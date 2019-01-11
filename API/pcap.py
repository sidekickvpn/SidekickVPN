import sys
from scapy.all import rdpcap, IP, TCP, UDP


def parse_packet(pkt, out=sys.stdout):
    session_ports = []
    # packet = rdpcap("{}".format(sys.argv[1]))

    # for pkt in packet:
    ip_pkt = pkt.getlayer(IP)
    if ip_pkt is None:
        return
    # print("TCP? {}, UDP? {}".format(ip_pkt.haslayer(TCP), ip_pkt.haslayer(UDP)))
    if ip_pkt.haslayer(TCP):

        tcp_pkt = ip_pkt.getlayer(TCP)
        tcp_destination = tcp_pkt.dport
        tcp_payload_size = len(tcp_pkt.payload)

        # Ignore SSH
        if tcp_destination == 22 or tcp_destination == 55458:
            return

        if tcp_destination in session_ports:
            session_number = session_ports.index(tcp_destination)
        else:
            session_number = len(session_ports)
            session_ports.append(tcp_destination)

        if (tcp_payload_size > 0):
            print("IP: Src {}, Dst {}".format(
                ip_pkt.src, ip_pkt.dst), file=out)
            print("TCP: Dest {}, Size {}, Session # {}".format(
                tcp_destination, tcp_payload_size, session_number), file=out)
            print(tcp_pkt.payload, file=out)

    if ip_pkt.haslayer(UDP):
        udp_pkt = ip_pkt.getlayer(UDP)
        udp_destination = udp_pkt.dport
        udp_payload_size = len(udp_pkt.payload)
        if udp_destination in session_ports:
            session_number = session_ports.index(udp_destination)
        else:
            session_number = len(session_ports)
            session_ports.append(udp_destination)
        if (udp_payload_size > 0):
            print("IP: Src {}, Dst {}".format(
                ip_pkt.src, ip_pkt.dst), file=out)
            print("UDP: Dest {}, Size {}, Session # {}".format(udp_destination, udp_payload_size,
                                                               session_number), file=out)
            print(udp_pkt.payload, file=out)

    print(session_ports, file=out)
