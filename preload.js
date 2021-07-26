const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["fromMain"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },

  tfObjectDetection: (img) => {
    (async () => {
      // Load the model.
      console.log("Loading TFMODEL");
      const model = await cocoSsd.load();

      // Classify the image.
      console.log("Feeding in the photo");
      const predictions = await model.detect(img);

      // console.log("Predictions: ");
      console.log(predictions);
    })();

  }
});
