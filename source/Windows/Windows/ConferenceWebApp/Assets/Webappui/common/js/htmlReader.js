
// Reading From Html file
function createXHR() {
    var request = false;
    try {
        request = new ActiveXObject('Msxml2.XMLHTTP');
    }
    catch (err2) {
        try {
            request = new ActiveXObject('Microsoft.XMLHTTP');
        }
        catch (err3) {
            try {
                request = new XMLHttpRequest();
            }
            catch (err1) {
                request = false;
            }
        }
    }
    return request;
}

// get the body of html file
function getBody(content) {
    test = content.toLowerCase();    
    var x = test.indexOf("<body");
    if (x == -1) return "";

    x = test.indexOf(">", x);
    if (x == -1) return "";

    var y = test.lastIndexOf("</body>");
    if (y == -1) y = test.lastIndexOf("</html>");
    if (y == -1) y = content.length;    // If no HTML then just grab everything till end

    return content.slice(x + 1, y);
}


// load html to a container
function loadHTML(url, mainContainer, divObj) {
    var xhr = createXHR();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            //if(xhr.status == 200)
            {
                var NewNode = document.createElement("div");
                NewNode.id = divObj.id;
                NewNode.className = divObj.class;
                NewNode.innerHTML = getBody(xhr.responseText);
                mainContainer.appendChild(NewNode);


            }
        }
    };

    xhr.open("GET", url, true);
    xhr.send(null);

}
