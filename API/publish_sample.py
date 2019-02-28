import pika
import time
import random
import json

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost')
)
connection.close()
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost')
)

channel = connection.channel()
channel.queue_declare(queue='reports', durable=False, auto_delete=True)

# Replace with a public key for a device config associated with your account
public_key = "UjjQu8S0rdUDx6UAurqjjd47TUsAAVEy4Yo1zdpvKRg="

for i in range(3):
    # TODO: Add random padding
    message = {
        "name": "SSH Login",
        "severity": "high",
        "message": "Message #{}".format(i),
        "publicKey": public_key  # Device Public Key
    }

    channel.basic_publish(exchange='',
                          routing_key='reports',
                          body=json.dumps(message))
    time.sleep(3)

connection.close()
