import socketio
import requests
import sys
import os
from scapy.all import sniff, wrpcap

# Init Socket.io client
sio = socketio.Client()


class SidekickNamespace(socketio.ClientNamespace):
  recording = False

  def stop_filter(self, pkt):
    return not self.recording

  def record_pkts(self, mode):
    """ 
    Start sniffing on WireGuard interface 
    
    Keyword arguements:
      mode -- positive or negative
              positive: Normal traffic
              negative: Potential sidechanels (ex. SSH password entry, etc.)
    """
    if not os.environ.get("VPN_NET_INTERFACE"):
      print("VPN_NET_INTERFACE not set")
      sys.exit(1)
    
    interface = os.environ.get("VPN_NET_INTERFACE")
    self.recording = True

    print("Mode: {} - Sniffing on {}".format(mode, interface))

    # Prn for testing purposes
    pkts = sniff(iface=interface, stop_filter=self.stop_filter, prn=lambda x: print(f"Recording: {self.recording} - {x}"))
    print("Finished sniffing...")
    
    
    filename = "{}.pcap".format(mode)
    if mode == "positive":
      wrpcap(filename, pkts)
    elif mode == "negative":
      wrpcap(filename, pkts)
      

  def on_record_pos(self, mode):
    if mode == "start" and self.recording == False:
      print("Recording positive pkts...")
      self.record_pkts("positive")
    else:
      print("Stop recording positive pkts...")
      self.recording = False

  def on_record_neg(self, mode):
    if mode == "start" and self.recording == False:
      print("Recording negative pkts...")
      self.record_pkts("negative")
    else:
      print("Stop recording negative pkts...")
      self.recording = False

  def on_connect(self):
    print('connection established')

  def on_disconnect(self):
    print('disconnected from server')

sio.register_namespace(SidekickNamespace('/sidekick'))

# Login to server using admin account (ADMIN_PWD is in .env folder, need to set it before running this script)
r = None
if os.environ.get('ADMIN_PWD'):
  r = requests.post('http://localhost:{}/api/users/login'.format(os.environ.get('PORT')), data={
    "email": "admin",
    "password": os.environ.get('ADMIN_PWD')
  })
else:
  print("ADMIN_PWD environment variable not set")
  sys.exit(1)

# Get token (removing 'Bearer ')
token = r.json()['token'][7:]

print("Token: {}".format(token))

# Connect with socket.io using above token to authenticate
sio.connect('http://localhost:{}?auth_token={}'.format(os.environ.get('PORT'), token))

sio.wait()
