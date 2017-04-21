
function onLoadNotes() {
    document.getElementById('userNotesSection').innerHTML = "";
    localStorage.removeItem('hasNotes');
    if (coreData != null) {
        /* Load topic list for future notes */
        var HTML = "";
        var topicData = coreData[0].TopicData;
        if (topicData.length > 0) {
            HTML += '<a href="#" class="dropdown-deploy">'
                 + '<em class="left-dropdown bg-light"></em>'
                 + '<span class="deploy">Select Topic</span>'
                 + '</a>'
                 + '<a href="#" class="dropdown-hidden">'
                 + '<em class="left-dropdown bg-light"></em>Select Topic</a>';

            for (var index = 0; index < topicData.length ; index++) {
                if (parseInt(topicData[index].TopicType) == 4) {
                    HTML += '<a href="#" value="' + topicData[index].TopicId + '" onclick="setTopicName(this)"'
                         + 'class="dropdown-item bg-light">' + topicData[index].TopicName + '</a>';
                }  
            }

            HTML += '<div class="dropdown-bottom-border"></div>';
            document.getElementById("DD_TopicList").innerHTML = $.trim(HTML);
            InitializeDatasForPageLoad();
        }
    }
    $('#HdnSelectedTopic').val('0');
    GetSavedNotes();
}

function GetSavedNotes() {
    var result = GetUserNotes(0);
    if (result.length > 0) {
        localStorage.setItem('hasNotes', true);
        var HTML = "";
        for (var i = 0; i < result.length; i++) {
            var topicName = (result[i].TopicName).replace(/(\r\n|\n|\r)/gm, " ");
            //topicName = $(topicName).text();
            //topicName = (topicName.length > 40) ? (topicName.substring(0, 35) + "...") : topicName;

            var notes = result[i].Notes;
            notes = notes.replace(/\r?\n/g, '<br />');

            HTML += '<div class="col-md-12">'
                 + '<div class="notesTitle">'
                 + '<table class="tbl_notes">'
                 + '<tr>'
                 + '<td>' + topicName + '</td>'
                 + '<td onclick="onClickEditNotes(' + result[i].NotesId + ',' + result[i].TopicId + ');"><img src="img/edit.png"  /></td>'
                 + '<td onclick="onClickDeleteNotes(' + result[i].NotesId + ');"><img src="img/delete.png" /></td>'
                 + '</tr>'
                 + '</table>'
                 + '</div>'
                 + '<div class="notesContent">'
                 + '<span>' + notes + '</span>'
                 + '</div>'
                 + '</div>';
        }
        document.getElementById('userNotesSection').innerHTML = $.trim(HTML);
    }
    else {
        localStorage.removeItem('hasNotes');
        document.getElementById('userNotesSection').innerHTML = "";
    }
}

function GetUserNotes(notesId) {
    var data = new NotesData();
    data.NotesId = parseInt(notesId);
    data.UserId = parseInt($('#HdnUserId').val());
    return g_UserService.getNotes(data, false, '').Result;
}

function onClickAddNotes() {
    $('#HdnSelectedTopic').val('0');
    $('#addNotesModal').find('#userNotes').val('');
    $('#addNotesModal').modal('show');
    document.getElementById("DD_TopicList").innerHTML = "";
    if (coreData != null) {
        /* Load topic list for future notes */
        var HTML = "";
        var topicData = coreData[0].TopicData;
        if (topicData.length > 0) {
            HTML += '<a href="#" class="dropdown-deploy">'
                 + '<em class="left-dropdown bg-light"></em>'
                 + '<span class="deploy">Select Topic</span>'
                 + '</a>'
                 + '<a href="#" class="dropdown-hidden">'
                 + '<em class="left-dropdown bg-light"></em>Select Topic</a>';

            for (var index = 0; index < topicData.length ; index++) {
                if (parseInt(topicData[index].TopicType) == 4) {
                    HTML += '<a href="#" value="' + topicData[index].TopicId + '" onclick="setTopicName(this)"'
                         + 'class="dropdown-item bg-light">' + topicData[index].TopicName + '</a>';
                }   
            }

            HTML += '<div class="dropdown-bottom-border"></div>';
            document.getElementById("DD_TopicList").innerHTML = $.trim(HTML);
        }

        InitializeDatasForPageLoad();
    }
}

function saveNotes(type) {
    var data = new NotesData();
    data.UserId = parseInt($('#HdnUserId').val());
    data.TopicId = parseInt($('#HdnSelectedTopic').val());

    if (type == 'add') {
        data.NotesId = 0;
        data.UserNotes = $('#addNotesModal').find('#userNotes').val().replace(/\r\n|\r|\n/g, "<br />");
    }
    else if (type == 'update') {
        data.NotesId = parseInt($('#HdnNotesId').val());
        data.UserNotes = $('#editNotesModal').find('#userNotes').val().replace(/\r\n|\r|\n/g, "<br />");
    }

    if ((data.TopicId) == 0) {
        $('#alertMessage').html('Please select a valid topic to save your notes.');
        $('#alertModal').modal('show');
        return;
    }

    if ((data.UserNotes).length == 0) {
        $('#alertMessage').html('Please enter your notes. This cannot be empty!');
        $('#alertModal').modal('show');
        return;
    }

    var result = g_UserService.createNotes(data, false, '').Result;

    if (result.length > 0) {
        var HTML = "";
        for (var i = 0; i < result.length; i++) {
            var topicName = (result[i].TopicName).replace(/(\r\n|\n|\r)/gm, " ");
            //topicName = $(topicName).text();
            //topicName = (topicName.length > 40) ? (topicName.substring(0, 35) + "...") : topicName;

            var notes = result[i].Notes;
            notes = notes;

            HTML += '<div class="col-md-12">'
                 + '<div class="notesTitle">'
                 + '<table>'
                 + '<tr>'
                 + '<td>' + topicName + '</td>'
                 + '<td onclick="onClickEditNotes(' + result[i].NotesId + ',' + result[i].TopicId + ');"><img src="img/edit.png" /></td>'
                 + '<td  onclick="onClickDeleteNotes(' + result[i].NotesId + ');"><img src="img/delete.png" /></td>'
                 + '</tr>'
                 + '</table>'
                 + '</div>'
                 + '<div class="notesContent">'
                 + '<span>' + notes + '</span>'
                 + '</div>'
                 + '</div>';
        }

        if (HTML.length > 0) {
            localStorage.setItem('hasNotes', true);
            document.getElementById('userNotesSection').innerHTML = HTML;
        }
    }

    $('#addNotesModal').find('#userNotes').val('');
    if (type == 'add') {
        $('#addNotesModal').modal('hide');
    }
    else if (type == 'update') {
        $('#editNotesModal').modal('hide');
    }

}

function onClickEditNotes(NotesId, TopicId) {
    $('#HdnNotesId').val(NotesId);
    $('#HdnSelectedTopic').val(TopicId);
    var result = GetUserNotes(NotesId);
    if (result.length > 0) {
        var topicName = (result[0].TopicName).replace(/(\r\n|\n|\r)/gm, " ");
        //topicName = $(topicName).text();
        $('#topicToEdit').html('<span>' + topicName + '</span>');
        $('#editNotesModal').find('#userNotes').val(result[0].Notes.replace(/<br\s?\/?>/g,"\n"));
        $('#editNotesModal').modal('show');
    }
}

function onClickDeleteNotes(NotesId) {
    $('#HdnNotesId').val(NotesId);
    $('#deleteNotesConfirmationModal').modal('show');
}

function onClickDeleteConfirmation() {
    $('#deleteNotesConfirmationModal').modal('hide');
    var data = new NotesData();
    data.NotesId = parseInt($('#HdnNotesId').val());
    g_UserService.deleteNotes(data, false, '').Result;
    GetSavedNotes();
}

function setTopicName(element) {
    var id = element.getAttribute("value");
    if (id.length > 0) {
        $('#HdnSelectedTopic').val(id);
        var result = GetUserNotesByTopic(id);
        if (result.length > 0) {
            $('#HdnNotesId').val(result[0].NotesId);
            $('#addNotesModal').modal('hide');
            var topicName = (result[0].TopicName).replace(/(\r\n|\n|\r)/gm, " ");
            //topicName = $(topicName).text();
            $('#topicToEdit').html('<span>' + topicName + '</span>');
            $('#editNotesModal').find('#userNotes').val(result[0].Notes);
            $('#editNotesModal').modal('show');
        }
    }
}

function sendNotesAsMail() {
    if (localStorage.getItem('hasNotes') != null) {
        $('#sendMailConfirmationModal').modal('show');
    }
    else {
        $('#alertMessage').html("It seems you have not taken the notes during the conference session. Please take your notes and try again");
        $('#alertModal').modal('show');
    }
}

function onClickMailConfirmation() {
    $('#sendMailConfirmationModal').modal('hide');
    var data = new NotesData();
    data.UserId = parseInt($('#HdnUserId').val());
    g_UserService.sendUserNotes(data, true, 'onSuccessEmail');
}

function onSuccessEmail(response) {
    if (response) {
        $('#alertMessage').html('Email sent successfully');
    }

    else {
        $('#alertMessage').html('There is some error while sending your mail. Please try again later.');
    }

    $('#alertModal').modal('show');
}

function GetUserNotesByTopic(topicId) {
    var data = new NotesData();
    data.TopicId = parseInt(topicId);
    data.UserId = parseInt($('#HdnUserId').val());
    return g_UserService.getNotes(data, false, '').Result;
}
