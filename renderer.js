window.api.receive("fromMain", (data) => {
  console.log(`Received ${data} from main process`);
});
window.api.send("toMain", "some data");


function getExif(im_file) {

  // eslint-disable-next-line no-undef
  EXIF.getData(im_file, function() {
    // eslint-disable-next-line no-undef
    var exifData = EXIF.getAllTags(this);
    // var makeAndModel = document.getElementById("makeAndModel");
    // makeAndModel.innerHTML = `${make} ${model}`;
    console.log(im_file, "render");
    window.api.insetExifData(exifData,im_file);
      
  });
}


function renderImages(filesList) {
  const target = document.querySelector("#target");

  // Clear the target
  target.innerHTML = "";

  for (let file of filesList) {
    console.log("appending ", file.path);
    const img = new Image();
    img.src = file.path;
    img.style["max-width"] = "100px";

    getExif(file);



    target.appendChild(img);

    // const contents = fs.readFileSync(file.path);

    console.log(file.path, " loaded");

    window.api.send("toMain", file.path);

    // break;
  }
}

function handleFileSelect(evt) {
  let files = evt.target.files; // FileList object
  let filesList = [];
  let i, f;

  // Loop through the FileList and remove the files that aren"t images
  for (i = 0; (f = files[i]); i++) {
    // Only process image files.
    if (!f.type.match("image.*") && !f.type.match("video.*")) {
      continue;
    }
    filesList.push(f);

    console.log(f);
  }

  filesList = filesList.filter((d) => d.type.match("image.*"));

  renderImages(filesList);
} // handleFileSelect

document
  .getElementById("files")
  .addEventListener("change", handleFileSelect, false);
document.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();

  renderImages(e.dataTransfer.files);
  // for (const f of e.dataTransfer.files) {
  //   console.log("File(s) you dragged here: ", f.path);
  // }
});
document.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
});
