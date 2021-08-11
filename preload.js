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

      console.log("exifData", exifData);
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
  

  },
  ///

});
