
module.exports = function(RED) {
    function PilightSwitchNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {

          var target="192.168.0.12:5001";

          var device="protocol=pollin&systemcode=31&unitcode=4";
          var ctl="on=1";
          if (msg.payload === false) {
            ctl="off=1";
          };
          var url="http://"+target+"/send?"+device+"&"+ctl
          msg={
            "url": url,
            "payload": url
          }
          node.send(msg);
        });
    }
    RED.nodes.registerType("pilight-switches",PilightSwitchNode);
}
