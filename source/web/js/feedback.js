
var groupArray = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six"
];


function SetSelection(element) {
    if (element.checked == true) {
        var data = new FeedbackData();
        var name = element.getAttribute('name');
        $('#feedback').find("#" + name).css("color", "#269bc2")
        data.UserId = parseInt($('#HdnUserId').val());
        data.QuestionId = parseInt(element.getAttribute("questionid"));
        data.Answer = element.getAttribute("value");
        g_UserService.submitFeedback(data, true, 'onSuccessFeedback');
    }
}

function onSuccessFeedback(response) {

}

function submitFeedback(feedbackFor) {
    var data = new FeedbackData();
    data.UserId = parseInt($('#HdnUserId').val());
    if (feedbackFor == 'event') {
        $('#event-success').css('display', 'none');
        $('#event-error').css('display', 'none');

        // Check the checked radio buttons
        var returnFlag = false;
        for (var index = 1; index <= 2; index++) {
            var elements = $("[data-group=" + groupArray[index] + "]");
            var _flag = false;
            for (i = 0; i < elements.length ; i++) {
                if (elements[i].checked)
                    _flag = true;
            }

            if (!_flag) {
                $("#" + groupArray[index]).css("color", "red");

                returnFlag = true;
            }
            else {
                _flag = false;
            }
        }
        if (document.getElementById("event_textarea").value == "")
        {
            document.getElementById("event_text_title").style.color = "red";
            $('#event-error').css('display', '');
            return;
        }
        else {
            document.getElementById("event_text_title").style.color = "black";
            data.Answer = document.getElementById("event_textarea").value;
            data.QuestionId = document.getElementById("event_textarea").getAttribute('questionid');
            g_UserService.submitFeedback(data, false, null);
        }
        if (returnFlag) {
            $('#event-error').css('display', '');
            return;
        }           

        if (g_UserService.submitFeedback(data, false, '').Result) {
            $('#event-success').css('display', 'block');
            $('#event_textarea').val("");


            $('#event_feedback_table').find('input[type=radio]:checked').removeAttr('checked');

            for (var i = 1; i <= 2; i++) {
                $("#" + groupArray[i]).css("color", "#000")
            }
        }

        window.setTimeout(function () {
            $('#event-success').css('display', 'none');
        }, 3000);
      
    }
    if (feedbackFor == 'venue') {
        $('#venue-success').css('display', 'none');
        $('#venue-error').css('display', 'none');

        // Check the checked radio buttons
        var returnFlag = false;
        for (var index = 4; index <= 5; index++) {
            var elements = $("[data-group=" + groupArray[index] + "]");
            var _flag = false;
            for (i = 0; i < elements.length ; i++) {
                if (elements[i].checked)
                    _flag = true;
            }

            if (!_flag) {
                $("#" + groupArray[index]).css("color", "red");

                returnFlag = true;
            }
            else {
                _flag = false;
            }
        }
        if (document.getElementById("venue_textarea").value == "") {
            document.getElementById("venue_text_title").style.color = "red";
            $('#venue-error').css('display', '');
            return;
        }
        else {
            document.getElementById("venue_text_title").style.color = "black";
            data.Answer = document.getElementById("venue_textarea").value;
            data.QuestionId = document.getElementById("venue_textarea").getAttribute('questionid');
            g_UserService.submitFeedback(data, false, null);
        }
        

        if (returnFlag) {
            $('#venue-error').css('display', '');
            return;
        }

        if (g_UserService.submitFeedback(data, false, '').Result) {
            $('#venue-success').css('display', 'block');
            $('#venue_textarea').val("")

            $('#venue_feedback_table').find('input[type=radio]:checked').removeAttr('checked');

            for (var i = 4; i <= 5; i++) {
                $("#" + groupArray[i]).css("color", "#000")
            }
        }

        window.setTimeout(function () {
            $('#venue-success').css('display', 'none');
        }, 3000);
    }
}