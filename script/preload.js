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
});

// // Note: Require the cpu and webgl backend and add them to package.json as peer dependencies.
// require("@tensorflow/tfjs-backend-cpu");
// require("@tensorflow/tfjs-backend-webgl");
// const cocoSsd = require("@tensorflow-models/coco-ssd");
//
// (async () => {
//   const img = document.getElementById("file");
//
//   // Load the model.
//   const model = await cocoSsd.load();
//
//   // Classify the image.
//   const predictions = await model.detect(img);
//
//   console.log("Predictions: ");
//   console.log(predictions);
// })();

// const mobilenet = require("@tensorflow-models/mobilenet");
//
// async function mobilenetload() {
//   const img = document.getElementById("img");
//   console.log("step 1");
//
//   // const handler = tfn.io.fileSystem("image_classification_model.json");
//   // const model = await tf.loadLayersModel(handler);
//   const model = await mobilenet.load({
//     version: 2,
//     alpha:0.5
//   });
//   console.log("Mobilenet Loaded");
//
//   // Classify the image.
//   const predictions = await model.classify(img);
//
//   console.log("Predictions: ");
//   console.log(predictions);
// }
// mobilenetload();
