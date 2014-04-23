#!/bin/sh

cd /home/pi/property-tools/
/usr/local/bin/node Rightmove.js
/usr/local/bin/node db-to-email.js
