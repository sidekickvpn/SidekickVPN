# Sidekick VPN

## Cloud VPS Instance

You will need to setup a Virtual Private Server (VPS) with a cloud provider of your choice. Some examples include AWS, Google Cloud, Digital Ocean, Vultr, etc. Digital Ocean is a good option, as its \$5 CDN/month option should be enough for most users.

The respective website will have detailed instruction on how to setup it up.

Docker and docker-compose will need to be installed on the VPS as well. Some VPS may come with them pre-installed or have easy ways to get a VPS with Docker up and running. For example, the Digital Ocean marketplace has a Docker droplet that could be used.

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

The second command will open up the deployment script.

The first few lines are the different configuration settings you can change. You can keep most of these as they are, but you need to replace `<public-ip>` in `export PUBLIC_IP=<public-ip>` with the public IP of your instance (ie. the IP you used to SSH into it).

NOTE: You may need to run `ip addr` to ensure the network interface being used is `eth0`, otherwise, you will need to change the `VPN_NET_INTERFACE` to the name of the interface being used. For example, if `ip addr` doesn't show an interface called `eth0`, but it has `enp1s0f1`, then change `export VPN_NET_INTERFACE="eth0"` to `export VPN_NET_INTERFACE="enp1s0f1"`

Press `Ctrl + X` then `Y` to save, and finally press `Enter` to exit and save the file.

### Setup

Now run

```
./deploy.sh
```

This will go ahead and get everything setup and started for you.

### Login Credentials

To login into the application once it's setup, you will need to setup a user account. A CLI tool called `user-cli` is included to make this simpler. Run the following commands to get started.

```
alias user-cli="docker exec -it
vpntrafficanalysis_sidekick_1 ./user-cli/bin/user-cli"
```

This command can be copy-pasted into the SSH prompt, to make it easier to run the tool.

```
user-cli add
```

This will prompt you for your firstname, lastname, email, and password. These are only used in the application running on your cloud instance and is not tracked by us. The email and password you enter are what you will use to login.

### Using the application

Now navigate on your machine/device (ie. not in the cloud instance) to `http://<server-public-ip>:5000`, where `<server-public-ip>` is the public IP of your server and `5000` was the default application port.

NOTE: the server-pulic-ip is whatever you used to SSH into the cloud instance.

Once that has loaded you will see a login screen. Enter your crendentials you provided to login.

#### Getting alerts for Google Auto-Complete side-channel detection

Login to the server hosting your Sidekick VPN instance over SSH. Then,
change directory to the `API` directory. Setup the environment variables
as follows:

```bash
cd ~/sidekickvpn/API
export VPN_NET_INTERFACE=wgnet0
export PORT=5000
export ADMIN_PWD=<from docker-compose.yml>
```

replacing `<from docker-compose.yml>` with the value for `ADMIN_PWD` found
in the file `docker-compose.yml` after running the `deploy.sh` script.

We can now start listening for side-channels that reveal information leaked
through the Google Auto-Complete side-channel by running the command:

```bash
python socket_reports_google_autocomplete.py
``` 

Information gathered from the traffic pattern analysis performed by this
script will be sent to and displayed on the Web UI.

#### Getting alerts for SSH private event side-channel detection

Follow the same environment variable setup as was done for the
*Getting alerts for Google Auto-Complete side-channel detection* example.

We can now start listening for side-channels that reveal information leaked
through the SSH traffic pattern analysis side-channel by running the command:

```bash
python socket_reports_ssh_password.py <SSH_SERVER_PORT>
```

replacing `<SSH_SERVER_PORT>` with the TCP port number which the remote
SSH server listens on (eg. 22).

Information gathered from the traffic pattern analysis performed by this
script will be sent to and displayed on the Web UI.

## FAQ

#### I've forgotten my login credentials (Email and/or password)

SSH back into your cloud instance and run through the "Login Credentaials" steps again to create a new user. You can continue using the old configurations on your devices, but you will need to add new ones using the new user in order to see reports.

#### How do I add devices to the VPN?

Login into the application and click on `Add Device` on the Devices tab. Enter a name for the device in the first field. Now you need to generate a private/public key-pair to use. For instructions on how to generate these keys refer to the video below

<VIDEO/LINK HERE>

#### How can I change what DNS servers are used?

By default, the CloudFlare DNS server with address 1.1.1.1 is used for all DNS queries going through the VPN. If, for example, you wanted to use one of Google's DNS (8.8.8.8 or 8.8.4.4 for example), then open the `deploy.sh` script on the cloud instance and got to the line shown below

```
echo "server=1.1.1.1" >> /etc/dnsmasq.conf
```

You can change the value or add similar lines just before or just after this one to replace/add DNS servers to be used by the VPN.

#### Can I use a VPS running something other than Ubuntu?

Other Linux distributions could work, as long as you update the install commands in `deploy.sh` to match how you install packages in that distribution. Furthermore, you may want to check `wireguard.com` to ensure there is a WireGuard package for the distribution and it is not too out of date.
