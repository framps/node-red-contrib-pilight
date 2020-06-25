
const xmlhttprequest = require('xmlhttprequest')
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

const glbl = {
  devices: null
}

module.exports = function(RED) {
    function PilightSwitchNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        this.name = config.name;
        this.device = config.device;

        node.on('input', function(msg) {

          // Retrieve the config node
          server = RED.nodes.getNode(config.server);
          var target=server.host+":"+server.port;

          if ( glbl.devices == null ) {
            glbl.devices=retrieveDeviceConfig(target);
          }

          console.log(JSON.stringify(node));

          if ( this.device in glbl.devices ) {
            device_details = glbl.devices[this.device];
            console.log("Device details of " + this.device + " : " + JSON.stringify(device_details));
          } else {
            console.error("Device " + this.device + " not found");
            setStatus(node, null, null);
            return;
          }

          // device_details: {"protocol":["pollin"],"id":[{"systemcode":31,"unitcode":4}],"state":"off"}
          // should become
          // device_url="protocol=pollin&systemcode=31&unitcode=4";

          protocol_url="protocol="+device_details.protocol + "&";
          id0=device_details.id[0];
          id_url="";

          Object.keys(id0).forEach(function(key){
             console.log(key + '=' + id0[key]);
             id_url=id_url + key + "=" + id0[key] + "&";
          });

          device_url=protocol_url + id_url;

          // Create on/off part of url
          var ctl="on=1";
          if (msg.payload === false) {
            ctl="off=1";
          };
          var url="http://"+target+"/send?"+device_url+ctl;

          response=HTTP_Get(url);

          setStatus(node, response, ctl === "on=1");

          msg={
            "url": url,
            "payload": url
          }
          node.send(msg);
        });
    }
    RED.nodes.registerType("pilight-switches",PilightSwitchNode);
}

function HTTP_Get(url) {

  console.log("get url " + url);
  var XMLHttpRequest = xmlhttprequest.XMLHttpRequest;
  xhttp=new XMLHttpRequest();
  xhttp.open("GET", url, false);
  xhttp.send();
  result=JSON.parse(xhttp.responseText);
  console.log("result: \n" + JSON.stringify(result));
  return result;
}

// set status of switch on, off or undefined
function setStatus(node, response, on) {

  console.log("Set status \n" + JSON.stringify(response)) + on;

  if ( response !== null) {
    if ( JSON.stringify(response) === JSON.stringify({ "message": "success" }) ) {
      if ( on ) {
        node.status({fill:"green",shape:"ring",text:"on"});
      } else {
        node.status({fill:"red",shape:"ring",text:"off"});
      }
    } else {
      node.status({fill:"red",shape:"dot",text:"undefined"});
    }
  } else {
      node.status({fill:"red",shape:"dot",text:"error"});
  }
}

function retrieveDeviceConfig(target) {

    console.log('Retrieving config from '+target);

    url="http://"+target+"/config?media=all";
    config=HTTP_Get(url);

    console.log(JSON.stringify(config));

    // extract all devices from response
    var devices = {};
    Object.keys(config.devices).forEach(function(key){
       console.log(key + '=' + config.devices[key]);
       devices[key]=config.devices[key];
    });

    console.log('Devices detected: \n' + JSON.stringify(devices,null,3));

    return devices;
}
