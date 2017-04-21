using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Omnificence.ConferenceApp;

public partial class ConferenceAppWebService : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        String reqPacket = System.Text.Encoding.UTF8.GetString(Request.BinaryRead(Request.ContentLength));
        String resPacket = Omnificence.ConferenceApp.Services.ServiceFactory.GetService(Omnificence.ConferenceApp.Services.ServiceType.UserService).DoService(reqPacket, this);
        Response.Write(resPacket);
    }
}
