
/*
  exemple for loading multiples gigantic image files
*/


function exemple2() {
  console.clear();

  var image2div = {};
  var imagesURL = ["forest1.jpg", "forest2.jpg", "forest3.jpg", "forest4.jpg"];
  var [progressBarBackground, progressBar] = FileLoader.createDivProgressBar();


  // creation of all div's (can be do before or during the loading)
  for (var i = 0; i < imagesURL.length; i++) {
    image2div[imagesURL[i]] = FileLoader.createDiv({
      style: {
        position: "absolute",
        left: i*245 + "px",
        width: "240px",
        height: "160px",
        backgroundColor: "white",
        "background-size": "contain",
        "background-repeat": "no-repeat",
        border: "1px solid black"
      }
    });
  }

  // creation of a context for call the function for the same type of file
  var imageLoadContext = {
    // "onload" is fired when a file is fully loaded
    // alternative
    // "onloadend" is fired for each file when ALL files are fully loaded
    onloadend: function(xhr) {
      console.log(`"${xhr.fileName}" is loaded`);
      var div = image2div[xhr.fileName];

      // direct version (much better)
      div.style["background-image"] = `url(${xhr.responseURL})`;
      
      // FileReader version
      //const reader = new FileReader();
      //reader.readAsDataURL(xhr.response); // uch.. (all images are converted to base64)
      //reader.onload = function () {
      //  var div = image2div[xhr.fileName];
      //  div.style["background-image"] = 'url("' + reader.result + '")';
      //};
    },

    // "onprogress" is fired when % of loading change
    onprogress: function(percentage, filesLoaded, filesTotal) {
      console.log(`loading ${filesLoaded}/${filesTotal} files: ${percentage}%`);
      progressBar.style.width = percentage + "%";
    },

    // "onprogressend" is fired when all "onload" or "onloadend" are finished
    onprogressend: function() {
      console.warn("file loading END!")
      progressBarBackground.remove();
    },
  };

  for (var i = 0; i < imagesURL.length; i++) {
    FileLoader.load(imagesURL[i], imageLoadContext, {responseType: "blob"});
  }

}
