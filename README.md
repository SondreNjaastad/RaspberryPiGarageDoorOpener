# Raspberry Pi Garage Door Controller

This project is intended to use on a Raspberry Pi.
Tested and running on a Pi 3B+, running on other models might require you to use other pins.

---
## Requirements

This project requires 
2 sensors for reading garagedoor state
1 relay for controlling the garagedoor motor
1 garagedoor motor that can be controlled via a relay

### Node
- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    vx.xx.x

    $ npm --version
    x.x.x

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###
## Install

    $ git clone https://github.com/SondreNjaastad/RaspberryPiGarageDoorOpener.git
    $ cd RaspberryPiGarageDoorOpener
    $ node index.js

## Configure app

It's recommended that you run the app as a [linux service](https://www.axllent.org/docs/view/nodejs-service-with-systemd), or with screen to keep the app running after leaving SSH.

    $ cp /home/pi/RaspberryPiGarageDoorOpener/garage.service /etc/systemd/system/garage.service
    $ systemctl enable garage.service
    $ systemctl start garage.service
