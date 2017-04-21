
var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
var isBlackBerry = /blackberry/i.test(navigator.userAgent.toLowerCase());
var isiDevice = /ipad|iphone|ipod/i.test(navigator.userAgent.toLowerCase());
var isWindowsPhone = /windows phone/i.test(navigator.userAgent.toLowerCase() || navigator.userAgent.match(/iemobile/i));

// Include css
var head = document.getElementsByTagName('head')[0];
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.media = 'all';

if (isAndroid) {
    link.href = 'css/android.css';
}

else if (isiDevice) {
    link.href = 'css/ios.css';
}

else if (isWindowsPhone) {
    link.href = 'css/windows.css';
}

else {
    link.href = 'css/desktop.css';
}

head.appendChild(link);

/* Mainly used for JSSOR files _ Higlights page */
jQuery(document).ready(function ($) {
    var options = {
        $AutoPlay: true,
        $AutoPlayInterval: 4000,
        $SlideDuration: 500,
        $DragOrientation: 3,

        $ThumbnailNavigatorOptions: {
            $Class: $JssorThumbnailNavigator$,
            $ChanceToShow: 2,
            $Loop: false,
            $SpacingX: 3,
            $SpacingY: 3,
            $DisplayPieces: 6,
            $ParkingPosition: 204,
            $ArrowNavigatorOptions: {
                $Class: $JssorArrowNavigator$,
                $ChanceToShow: 2,
                $AutoCenter: 2,
                $Steps: 6
            }
        }
    };

    var jssor_slider1 = new $JssorSlider$("slider1_container", options);

    function ScaleSlider() {
        var parentWidth = jssor_slider1.$Elmt.parentNode.clientWidth;
        if (parentWidth)
            jssor_slider1.$SetScaleWidth(Math.min(parentWidth, 720));
        else
            window.setTimeout(ScaleSlider, 30);
    }

    ScaleSlider();

    if (!navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|IEMobile)/)) {
        $(window).bind('resize', ScaleSlider);
    }

});

$(window).load(function () {
    $('#content').removeClass('fullwidth').delay(10).queue(function (next) {
        $(this).addClass('fullwidth');
        next();
    });
});

$(document).ready(function () {
    $('.collapse').on('shown.bs.collapse', function () {
        $(this).parent().find(".right-arrow").find("img").attr("src", "img/down-arrow.png");
    }).on('hidden.bs.collapse', function () {
        $(this).parent().find(".right-arrow").find("img").attr("src", "img/right-arrow.png");
    });
});