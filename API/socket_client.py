import socketio
import requests
import os
from pymongo import MongoClient
from bson.json_util import dumps
import json
from datetime import datetime
from scapy.all import sniff, wrpcap

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017')
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
  sio.emit('newPythonReport', report_json)


def main():
  """ This function runs once socket.io has connected """

  # Example new report call
  sendReport({
    "name": "Report One",
    "severity": "HIGH",
    "message": "This is a report from python",
    "publicKey": "yNJDV/AeQkij2hPe2CDIUAUoxjYPpP18wrsGo42uP1Y="
  })

recording = False

def record_pkts(mode):
  """ 
  Start sniffing on WireGuard interface 
  
  Keyword arguements:
    mode -- positive or negative
            positive: Normal traffic
            negative: Potential sidechanels (ex. SSH password entry, etc.)
  """
  interface = os.environ.get("VPN_NAME") if os.environ.get("VPN_NAME") else "wgnet0-default"
  
  recording = True
  print(f"Mode: {mode} - Sniffing on {interface}")
  pkts = sniff(iface=interface, stop_filter=not recording)

  if mode == "positive":
    wrpcap(mode, pkts)
  elif mode == "negative":
    wrpcap(mode, pkts)
    

@sio.on('record/positive')
def on_record_pos(mode):
  print("Recording positive pkts...")
  print(f"Mode: {mode}")

  if mode == "start" and recording == False:
    record_pkts("positive")
  else:
    recording = False

@sio.on('record/negative')
def on_record_neg(mode):
  print("Recording negative pkts...")
  print(f"Mode: {mode}")

  if mode == "start" and recording == False:
    record_pkts("negative")
  else:
    recording = False

@sio.on('connect')
def on_connect():
  print('connection established')
  main()

@sio.on('disconnect')
def on_disconnect():
  print('disconnected from server')


# Login to server using admin account (ADMIN_PWD is in .env folder, need to set it before running this script)
r = requests.post('http://localhost:5000/api/users/login', data={
  "email": "admin",
  "password": os.environ.get('ADMIN_PWD')
})

print(r.json())
# Get token (removing 'Bearer ')
token = r.json()['token'][7:]


# Connect with socket.io using above token to authenticate
sio.connect('http://localhost:5000?auth_token={}'.format(token))
