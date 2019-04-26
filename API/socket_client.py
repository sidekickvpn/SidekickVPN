import socketio
import requests
import sys
import os
from pymongo import MongoClient
from bson.json_util import dumps
import json
from datetime import datetime
from scapy.all import sniff, wrpcap


# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017')
if (os.environ.get('MONGO_URI')):
  client = os.environ.get('MONGO_URI')

db = client.sidekickvpn

# Init Socket.io client
sio = socketio.Client()


"""
Report Schema
{
  name: String,
  severity: String,
  message: String,
  publicKey: String
}
"""

def sendReport(report):
  """ Construct report, Add Report to database, Send notification over Socket.io """
  # Get the device the report is for
  device = db.devices.find_one({ "publicKey": report["publicKey"] })

  # Construct the new report
  newReport = {
    "name": report["name"],
    "severity": report["severity"],
    "message": report["message"],
    "device": device["_id"],
    "user": device["user"]
  }


  # Insert report into database
  report_id = db.reports.insert_one(newReport).inserted_id
  report = db.reports.find_one({ "_id": report_id })
  
  # Convert BSON -> JSON -> Dict to extract the ObjectId values
  report_json = json.loads(dumps(report))
  report_json["_id"] = report_json["_id"]["$oid"]
  report_json["device"] = report_json["device"]["$oid"]
  report_json["user"] = report_json["user"]["$oid"]
  report_json["date"] = datetime.utcnow().isoformat()

  # Send notfication using Socket.io
  sio.emit('newPythonReport', report_json, namespace="/sidekick")


def main():
  """ This function runs once socket.io has connected """

  # Example new report call
  sendReport({
    "name": "Report One",
    "severity": "HIGH",
    "message": "This is a report from python",
    "publicKey": "yNJDV/AeQkij2hPe2CDIUAUoxjYPpP18wrsGo42uP1Y="
  })

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
    interface = os.environ.get("VPN_NAME") if os.environ.get("VPN_NAME") else "wgnet0"
    
    self.recording = True
    print(f"Mode: {mode} - Sniffing on {interface}")
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
      # self.record_pkts("negative")
    else:
      print("Stop recording negative pkts...")
      self.recording = False


  def on_record_test(self, mode):
    print(f"Testing...Mode {mode}")

    if mode == "start" and self.recording == False:
      print("Recording positive pkts...")
      # self.record_pkts("positive")
    else:
      print("Stop recording positive pkts...")
      self.recording = False

  def on_connect(self):
    print('connection established')
    # main()

  def on_disconnect(self):
    print('disconnected from server')

sio.register_namespace(SidekickNamespace('/sidekick'))

# Login to server using admin account (ADMIN_PWD is in .env folder, need to set it before running this script)
r = None
if os.environ.get('ADMIN_PWD'):
  r = requests.post('http://localhost:5001/api/users/login', data={
    "email": "admin@sidekick.com",
    "password": os.environ.get('ADMIN_PWD')
  })
else:
  print("ADMIN_PWD environment variable not set")
  sys.exit(1)

# Get token (removing 'Bearer ')
token = r.json()['token'][7:]


# Connect with socket.io using above token to authenticate
sio.connect('http://localhost:5001?auth_token={}'.format(token))

sio.wait()
