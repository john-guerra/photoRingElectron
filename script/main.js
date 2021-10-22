const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const mobilenet = require("@tensorflow-models/mobilenet");
// const fs = require("fs");


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Receive a message from the renderer
  ipcMain.on("toMain", (event, args) => {
    // const contents = fs.readFileSync()
    console.log("got message toMain", event, args);

    // Send result back to renderer process
    mainWindow.webContents.send("fromMain", "got 111it");
  });



}




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  //My attempt to receive image location from renderer and push the result back
  app.on("open-file", function () {
    //Tensorflow code
    async function mobilenetload(imagepath) {
      const img = new Image();
      img.src = imagepath;
      console.log("step 1");

      const model = await mobilenet.load({
        version: 2,
        alpha:0.5
      });
      console.log("Mobilenet Loaded");

      // Classify the image.
      const predictions = await model.classify(img);

      console.log("Predictions: ");
      console.log(predictions);
      return predictions;
    }

    ipcMain.on("totensorflow", (event, args) => {
      console.log(event,args);
      console.log("Running mobilenet Code");
      window.send("fromtensorflow", mobilenetload(args));
    });
  });


});














// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


