
function onClickMaps() {
    $('#mapsTab').css({
        'background-color': '#fff',
        'color': '#269bc2'
    });

    $('#floorTab,#venueTab').css({
        'background-color': '#269bc2',
        'color': '#fff'
    });

    // info-window fix
    $('#mapTabContents').css('margin-top', '-190px');
    $('#venueContainer').removeClass('hasOverflow');
    $('#venueContainer').addClass('hasNoOverflow');

    $('#venueTabContents,#floorTabContents').hide();
    $('#mapTabContents').show();

    $('#commonHeader').find('img').hide();
}

function onClickFloorPlans() {
    $('#floorTab').css({
        'background-color': '#fff',
        'color': '#269bc2'
    });

    $('#mapsTab,#venueTab').css({
        'background-color': '#269bc2',
        'color': '#fff'
    });

    $('#venueContainer').removeClass('hasNoOverflow');
    $('#venueContainer').addClass('hasOverflow');

    $('#venueTabContents,#mapTabContents').hide();
    $('#floorTabContents').show();

    $('#commonHeader').find('img').show();
}

function onClickVenue() {
    $('#venueTab').css({
        'background-color': '#fff',
        'color': '#269bc2'
    });

    $('#floorTab,#mapsTab').css({
        'background-color': '#269bc2',
        'color': '#fff'
    });

    $('#venueContainer').removeClass('hasNoOverflow');
    $('#venueContainer').addClass('hasOverflow');

    $('#mapTabContents,#floorTabContents').hide();
    $('#venueTabContents').show();

    $('#commonHeader').find('img').hide();
}

function onClickZoomIn() {
    var range = parseInt(document.getElementById('zoomRange').value);
    if ((range + 1) > 5) {
        document.getElementById('zoomRange').value = 5;
    }
    else {
        document.getElementById('zoomRange').value = range + 1;
    }
    performZoom();
}

function onClickZoomOut() {
    var range = parseInt(document.getElementById('zoomRange').value);
    if ((range - 1) < 1) {
        document.getElementById('zoomRange').value = 1;
    }
    else {
        document.getElementById('zoomRange').value = range - 1;
    }
    performZoom();
}

function performZoom() {
    var range = parseInt(document.getElementById('zoomRange').value);
    if (range == 1) {
        $('#floorTabContents').find('img').css('width', '100%');
    }
    else if (range == 2) {
        $('#floorTabContents').find('img').css('width', '125%');
    }
    else if (range == 3) {
        $('#floorTabContents').find('img').css('width', '150%');
    }
    else if (range == 4) {
        $('#floorTabContents').find('img').css('width', '175%');
    }
    else if (range == 5) {
        $('#floorTabContents').find('img').css('width', '200%');
    }
}