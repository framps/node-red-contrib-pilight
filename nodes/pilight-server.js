module.exports = function(RED) {
    function PilightServerNode(n) {
        RED.nodes.createNode(this,n);
        this.host = n.host;
        this.port = n.port;
    }
    RED.nodes.registerType("pilight-server",PilightServerNode);
}