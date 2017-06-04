
(function($) {

$("#addmileInput").change((event) => mpenFile(event));
$("#uploadFile").click((e) => $("#addFileInput").trigger('click'));

//$(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii'});

var file;
var cut=false;
var locate;
var nbresources=1;
var nbslides=1;

$.contextMenu({
	selector: '.the-node',
    callback: function(key, options) {
		switch (key) {
			case "edit":
				updateVal(this, this.text());
				break;
			case "cut":
				file = this.text();
				cut = true;
				locate = window.location.pathname;

				xhttp = new XMLHttpRequest();

				save=encodeURIComponent(file);
				cut=encodeURIComponent(cut);
				locate=encodeURIComponent(locate);

				xhttp.open('post', '/save', true);
				xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhttp.send("file="+file+"&cut="+cut+"&locate="+locate);
				break;
			case "copy":
				file = this.text();
				cut = false;
				locate = window.location.pathname;

				xhttp = new XMLHttpRequest();

				save=encodeURIComponent(file);
				cut=encodeURIComponent(cut);
				locate=encodeURIComponent(locate);

				xhttp.open('post', '/save', true);
				xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhttp.send("file="+file+"&cut="+cut+"&locate="+locate);
				break;
			case "paste":

				xhttp = new XMLHttpRequest();

				xhttp.onreadystatechange = function() {
					if (xhttp.readyState == 4 && (xhttp.status == 200 || xhttp.status == 0)) {
						window.location = window.location;
					}
				};

				xhttp.open('get', '/copy', true);
				xhttp.send(null);

				break;
			case "delete":
				window.location = "/delete/"+$(this).text();
				break;
			default:
				window.console && console.log("default") || alert("default");
				break;
		}
        //var m = "clicked: " + key + " on " + $(this).text();
        //window.console && console.log(m) || alert(m);
    },
    items: {
        "edit": {name: "Edit", icon: "edit"},
        "cut": {name: "Cut", icon: "cut"},
        "copy": {name: "Copy", icon: "copy"},
        "paste": {name: "Paste", icon: "paste"},
        "delete": {name: "Delete", icon: "delete"},
        "sep1": "---------",
        "quit": {name: "Quit", icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
    }
})


function updateVal(currentEle, value) {

  $(currentEle).html('<form method="post" action="/rename/' + value + '"' + '><input name="newname" type="text" value="' + value + '" /><input type="submit" style="display:none" /></form>');
  $("#newname").focus();

}

$('#addField').on( "click", function() {
    nbresources += 1;
    var itm = document.getElementById("resource1");
    var cln = itm.cloneNode(true);
    cln.setAttribute("id","resource"+nbslides.toString());
    document.getElementById('resourcesList').appendChild(cln);
})

$('#nextSlide').on( "click", function() {
    nbslides += 1;
})

/*
$('#deleteField').on( "click", function() {
    event.target.setAttribute("value", "None");
    event.target.setAttribute("style", "display: none");
});
*/

var file2upload;

function openFile(event) {

	var input = event.target;

	var reader = new FileReader();
	reader.onload = function(e) {
		var dataURL = reader.result;

		console.log(input.files[0]);
		$("#file2upload").val(input.files[0].name);

		file2upload = input.files[0];

		$("#file2beuploaded").innerHTML = input.files[0];

		/*
		const req = new XMLHttpRequest();
		req.overrideMimeType("multipart/form-data");

		req.onprogress = onProgress;
		req.onerror = onError;
		req.onload = onLoad;
		req.onloadend = onLoadEnd;

		req.open('post', '/upload', true);
		req.send(input.files[0]);
		*/

	};
	reader.readAsDataURL(input.files[0]);
}

function onProgress(event) {
	if (event.lengthComputable) {
		var percentComplete = (event.loaded / event.total)*100;
		console.log("Loading: %dMM", percentComplete);
	} else {
		//Impossible to compute the progression because the total size is unknown"
	}
}

function onError(event) {
	console.error("Une erreur " + event.target.status + " s'est produite au cours de la réception du document.");
}

function onLoad(event) {
	if (this.status === 200) {
		console.log("Réponse reçue: %s", this.responseText);
	} else {
		console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
	}
}

function onLoadEnd(event) {
	console.log("Le transfert est terminé.");
}

function ajaxSuccess () {
  alert(this.responseText);
}

function AJAXSubmit (oFormElement) {
  if (!oFormElement.action) { return; }
  var oReq = new XMLHttpRequest();
  oReq.onload = ajaxSuccess;
  if (oFormElement.method.toLowerCase() === "post") {
    oReq.open("post", oFormElement.action, true);
    oReq.send(new FormData(oFormElement));
  } else {
    var oField, sFieldType, nFile, sSearch = "";
    for (var nItem = 0; nItem < oFormElement.elements.length; nItem++) {
      oField = oFormElement.elements[nItem];
      if (!oField.hasAttribute("name")) { continue; }
      sFieldType = oField.nodeName.toUpperCase() === "INPUT" ? oField.getAttribute("type").toUpperCase() : "TEXT";
      if (sFieldType === "FILE") {
        for (nFile = 0; nFile < oField.files.length; sSearch += "&" + escape(oField.name) + "=" + escape(oField.files[nFile++].name));
      } else if ((sFieldType !== "RADIO" && sFieldType !== "CHECKBOX") || oField.checked) {
        sSearch += "&" + escape(oField.name) + "=" + escape(oField.value);
      }
    }
    oReq.open("get", oFormElement.action.replace(/(?:\?.*)?$/, sSearch.replace(/^&/, "?")), true);
    oReq.send(null);
  }
}


})(jQuery);
