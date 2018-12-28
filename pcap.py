from scapy.all import rdpcap, IP, TCP, UDP

session_ports = []
packet = rdpcap("logs/wg0_packets.pcap")

for pkt in packet:
    ip_pkt = pkt.getlayer(IP)
    print("{}".format(ip_pkt))
    print("TCP? {}, UDP? {}".format(ip_pkt.haslayer(TCP), ip_pkt.haslayer(UDP)))
    if ip_pkt.haslayer(TCP):
        tcp_pkt = ip_pkt.getlayer(TCP)
        tcp_destination = tcp_pkt.dport
        tcp_payload_size = len(tcp_pkt.payload)
        if tcp_destination in session_ports:
            session_number = session_ports.index(tcp_destination)
        else:
            session_number = len(session_ports)
            session_ports.append(tcp_destination)

        print(tcp_destination, tcp_payload_size, session_number)

    if ip_pkt.haslayer(UDP):
        udp_pkt = ip_pkt.getlayer(UDP)
        udp_destination = udp_pkt.dport
        udp_payload_size = len(udp_pkt.payload)
        if udp_destination in session_ports:
            session_number = session_ports.index(udp_destination)
        else:
            session_number = len(session_ports)
            session_ports.append(udp_destination)
        print(udp_destination, udp_payload_size,
              session_number)
        print(udp_pkt.payload)

print(session_ports)
