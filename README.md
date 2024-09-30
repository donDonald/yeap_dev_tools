# Licence
This piece of code is [MIT licensed](./LICENSE)

<div align="center">
    <img src="images/license-MIT-blue.svg">
</div>

---

# Intro
Set of tools ment to be used for testing purposes:
* etc_host - for updating /etc/hosts with given address-name pair
* etc_host_docker - for updating /etc/hosts with given docker containe address-container pair
* docker_compose - for launching docker-compose files
* ajax - for sending AJAX requests
* Pm2 - for launching node packages witn pm2 tool(I maight want start using pm2 packages later on)
* ServerHost - a tool for managin apps powered by [yeap_app_server](https://github.com/donDonald/yeap_app_server) in host mode
* ServerDocker - a tool for managin apps powered by [yeap_app_server](https://github.com/donDonald/yeap_app_server) in docker mode
---

# Quick start

### Prerequisites
Next tools are installed:
* docker
* docker-compose

### Install pm2 tool for managing node processes
```
$ sudo npm install pm2 -g
```

### Install mocha test framework
```
$ npm install -g mocha
```

### Run unit-test
```
$ cd yeap_dev_tools
$ npm install
$ npm test
```

