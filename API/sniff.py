from scapy.all import sniff, wrpcap

pkts = sniff(iface='wgnet0', prn= lambda x: x.summary())

print(pkts)