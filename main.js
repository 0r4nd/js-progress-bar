





function copyStyle(elem, style) {
  if (!style) return;
  Object.keys(style).forEach((key,i) => {
    elem.style[key] = style[key];
  });
}
const mouseEventTypes = [
  "onclick","oncontextmenu","ondblclick","onmousedown","onmouseenter",
  "onmouseleave","onmousemove","onmouseout","onmouseover","onmouseup",
];
function copyMouseEventTypes(dst, src) {
  for (var i = 0; i < mouseEventTypes.length; i++) {
    var key = mouseEventTypes[i];
    if (src[key]) dst[key] = src[key];
  }
}
function createDiv(opts = {}) {
  const elem = document.createElement("div");
  var parent = opts.parent;
  if (opts.id) elem.id = opts.id;
  if (opts.className) elem.className = opts.className;
  if (opts.contentEditable) elem.contentEditable = opts.contentEditable;
  if (typeof(opts.text) == "string") {
    var t = document.createTextNode(opts.text);
    elem.appendChild(t);
  }
  copyMouseEventTypes(elem, opts);
  copyStyle(elem, opts.style);
  if (!parent) parent = document.body;
  parent.appendChild(elem);
  return elem;
};



function loadHTML(elem, href) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(e) { 
    if (xhr.readyState == 4 && xhr.status == 200) {
      elem.innerHTML = xhr.responseText;
    }
  }
  xhr.open("GET", href, true);
  xhr.setRequestHeader('Content-type', 'text/html');
  xhr.send();
}



Dom.loadImage = function(elem, src, onload) {
  if (!src) return;
  var img = new Image();
  img.onload = function() {
    if (elem) {
      var ctx = elem.getContext("2d");
      if (!elem.width) elem.width = this.naturalWidth;
      if (!elem.height) elem.height = this.naturalHeight;
      ctx.drawImage(this, 0,0, elem.width, elem.height);
    }
    if (typeof onload === 'function') onload(img);
  }
  img.src = src;

  return img;
};



function loadFile(opts = {}) {
  var req = new XMLHttpRequest();

  req.onprogress = e => {
    if (e.lengthComputable) {
      var percentage = Math.round((e.loaded/e.total)*100);
      console.log("percent " + percentage + '%' );
    } else {
      console.log("Unable to compute progress information since the total size is unknown");
    }
  };

  req.onreadystatechange = () => {

    switch (req.readyState) {
      // Uninitialized: État initial.
      default:
      case 0: 
        break;

      // Open: La méthode open a été exécutée avec succès.
      case 1:
        break;

      // Sent: La requête a été correctement envoyée, mais aucune donnée n’a encore été reçue.
      case 2:
        break;

      // Receiving: Des données sont en cours de réception.
      case 3:
        break;

      // Loaded: Le traitement de la requête est fini.
      case 4:
        if (req.status === 200) {
          if (typeof(opts.onload) == 'function') opts.onload(req);
        } else {
          //if (typeof(opts.onerror) == 'function') opts.onerror(req);
        }
        break;
    }

  };
  if (typeof(opts.onerror) == 'function') {
    req.onerror = err => opts.onerror(err);
  }
  if (opts.src) req.open('GET', opts.src, true);
  if (opts.mimeType) req.overrideMimeType(opts.mimeType);
  if (opts.responseType) req.responseType = opts.responseType;
  //request.responseType = 'arraybuffer';
  req.send();
};




function main() {
  console.clear();
  
  var image2div = {};
  var imagesURL = ["foret1.jpg"/*, "foret2.jpg", "foret3.jpg", "foret4.jpg"*/];

  for (var i = 0; i < imagesURL.length; i++) {
    image2div[imagesURL[i]] = createDiv({
      id: 'content' + i,
      style: {
        //position: "relative",
        width: "200px",
        height: "100px",
        backgroundColor: "white",
        "background-size": "contain",
        "background-repeat": "no-repeat",
        border: "1px solid black",
        //'background-image': 'url("' + "foret1.jpg" + '")',
      },
    });

    loadFile({
      //src: "bomb.png",
      src: imagesURL[i],
      //responseType: 'arraybuffer',
      responseType: 'blob',
      onload: (req) => {
        const reader = new FileReader();
        reader.readAsDataURL(req.response);
        reader.onload = function() {
          var div = image2div[req.response.name];
          div.style['background-image'] = 'url("' + reader.result + '")';
          //console.log(image2div[req.response.name])
        };
      },
    });
  }

  //loadHTML(content, "assets/menu.html");
  

}




