
function onloadPresentation(data) {
    $('#presentationContent').html('');
    data = JSON.parse(data);
    if (data != null && data.Count > 0) {
        var content = '';
        for (var index = 1; index <= data.Count; index++) {
            content += '<img src="' + data.PresentationData + '/' + data.PresentationName + '/Slide' + index + '.JPG" />';
        }
        $('#presentationContent').html(content);
    }
}