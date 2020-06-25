# node-red-contrib-pilight

[pilight](https://www.pilight.org/) supports various 433MHz devices. This node should help to use 433MHz switches via pilight in Node-Red.

## Note
This custom node is still under development.

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

defines a switch called `PO1`. The switch can be turned on or off by passing true or false in the input payload. When a node is created the switch name can be selected from a drop down list of all available pilight switches.

## Sample flow which just turns a switch on and off

In following flow LivingRoom is the pilight switch node and pilightSend is a HTTP-Request node. The pilightSend node will vanish because all HTTP REST call logic will be handled in the pilight switch node.

![Alt text](pics/pilight_customnode_flow.png?raw=true "Title")

## Coding status

### Implemented

1. A config node holds the hostname/ip of the pilight host and the port
2. A switch node has a name and a device name which idetifies the pilight switch device (see below)
3. During startup all available pilight switch devices are retrieved from pilight and can be used as device names in nodes
4. A flag on the node shows whether the switch is on of off

### Missing

1. During node creation present a dropdown list of available pilight switches to select the device name from
2. Error handling and notification
3. Set switch status from pilight device list when node-red starts up
