let peer = null;
let screenStream = null;
let currentResolution = 1080; // Default to 1080p

// Initialize PeerJS with your server
function initializePeer() {
  peer = new Peer({
    host: "localhost",
    port: 9000,
    path: "/myapp",
  });

  peer.on("error", (err) => console.error("PeerJS error:", err));
}

// Adjust resolution based on system load (simulated)
function adjustResolution() {
  const simulatedLoad = Math.random() * 100; // Replace with real metrics
  currentResolution = simulatedLoad > 70 ? 480 : 1080;
}

// Capture screen with dynamic resolution
async function startCapture() {
  try {
    adjustResolution();

    screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        frameRate: 10,
        width: { ideal: currentResolution },
      },
    });

    const videoElement = document.getElementById("screen");
    videoElement.srcObject = screenStream;

    // Send stream to PeerJS server
    const call = peer.call("backend-peer", screenStream);
    call.on("stream", (remoteStream) => {
      console.log("Streaming to backend at", currentResolution + "p");
    });
  } catch (error) {
    console.error("Screen capture failed:", error);
  }
}

// Initialize on page load
window.onload = () => {
  initializePeer();
  startCapture();
};

// Cleanup
window.onbeforeunload = () => {
  if (screenStream) screenStream.getTracks().forEach((track) => track.stop());
  if (peer) peer.destroy();
};
