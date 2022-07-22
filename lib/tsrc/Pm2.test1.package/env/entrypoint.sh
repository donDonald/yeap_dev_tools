#!/bin/bash

echo "entrypoint, whoami:$(whoami)"
#tail -f /dev/null

cd /home/service/Pm2.test1.package/
npm start

