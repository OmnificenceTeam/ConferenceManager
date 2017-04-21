
var _gAbstract = new Array();
var _gConfData;

function onAgendaLoad() {
    document.getElementById('MainAgendaData').innerHTML = "";
    GetConferenceDays();
    $('.hide-toggle-v1').show();
}

function GetConferenceDays() {

    var dayList = new Array();
    if (coreData != null) {
        var dayData = coreData[0].DayData;
        var HTML = "";
        for (var i = 0; i < dayData.length; i++) {
            dayList.push(dayData[i]);
        }
    }

    if (dayList.length > 0) {
        dayList.sortOn("DayName");

        HTML += '<a href="#" class="dropdown-deploy">'
             + '<em class="left-dropdown bg-light"></em>'
             + '<span class="deploy">Select Day</span>'
             + '</a>'
             + '<a href="#" class="dropdown-hidden">'
             + '<em class="left-dropdown bg-light"></em>Select Day</a>';

        for (var index = 0; index < dayList.length; index++) {
            HTML += '<a href="#" onclick="onChangeDDdays(' + dayList[index].DayId + ')" class="dropdown-item bg-light">'
                 + dayList[index].DayName + '</a>';
        }

        HTML += '<div class="dropdown-bottom-border"></div>';
        document.getElementById('DD_Days').innerHTML = HTML;
		
        HTML = '<a href="#" class="dropdown-deploy Dropdown_Border">'
			 + '<em class="left-dropdown bg-light"></em>'
			 + '<span class="deploy">Select Session</span>'
			 + '</a>'
			 + '<a href="#" class="dropdown-hidden Dropdown_Border">'
			 + '<em class="left-dropdown bg-light"></em>Select Session</a>';
			 + '<div class="dropdown-bottom-border"></div>';
		
		document.getElementById('DD_Session').innerHTML = HTML;
		InitializeDatasForPageLoad();
    }
}

// New requirement - To display the topics list by selected day
/*
function onChangeDDdays(dayId) {
    if (coreData != null) {
        var HTML = "";
        var _conferenceData = coreData[0].ConferenceData;
        for (var c = 0; c < _conferenceData.length; c++) {
            var _dayData = coreData[0].ConferenceData[c].dayList;
            for (var d = 0; d < _dayData.length; d++) {
                if (parseInt(_dayData[d].DayId) == parseInt(dayId)) {
                    var _sessionData = coreData[0].ConferenceData[c].dayList[d].sessionList;
                    for (var s = 0; s < _sessionData.length; s++) {
                        if (parseInt(_sessionData[s].SessionId) == parseInt(dayId)) {
                            var _topicData = coreData[0].ConferenceData[c].dayList[d].sessionList[s].topicList;
                            for (var t = 0; t < _topicData.length; t++) {
                                HTML += '<div class="container no-bottom">'
                                     + '<div class="toggle-container-v1">'
                                     + '<div class="toggle-v1">'
                                     + '<a href="#" class="show-toggle-v1">' + _topicData[t].TopicName + '</a>'
                                     + '<a href="#" class="hide-toggle-v1">' + _topicData[t].TopicName + ' <p>'
                                     + '<span class="highlight bg-gray">' + _topicData[t].StartTime;

                                if (_topicData[t].EndTime == "") {
                                    HTML += '</span></p></a>';
                                }

                                else {
                                    HTML += ' - ' + _topicData[t].EndTime + '</span></p></a>';
                                }


                                HTML += '<div class="clear"></div>'
                                     + '<div class="toggle-content-v1">'
                                     + '<div class="toggle-decoration-v1"></div>'
                                     + '<p><span class="bold">Time: </span>'
                                     + '<span class="highlight bg-gray">' + _topicData[t].StartTime;

                                if (_topicData[t].EndTime == "") {
                                    HTML += '</span></p>';
                                }

                                else {
                                    HTML += ' - ' + _topicData[t].EndTime + '</span></p>';
                                }

                                var _mappedSpeaker = coreData[0].ConferenceData[c].dayList[d].sessionList[s].topicList[t].mappedSpeaker;
                                var hasTitle = false;
                                for (var m = 0; m < _mappedSpeaker.length; m++) {
                                    if (!(_mappedSpeaker[m].SpeakerName == 'All')) {
                                        if (m != 0) {
                                            HTML += ', ';
                                        }
                                        if (!hasTitle) {
                                            if (parseInt(_mappedSpeaker[m].SpeakerType) == 1) {
                                                HTML += '<p><span class="bold">Speakers: </span>';
                                            }
                                            else if (parseInt(_mappedSpeaker[m].SpeakerType) == 2) {
                                                HTML += '<p><span class="bold">Chairperson: </span>';
                                            }
                                            hasTitle = true;
                                        }

                                        HTML += '<a style="display: inline;" data-id="speakerdetail" data-animate="1" class="color-link"'
                                             + 'onclick="changePage($(' + "this" + ').data(' + "'id'" + '));'
                                             + 'FillSpeakerDetail(' + _mappedSpeaker[m].SpeakerId + ',this)"'
                                             + 'data-link="agenda" href="#"  >'
                                             + '<span class="span-link">' + $.trim(_mappedSpeaker[m].SpeakerName) + '</span></a>';
                                    }

                                }

                                HTML += '</p>';

                                var _mappedPresentation = coreData[0].ConferenceData[c].dayList[d].sessionList[s].topicList[t].mappedPresentation;
                                if (_mappedPresentation.length > 0) {
                                    HTML += "<p><span class='bold'> Presentation: </span>";
                                    for (var p = 0; p < _mappedPresentation.length; p++) {
                                        if (_mappedPresentation[p].PresentationName != "" && _mappedPresentation[p].PresentationName != null) {
                                            HTML += "<a style='display: inline;' data-id='presentation' data-animate='1'"
                                                 + "class='color-link'"
                                                 + "onclick='changePage($(" + "this" + ").data(&#39;id&#39;));"
                                                 + "onloadPresentation(&#39;" + _mappedPresentation[p].PresentationPath + "&#39;);' "
                                                 + "data-link='agenda' href='#'>"
                                                 + "<span class='span-link'>" + _mappedPresentation[p].PresentationName
                                                 + "</span></a></p>";
                                        }
                                    }
                                    HTML += "</p>";

                                    $('#presentationSection').find('#BckBtn').attr('data-id', '');
                                    $('#presentationSection').find('#BckBtn').attr('data-id', 'agenda');
                                }

                                HTML += '</div></div></div></div>';
                            }
                        }
                    }
                }
            }
        }

        if (HTML.length > 0) {
            document.getElementById('MainAgendaData').innerHTML = HTML;
            InitializeDatasForPageLoad();
            $('.dropdown-deploy').show();
        }
    }
}

*/

// To display session list by selected day
function onChangeDDdays(dayId) {

    if (coreData != null) {
        var sessionData = coreData[0].SessionData;
        var sessionList = new Array();
        var HTML = "";

        for (var i = 0; i < sessionData.length; i++) {
            if (parseInt(sessionData[i].DayId) == parseInt(dayId)) {
                sessionList.push(sessionData[i]);
            }
        }

        if (sessionList.length > 0) {

            HTML += '<a href="#" class="dropdown-deploy">'
                 + '<em class="left-dropdown bg-light"></em>'
                 + '<span class="deploy">Select Session</span>'
                 + '</a>'
                 + '<a href="#" class="dropdown-hidden">'
                 + '<em class="left-dropdown bg-light"></em>Select Session</a>';

            for (var index = 0 ; index < sessionList.length; index++) {
                HTML += '<a href="#" onclick="onChangeDDSession(' + sessionList[index].SessionId + ',' + sessionList[index].DayId + ')" class="dropdown-item bg-light">'
                     + sessionList[index].SessionName + '</a>';
            }

            HTML += '<div class="dropdown-bottom-border"></div>';
            document.getElementById('DD_Session').innerHTML = HTML;
            document.getElementById('MainAgendaData').innerHTML = "";
            InitializeDatasForPageLoad();
        }
    }
}

// To display the topic by selected session
function onChangeDDSession(sessionId, dayId) {
    GetMappedTopicsAndSpeakers(sessionId, dayId)
}

function GetMappedTopicsAndSpeakers(sessionId, dayId) {

    if (coreData != null) {
        var HTML = "";
        var _conferenceData = coreData[0].ConferenceData;
        for (var c = 0; c < _conferenceData.length; c++) {
            var _dayData = coreData[0].ConferenceData[c].dayList;
            for (var d = 0; d < _dayData.length; d++) {
                if (parseInt(_dayData[d].DayId) == parseInt(dayId)) {
                    var _sessionData = coreData[0].ConferenceData[c].dayList[d].sessionList;
                    for (var s = 0; s < _sessionData.length; s++) {
                        if (parseInt(_sessionData[s].SessionId) == parseInt(sessionId)) {
                            var _topicData = coreData[0].ConferenceData[c].dayList[d].sessionList[s].topicList;
                            for (var t = 0; t < _topicData.length; t++) {
                                HTML += '<div class="container no-bottom">'
                                     + '<div class="toggle-container-v1">'
                                     + '<div class="toggle-v1">'
                                     + '<a href="#" class="show-toggle-v1">' + _topicData[t].TopicName + '</a>'
                                     + '<a href="#" class="hide-toggle-v1">' + _topicData[t].TopicName + ' <p>'
                                     + '<span aria-hidden="true" class="icon-custom-time-2 icon-size-20"></span>'
                                     + '<span class="highlight bg-gray">' + _topicData[t].StartTime;

                                if (_topicData[t].EndTime == "") {
                                    HTML += '</span></p></a>';
                                }

                                else {
                                    HTML += ' - ' + _topicData[t].EndTime + '</span></p></a>';
                                }


                                HTML += '<div class="clear"></div>'
                                     + '<div class="toggle-content-v1">'
                                     + '<div class="toggle-decoration-v1"></div>'
                                     + '<p><span class="bold">Time :</span>'
                                     + '<span class="highlight bg-gray">' + _topicData[t].StartTime;

                                if (_topicData[t].EndTime == "") {
                                    HTML += '</span></p>';
                                }

                                else {
                                    HTML += ' - ' + _topicData[t].EndTime + '</span></p>';
                                }

                                var _mappedSpeaker = coreData[0].ConferenceData[c].dayList[d].sessionList[s].topicList[t].mappedSpeaker;



                                var hasTitle = false;
                                var hasModerator = false;
                                var coma = true;
                                for (var m = 0; m < _mappedSpeaker.length; m++) {
                                    if (!(_mappedSpeaker[m].SpeakerName == 'All')) {
                                        if (!hasTitle) {
                                            if (parseInt(_mappedSpeaker[m].SpeakerType) == 3) {
                                                HTML += '<p><span class="bold">Moderator(s) : </span>';
                                                hasModerator = true;
                                                hasTitle = true;
                                            }
                                        }

                                        if (hasModerator && (parseInt(_mappedSpeaker[m].SpeakerType) == 3)) {
                                            if (!coma) {
                                                HTML += ', ';
                                            }
                                            HTML += '<a style="display: inline;" data-id="speakerdetail" data-animate="1" class="color-link"'
                                                 + 'onclick="changePage($(' + "this" + ').data(' + "'id'" + '));'
                                                 + 'FillSpeakerDetail(' + _mappedSpeaker[m].SpeakerId + ',this)"'
                                                 + 'data-link="agenda" href="#"  >'
                                                 + '<span class="span-link">' + $.trim(_mappedSpeaker[m].SpeakerName) + '</span></a>';
                                            coma = false;
                                        }

                                    }
                                }

                                HTML += '</p>';

                                var hasTitle = false;
                                var hasSpeaker = false;
                                for (var m = 0; m < _mappedSpeaker.length; m++) {
                                    if (!(_mappedSpeaker[m].SpeakerName == 'All')) {
                                        if (!hasTitle) {
                                            if (parseInt(_mappedSpeaker[m].SpeakerType) == 1) {
                                                if(_topicData[t].TopicName.toLowerCase().indexOf("panel") > -1)         
                                                    HTML += '<p><span class="bold">Panel Member(s) : </span>';
                                                else
                                                    HTML += '<p><span class="bold">Presenter : </span>';
                                                hasSpeaker = true;
                                                hasTitle = true;
                                            }
                                        }

                                        if (hasSpeaker && (parseInt(_mappedSpeaker[m].SpeakerType) == 1)) {
                                            if (m != 0) {
                                                HTML += ', ';
                                            }

                                            HTML += '<a style="display: inline;" data-id="speakerdetail" data-animate="1" class="color-link"'
                                            + 'onclick="changePage($(' + "this" + ').data(' + "'id'" + '));'
                                            + 'FillSpeakerDetail(' + _mappedSpeaker[m].SpeakerId + ',this)"'
                                            + 'data-link="agenda" href="#"  >'
                                            + '<span class="span-link">' + $.trim(_mappedSpeaker[m].SpeakerName) + '</span></a>';
                                        }
                                        
                                       
                                    }
                                    
                                }

                                HTML += '</p>';


                                var _mappedPresentation = coreData[0].ConferenceData[c].dayList[d].sessionList[s].topicList[t].mappedPresentation;
                                if (_mappedPresentation.length > 0) {
                                    HTML += "<p><span class='bold'> Presentation: </span>";
                                    for (var p = 0; p < _mappedPresentation.length; p++) {
                                        if (_mappedPresentation[p].PresentationName != "" && _mappedPresentation[p].PresentationName != null) {
                                            HTML += "<a style='display: inline;' data-id='presentation' data-animate='1'"
                                                 + "class='color-link'"
                                                 + "onclick='changePage($(" + "this" + ").data(&#39;id&#39;));"
                                                 + "onloadPresentation(&#39;" + _mappedPresentation[p].PresentationPath + "&#39;);'"
                                                 + "data-link='agenda' href='#'>"
                                                 + "<span class='span-link'>" + _mappedPresentation[p].PresentationName
                                                 + "</span></a></p>";
                                        }
                                    }
                                    HTML += "</p>";

                                    $('#presentationSection').find('#BckBtn').attr('data-id', '');
                                    $('#presentationSection').find('#BckBtn').attr('data-id', 'agenda');
                                }

                                HTML += '</div></div></div></div>';
                            }
                        }
                    }
                }
            }
        }

        if (HTML.length > 0) {
            document.getElementById('MainAgendaData').innerHTML = HTML;
            InitializeDatasForPageLoad();
            $('.dropdown-deploy').show();
        }
    }
}

