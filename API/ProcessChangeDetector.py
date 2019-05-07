#!/usr/bin/env python
# -*- coding: utf-8 -*-

from scapy.all import *

class ProcessChangeDetector:
	def __init__(self, srv_prt=22):
		self.current_state = "None"
		self.current_count = 0
		self.server_port = srv_prt
		self.process_change_desc = []
		self.res_associated_pkts = []
		self.associated_pkts = []
		self.prev_pkt = None
	
	def add_packet(self, pkt, associated_pkt=False):
		if associated_pkt == True:
			self.associated_pkts.append(pkt)
			#print "Total associated packets: {}".format(len(self.associated_pkts))
			return
		
		res = None
		if not pkt.haslayer(TCP):
			return
		if pkt[TCP].dport != self.server_port and pkt[TCP].sport != self.server_port:
			return
		if len(pkt[TCP].payload) == 0:
			return
		if self.prev_pkt is None:
			self.prev_pkt = pkt
			return
		
		#Client-to-Server
		if pkt[TCP].dport == self.server_port:
			if self.prev_pkt[TCP].dport == self.server_port:
				if len(pkt[TCP].payload) == 36 and len(self.prev_pkt[TCP].payload) == 36:
					#print "SilentKeystroke"
					if self.current_state != "SilentKeystroke":
						if self.current_count != 0:
							res = (self.current_state, self.current_count)
							self.res_associated_pkts = self.associated_pkts[:]
						self.current_count = 0
						self.associated_pkts = []
					self.current_state = "SilentKeystroke"
					self.current_count += 1
				
					
		
		#Server-to-Client
		elif pkt[TCP].sport == self.server_port:
			if self.prev_pkt[TCP].dport == self.server_port:
				if len(pkt[TCP].payload) == 36 and len(self.prev_pkt[TCP].payload) == 36:
					if self.current_state != "Keystroke":
						if self.current_count != 0:
							#self.process_change_desc.append((self.current_state, self.current_count))
							#yield (self.current_state, self.current_count)
							res = (self.current_state, self.current_count)
							self.res_associated_pkts = self.associated_pkts[:]
						self.current_count = 0
						self.associated_pkts = []
					self.current_state = "Keystroke"
					self.current_count += 1
					#print "Keystroke"
			elif self.prev_pkt[TCP].sport == self.server_port:
				if self.current_state != "CommandOutput":
					if self.current_count != 0:
						#self.process_change_desc.append((self.current_state, self.current_count))
						#yield (self.current_state, self.current_count)
						res = (self.current_state, self.current_count)
						self.res_associated_pkts = self.associated_pkts[:]
					self.current_count = 0
					self.associated_pkts = []
				self.current_state = "CommandOutput"
				self.current_count += 1
				#print "CommandOutput"
		
		self.prev_pkt = pkt
		#if res is not None:
		#	self.res_associated_pkts = self.associated_pkts[:]
		#	self.associated_pkts = []
		return res
	
	def flush(self):
		if self.current_count != 0:
			return (self.current_state, self.current_count)
	
	def dump_associated_pkts(self):
		pkts_copy = self.res_associated_pkts[:]
		self.res_associated_pkts = []
		return pkts_copy
