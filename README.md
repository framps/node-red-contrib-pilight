# node-red-contrib-pilight_switches

## Abstract

[pilight](https://www.pilight.org/) supports various 433MHz devices. This node hides the complexity to manage 433MHz switches via pilight in Node-Red. Just drag and drop a pilight switch node into the flow editor, create a pilight server configuration and pass true or false to turn the switch on or off.

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

defines a switch with device name `PO1`.

## Sample flow which just turns a switch on and off

In following flow there are three pilight switches defined. One in on and the other is off. They can be turned on or off by sending true or false to the switch node. The last one is in error state because the pilight device selected initially does not exist any more on the pilight server.

![Alt text](pics/pilight_customnode_flow.png?raw=true "Title")

## Features

1. A config node holds the hostname/ip of the pilight host and the port
2. A switch node has a free format node name and a device name which identifies the pilight switch device
3. During startup all available pilight switch devices are retrieved from pilight server and can be used as device names in nodes via a drop down list
4. A flag on the node shows the state of the switch (on, off, error or undefined)
5. Actual status of switches is retrieved from pilight server when node-red starts up and initializes the switch nodes
6. When a node is created the pilight device is selected from a dropdown list of all defined pilight switches
7. Default name for a pilight switch is the device name.

## How to use a pilight switch

1. git clone this repository on your system
2. Install pilight switches with `npm install ~/github.com/framps/node-red-contrib-pilight_switches`
3. Drag and drop node `pilight switches` into the flow editor
4. Double click on the node and create a configuration node for pilight-switches. Add the hostname and port (usually 5001) of your pilight server.
5. If this is the first pilight switch used
  1. Deploy the switch and the switch will go into error state.
  2. Edit the switch and select a pilight device from the dropdown list.
  3. Update the pilight switch name
  4. Deploy the updated switch to update the state of the pilight switch with the current state
6. If this is another pilight switch used
  1. Edit the switch and select a pilight device from the dropdown list.
  2. Update the pilight switch name
  3. Deploy the updated switch to update the state of the pilight switch with the current state
7. Pass `true` or `false` into the node to turn the switch on or off.

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

## Open issues

1. When the first pilight switch instance with the pilight server config was created there is no retrieval done of the existing devices from the pilight server. This retrieval will be triggered when the first pilight switch is deployed. Then the switch will go into error state first because no device was selected for the switch. Next the switch has to be updated and a device from the drop down list be selected to retrieve the current switch status on the pilight server and set the switch to state on or off. If a deployed pilight switch exist already the device list is available immediately.
2. Even multiple pilight server configs can be defined and used by the switches only one pilight switch can be used as of now.

### Todos

1. Solve initial device list retrieval (Shortcut 1.)
2. Support multiple pilight servers (Shortcut 2.)

#### Any hint and/or help how to get both todos solved is appreciated.
