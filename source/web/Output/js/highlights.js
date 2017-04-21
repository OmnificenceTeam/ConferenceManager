function highLights(ele) {
    if (ele == 1) {
        document.getElementById("gallery").style.display = "none";
        document.getElementById("photogallery").style.display = "block";
    }
    if (ele == 2) {
        document.getElementById("gallery").style.display = "none";
        document.getElementById("meetingvideo").style.display = "block";
        //  meetingreport();

    }
    if (ele == 3) {
        document.getElementById("gallery").style.display = "none";
        document.getElementById("meetingreport").style.display = "block";
        meetingreport();
    }
}


function Onclick_Back() {
    $('.headerText').html('HIGHLIGHTS');
    document.getElementById("gallery").style.display = "block";
    // document.getElementById("phg").style.display = "block";
    document.getElementById("mtr").style.display = "block";
    document.getElementById("mtv").style.display = "block";
    document.getElementById("photogallery").style.display = "none";
    document.getElementById("meetingreport").style.display = "none";
    document.getElementById("meetingvideo").style.display = "none";

}


function meetingreport() {
    var content = '';

    for (var index = 1; index <= 12; index++) {
        content += '<img class="img_cls" src="img/help/help_' + index + '.jpg" />';
    }

    $('#meetrep').html(content);
}


function Onclickmeetingvideo(ele) {
    document.getElementById("meetingvideo").style.display = "none";
    document.getElementById("Meeting_video_Play").style.display = "block";
    if (ele == 1) {
        v.setAttribute("src", "video/Intro.mp4");
        // v.setAttribute("src", "http://apps.omnificence.in/MENA2016/app/video/dummy.ogg");
    }

    //if (ele == 2) {
    //    v.setAttribute("src", "http://apps.omnificence.in/MENA2016/app/video/dummy1.mp4");
    //}
    //if (ele == 3) {
    //    v.setAttribute("src", "http://apps.omnificence.in/MENA2016/app/video/dummy1.mp4");
    //}
    v.load();
    v.play();

}

function Onclick_Back_TO_gallery() {
    document.getElementById("meetingvideo").style.display = "block";
    document.getElementById("Meeting_video_Play").style.display = "none";
    v.pause();
}


var v = document.getElementById('videoPlayer');
v.pause()
v.volume = 0.5;

v.addEventListener('click', function () {
    if (v.paused == false) {
        v.pause();
        v.firstChild.nodeValue = 'Play';
    }
    else {
        v.play();
        v.firstChild.nodeValue = 'Pause';
    }
});

function Onclick_Img_Choose_Video(ele) {


}

function img_ht() {
    var a = $('body').css("width");
    if (a == "320px") {
        $('.Videos').css("margin-top", "10px");
        $('.Video_div').css("height", "106px");
    }
    if (a == "360px" || a == "361px") {
        $('.Videos').css("margin-top", "10px");
        $('.Video_div').css("height", "112px");
    }
    if (a == "375px") {
        $('.Videos').css("margin-top", "10px");
        $('.Video_div').css("height", "110px");
    }
    if (a == "414px") {
        $('.Videos').css("margin-top", "10px");
        $('.Video_div').css("height", "110px");
    }
    if (a == "411px") {
        $('.Videos').css("margin-top", "10px");
        $('.Video_div').css("height", "110px");
    }
    if (a == "434px") {
        $('.Videos').css("margin-top", "10px");
        $('.Video_div').css("height", "125px");
    }
}