#!/bin/bash

IMAGE=$1

if [ -z $IMAGE ]; then
    echo "Where is image dude? Exiting" 1>&2
    exit
fi

docker stop $IMAGE
docker rm -f $IMAGE

bash ./build.sh $IMAGE

KEYS="-dt"

docker run --name $IMAGE --hostname $IMAGE -p 10000:10000 $KEYS $IMAGE

