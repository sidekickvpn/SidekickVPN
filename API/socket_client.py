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
    pkts = sniff(iface=interface, stop_filter=self.stop_filter)
    print("Finished sniffing...")
    
    
    filename = "{}.pcap".format(mode)
    if mode == "positive":
      wrpcap(filename, pkts)
    elif mode == "negative":
      wrpcap(filename, pkts)

  def send_results(self, results):
    """ Sends the results string to the frontend over the socket """
    self.emit("pythonTrainingResults", results)

  def on_record_pos(self, mode):
    """ Handle Positive Recording event (either start or stop recording) """
    if mode == "start" and self.recording == False:
      self.record_pkts("positive")
    else:
      self.recording = False

  def on_record_neg(self, mode):
    """ Handle Negative Recording event (either start or stop recording) """

    if mode == "start" and self.recording == False:
      self.record_pkts("negative")
    else:
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

# Connect with socket.io using above token to authenticate
sio.connect('http://localhost:{}?auth_token={}'.format(os.environ.get('PORT'), token))

sio.wait()
