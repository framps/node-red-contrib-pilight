# node-red-contrib-pilight

[pilight](https://www.pilight.org/) supports various 433MHz devices. This node should help to use 433MHz switches via pilight in Node-Red.

## Note
This custom node is still draft.

## Current implementation status

As of now the current custom node uses a config node which holds the hostname/ip of the pilight host and the port and generates a URL which has to be passed to a HTTP-Request node. The request uses a hard coded pilight switch of type pollin.

## Sample flow which just turns a switch on and off

In following flow LivingRoom is the pilight switch node and pilightSend is a HTTP-Request node.

![Alt text](pics/pilight_customnode_flow.png?raw=true "Title")
