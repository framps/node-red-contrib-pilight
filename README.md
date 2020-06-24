# node-red-contrib-pilight

[pilight](https://www.pilight.org/) supports various 433MHz devices. This node should help to use 433MHz switches via pilight in Node-Red.

## Note
This custom node is still under development.

## Current implementation status

As of now the current custom node retrieves all available devices from pilight and uses a config node which holds the hostname/ip of the pilight host and the port.
For now a hard coded pilight switch of type pollin is used for all nodes but the pilight device name and it's device artefacts is planned to be used instead.

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

defines a switch called `PO1`. The node-red pilight switch node now has to have the same name `PO1` and then the switch can be turned on and off by passing true or false in the input payload. When a node is created the switch name can be selected from a drop down list of all available pilight switches. 

## Sample flow which just turns a switch on and off

In following flow LivingRoom is the pilight switch node and pilightSend is a HTTP-Request node. The pilightSend node will vanish because all HTTP REST call logic will be handled in the pilight switch node.

![Alt text](pics/pilight_customnode_flow.png?raw=true "Title")
