
function FillSpeakerDetail(speakerId, element) {

    if ($(element).data("link") == "agenda") {
        $("#BckBtn").attr("data-id", "agenda");
    }
    else {
        $('#SpeakerDetailsContainer').find("#BckBtn").attr("data-id", "speakerlist");
    }

    if (coreData != null) {
        var speakerData = coreData[0].SpeakerData;
   
        var currentSpeaker = new Array();
       
        var topicList = new Array();
        var HTML = "";
        for (var i = 0; i < speakerData.length; i++) {
            if (parseInt(speakerData[i].SpeakerId) == parseInt(speakerId)) {
                currentSpeaker.push(speakerData[i]);
                break;
            }
        }
     
        
        if (currentSpeaker.length > 0) {
           
            if (currentSpeaker[0].SpeakerType == 1) {
                document.getElementById("details-header").innerHTML = "Faculty Member";
                           }

            else if (currentSpeaker[0].SpeakerType == 2) {
                document.getElementById("details-header").innerHTML = "Chairperson";
            }
            else if (currentSpeaker[0].SpeakerType == 3) {
                document.getElementById("details-header").innerHTML = "Faculty Member";
            }

            HTML += '<div class="speakerDetails">'
                 + '<img class="speaker-photo" src="' + currentSpeaker[0].SpeakerPhoto + '" />'
                 + '<h4 class="no-bottom speakerName">' + currentSpeaker[0].SpeakerName + '</h4>'
                 + '<div class="no-bottom speakerDesc">' + currentSpeaker[0].SpeakerDetails + ' </div>'
                 + '</div>'
                 + '<h3 class="biographyHeader">Biography</h3>'
                 + '<div class="speech-left biographyContainer">' + currentSpeaker[0].SpeakerDescription + '</div>'
                 + '<div class="clear"></div>'
                 + '<div class="space-20"></div>';


            // Get conference topic list for this speaker
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
                                if (parseInt(currentSpeaker[0].SpeakerId) == _mappedSpeaker[m].SpeakerId) {
                                    topicList.push(_topicData[t]);
                                }
                            }
                        }
                    }
                }
            }

            if (topicList.length > 0) {
                for (var index = 0 ; index < topicList.length; index++) {
                    HTML += '<div class="container no-bottom">'
                         + '<div class="toggle-container-v1">'
                         + '<div class="toggle-v1">'
                         + '<a href="#" class="show-toggle-v1">' + topicList[index].TopicName + '</a>'
                         + '<a href="#" class="hide-toggle-v1">' + topicList[index].TopicName + ' <p>'
                         + '<span class="highlight bg-gray">' + topicList[index].StartTime;

                    if (topicList[index].EndTime == "") {
                        HTML += '</span></p></a>';
                    }
                        
                    else {
                        HTML += ' - ' + topicList[index].EndTime + '</span></p></a>';
                    }
                        
                    HTML += '<div class="clear"></div>'
                         + '<div class="toggle-content-v1">'
                         + '<div class="toggle-decoration-v1"></div>'
                         + '<p><span class="bold">Time: </span><span class="highlight bg-gray">' + topicList[index].StartTime;

                    if (topicList[index].EndTime == "") {
                        HTML += '</span></p>';
                    }
                        
                    else {
                        HTML += ' - ' + topicList[index].EndTime + '</span></p>';
                    }

                    var _mappedPresentation = topicList[index].mappedPresentation;
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
                        $('#presentationSection').find('#BckBtn').attr('data-id', 'speakerdetail');
                    }

                    HTML += '</div></div></div></div>';
                }
            }
        }

        document.getElementById("SpeakerData").innerHTML = HTML;

        InitializeDatasForPageLoad();

        $(".hide-toggle-v1").show();
        $(element).parent().parent().parent().find(".hide-toggle-v1").hide();
        $(element).parent().parent().parent().find(".show-toggle-v1").show();
        $(element).parent().parent().parent().find(".toggle-content-v1").show();

        window.scrollTo(0, 0);
    }
}
