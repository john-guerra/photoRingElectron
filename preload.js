const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
// var Connection = require("tedious").Connection;
// var config = {
//   server: "localhost",  //update me
//   authentication: {
//     type: "default",
//     options: {
//       userName: "root", //update me
//       password: "123"  //update me
//     }
//   },
//   options: {
//     // If you are on Microsoft Azure, you need encryption:
//     encrypt: true,
//     database: "photoring2"  //update me
//   }
// };
//
//
// var Request = require("tedious").Request;
// var TYPES = require("tedious").TYPES;


var sqlite3 = require("sqlite3").verbose();
// eslint-disable-next-line no-unused-vars



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
    var db = new sqlite3.Database("mydb.db",(err)=>{
      if(err){
        return console.error(err.message);
      }
      console.log("connected to sqlite");
    });

    db.serialize(function () {
      console.log("hi there");
      db.run("CREATE TABLE IF NOT EXISTS photoring (info TEXT)");
      // eslint-disable-next-line no-unused-vars
      var stmt = db.prepare("INSERT INTO photoring VALUES (?)");
      for (var i = 0; i < 1; i++) {
        // eslint-disable-next-line no-undef
        stmt.run("Ipsum " + exifData["DateTime"]);
      }
      stmt.finalize();
      db.each("SELECT rowid AS id, info FROM photoring", function(err, row) {
        console.log(row.id + ": " + row.info);
      });

    });
    db.close();
    // db.serialize(function() {
    //   db.run("CREATE TABLE if not exists lorem (info TEXT)");
    //
    //   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    //   for (var i = 0; i < 10; i++) {
    //     stmt.run("Ipsum " + i);
    //   }
    //   stmt.finalize();
    //
    //   db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
    //     console.log(row.id + ": " + row.info);
    //   });
    // });
    //
    // db.close();
    // var connection = new Connection(config);
    // connection.on("debug", function(err) { console.log("debug:", err);});
    // connection.connect();
  
    // eslint-disable-next-line no-undef
    // request = new Request("INSERT INTO photos VALUES ( @PHOTOID, @APERTURE, @BRIGHTNESS, @DATETIME, @FOCALLENGTH) ;", function(err) {
    //   if (err) {
    //     console.log(err);}
    // });
    // eslint-disable-next-line no-undef
    // request.addParameter("PHOTOID", TYPES.Int,1);//exifData["ApertureValue"][0]);
    // // eslint-disable-next-line no-undef
    // request.addParameter("APERTURE", TYPES.Float,2.0);//exifData["ApertureValue"][0]);
    // // eslint-disable-next-line no-undef
    // request.addParameter("BRIGHTNESS", TYPES.Float , exifData["BrightnessValue"]);
    // // eslint-disable-next-line no-undef
    // request.addParameter("DATETIME", TYPES.VarChar, exifData["DateTime"]);
    // // eslint-disable-next-line no-undef
    // request.addParameter("FOCALLENGTH", TYPES.Float, 4);
    // // eslint-disable-next-line no-undef
    // request.on("row", function(columns) {
    //   columns.forEach(function(column) {
    //     if (column.value === null) {
    //       console.log("NULL");
    //     } else {
    //       console.log("Photo id is " + column.value);
    //     }
    //   });
    // });
    // // eslint-disable-next-line no-unused-vars,no-undef
    // request.on("requestCompleted", function (rowCount, more) {
    //   connection.close();
    // });
    // eslint-disable-next-line no-undef

  },
  ///
});
