// Note: Require the cpu and webgl backend and add them to package.json as peer dependencies.
require("@tensorflow/tfjs-backend-cpu");
require("@tensorflow/tfjs-backend-webgl");
const cocoSsd = require("@tensorflow-models/coco-ssd");

export function runtf() {
  (async () => {
    const img = document.getElementById("file");

    // Load the model.
    const model = await cocoSsd.load();

    // Classify the image.
    const predictions = await model.detect(img);

    console.log("Predictions: ");
    console.log(predictions);
  })();
}


