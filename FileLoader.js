


const FileLoader = (function() {
  "use strict";


  // ------------------------ Module ------------------------
  function FileLoader() {}

  FileLoader.load = function(src, context = {}, optsXHR = {}) {
    var xhr = new XMLHttpRequest();
    xhr.fileName = src;

    if (typeof FileLoader.files[xhr.fileName] === "undefined") {
      FileLoader.files[xhr.fileName] = { percentage:0, xhr:xhr };
    }

    xhr.onprogress = function (e) {
      //console.log("progress");
      if (e.lengthComputable) {
        var totalPercentage = 0, filesLoaded = 0;
        var percentage = Math.round((e.loaded / e.total) * 100);
        FileLoader.files[this.fileName].percentage = percentage;
        
        var keys = Object.keys(FileLoader.files);
        for (var i = 0; i < keys.length; i++) {
          percentage = FileLoader.files[keys[i]].percentage;
          totalPercentage += percentage;
          if (percentage >= 100) filesLoaded++;
        }
        totalPercentage /= keys.length || 1;

        if (totalPercentage != FileLoader.prevTotalPercentage) {
          if (typeof context.onprogress == "function") context.onprogress(totalPercentage, filesLoaded, keys.length);
        }
        FileLoader.prevTotalPercentage = totalPercentage;
      } else {
        console.warn("the total size is unknown");
      }
    };

    xhr.onload = function (e) {
      if (this.status === 200) {

        if (FileLoader.prevTotalPercentage >= 100) {
          // console.warn("reinitialisation!");
          if (typeof context.onloadend == "function") {
            for (var i = 0, keys = Object.keys(FileLoader.files); i < keys.length; i++) {
              context.onloadend(FileLoader.files[keys[i]].xhr);
            }
            if (typeof context.onprogressend == "function") context.onprogressend();
          }
          FileLoader.prevTotalPercentage = 0;
          FileLoader.files = {};
        }
        if (typeof context.onload == "function") {
          context.onload(this);
          if (Object.keys(FileLoader.files).length === 0 &&
              typeof context.onprogressend == "function") context.onprogressend();
        }

      } else {
        if (typeof(context.onerror) == 'function') context.onerror(this);
      }
    };

    if (typeof context.onerror == "function") {
      xhr.onerror = (err) => context.onerror(err);
    }
    if (xhr.fileName) {
      xhr.open("GET", xhr.fileName, true);
      if (optsXHR.withCredentials) xhr.withCredentials = true;
    }
    if (optsXHR.mimeType) xhr.overrideMimeType(optsXHR.mimeType);
    if (optsXHR.responseType) xhr.responseType = optsXHR.responseType;
    xhr.send();
  }
  FileLoader.prevTotalPercentage = 0;
  FileLoader.files = {};


  // ------------------------ Utils ------------------------
  const mouseEventTypes = [
    "onclick",
    "oncontextmenu",
    "ondblclick",
    "onmousedown",
    "onmouseenter",
    "onmouseleave",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup"
  ];
  function copyMouseEventTypes(dst, src) {
    for (var i = 0; i < mouseEventTypes.length; i++) {
      var key = mouseEventTypes[i];
      if (src[key]) dst[key] = src[key];
    }
  }
  function copyStyle(elem, style) {
    if (!style) return;
    Object.keys(style).forEach((key, i) => {
      elem.style[key] = style[key];
    });
  }

  FileLoader.createDiv = function(opts = {}) {
    const elem = document.createElement("div");
    var parent = opts.parent;
    if (opts.id) elem.id = opts.id;
    if (opts.className) elem.className = opts.className;
    if (opts.contentEditable) elem.contentEditable = opts.contentEditable;
    if (typeof opts.text == "string") {
      var t = document.createTextNode(opts.text);
      elem.appendChild(t);
    }
    copyMouseEventTypes(elem, opts);
    copyStyle(elem, opts.style);
    if (!parent) parent = document.body;
    parent.appendChild(elem);
    return elem;
  };

  // create a progress-bar div
  FileLoader.createDivProgressBar = function(parent) {
    // background, last ancestor
    var progressBarBackground = FileLoader.createDiv({
      parent: parent || document.getElementById("body"),
      style: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        zIndex: 2147483647,
      }
    });
    var progressBarBarBackground = FileLoader.createDiv({
      parent: progressBarBackground,
      style: {
        position: "absolute",
        left: "25%",
        top: "45%",
        width: "50%",
        height: "5%",
        backgroundColor: "black",
        border: "2px solid white"
      }
    });
    // last child
    var progressBarBar = FileLoader.createDiv({
      parent: progressBarBarBackground,
      style: {
        position: "absolute",
        left: "6px",
        top: "6px",
        width: "0%",
        height: "calc(100% - 12px)",
        maxWidth: "calc(100% - 12px)",
        backgroundColor: "white",
      }
    });
    return [progressBarBackground, progressBarBar];
  };


/* // unused
  function loadHTML(elem, href) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        elem.innerHTML = xhr.responseText;
      }
    };
    xhr.open("GET", href, true);
    xhr.setRequestHeader("Content-type", "text/html");
    xhr.send();
  }

  function loadImage(elem, src, onload) {
    if (!src) return;
    var img = new Image();
    img.onload = function () {
      if (elem) {
        var ctx = elem.getContext("2d");
        if (!elem.width) elem.width = this.naturalWidth;
        if (!elem.height) elem.height = this.naturalHeight;
        ctx.drawImage(this, 0, 0, elem.width, elem.height);
      }
      if (typeof onload === "function") onload(img);
    };
    img.src = src;

    return img;
  }
*/

  return FileLoader;
})();

