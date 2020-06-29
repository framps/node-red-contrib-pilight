
const xmlhttprequest = require('xmlhttprequest')

// keep pilight device list
const glbl = {
  devices: null
}

module.exports = function(RED) {

    function PilightSwitchNode(config) {

        // -- Node initialized

        RED.nodes.createNode(this,config);
        var node = this;

        // save node name and pilight device name
        this.name = config.name;
        this.device = config.device;

        // construct pilight server host from config node
        server = RED.nodes.getNode(config.server);
        var target=server.host+":"+server.port;

        // retrieve all pilight devices from pilight server
        if ( glbl.devices == null ) {
          glbl.devices=retrieveDeviceConfig(target);
        }

        if ( this.device in glbl.devices ) {
          device_details = glbl.devices[this.device];
          // set on/off query string
          setStatus(node, device_details.state === "on" ? node_status.ON : node_status.OFF);
        } else {
          // device does not exist any more on pilight server
          console.error("Device " + this.device + " not found");
          setStatus(node, node_status.ERROR);
        }

        // -- Node received input payload

        node.on('input', function(msg) {

          // ignore any invalid input
          if ( typeof msg.payload !== 'boolean') {
            return
          }

          // Retrieve the config node
          var server = RED.nodes.getNode(config.server);
          var target=server.host+":"+server.port;

          // construct pilight server host from config node
          if ( this.device in glbl.devices ) {
            device_details = glbl.devices[this.device];
            // console.log("Device details of " + this.device + " : " + JSON.stringify(device_details));
          } else {
            // device does not exist any more on pilight server
            console.error("Device " + this.device + " not found");
            setStatus(node, node_status.ERROR);
            return;
          }

          // now turn switch on or off

          // device_details from pilight device atrributes: {"protocol":["pollin"],"id":[{"systemcode":31,"unitcode":4}],"state":"off"}
          // should become
          // device_url="protocol=pollin&systemcode=31&unitcode=4"

          var protocol_url="protocol="+device_details.protocol + "&";
          var id0=device_details.id[0];
          var id_url="";
          // build REST url from device info
          Object.keys(id0).forEach(function(key){
             console.log(key + '=' + id0[key]);
             id_url=id_url + key + "=" + id0[key] + "&";
          });
          var request="http://"+target+"/send?"+protocol_url + id_url + (msg.payload ? "on=1" : "off=1");

          // send REST request
          var response=HTTP_Get(request);
          // status unknown for now
          var status=node_status.UNKNOWN;

          if ( response != null ) {
            // check REST response and set status of node
            if ( JSON.stringify(response) === JSON.stringify({ "message": "success" }) ) {
              status=(msg.payload === true ? node_status.ON : node_status.OFF);
            } else if ( JSON.stringify(response) === JSON.stringify({ "message": "failure" }) ) {
              status=node_status.FAILED;
            }
          } else {
              status=node_status.ERROR;
          }

          // set status of node
          setStatus(node,status);

          // return status in payload and response and REST url
          var msg={
            "request": request, // REST request to pilight
            "response" : response, // REST response from pilight
            "payload": status // on, off, error or undefined
          }
          node.send(msg);
        });
    }

    //  -- callback from client to retrieve the list of available pilight devices to build the dropdown list in the editor

    RED.httpAdmin.get("/pilightswitch/devices", RED.auth.needsPermission('pilight-switch.read'), function(req, res) {
        res.json(glbl.devices);
    });

    RED.nodes.registerType("pilight-switches",PilightSwitchNode);

    // send a get HTTP request and return HTTP response
    // return null if request failed

    function HTTP_Get(url) {

      console.log("Request " + url);
      var XMLHttpRequest = xmlhttprequest.XMLHttpRequest;
      xhttp=new XMLHttpRequest();
      var requestOK=true
      xhttp.addEventListener("error", function transferFailed(evt) {
        console.error("Unable to process request");
        console.error(xhttp.statusText);
        requestOK=false;
      });
      xhttp.open("GET", url, false);
      xhttp.send();
      if ( requestOK ) {
        // console.log(JSON.stringify(xhttp));
        var result=JSON.parse(xhttp.responseText);
        // console.log("result: \n" + JSON.stringify(result));
        return result;
      } else {
        return null;
      }
    }

    // node states

    const node_status = {
      FAILED: 'failed',     // REST request failed
      ERROR: 'error',       // pilight device not found
      ON: 'on',             // switch turned on
      OFF: 'off',           // switch tuned off
      UNKNOWN: 'unkonwn'    // unexpected REST response
    }

//
// -- set status of switch in flow editor on, off, undefined or failed
//

    function setStatus(node, status) {

      switch (status) {
        case node_status.ON :
          node.status({fill:"green",shape:"ring",text:"on"});
          break;
        case node_status.OFF :
          node.status({fill:"red",shape:"ring",text:"off"});
          break;
        case node_status.UNDEFINED :
          node.status({fill:"red",shape:"dot",text:"undefined"});
          break;
        case node_status.ERROR :
          node.status({fill:"red",shape:"dot",text:"error"});
      }
    }

//
//    -- retrieve pilight devices defined in pilight server
//
//    pilight response format is a list of devices with their name and properties including the current state.
//    Current state is etrieved during initialization of node to set the status in node-red accordingly.
//    In case of error the returned list is empty

/*
    {
    "devices": {
      "PO1": {
        "protocol": [
          "pollin"
        ],
        "id": [
        {
          "systemcode": 31,
          "unitcode": 1
        }
      ],
        "state": "off"
      },
      "PO2": {
        "protocol": [
          "pollin"
        ],
        "id": [
          {
            "systemcode": 31,
            "unitcode": 2
          }
        ],
        "state": "off"
        },

...

  */

    function retrieveDeviceConfig(target) {

        var url="http://"+target+"/config?media=all";
        var config=HTTP_Get(url);

        var devices = {};

        if ( config !== null ) {
          // extract all devices from response
          Object.keys(config.devices).forEach(function(key){
             console.log(key + '=' + config.devices[key]);
             devices[key]=config.devices[key];
          });

          console.log('Devices detected: \n' + JSON.stringify(devices,null,3));
        } else {
          console.error('Unable to retrieve config');
        }

        return devices;
    }

}
