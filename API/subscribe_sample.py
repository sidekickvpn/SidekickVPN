#!/usr/bin/env python
import pika
import io
from scapy.all import Ether, IP, TCP
from pcap import parse_packet
from serialize_pkt import SerializePkt


connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()


channel.queue_declare(queue='encrypted-pkts')


def callback(ch, method, properties, body):
    pkt = SerializePkt(body)
    pkt = pkt()

    if pkt.haslayer(IP):
        ip_pkt = pkt.getlayer(IP)
        if ip_pkt.src != "127.0.0.1":
            print("src: {}, dst: {}".format(ip_pkt.src, ip_pkt.dst))


channel.basic_consume(callback,
                      queue='encrypted-pkts',
                      no_ack=True)

print('Connected')
channel.start_consuming()
