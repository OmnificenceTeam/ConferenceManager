
function onLoadSpeakerList() {
   ListSpeakerByName();
   // ListSpeakerByDay();

}

function ListSpeakerByName() {
    var speakerList = new Array();
    if (coreData != null) {
        var speakerData = coreData[0].SpeakerData;
        var HTML = "";
        for (var i = 0; i < speakerData.length; i++) {
            if (speakerData[i].SpeakerName == 'All')
                continue;
            speakerList.push(speakerData[i]);
        }
    }

    if (speakerList.length > 0) {
        speakerList.sortOn("SpeakerName");
        
        for (var index = 0; index < speakerList.length ; index++) {
            if (speakerList[index].SpeakerName != "" && speakerList[index].SpeakerName != null && speakerList[index].SpeakerType == 1) {
                HTML += '<div class="speakerlistContainer">'
                     + '<a data-id="speakerdetail" data-animate="1" data-link="speaker" href="#"'
                     + 'onclick="changePage(' + "this" + '.getAttribute(' + "'data-id'" + '));'
                     + 'FillSpeakerDetail(' + speakerList[index].SpeakerId + ',this)" >'
                     + '<div style="width: 100%;">'
                     + '<div style="float: left;">'
                     + '<img src="' + speakerList[index].SpeakerPhoto + '" />'
                     + '</div>'
                     + '<div style="float: left; width: 70%;">'
                     + '<h4 class="no-bottom">' + speakerList[index].SpeakerName + '</h4>'
                     + '<div class="no-bottom">' + speakerList[index].SpeakerDetails + '</div>'
                     + '</div>'
                     + '<br style="clear: left;" />'
                     + '</div>'
                     + '</a>'
                     + '</div><br />';
            }
           
        }
        document.getElementById("SpeakerList").innerHTML = HTML;

    }
}


function ListSpeakerByDay() {
    if (coreData != null) {
        var speakerData = coreData[0].SpeakerData;
        var HTML = "";

        var _conferenceData = coreData[0].ConferenceData;
        for (var c = 0; c < _conferenceData.length; c++) {
            var _dayData = coreData[0].ConferenceData[c].dayList;
            for (var d = 0; d < _dayData.length; d++) {
                HTML += '<h4 class="heading center-text">Day ' + (d + 1) + '</h4>'
                     + '<div class="decoration"></div>';
                var _sessionData = coreData[0].ConferenceData[c].dayList[d].sessionList;
                for (var s = 0; s < _sessionData.length; s++) {
                    var _topicData = coreData[0].ConferenceData[c].dayList[d].sessionList[s].topicList;
                    for (var t = 0; t < _topicData.length; t++) {
                        var _mappedSpeaker = coreData[0].ConferenceData[c].dayList[d].sessionList[s].topicList[t].mappedSpeaker;
                        for (var m = 0; m < _mappedSpeaker.length; m++) {
                            for (var sl = 0; sl < speakerData.length; sl++) {
                                if (parseInt(speakerData[sl].SpeakerId) == (_mappedSpeaker[m].SpeakerId)) {
                                    if (!(speakerData[sl].SpeakerName == 'All') && speakerData[sl].SpeakerType == 1) {
                                        HTML += '<div class="speakerlistContainer">'
                                             + '<a data-id="speakerdetail" data-animate="1" data-link="speaker" href="#"'
                                             + 'onclick="changePage(' + "this" + '.getAttribute(' + "'data-id'" + '));'
                                             + 'FillSpeakerDetail(' + speakerData[sl].SpeakerId + ',this)" >'
                                             + '<div style="width: 100%;">'
                                             + '<div style="float: left; padding-top:4px;">'
                                             + '<img src="' + speakerData[sl].SpeakerPhoto + '" />'
                                             + '</div>'
                                             + '<div style="float: left; width: 70%;">'
                                             + '<h4 class="no-bottom">' + speakerData[sl].SpeakerName + '</h4>'
                                             + '<div class="no-bottom">' + speakerData[sl].SpeakerDetails + '</div>'
                                             + '</div>'
                                             + '<br style="clear: left;" />'
                                             + '</div>'
                                             + '</a>'
                                             + '</div><br />';
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        document.getElementById("SpeakerList").innerHTML = HTML;
    }
}