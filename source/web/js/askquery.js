
function onQueryPageLoad() {
    GetSpeakerNames();
}

function GetSpeakerNames() {
    var speakerList = new Array();
    var originalList = new Array();
    if (coreData != null) {
        var speakerData = coreData[0].SpeakerData;
        var HTML = "";
        for (var i = 0; i < speakerData.length; i++) {
            if (speakerData[i].SpeakerName == 'All' || (speakerData[i].SpeakerName).indexOf("Vimal Narayanan") > -1)
                continue;

            var topicList = new Array();
            var HTML = "";
            var speakerId = speakerData[i].SpeakerId;
            var _conferenceData = coreData[0].ConferenceData;
            for (var c = 0; c < _conferenceData.length; c++) {
                var _dayData = coreData[0].ConferenceData[c].dayList;
                for (var d = 0; d < _dayData.length; d++) {
                    var _sessionData = coreData[0].ConferenceData[c].dayList[d].sessionList;
                    for (var s = 0; s < _sessionData.length; s++) {
                        var _topicData = coreData[0].ConferenceData[c].dayList[d].sessionList[s].topicList;
                        for (var t = 0; t < _topicData.length; t++) {
                            var _mappedSpeaker = coreData[0].ConferenceData[c].dayList[d].sessionList[s].topicList[t].mappedSpeaker;
                            for (var m = 0; m < _mappedSpeaker.length; m++) {
                                if (parseInt(speakerId) == parseInt(_mappedSpeaker[m].SpeakerId)) {
                                    topicList.push(_topicData[t]);
                                }
                            }
                        }
                    }
                }
            }
            var OTopic = new Array();
            if (topicList.length > 0) {
                topicList = removeDuplicateTopics(topicList);
                OTopic = removeDuplicateTopics(topicList);
                for (var index = 0 ; index < topicList.length; index++) {
                    if (topicList[index].TopicName.toLowerCase().indexOf("panel") > -1 && speakerData[i].SpeakerType == 1)
                    {
                        var check = OTopic.indexOf(topicList[index]);
                        if (check > -1) {
                            OTopic.splice(check, 1);
                        }
                    }
                }
            }

            if(OTopic.length > 0)
                speakerList.push(speakerData[i]);
        }
    }

    speakerList = removeDuplicateSpeakerName(speakerList);
    if (speakerList.length > 0) {
        speakerList.sortOn("SpeakerName");

        HTML += '<a href="#" class="dropdown-deploy">'
             + '<em class="left-dropdown bg-light"></em>'
             + '<span class="deploy">Select Speaker</span>'
             + '</a>'
             + '<a href="#" class="dropdown-hidden">'
             + '<em class="left-dropdown bg-light"></em>Select Speaker</a>';

        for (var index = 0; index < speakerList.length; index++) {
            HTML += '<a href="#" data-sp="' + speakerList[index].SpeakerName + '" onclick="onChangeDDSpeaker(' + speakerList[index].SpeakerId + ',this)" class="dropdown-item bg-light">'
                     + speakerList[index].SpeakerName + '</a>';
        }

        HTML += '<div class="dropdown-bottom-border"></div>';
        document.getElementById('DD_Speaker').innerHTML = HTML;

        HTML = '<a href="#" class="dropdown-deploy">'
             + '<em class="left-dropdown bg-light"></em>'
             + '<span class="deploy">Select Topic</span>'
             + '</a>'
             + '<a href="#" class="dropdown-hidden">'
             + '<em class="left-dropdown bg-light"></em>'
             + '<span>Select Topic</span>'
             + '</a>'
             + '<div class="dropdown-bottom-border"></div>';

        document.getElementById('DD_Topic').innerHTML = HTML;

        InitializeDatasForPageLoad();
    }
}


function onChangeDDSpeaker(speakerId, ele) {
    var speakerName = $(ele).data("sp");
    $('#HdnSpeakerId').val(speakerId);
    $('#HdnTopicId').val("0");

    if (coreData != null) {
        var speakerData = coreData[0].SpeakerData;
        var topicList = new Array();
        var HTML = "";

        var _conferenceData = coreData[0].ConferenceData;
        for (var c = 0; c < _conferenceData.length; c++) {
            var _dayData = coreData[0].ConferenceData[c].dayList;
            for (var d = 0; d < _dayData.length; d++) {
                var _sessionData = coreData[0].ConferenceData[c].dayList[d].sessionList;
                for (var s = 0; s < _sessionData.length; s++) {
                    var _topicData = coreData[0].ConferenceData[c].dayList[d].sessionList[s].topicList;
                    for (var t = 0; t < _topicData.length; t++) {
                        var _mappedSpeaker = coreData[0].ConferenceData[c].dayList[d].sessionList[s].topicList[t].mappedSpeaker;
                        for (var m = 0; m < _mappedSpeaker.length; m++) {
                            if (speakerName.toLowerCase() == _mappedSpeaker[m].SpeakerName.toLowerCase()) {
                                if (_mappedSpeaker[m].SpeakerType == 3)
                                    topicList.push(_topicData[t]);
                                if(_mappedSpeaker[m].SpeakerType == 1)
                                {
                                    if (_topicData[t].TopicName.toLowerCase().indexOf("panel") > -1)
                                    {

                                    }
                                   else if (_topicData[t].TopicName.toLowerCase().indexOf("closing remarks") > -1) {

                                    }
                                   else 
                                      topicList.push(_topicData[t]);
                                }
                            }
                        }
                    }
                }
            }
        }

        if (topicList.length > 0) {

            topicList = removeDuplicateTopics(topicList);

            HTML += '<a href="#" class="dropdown-deploy">'
                 + '<em class="left-dropdown bg-light"></em>'
                 + '<span class="deploy">Select Topic</span>'
                 + '</a>'
                 + '<a href="#" class="dropdown-hidden">'
                 + '<em class="left-dropdown bg-light"></em>Select Topic</a>';

            for (var index = 0 ; index < topicList.length; index++) {

                HTML += '<a href="#" onclick="onChangeDDTopic(' + topicList[index].TopicId + ')" class="dropdown-item bg-light">'
                     + topicList[index].TopicName + '</a>';
            }

            HTML += '<div class="dropdown-bottom-border"></div>';
            document.getElementById('DD_Topic').innerHTML = HTML;
            InitializeDatasForPageLoad();
        }
    }
}

function onChangeDDTopic(TopicId) {
    $('#HdnTopicId').val(TopicId);
}

function createQuery() {

    var data = new UserQueries();

    var message = $.trim($('#contactMessageTextarea').val());
    data.SpeakerId = parseInt($('#HdnSpeakerId').val());
    data.TopicId = parseInt($('#HdnTopicId').val());

    if ((data.SpeakerId) == 0) {
        $('#alertMessage').html('Please select the Speaker');
        $('#alertModal').modal('show');
        return;
    }

    if ((data.TopicId) == 0) {
        $('#alertMessage').html('Please select the Topic');
        $('#alertModal').modal('show');
        return;
    }

    if (message.length == 0) {
        $('#alertMessage').html('Please enter your query');
        $('#alertModal').modal('show');
        return;
    }
   
    data.UserId = parseInt($('#HdnUserId').val());
    data.Query = message;

    if (g_UserService.createQuery(data, false, '').Result) {
        $('#contactMessageTextarea').val('');

        $('#alertMessage').html('Your query has been submitted successfully.');
        $('#alertModal').modal('show');

        var HTML = '<a href="#" class="dropdown-deploy">'
                 + '<em class="left-dropdown bg-light"></em><span class="deploy">Select Topic</span></a>'
                 + '<a href="#"  class="dropdown-hidden"><em class="left-dropdown bg-light"></em>Select Topic</a>'
                 + '<div class="dropdown-bottom-border"></div>';

        document.getElementById('DD_Topic').innerHTML = HTML;

        $('#HdnSpeakerId').val("0");
        $('#HdnTopicId').val("0");

        GetSpeakerNames();
    }
}