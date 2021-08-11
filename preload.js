const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object


var sqlite3 = require("sqlite3").verbose();





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
  insetExifData: (exifData,im_file) => {


    var db = new sqlite3.Database("mydb.db", (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("connected to sqlite");
    });

    db.serialize(function () {
      console.log("checking now" ,im_file.path);
      db.run("CREATE TABLE IF NOT EXISTS photos (file_path TEXT PRIMARY KEY, fileSize INTEGER, datetime DATETIME,type TEXT, exifid INTEGER, imagewidth INTEGER, imageheight INTEGER,colorspace INTEGER,make TEXT, model TEXT, xresolution REAL, yresolution REAL, ycbrpos INTEGER,ExposureProgram TEXT, exposuretime REAL, fnumber REAL, focallength REAL, shutterspeed REAL, flash TEXT,lightsource TEXT, whitebalance TEXT, exposuremode NUMBER, ISO REAL, brightness REAL, aperturevalue REAL) ");

      //     // eslint-disable-next-line no-unused-vars
      var stmt = db.prepare("INSERT INTO photos VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
      for (var i = 0; i < 1; i++) {
        stmt.run(im_file.path, exifData["Size"],exifData["DateTime"],exifData["Type"],exifData["ExifIFDPointer"],exifData["ImageWidth"],exifData["ImageHeight"],exifData["ColorSpace"],exifData["Make"],exifData["Model"],exifData["XResolution"][0],exifData["YResolution"][0],exifData["YCbCrPositioning"],exifData["ExposureProgram"],exifData["ExposureTime"][0],exifData["FNumber"][0],exifData["FocalLength"][0],exifData["ShutterSpeedValue"],exifData["Flash"],exifData["LightSource"],exifData["WhiteBalance"],exifData["ExposureMode"],exifData["ISOSpeedRatings"],exifData["BrightnessValue"],exifData["ApertureValue"][0]);
      }
      stmt.finalize();
      db.each("SELECT file_path AS id FROM photos", function(err, row) {
        console.log(row.id );
      });
    //
    });
    db.close();
    //
    //
    // }
    ///
  },
});
