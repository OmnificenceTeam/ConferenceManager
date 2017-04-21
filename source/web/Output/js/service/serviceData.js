
/**
*   Omnificence - 2015
*   Core Application data
*/

var UserType = {
    Invalid: 0,
    SuperAdmin: 1,
    Admin: 2,
    Moderator: 3,
    User: 4
};

function UserData() {
    this.UserId = 0;
    this.FirstName = '';
    this.LastName = '';
    this.EmailId = '';
    this.Password = '';
    this.Address = '';
    this.Country = '';
    this.PhoneNumber = '';
    this.Active = true;
    this.ActivationCode = '';
    this.UserType = UserType.Invalid;
    this.SecurityQuestionId = 0;
    this.Answer = '';
    this.ConferenceId = 0;
    this.DeviceType = 0;
    this.DeviceToken = '';
    this.AccessCode = '';
    this.Speciality = '';
}

function LoginData() {
    this.UserId = 0;
    this.UserType = UserType.Invalid;
}

function NotesData() {
    this.NotesId = 0;
    this.UserId = 0;
    this.TopicId = 0;
    this.UserNotes = '';
}

function UserQueries() {
    this.UserId = 0;
    this.TopicId = 0;
    this.SpeakerId = 0;
    this.QueryId = 0;
    this.Query = '';
}

function WorkshopData() {
    this.UserId = 0;
    this.WorkshopId = 0;
}

function FeedbackData() {
    this.FeedbackId = 0;
    this.QuestionId = 0
    this.UserId = 0;
    this.Answer = 0;
}

function PollData() {
    this.PollId = 0;
    this.UserId = 0;
    this.OptionId = 0;
}

function CheckUpdate() {
    this.LocalFiles = null;
}

function NotificationData() {
    this.NotificationId = 0;
    this.UserId = 0;
    this.NotificationSubject = '';
    this.NotificationMessage = '';
    this.NotificationDate = new Date();
}

function SurveyData() {
    this.SurveyId = 0;
    this.QuestionId = 0
    this.UserId = 0;
    this.Answer = 0;
}