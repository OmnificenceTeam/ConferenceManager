
var pollOptions = ["A", "B", "C", "D", "E", "F"];
var pollStatus = true;
var test = "";
var timeDiff = 15;
var timer = null;
var started = false;



$(document).on('click', 'img.pollselect', function () {

    if (!pollStatus)
        return;
    $('#HdnOptionId').val($(this).data('value'));
    var parent = $(this).parent().find('.pollselect');
    for (var index = 0; index < parent.length; index++) {
        parent[index].src = "img/" + pollOptions[index] + ".png";
    }
    $(this).attr('src', "img/" + pollOptions[parseInt($(this).data('value')) - 1] + "1.png");
    $('#timerspan').hide();
});

function onLoadPoll() {
    var parent = $('#poll').find('.pollselect');
    for (var index = 0; index < parent.length; index++) {
        parent[index].src = "img/" + pollOptions[index] + ".png";
    }
    //$('#HdnOptionId').val("");
    pollStatus = true;
    $('#timerspan').hide();
}

function onClickSubmitPoll() {
    if ($('#HdnOptionId').val() == "") {
        $('#alertMessage').html('Please select an Option');
        $('#alertModal').modal('show');
        return;
    }

    pollStatus = false;

    var data = new PollData();
    data.UserId = parseInt($('#HdnUserId').val());
    data.OptionId = parseInt($('#HdnOptionId').val());

    //$('#submitButton').hide();
    $('#timerspan').show();

    g_UserService.submitPollOption(data, true, 'onSuccessPollOption');

    if (!started) {
        started = true;
        //timer = window.setInterval(function () {
        //timerloop();
        //}, 1000);
    }
    $('#HdnOptionId').val('');
}

function timerloop() {
    timeDiff = timeDiff - 1;
    if (timeDiff == 1) {
        started = false;
        timeDiff = 15;
        $('#submitButton').hide();
        $('#timerspan').hide();
        clearInterval(timer);
        onLoadPoll();

        window.setTimeout(function () {
            $('#submitButton').show();
        }, 5000);
    }
}

function onSuccessPollOption(response) {
    //$('#submitButton').show();
    onLoadPoll();
}


