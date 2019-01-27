import subprocess
import os


def get_server_public_key():
    """ Get the server's public key """
    vpn_name = os.environ.get("VPN_NAME", "wgnet0")

    cmd = subprocess.run(["sudo", "wg", "show", vpn_name, "public-key"], stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE, universal_newlines=True)

    if len(cmd.stderr) > 0:
        print("ERROR: {}".format(cmd.stderr))
        return None

    return cmd.stdout


def get_peer_info(public_key):
    """ Get the info of the peer with the given public key """
    vpn_name = os.environ.get("VPN_NAME", "wgnet0")

    cmd = subprocess.run(["sudo", "wg", "show", vpn_name, "dump"], stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE, universal_newlines=True)
    if len(cmd.stderr) > 0:
        print("ERROR: {}".format(cmd.stderr))
        return None

    peers = cmd.stdout.split("\n")[1:-1]
    for i in range(len(peers)):
        peer = {}
        p = peers[i].split('\t')
        if p[0] == public_key:
            peer["public_key"] = p[0]
            # Index 1 is preshared key --> skip
            peer["endpoints"] = p[2]
            peer["allowed_ips"] = p[3]
            peer["latest_handshake"] = p[4]
            peer["received"] = p[5]
            peer["sent"] = p[6]
            return peer

    # No Matching Peer
    return None
