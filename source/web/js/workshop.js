
function onLoadWorkshop() {
    $('#workshop-message').hide();
}

function registerWorkshop() {
    var id = $('#workshopCont').find('input[name="check"]:checked').val();
    if (id == null || id == undefined) {
        $('#workshop-message').css('color', '#ff0000');
        $('#workshop-message').html('Please select your workshop');
        $('#workshop-message').fadeIn();
        return;
    }
    
    var name = document.getElementById('Workshop' + id).getAttribute('work');
    var data = new WorkshopData();
    data.UserId = parseInt($('#HdnUserId').val());
    data.WorkshopId = parseInt(id);

    if (g_UserService.registerWorkshop(data, false, '').Result) {
        $('#workshop-message').css('color', 'green');
        $('#workshop-message').html('You are successfully registered to ' + name);
        $('#workshop-message').fadeIn();
        //$('#workshopCont').find('input[value="' + id + '"]').prop('checked', false);
    }
    else {
        $('#workshop-message').css('color', '#ff0000');
        $('#workshop-message').html('There is an error while registering your details. Please try after some time.');
        $('#workshop-message').fadeIn();
    }

    hideMessage();
}

function hideMessage() {
    window.setTimeout(function () {
        $('#workshop-message').fadeOut();
    }, 3000);
}