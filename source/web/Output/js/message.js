var _gMessages;


function onMessageLoad() {

    var data = new NotificationData();
    data.NotificationId = 0;
    data.UserId = parseInt($("#HdnUserId").val());

    var messages = g_UserService.GetUserNotification(data, false, '').Result;
    if (messages.length > 0) {
        _gMessages = messages;
        var html = "";
        for (var index = 0; index < messages.length ; index++) {
            var isWindowsPhone = /windows phone/i.test(navigator.userAgent.toLowerCase());
            var dateTime = new Date(parseInt(messages[index].DateTime.substr(6)));
            if (isWindowsPhone) {
                //dateTime = messages[index].DateTime;
            }
            else {
                dateTime = dateFormat(dateTime, "dS mmm, h:MM TT");
            }


            if (messages[index].IsRead) {
                html += '<div class="read" onclick="onClickMessage(' + index + ',this)">'
                     + '<div class="messageImg">'
                     + '<img class="img" src="img/emailopen.png" style="width: 32px;" /></div>'
                     + '<input type="hidden" value="' + messages[index].NotificationId + '" id="HdnMessageId" />'
                     + '<p class="messageTitle">' + messages[index].NotificationSubject.slice(0, 20) + '<span class="messageTime">' + dateTime
                     + '</span></p>'
                     + '<p class="message">' + messages[index].NotificationMessage.slice(0, 20) + '</p>'
                     + '</div>';
            }
            else {
                html += '<div class="unread"  onclick="onClickMessage(' + index + ',this)">'
                     + '<div class="messageImg">'
                     + '<img class="img" src="img/email.png" style="width: 28px; margin-left:2px;" /></div>'
                     + '<input type="hidden" value="' + messages[index].NotificationId + '" id="HdnMessageId" />'
                     + '<p class="messageTitle">' + messages[index].NotificationSubject.slice(0, 20) + '<span class="messageTime">' + dateTime
                     + '</span></p>'
                     + '<p class="message">' + messages[index].NotificationMessage.slice(0, 20) + '</p>'
                     + '</div>';
            }
        }
        $('#messageContent').html(html);
    }
}




function onClickMessage(index, ele) {
    var data = new NotificationData();
    data.NotificationId = parseInt(_gMessages[index].NotificationId);
    data.UserId = parseInt($("#HdnUserId").val());

    var result = g_UserService.SetUserNotificationRead(data, false, '').Result;

    if (result) {
        $(ele).attr('class', 'read');
        $(ele).find(".img").attr('src', 'img/emailopen.png');
        $(ele).find(".img").css('width', '32px');
        $(ele).find(".img").css('margin-left', '0px');
    }

    $('#myModalm').find('.myModalLabel').html(_gMessages[index].NotificationSubject);
    $('#myModalm').find('.modal-body').html(_gMessages[index].NotificationMessage);
    $('#myModalm').modal("show");
}


//date format
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
		    val = String(val);
		    len = len || 2;
		    while (val.length < len) val = "0" + val;
		    return val;
		};

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
			    d: d,
			    dd: pad(d),
			    ddd: dF.i18n.dayNames[D],
			    dddd: dF.i18n.dayNames[D + 7],
			    m: m + 1,
			    mm: pad(m + 1),
			    mmm: dF.i18n.monthNames[m],
			    mmmm: dF.i18n.monthNames[m + 12],
			    yy: String(y).slice(2),
			    yyyy: y,
			    h: H % 12 || 12,
			    hh: pad(H % 12 || 12),
			    H: H,
			    HH: pad(H),
			    M: M,
			    MM: pad(M),
			    s: s,
			    ss: pad(s),
			    l: pad(L, 3),
			    L: pad(L > 99 ? Math.round(L / 10) : L),
			    t: H < 12 ? "a" : "p",
			    tt: H < 12 ? "am" : "pm",
			    T: H < 12 ? "A" : "P",
			    TT: H < 12 ? "AM" : "PM",
			    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

