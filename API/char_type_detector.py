#!/usr/bin/env python
# -*- coding: utf-8 -*-

from scapy.all import *

CONST_CHAR_TYPED = 0
CONST_NEW_SEARCH = 1
CONST_NULL = 2

class CharTypeDetector:
	def __init__(self, s_ip, key_sz, min_dly, max_dly):
		self.source_ip = s_ip
		self.keystroke_size = key_sz
		self.min_delay = min_dly
		self.max_delay = max_dly
		self.prev_time = None
		self.tokens = []
		self.session = None
		self.chars_typed = 0
	
	def add_packet(self, pkt):
		if pkt.haslayer(TCP):
			if (pkt[IP].src == self.source_ip) or (self.source_ip == '0.0.0.0'):
				if len(pkt[TCP].payload) == self.keystroke_size:
					if self.prev_time is None:
						self.prev_time = pkt.time
						#print "Beginning a new search..." #DEBUG
						self.chars_typed = 1
						#self.tokens.append((CONST_NEW_SEARCH, self.session))
						self.tokens = []
					
					if (pkt.time - self.prev_time) < self.max_delay:
						if (pkt.time - self.prev_time) > self.min_delay:
							self.prev_time = pkt.time
							#print "A Letter was typed!" #DEBUG
							self.chars_typed += 1
							self.tokens.append((CONST_CHAR_TYPED, self.session))
							return
					else:
						self.prev_time = None
						self.chars_typed = 0
				
				elif len(pkt[TCP].payload) > 1100:
					#print "Running the search..." #DEBUG
					#return True
					self.prev_time = None
					query_chars = self.chars_typed
					self.chars_typed = 0
					return query_chars
		
		#return CONST_NULL
		self.tokens.append((CONST_NULL, self.session))
	
	def read_tokens(self):
		return self.tokens
	
	def set_session(self, s):
		self.session = s
	
	def get_session(self):
		return self.session
	
	def force_next(self):
		self.prev_time = None

