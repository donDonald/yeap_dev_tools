#!/bin/bash

IMAGE=$1

if [ -z $IMAGE ]; then
    echo "Where is image name dude? Exiting" 1>&2
    exit
fi

docker build -t $IMAGE -f ./Dockerfile ..

