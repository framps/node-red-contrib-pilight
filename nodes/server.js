module.exports = function(RED) {
    function PilightServerNode(n) {
        console.log("Server initialized");
        RED.nodes.createNode(this,n);
        this.host = n.host; // hostname and protocol
        this.port = n.port; // pilight port
    }
    RED.nodes.registerType("pilight-server",PilightServerNode);
}
