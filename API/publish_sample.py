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
public_key = "IHbV9fROkzZnxlO4AOBgN4/kw01WO+cjL5wg7iZWrHg="

for i in range(3):
    # TODO: Add random padding
    message = {
        "name": "SSH Login",
        "severity": "high",
        "message": "Test Message #{}".format(i),
        "publicKey": public_key  # Device Public Key
    }

    channel.basic_publish(exchange='',
                          routing_key='reports',
                          body=json.dumps(message))
    time.sleep(3)

connection.close()
