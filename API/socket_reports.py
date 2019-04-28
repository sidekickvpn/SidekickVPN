import socketio
import requests
import sys
import os
from pymongo import MongoClient
from bson.json_util import dumps
import json
from datetime import datetime
from scapy.all import sniff
import random


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

def check_pkt(pkt):
  """ Replace this logic with real traffic analysis """
  print(pkt.summary())

  # Assume all traffic is for the device using VPN IP of 192.168.10.16 (ie. replace with real IP in real code)
  vpnIP = "192.168.10.15"

  # Fake traffic analysis, which has a 10% change of generating a HIGH severity report, 20% for a MED report, and 30% for a LOW
  rand = random.random()
  if (rand < 0.1):
    # Generate HIGH report
    sendReport({
      "name": "Report {}".format(rand*100),
      "severity": "HIGH",
      "message": "This is a HIGH report from python. {}".format(pkt.summary()),
      "vpnIp": vpnIP
    })
  elif (rand >= 0.1 and rand < 0.3):
    # Generate MED report
    sendReport({
      "name": "Report {}".format(rand*100),
      "severity": "MED",
      "message": "This is a MED report from python. {}".format(pkt.summary()),
      "vpnIp": vpnIP
    })
  elif (rand >= 0.3 and rand < 0.6):
    # Generate LOW report
    sendReport({
      "name": "Report {}".format(rand*100),
      "severity": "LOW",
      "message": "This is a LOW report from python. {}".format(pkt.summary()),
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
    "email": "admin@sidekick.com",
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
