function loadpdf(path) {
    var doc = ReadXmlFromID(path);
    var mainNode = doc.getElementsByTagName("pages")[0];
    var pages = mainNode.getElementsByTagName("page");
    var html = "<div id='innerWarp'>";
    for (var i = 0; i < pages.length; i++) {
        html += "<a><img src=" + pages[i].getAttribute("url") + " /></a>"
    }
    html += "</div>";
    $("#pdfWrapper").html(html);
    PdfZoom();
}

function PdfZoom()
{
        $("#pdfWrapper").css("width", '100%');
        var width = parseInt($("#test").css("width"));
        var addWid = 50;
        $("#innerWarp").swipe({
            pinchStatus: function (event, phase, direction, distance, duration, fingerCount, pinchZoom, fingerData) {
                if (direction == "in") {
                    width = width + addWid;
                }
                else if (direction == "out") {
                    width = width - addWid;
                }
                if (width < $(window).width()) {
                    width = $(window).width();
                }
                $("#innerWarp").css("width", width);
           
            },
            fingers: 2,
            threshold: 0
        });

}