# node-red-contrib-pilight_switches

[pilight](https://www.pilight.org/) supports various 433MHz devices. This node hides the complexity to manage 433MHz switches via pilight in Node-Red. Just pass true or false to turn the switch on or off.

## Use case

A node-red plight switch can be used to turn a pilight switch on and off. It's identified via it's pilight device name. For example the following pilight device definition

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

defines a switch called `PO1`.

## Sample flow which just turns a switch on and off

In following flow there are three pilight switches. One in on and the other is off. They can be turned on or off by sending true or false to the switch node. The last one is in error state because the pilight device selected initially does not exist any more on the pilight server.

![Alt text](pics/pilight_customnode_flow.png?raw=true "Title")

## Features

1. A config node holds the hostname/ip of the pilight host and the port
2. A switch node has a node name and a device name which identifies the pilight switch device
3. During startup all available pilight switch devices are retrieved from pilight server and can be used as device names in nodes via a drop down list
4. A flag on the node shows the state of the switch (on, off, error or undefined)
5. Actual status of switches is retrieved from pilight server when node-red starts up and initializes the switch nodes
6. When a node is created a the pilight device is selected from a dropdown list of all defined pilight switches

### Todos

1. Better error handling and notification

## How to use a pilight switch

1. git clone this repository on your system
2. Install pilight switches with `npm install ~/github.com/framps/node-red-contrib-pilight-switches`
3. Start node-red and drag and drop node `pilight switches` in the flow editor
4. Double click on the node and create a configuration node for pilight-switches. Add the hostname and port (usually 5001) of you configured pilight server.
5. Select the pilight device switch via the dropdown list.
6. Pass `true` or `false` into the node to turn the switch on or off.

## Input

msg.payload can be true or false to turn the switch on or off. All other input is ignored.

## Output

```
msg={
  "request": request,   
  "response": response,
  "payload": status     
}
```
* request: REST request sent to pilight
* response: REST response from pilight
* status: state of the switch (on, off, undefined or error)
