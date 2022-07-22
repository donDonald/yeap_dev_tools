#!/bin/bash

echo "entrypoint, whoami:$(whoami)"
#tail -f /dev/null

cd /home/service/Pm2.test2.package/
npm start

