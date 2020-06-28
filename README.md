# node-red-contrib-pilight-switches

[pilight](https://www.pilight.org/) supports various 433MHz devices. This node should help to use 433MHz switches via pilight in Node-Red.

## Use case

A node-red plight switch can be used to turn a pilight switch on and off. It's identified via it's pilight config definition name. For example the following pilight config device definition

```
"PO1": {
                       "protocol": [ "pollin" ],
                       "id": [{
                               "systemcode": 31,
                               "unitcode": 1
                       }],
                       "state": "off"
               }
```

defines a switch called `PO1`. The switch can be turned on or off by passing true or false in the input payload.

## Sample flow which just turns a switch on and off

In following flow there are three pilight switches. One in on and the other is off. They can be turned on or off by sending true or false to the switch node. The last one is in error state because an invalid pilight device name is used in the pilight switch node.

![Alt text](pics/pilight_customnode_flow.png?raw=true "Title")

## Coding status

### Implemented

1. A config node holds the hostname/ip of the pilight host and the port
2. A switch node has a name and a device name which idetifies the pilight switch device (see below)
3. During startup all available pilight switch devices are retrieved from pilight and can be used as device names in nodes
4. A flag on the node shows whether the switch is on of off
5. Set switch status from pilight device list when node-red starts up and initializes the switch nodes
6. When a node is created present a dropdown list of available pilight switches to select the device name from

### Missing

1. Better error handling and notification
