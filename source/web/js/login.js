var height = window.innerHeight;
var menuHeight = 103;
var _gDeviceToken = "00000000000000000000";
$('#contactNameFieldError').hide();
$('#contactEmailFieldError').hide();
$('#contactCountryFieldError').hide();
$('#contactEmailFieldError2').hide();
$('#accessCodeFieldError').hide();
$('#specialityFieldError').hide();
$('#invalidCodeFieldError').hide();

function SetDeviceToken(devicetoken) {
    _gDeviceToken = devicetoken;
}

function onFirstLoad() {
    checkAlreadyRegistered();
}

function getCountryList() {
    var result = g_UserService.getCountries(null, false, '').Result;
    if (result.length > 0) {
        var HTML = '<option value="0" selected disabled>Select Country</option>';
        for (var i = 0; i < result.length; i++) {
            HTML += '<option value="' + result[i].CountryId + '">' + result[i].Country + '</option>';
        }
        document.getElementById('contactCountryField').innerHTML = HTML;
    }
}

function loadConferenceJson() {
    $.getJSON(jsonUrl, function (data) {
        coreData = data;
    });
}

function onclickLogin(ele) {
  
    $('#contactNameFieldError').hide();
    $('#contactEmailFieldError').hide();
    $('#contactCountryFieldError').hide();
    $('#contactEmailFieldError2').hide();
    $('#accessCodeFieldError').hide();
    $('#specialityFieldError').hide();
    $('#invalidCodeFieldError').hide();

    var countryId = parseInt($("#contactCountryField").children("option").filter(":selected").val());

    if ($('#contactNameField').val() == "") {
        $('#contactNameFieldError').show();
        return;
    }
    else if ($('#contactEmailField').val() == "") {
        $('#contactEmailFieldError').show();
        return;
    }
    else if (countryId == 0) {
        $('#contactCountryFieldError').show();
        return;
    }
    else if ($('#accessCodeField').val() == "") {
        $('#accessCodeFieldError').show();
        return;
    }

    if (!isValidEmailAddress($('#contactEmailField').val())) {
        $('#contactEmailFieldError2').show();
        return;
    }

    var data = new UserData();

    var isiDevice = /ipad|iphone|ipod/i.test(navigator.userAgent.toLowerCase());
    if (isiDevice) {
        data.DeviceType = 1;
    }

    var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
    if (isAndroid) {
        data.DeviceType = 2;
    }

    var isBlackBerry = /blackberry/i.test(navigator.userAgent.toLowerCase());
    if (isBlackBerry) {
        data.DeviceType = 3;
    }

    var isWindowsPhone = /windows phone/i.test(navigator.userAgent.toLowerCase());
    if (isWindowsPhone) {
        data.DeviceType = 4;
    }

    data.DeviceToken = _gDeviceToken;

    data.FirstName = $.trim($('#contactNameField').val());
    data.EmailId = $.trim($('#contactEmailField').val()).toLowerCase();
    data.Country = $.trim($("#contactCountryField").children("option").filter(":selected").text());
    data.AccessCode = $.trim($('#accessCodeField').val());

    data.UserId = 0;
    data.UserType = UserType.User;

    var result = g_UserService.createUser(data, false, '').Result;
    sessvars.tut = false;

    if (result.UserId > 0) {
        _glocalStorage.saveData("login", result);
        if (result.isLogged == false) {
            localStorage.setItem("isFirstLogin", "1");
        }
        else if (result.isLogged == true) {
            localStorage.setItem("isFirstLogin", "0");
        }
        if (result.SurveyStatus == false) {
            localStorage.setItem("isSurveySubmit", "0");
        }
        else if (result.SurveyStatus == true) {
            localStorage.setItem("isSurveySubmit", "1");
        }
        
        $("#HdnUserId").val(result.UserId);
        $("#registerSection").fadeOut("slow", function () {
            $('#contentdiv').css('overflow-y', 'hidden');
            $("#loaderSection").fadeIn("slow");
        });

        window.setTimeout(function () {
            $("#loaderSection").hide();
            $('#contentdiv').css('overflow-y', 'auto');
            loadHomePage();
            $("#registerSection").show();
        }, 3000);
        return true;
    }
    else {
        window.setTimeout(function () {
            $('#invalidCodeFieldError').show();
        }, 500);
        return;
    }
    return false;
}

function onclickLogout() {
    _glocalStorage.deleteData();
    localStorage.removeItem('hasNotes');

    location.reload();

    //getCountryList();

    //var cpage = page;
    //cpage.style.display = "none";
    //page = document.getElementById('login');

    //$('body').css('background', '');

    //var height = window.innerHeight;
    //var width = window.innerWidth;

    //document.getElementById('maincont').style.height = height + 'px';
    //document.getElementById('contentdiv').style.height = (height) + 'px';

    //page.style.top = "0px;";
    //$(page).find("input[type='text']").val("");
    //page.style.display = "";

    //$("#menu").hide();

    //$('#commonHeader').hide();

    //var height = $(window).height();

    //if ((height - $('.login-cont').height()) / 2 < 0) {
    //    $('.login-cont').css({ 'top': 20 + 'px' });
    //}
    //else {
    //    $('.login-cont').css({ 'top': ((height - $('.login-cont').height()) / 2) - 100 + 'px' });
    //}

    //if (((height - $('.login-cont').height()) / 2) - 100 < 0) {
    //    $('.login-cont').css({ 'top': 0 + 'px' });
    //}
    //document.getElementById('contentdiv').style.top = -(height - menuHeight) + 'px';
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
};

function animateRegistrationSection() {

    window.setTimeout(function () {
        var count = 0;
        var myInterval = window.setInterval(function () {
            count++;
            $('#registerSection').find('.responsive-image').css('display', 'none');
            $('#img-frame-' + count).css('display', 'block');
            if (count == 15) {
                clearInterval(myInterval);
                drawRegistrationContainer();
            }
        }, 100);
    }, 300);
}

function drawRegistrationContainer() {
    var width = 0;
    $('#login-input-section').css('visibility', 'visible');
    var containerInterval = window.setInterval(function () {
        width += 10;
        $('#login-input-section').css('width', width + '%');
        $('#animate-image-container').css('width', width + '%');
        if (width == 100) {
            clearInterval(containerInterval);
        }
    }, 20);

    window.setTimeout(function () {
        $('.disclaimer-logo').show();
    }, 100);

    window.setTimeout(function () {
        $('.name-field').css('visibility', 'visible');
        $('.name-field').addClass('animated bounceInUp');

        window.setTimeout(function () {
            $('.email-field').css('visibility', 'visible');
            $('.email-field').addClass('animated bounceInUp');
        }, 100);
        window.setTimeout(function () {
            $('.country-field').css('visibility', 'visible');
            $('.country-field').addClass('animated bounceInUp');
        }, 200);
        window.setTimeout(function () {
            $('.access-code-field').css('visibility', 'visible');
            $('.access-code-field').addClass('animated bounceInUp');
        }, 300);
        window.setTimeout(function () {
            $('.register-button').css('visibility', 'visible');
            $('.register-button').addClass('animated bounceInUp');
        }, 400);
    }, 300);
}

function checkAlreadyRegistered() {
    try {
        if (_glocalStorage.isDataExists("login")) {
            var userData = _glocalStorage.loadData("login");
            if (userData.UserId > 0) {
                $("#HdnUserId").val(userData.UserId);
                if (userData.isLogged == false) {
                    localStorage.setItem("isFirstLogin", "1");
                }
                else if (userData.isLogged == true) {
                    localStorage.setItem("isFirstLogin", "0");
                }
                if (userData.SurveyStatus == false) {
                    localStorage.setItem("isSurveySubmit", "0");
                }
                else if (userData.SurveyStatus == true) {
                    localStorage.setItem("isSurveySubmit", "1");
                }
                loadHomePage();
            }
        }
        else {
            animateRegistrationSection();
            getCountryList();
        }
    }
    catch (e) {
        console.log("Login error: " + e);
    }
}