window.api.receive("fromMain", (data) => {
  console.log(`Received ${data} from main process`);
});
window.api.send("toMain", "some data");

function renderImages(filesList) {
  const target = document.querySelector("#target");

  // Clear the target
  target.innerHTML = "";

  for (let file of filesList) {
    console.log("appending ", file.path);
    const img = new Image();
    img.src = file.path;
    img.style["max-width"] = "100px";

    target.appendChild(img);

    // const contents = fs.readFileSync(file.path);

    console.log(file.path, " loaded");

    //my attempt to pass and receive information about image
    window.api.send("toMain", file.path);
    window.api.send("totensorflow", file.path);
    window.api.receive("fromtensorflow", (data) =>
      console.log(data)
    );

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
