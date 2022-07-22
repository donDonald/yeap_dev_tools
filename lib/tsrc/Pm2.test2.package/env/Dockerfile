FROM ubuntu:20.04
MAINTAINER Pavel Taranov <pavel.a.taranov@gmail.com>

# Setup timezone
RUN apt-get update && \
    apt-get install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/Europe/Moscow /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata




# Basic tools
RUN apt-get update \
 && apt-get install --yes wget \
                          gawk \
                          mc \
                          vim \
                          git \
                          tig \
                          lsof \
                          curl \
                          netcat \
                          iputils-ping




# Install node
RUN wget https://nodejs.org/dist/v12.14.1/node-v12.14.1-linux-x64.tar.xz \
 && tar -xf node-v12.14.1-linux-x64.tar.xz --directory /usr/local --strip-components 1 \
 && rm ./node-v12.14.1-linux-x64.tar.xz \
 && npm install -g mocha assert




# Create user
RUN groupadd --gid 2100 service \
  && useradd --uid 2100 --gid service --shell /bin/bash --create-home service
USER service




# Setup app itself
RUN mkdir -p /home/service/Pm2.test2.package/logs
COPY ./env/entrypoint.sh /home/service/Pm2.test2.package/entrypoint.sh
COPY ./index.js /home/service/Pm2.test2.package
COPY ./config /home/service/Pm2.test2.package/config
COPY ./package.json /home/service/Pm2.test2.package/
#COPY ./node_modules /home/service/Pm2.test2.package/node_modules




ENTRYPOINT /home/service/Pm2.test2.package/entrypoint.sh

