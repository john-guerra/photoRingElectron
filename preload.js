const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
var Connection = require("tedious").Connection;  
var config = {  
  server: "localhost",  //update me
  authentication: {
    type: "default",
    options: {
      userName: "root", //update me
      password: "123"  //update me
    }
  },
  options: {
    // If you are on Microsoft Azure, you need encryption:
    encrypt: true,
    database: "photoring2"  //update me
  }
};  


var Request = require("tedious").Request;  
var TYPES = require("tedious").TYPES;  


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
  ///
  insetExifData: (exifData) => {  
    console.log(exifData["DateTime"]);
  
    var connection = new Connection(config);  
    connection.on("debug", function(err) { console.log("debug:", err);});
    connection.connect();
  
    // eslint-disable-next-line no-undef
    request = new Request("INSERT INTO photos VALUES ( @PHOTOID, @APERTURE, @BRIGHTNESS, @DATETIME, @FOCALLENGTH) ;", function(err) {
      if (err) {  
        console.log(err);}  
    });  
    // eslint-disable-next-line no-undef
    request.addParameter("PHOTOID", TYPES.Int,1);//exifData["ApertureValue"][0]);
    // eslint-disable-next-line no-undef
    request.addParameter("APERTURE", TYPES.Float,2.0);//exifData["ApertureValue"][0]);
    // eslint-disable-next-line no-undef
    request.addParameter("BRIGHTNESS", TYPES.Float , exifData["BrightnessValue"]);
    // eslint-disable-next-line no-undef
    request.addParameter("DATETIME", TYPES.VarChar, exifData["DateTime"]);
    // eslint-disable-next-line no-undef
    request.addParameter("FOCALLENGTH", TYPES.Float, 4);
    // eslint-disable-next-line no-undef
    request.on("row", function(columns) {
      columns.forEach(function(column) {  
        if (column.value === null) {  
          console.log("NULL");  
        } else {  
          console.log("Photo id is " + column.value);  
        }  
      });  
    });
    // eslint-disable-next-line no-unused-vars,no-undef
    request.on("requestCompleted", function (rowCount, more) {
      connection.close();
    });
    // eslint-disable-next-line no-undef
    connection.execSql(request);
  },
  ///
});
