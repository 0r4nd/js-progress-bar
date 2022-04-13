
/*
  exemple for loading image file
*/

function exemple1() {
  var [progressBarBackground, progressBar] = FileLoader.createDivProgressBar();

  // FileLoader.load(fileName, context, xhrOptions(optional))
  FileLoader.load("forest1.jpg", {
      // "onload" is fired when a file is fully loaded
      // alternative
      // "onloadend" is fired for each file when ALL files are fully loaded
      onload: xhr => {
        FileLoader.createDiv({
          id: "myImage",
          style: {
            width: "200px",
            height: "100px",
            backgroundColor: "white",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${xhr.responseURL})`,
            border: "1px solid black"
          }
        });
      },
      // "onprogress" is fired when % of loading change
      onprogress: (percentage, filesLoaded, filesTotal) => {
        progressBar.style.width = percentage + "%"
      },
      // "onprogressend" is fired when all "onload" or "onloadend" are finished
      onprogressend: () => {
        progressBarBackground.remove()
      },

    }, {responseType: "blob"});

}
