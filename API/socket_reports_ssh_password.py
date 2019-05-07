import socketio
import requests
import sys
import os
from pymongo import MongoClient
from bson.json_util import dumps
import json
from datetime import datetime
from scapy.all import sniff, IP
import random

#Network specifics
NETWORK_ADDRESS_PREFIX = ["192", "168", "10"]

#SSH specific imports
from ProcessChangeDetector import ProcessChangeDetector
SSH_SERVER_PORT = int(sys.argv[1])

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017')
# if (os.environ.get('MONGO_URI')):
#   client = os.environ.get('MONGO_URI')

db = client.sidekickvpn

# Init Socket.io client
sio = socketio.Client()


"""
Report Schema
{
  name: String,
  severity: "HIGH" || "MED" || "LOW",
  message: String,
  vpnIp: String
}

Example report
{
  "name": "Report One",
  "severity": "HIGH",
  "message": "This is a report from python",
  "vpnIp": "192.168.10.16"
}
"""

def sendReport(report):
  """ Construct report, Add Report to database, Send notification over Socket.io """
  # Get the device the report is for, using the given VPN IP
  device = db.devices.find_one({ "vpnIp": report["vpnIp"] })

  if not device:
    print("No device found with VPN IP {}".format(report["vpnIp"]))
    return None

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


ssh_detectors = []
for i in range(256):
	ssh_detectors.append(ProcessChangeDetector(SSH_SERVER_PORT))


def check_pkt(pkt):
  """ Replace this logic with real traffic analysis """
  #print(pkt.summary())
  # Assume all traffic is for the device using VPN IP of 192.168.10.16 (ie. replace with real IP in real code)
  #vpnIP = "192.168.10.17"
  #vpnIP = "192.168.10.35"
  if pkt.haslayer(IP):
    detector_key = None
    if str(pkt[IP].src).split('.')[0:3] == NETWORK_ADDRESS_PREFIX:
      detector_key = int(str(pkt[IP].src).split('.')[3])
    
    if str(pkt[IP].dst).split('.')[0:3] == NETWORK_ADDRESS_PREFIX:
      detector_key = int(str(pkt[IP].dst).split('.')[3])
      
    if detector_key is None:
      return
    
    if detector_key not in range(256):
      return
  
    vpnIP = NETWORK_ADDRESS_PREFIX[0] + "." + NETWORK_ADDRESS_PREFIX[1] + "." + NETWORK_ADDRESS_PREFIX[2] + "." + str(detector_key)
    ret = ssh_detectors[detector_key].add_packet(pkt)
    if bool(ret):
      if ret[0] == "SilentKeystroke":
        sendReport({
          "name": "Report - SSH Sensitive Input",
          "severity": "HIGH",
          "message": "A sensitive input of {} characters was typed over SSH.".format(ret[1]),
          "vpnIp": vpnIP
        })


class SidekickNamespace(socketio.ClientNamespace):
  def on_connect(self):
    print('connection established')
    if (os.environ.get("VPN_NET_INTERFACE")):
      print("Starting sniff on {}".format(os.environ.get("VPN_NET_INTERFACE")))
      sniff(iface=os.environ.get("VPN_NET_INTERFACE"), prn=check_pkt)
    else:
      print("VPN_NET_INTERFACE not set")
      sys.exit(1)

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
