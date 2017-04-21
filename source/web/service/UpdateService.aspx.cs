using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Omnificence.UpdateApp;

public partial class service_UpdateService : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        String reqPacket = System.Text.Encoding.UTF8.GetString(Request.BinaryRead(Request.ContentLength));
        String resPacket = ServiceFactory.GetService(ServiceType.Update).DoService(reqPacket, this);
        Response.Write(resPacket);

    }
}