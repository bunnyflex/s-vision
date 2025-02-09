const { PeerServer } = require("peer");

const peerServer = PeerServer({
  port: 9000,
  path: "/myapp",
});

peerServer.on("connection", (client) => {
  console.log("Peer connected:", client.id);
});

console.log("PeerJS server running on port 9000");
