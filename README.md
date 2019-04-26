# Sidekick VPN

## Installation and Setup

SSH into your VPS instance and clone this repository into the instance using the command below. NOTE: The VPS instance should be running Ubuntu, preferably Ubuntu 16 or above.

```
git clone https://github.com/sidekickvpn/sidekickvpn.git
```

### Configuration

Once that has finished, run the following commands in the instance

```
cd sidekickvpn
nano deploy.sh
```

The first few lines are the different configuration settings you can change. You can keep most of these as they are, but you need to replace `<public-ip>` in `export PUBLIC_IP=<public-ip>` with the public IP of your instance (ie. the IP you used to SSH into it).

NOTE: You may need to run `ip addr` to ensure the network interface being used is `eth0`, otherwise, you will need to change the `VPN_NET_INTERFACE` to the name of the interface being used. For example, if `ip addr` doesn't show an interface called `eth0`, but it has `enp1s0f1`, then change `export VPN_NET_INTERFACE="eth0"` to `export VPN_NET_INTERFACE="enp1s0f1"`

### Login Credentials

To login into the application once it's setup, you will need to setup a user account. A CLI tool called `user-cli` is included to make this simpler. Run the following command to get started.

!!!!!USER-CLI COMMAND(S) HERE!!!!!

### Setup

Now run

```
./deploy.sh
```

This will go ahead and get everything setup and started for you.

Now navigate on your machine/device (ie. not in the cloud instance) to `http://<server-public-ip>:5000`, where `<server-public-ip>` is the public IP of your server and `5000` was the default application port

Once that has loaded you will see a login screen. Enter your crendentials you provided to login.
