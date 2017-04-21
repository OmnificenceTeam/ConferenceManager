function divObject() {
    this.id = "";
    this.class = "";
}

function loadWholePage(MainContentId) {
    var mainDiv = document.getElementById(MainContentId);
    var XmlData = ReadXml('data.xml');
    var pages = XmlData.getElementsByTagName("page");

    for (var index = 0; index < pages.length; index++) {
        var divObj = new divObject();
        divObj.id = pages[index].getAttribute("id");
        divObj.class = pages[index].getAttribute("class");
        var url = pages[index].getAttribute("url");
        loadHTML(url, mainDiv, divObj);
    }
}

var topVal = 0;

var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
var isBlackBerry = /blackberry/i.test(navigator.userAgent.toLowerCase());
var isiDevice = /ipad|iphone|ipod/i.test(navigator.userAgent.toLowerCase());
var isWindowsPhone = /windows phone/i.test(navigator.userAgent.toLowerCase());

if (isWindowsPhone == true) {
    isAndroid = isBlackBerry = isiDevice = false;
}

function onPushNotification(string) {
    var result = JSON.parse(string);
    if ((typeof result.type == "string" && (result.type.toLowerCase() == "page" || result.type == "1")) || parseInt(result.type) == 1) {
        changePage(result.page);
    }
}

function Logout() {
    sessvars.LoginID = 0;
    window.location.href = "login.html";
}

function getQueryParams() {
    var qs = document.location.hash;
    qs = qs.split("+").join(" ");

    var params = {},
        tokens,
        re = /[#&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }
    return params;
}


function goBack() {
    window.history.back()
}

function InitializeDatasForPageLoad() {
    $('.dropdown-hidden').hide();
    $('.dropdown-item').hide();

    $('.dropdown-item').click(function () {
        $(this).parent().find('.deploy').html($(this).html());
        $(this).parent().parent().find('.dropdown-item').hide(200);
        $(this).parent().parent().find('.dropdown-deploy').show();
        $(this).parent().parent().find('.dropdown-hidden').hide();
        return false;
    });


    $('.dropdown-deploy').click(function () {
        $(this).parent().parent().find('.dropdown-item').show(200);
        $(this).parent().parent().find('.dropdown-hidden').show();
        $(this).hide();
        return false;
    });

    $('.dropdown-hidden').click(function () {
        $(this).parent().parent().find('.dropdown-item').hide(200);
        $(this).parent().parent().find('.dropdown-deploy').show();
        $(this).parent().parent().find(this).hide();
        return false;
    });

    $('.show-toggle-v1').hide();
    $('.toggle-content-v1').hide();

    $('.show-toggle-v1').click(function () {
        $(this).hide();
        $(this).parent().find('.hide-toggle-v1').show();
        $(this).parent().find('.toggle-content-v1').fadeOut(100);
        return false;
    });

    $('.hide-toggle-v1').click(function () {
        $(this).parent().find('.show-toggle-v1').show();
        $(this).hide();
        $(this).parent().find('.toggle-content-v1').fadeIn(200);
        return false;
    });

    $('.show-toggle-v2').hide();
    $('.toggle-content-v2').hide();

    $('.show-toggle-v2').click(function () {
        $(this).hide(); $(this).parent().find('.hide-toggle-v2').show();
        $(this).parent().find('.toggle-content-v2').fadeOut(100);
        return false;
    });

    $('.hide-toggle-v2').click(function () {
        $(this).parent().find('.show-toggle-v2').show();
        $(this).hide();
        $(this).parent().find('.toggle-content-v2').fadeIn(200);
        return false;
    });

    $('.show-toggle-v3').hide();
    $('.toggle-content-v3').hide();
    $('.show-toggle-v3').click(function () {
        $(this).hide();
        $(this).parent().find('.hide-toggle-v3').show();
        $(this).parent().find('.toggle-content-v3').fadeOut(100);
        return false;
    });

    $('.hide-toggle-v3').click(function () {
        $(this).parent().find('.show-toggle-v3').show();
        $(this).hide(); $(this).parent().find('.toggle-content-v3').fadeIn(200);
        return false;
    });

    $('.show-toggle-v4').hide();
    $('.toggle-content-v4').hide();

    $('.show-toggle-v4').click(function () {
        $(this).hide();
        $(this).parent().find('.hide-toggle-v4').show();
        $(this).parent().find('.toggle-content-v4').fadeOut(100);
        return false;
    });

    $('.hide-toggle-v4').click(function () {
        $(this).parent().find('.show-toggle-v4').show();
        $(this).hide();
        $(this).parent().find('.toggle-content-v4').fadeIn(200);
        return false;
    });

    $('.show-toggle-v5').hide();
    $('.toggle-content-v5').hide();

    $('.show-toggle-v5').click(function () {
        $(this).hide();
        $(this).parent().find('.hide-toggle-v5').show();
        $(this).parent().find('.toggle-content-v5').fadeOut(100);
        return false;
    });

    $('.hide-toggle-v5').click(function () {
        $(this).parent().find('.show-toggle-v5').show();
        $(this).hide();
        $(this).parent().find('.toggle-content-v5').fadeIn(200);
        return false;
    });
}

Array.prototype.sortOn = function (key) {
    this.sort(function (a, b) {
        if (a[key] < b[key]) {
            return -1;
        } else if (a[key] > b[key]) {
            return 1;
        }
        return 0;
    });
}

Array.prototype.removeDuplicates = function () {
    var input = this;
    var hashObject = new Object();

    for (var i = input.length - 1; i >= 0; i--) {
        var currentItem = input[i];

        if (hashObject[currentItem] == true) {
            input.splice(i, 1);
        }

        hashObject[currentItem] = true;
    }
    return input;
}

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function removeDuplicateTopics(list) {
    var tempArr = []
    var uniqueList = [];
    $.each(list, function (index, value) {
        if ($.inArray(value.TopicName, tempArr) == -1) {
            tempArr.push(value.TopicName);
            uniqueList.push(value);
        }
    });

    return uniqueList;
}

function removeDuplicateSpeakerName(list) {
    var tempArr = []
    var uniqueList = [];
    $.each(list, function (index, value) {
        if ($.inArray(value.SpeakerName, tempArr) == -1) {
            tempArr.push(value.SpeakerName);
            uniqueList.push(value);
        }
    });

    return uniqueList;
}


function createHelpContents() {
    var content = '';
    for (var index = 1; index <= 12; index++) {
        content += '<img src="img/help/help_' + index + '.jpg" />';
    }

    $('#helpContent').html(content);
}

function onNetworkStatus(status) {
    if (parseInt(status) == 1) {
        // has network
        getCountryList();
    }
    else {
        // no network
    }
}

function tab(ele) {
    $('.prefirstdiv').css({
        'background-color': '#fff',
        'color': '#269bc2'
    });
    $('.displaydiv').css({
        'display': 'none',
    });

    if (ele == "1") {
        $('#ADVANTAGES').css({
            'background-color': '#269bc2',
            'color': '#fff'
        });
        $('#advantages_accordion').css({
            'display': 'block',
        });
    }
    if (ele == "2") {
        $('#BENEFITS').css({
            'background-color': '#269bc2',
            'color': '#fff'
        });
        $('#benefits_accordion').css({
            'display': 'block',
        });
    }
}

function onclickPrereadCmldiv() {

    $('.prefirstdiv').css({
        'background-color': '#fff',
        'color': '#269bc2'
    });
    $('.displaydiv').css({
        'display': 'none',
    });

    $('#ADVANTAGES').css({
        'background-color': '#269bc2',
        'color': '#fff'
    });
    $('#advantages_accordion').css({
        'display': 'block',
    });
}

function menuBar() {

}

$('.collapse').on('shown.bs.collapse', function () {
    $(this).parent().find(".Pre_Txt_Close").removeClass("Pre_Txt_Close").addClass("Pre_Txt_Open");
}).on('hidden.bs.collapse', function () {
    $(this).parent().find(".Pre_Txt_Open").removeClass("Pre_Txt_Open").addClass("Pre_Txt_Close");
});

