echo "Waiting for mongo to start, sleeping for 10..."
sleep 15
python socket_reports.py &
python socket_client.py