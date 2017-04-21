var surveyGroupArray = [
        "",
        "s_one",
        "s_two",
        "s_three",
        "s_four",
        "s_five",
        "s_six",
        "s_seven",
        "s_eight",
        "s_nine"
];

function onLoadSurvey() {
    var isSurveySubmit = parseInt(localStorage.getItem("isSurveySubmit"));
    if (isSurveySubmit == 1) {
        $('#survey_table').css("display", "none");
        $('#sucess_Msg_Survey').css("display", "block");
    }

    else {
        $('#sucess_Msg_Survey').css("display", "none");
        $('#survey_table').css("display", "block");
    }
}

function onclickYesForSurvey() {
    $('#surveyModal').modal('hide');
    $("#SurveyM").click();
}

function submitSurvey() {
    $('#surveysuccess').css('display', 'none');
    $('#surveyerror').css('display', 'none');

    // Check the checked radio buttons
    var returnFlag = false;
    for (var index = 1; index < surveyGroupArray.length; index++) {
        var elements = $("[data-group=" + surveyGroupArray[index] + "]");
        var _flag = false;
        for (i = 0; i < elements.length ; i++) {
            if (elements[i].checked)
                _flag = true;

            if (surveyGroupArray[index] == "s_four") {
                if ($('input[name=' + surveyGroupArray[index - 1] + ']:checked').val() == "2")
                    _flag = true;
            }
        }

        if (!_flag) {
            $("#" + surveyGroupArray[index]).css("color", "red");
            returnFlag = true;
        }
        else {
            _flag = false;
        }
    }

    if (returnFlag) {
        $('#surveyerror').css('display', 'block');
        return;
    }

    for (var index = 1; index < surveyGroupArray.length; index++) {
        var options = [];
        $('input[name="' + surveyGroupArray[index] + '"]:checked').each(function () {
            options.push(this.value);
        });

        if (options.length > 0) {
            var data = new SurveyData();
            $('#survey').find("#" + surveyGroupArray[index]).css("color", "#269bc2")
            data.UserId = parseInt($('#HdnUserId').val());
            data.QuestionId = index;
            data.Answer = options.join(',');
            g_UserService.submitSurvey(data, true, 'onSuccessSurvey');
        }
    }


    $('#surveysuccess').css('display', 'block');
    var data = new UserData();
    data.UserId = parseInt($('#HdnUserId').val());
    g_UserService.completeSurvey(data, false, '');
    localStorage.setItem("isSurveySubmit", "1");

    var us = _glocalStorage.loadData('login');
    us.SurveyStatus = true;
    _glocalStorage.saveData('login', us);

    $('#survey_table').find('input[type=radio]:checked').removeAttr('checked');
    $('#survey_table').find('input[type=checkbox]:checked').removeAttr('checked');

    for (var i = 1; i < surveyGroupArray.length; i++) {
        $("#" + surveyGroupArray[i]).css("color", "#000");
    }

    window.setTimeout(function () {
        $('#surveysuccess').css('display', 'none');
        $('#survey_table').css("display", "none");
        $('#sucess_Msg_Survey').css("display", "block");
    }, 3000);
}

function onSuccessSurvey(response) {

}

function displayNone() {
    $('#survey_table').css("display", "none");
}

function onClickOpenNewQues() {
    $('#survey_table').find("#s_four").css("color", "#269bc2")
    $('.HideCls').css("display", "block");
}

function onClickCloseNewQues() {
    $('.HideCls').css("display", "none");
}

function setSurveySelection(element) {
    var id = element.getAttribute('name');
    $('#survey_table').find("#" + id).css("color", "#269bc2")
}