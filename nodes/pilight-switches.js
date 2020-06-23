
// const xmlhttprequest = require('xmlhttprequest')
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

const glbl = {
  devices: null
}

module.exports = function(RED) {
    function PilightSwitchNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {

          // Retrieve the config node
          server = RED.nodes.getNode(config.server);
          var target=server.host+":"+server.port;

          if ( glbl.devices == null) {
            glbl.devices=retrieveDeviceConfig(target);
          }

          // for now just use one switch, later on lookup device from devices list
          var device="protocol=pollin&systemcode=31&unitcode=4";
          var ctl="on=1";
          if (msg.payload === false) {
            ctl="off=1";
          };
          var url="http://"+target+"/send?"+device+"&"+ctl;
          msg={
            "url": url,
            "payload": url
          }
          node.send(msg);
        });
    }
    RED.nodes.registerType("pilight-switches",PilightSwitchNode);
}

function retrieveDeviceConfig(target) {

    console.log('Retrieving config from '+target);

    var XMLHttpRequest = xmlhttprequest.XMLHttpRequest;
    xhttp=new XMLHttpRequest();
    url="http://"+target+"/config?media=all";

    xhttp.open("GET", url, false);
    xhttp.send();
    config=JSON.parse(xhttp.responseText);

    // extract all devices from response
    var devices = {};
    Object.keys(config.devices).forEach(function(key){
       console.log(key + '=' + config.devices[key]);
       devices[key]=config.devices[key];
    });

    console.log('Devices detected')
    console.log(JSON.stringify(devices,null,3));

    return devices;

}
