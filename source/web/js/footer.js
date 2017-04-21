
var page = document.getElementById("login");
var menuHeight = 103;

$(window).load(function () {

    $('#loaderSection').css('transform', 'translate(0px, -50%)');

    if (isiDevice)
    {
        $(".heading").css("font-size","16px");
        $(".heading").css("font-weight", "bold");

        $("#preloader").hide();
    }
    var height = window.innerHeight;
    var width = window.innerWidth;
    if (height < width) {
        if (isAndroid) {
            $('#loaderSection').css('transform', 'translate(0, 0)');
        }
    }
    else {
        if (isAndroid) {
            $('#loaderSection').css('transform', 'translate(0px, -50%)');
        }
    }

    document.getElementById('maincont').style.height = height + 'px';
    document.getElementById('maincont').style.width = width + 'px';
    document.getElementById('contentdiv').style.height = (height - menuHeight - 50) + 'px';
    document.getElementById('sidemenubar').style.height = (height - menuHeight) + 'px';
    document.getElementById('contentdiv').style.top = -(height - (menuHeight)) + 'px';
    document.getElementById('mapTabContents').style.height = (height + 50) + 'px';
    page.style.display = "";
    if (page == document.getElementById("login")) {
        $("#menu").hide();
        $("#commonHeader").hide();
        var height = window.innerHeight;
        document.getElementById('contentdiv').style.height = (height) + 'px';
        document.getElementById('contentdiv').style.top = -(height - menuHeight) + 'px';
        centerLoginContainer();
    }
   

    if (width > 700) {
        $("#logoHide").css("width", "370px");
        $("#logoHide").css("height", "20px");
    }
});

if (isiDevice) {
    window.onorientationchange = function () {
        var height = window.innerHeight;
        var width = window.innerWidth;

        document.getElementById('maincont').style.width = width + 'px';
        document.getElementById('maincont').style.height = height + 'px';

        if (page != document.getElementById("login") && isWindowsPhone)
            return;

        else {
            document.getElementById('contentdiv').style.height = (height - menuHeight - 50) + 'px';
            document.getElementById('sidemenubar').style.height = (height - menuHeight) + 'px';
            document.getElementById('contentdiv').style.top = -(height - (menuHeight)) + 'px';

            page.style.display = "";

            if (page == document.getElementById("login")) {
                $("#menu").hide();
                $("#commonHeader").hide();
                var height = window.innerHeight;
                document.getElementById('contentdiv').style.height = (height) + 'px';
                centerLoginContainer();
            }
        }

        var height = $(window).height();

        if (page == document.getElementById("login")) {
            if ((height - $('.login-cont').height()) / 2 < 0) {
                $('.login-cont').css({ 'top': 20 + 'px' });
            }
            else {
                $('.login-cont').css({ 'top': ((height - $('.login-cont').height()) / 2) - 100 + 'px' });
            }

            if (((height - $('.login-cont').height()) / 2) - 100 < 0) {
                $('.login-cont').css({ 'top': 0 + 'px' });
            }
        }
    };
}
else {
    window.onresize = function () {
        var height = window.innerHeight;
        var width = window.innerWidth;
        if (height < width) {
            if (isAndroid) {
                $('#loaderSection').css('transform', 'translate(0, 0)');
            }
        }
        else {
            if (isAndroid) {
                $('#loaderSection').css('transform', 'translate(0px, -50%)');
            }
        }

        document.getElementById('maincont').style.width = width + 'px';
        document.getElementById('maincont').style.height = height + 'px';

        if (isWindowsPhone) {
            document.getElementById('contentdiv').style.height = (height - menuHeight - 50) + 'px';
            document.getElementById('sidemenubar').style.height = (height - menuHeight) + 'px';
            document.getElementById('contentdiv').style.top = -(height - (menuHeight)) + 'px';
        }

        if (page != document.getElementById("login") && isWindowsPhone)
            return;

        else {
            document.getElementById('contentdiv').style.height = (height - menuHeight - 50) + 'px';
            document.getElementById('sidemenubar').style.height = (height - menuHeight) + 'px';
            document.getElementById('contentdiv').style.top = -(height - (menuHeight)) + 'px';

            page.style.display = "";

            if (page == document.getElementById("login")) {
                $("#menu").hide();
                $("#commonHeader").hide();
                var height = window.innerHeight;
                document.getElementById('contentdiv').style.height = (height) + 'px';
                centerLoginContainer();
            }
        }

        var height = $(window).height();

        if (page == document.getElementById("login")) {
            if ((height - $('.login-cont').height()) / 2 < 0) {
                $('.login-cont').css({ 'top': 20 + 'px' });
            }
            else {
                $('.login-cont').css({ 'top': ((height - $('.login-cont').height()) / 2) - 100 + 'px' });
            }

            if (((height - $('.login-cont').height()) / 2) - 100 < 0) {
                $('.login-cont').css({ 'top': 0 + 'px' });
            }
        }
    };
}

function loadHomePage() {

    $('#commonHeader').find('img').hide();

    $('body').css('background', '');

    var height = window.innerHeight;
    var width = window.innerWidth;

    $('body').removeClass('appLogin');
    $('body').addClass('appHome');
    var newpage = document.getElementById('introduction');
    newpage.style.display = "";
    newpage.style.left = window.innerWidth + "px";

    highlightActiveMenu(document.getElementById('intro'));

    var ele = $('.nav-onit');
    ele.removeClass('nav-onit');
    ele.addClass('nav-page');

  //  $('.headerText').html('MENA Hematology Summit <br /> May 6-7 2016');

    var currentEle = $('#intro').find('.nav-page');
    currentEle.removeClass('nav-page');
    currentEle.addClass('nav-onit');

    page.style.left = -window.innerWidth + "px";
    page.style.display = "none";
    page.style.left = "";

    $("#menu").fadeIn('slow');

    window.setTimeout(function () {
        var height = window.innerHeight; 
        document.getElementById('contentdiv').style.height = (height - menuHeight - 50) + 'px';
        $(newpage).fadeIn('slow');
        $("#commonHeader").fadeIn('slow');
        newpage.style.left = "";
        page = newpage;
        $("#contentdiv").scrollTop(0);
    }, 100);

    // Create / Generate help contents
    // createHelpContents();

    // Show survey alert
    var isFirstLogin = parseInt(localStorage.getItem("isFirstLogin"));
    var isSurveySubmit = parseInt(localStorage.getItem("isSurveySubmit"));
    if (isFirstLogin == 1 && isSurveySubmit == 0) {
        var us = _glocalStorage.loadData('login');
        us.isLogged = true;
        _glocalStorage.saveData('login', us);
        var data = new UserData();
        data.UserId = parseInt($("#HdnUserId").val());
        g_UserService.setUserLogged(data, false, '');
        $('#surveyModal').modal('show');
    }
}

function showSideBar() {

    if (isWindowsPhone) {
        if ($("#sidemenubar").css("left") == "0px") {
            document.getElementById("sidemenubar").style.left = "-260px";
            document.getElementById("contentdiv").style.left = "0px";
            document.getElementById('commonHeader').style.left = '0px';
        }
        else {
            document.getElementById("sidemenubar").style.left = "0px";
            document.getElementById("contentdiv").style.left = "260px";
            document.getElementById('commonHeader').style.left = '260px';
        }
    }
    else {
        if ($("#sidemenubar").css("-webkit-transform") == "matrix(1, 0, 0, 1, 0, 0)" || $("#sidemenubar").css("-webkit-transform") == "none") {
            $("#sidemenubar").css("-webkit-transform", "translate3d(260px,0,0)");
            $("#contentdiv").css("-webkit-transform", "translate3d(260px,0,0)");
            $("#commonHeader").css("-webkit-transform", "translate3d(260px,0,0)");
        }
        else {
            $("#sidemenubar").css("-webkit-transform", "translate3d(0px,0,0)");
            $("#contentdiv").css("-webkit-transform", "translate3d(0px,0,0)");
            $("#commonHeader").css("-webkit-transform", "translate3d(0px,0,0)");
        }
    }
}

function showPage(id) {

    if (isWindowsPhone) {
        document.getElementById("sidemenubar").style.left = "-260px";
        document.getElementById("contentdiv").style.left = "0px";
        document.getElementById("commonHeader").style.left = "0px";
    }
    else {
        $("#sidemenubar").css("-webkit-transform", "translate3d(0px,0,0)");
        $("#contentdiv").css("-webkit-transform", "translate3d(0px,0,0)");
        $("#commonHeader").css("-webkit-transform", "translate3d(0px,0,0)");
    }

    if (id != "#login") {
        var newpage = document.getElementById(id);
        if (page == newpage)
            return;

        newpage.style.display = "";
        page.style.display = "none";
        page = newpage;
    }

    $("#contentdiv").scrollTop(0);
}

function changePage(id) {

    $('#commonHeader').find('img').hide();

    var newpage = document.getElementById(id);
    if (page == undefined || page == document.getElementById("login") || page == newpage) {
        return;
    }

    newpage.style.display = "";
    newpage.style.left = window.innerWidth + "px";

    $('.headerText').css('visibility', 'visible');

    if (id == 'speakerlist') {
        $('.headerText').html('Faculty Members');
    }

    else if (id == 'agenda') {
        $('.headerText').html('Agenda');
    }

    else if (id == 'presentation') {
        $('.headerText').css('visibility', 'hidden');
    }

    else if (id == 'feedback') {
        $('.headerText').html('Feedback');
    }

    else if (id == 'message') {
        $('.headerText').html('Messages');
    }

    else if (id == 'poll') {
        $('.headerText').html('Poll');
    }



    window.setTimeout(function () {
        page.style.left = -window.innerWidth + "px";
        newpage.style.left = "";
        page.style.display = "none";
        page.style.left = "";
        page = newpage;
        page.style.display = "block";
        $("#contentdiv").scrollTop(0);

        if (id == "message") {
            onMessageLoad();
            var ele = $('.nav-onit');
            ele.removeClass('nav-onit');
            ele.addClass('nav-page');

            var currentEle = $("#MessM").find('.nav-page');
            currentEle.removeClass('nav-page');
            currentEle.addClass('nav-onit');
        }

        else if (id == "feedback") {
            //onloadfeedback();
            var ele = $('.nav-onit');
            ele.removeClass('nav-onit');
            ele.addClass('nav-page');

            var currentEle = $("#FeedM").find('.nav-page');
            currentEle.removeClass('nav-page');
            currentEle.addClass('nav-onit');
        }
        else if (id == "poll") {
            onLoadPoll();
            var ele = $('.nav-onit');
            ele.removeClass('nav-onit');
            ele.addClass('nav-page');

            var currentEle = $("#PollM").find('.nav-page');
            currentEle.removeClass('nav-page');
            currentEle.addClass('nav-onit');
        }

    }, 100);
}

$('.nav-item').on("click", function () {

    highlightActiveMenu(this);

    showPage($(this).data('id'));

    if ($(this).data('id') == '#login') {
        return;
    }

    var ele = $('.nav-onit');
    ele.removeClass('nav-onit');
    ele.addClass('nav-page');

    var title = $(this).data('title');
    $('.headerText').html(title);

    $('#commonHeader').find('img').hide();

    var currentEle = $(this).find('.nav-page');
    currentEle.removeClass('nav-page');
    currentEle.addClass('nav-onit');
});

function highlightActiveMenu(element) {
    $('.nav-item').css('background-color', '#269bc2');
    $(element).css('background-color', '#115476');
}