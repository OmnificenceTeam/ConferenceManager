using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class appstore : System.Web.UI.Page
{
    public class Logger
    {
        private static string LogFile;
        static Logger()
        {
            LogFile = System.Configuration.ConfigurationManager.AppSettings["LogFileVer"];
        }

        public static void Log(string msg)
        {
            try
            {
                System.IO.File.AppendAllText(LogFile, DateTime.Now.ToString("dd-MMM-yyyy HH:mm:ss.fff") + " : " + msg + Environment.NewLine);
            }
            catch (Exception)
            {
            }
        }
    }

    protected void Page_Load(object sender, EventArgs e)
    {
       
       var userAgent = Request.UserAgent.ToString().ToLower();
       Logger.Log(userAgent);

       if (userAgent.Contains("ipad") || userAgent.Contains("iphone"))
           apple.Visible = true;
       else if (userAgent.Contains("android"))
           google.Visible = true;
       else if (userAgent.Contains("windows"))
           Response.Redirect("http://www.windowsphone.com/en-in/store/app/net-summit/34b88d13-dc76-46a5-9273-7a486ac88306");
       else if (userAgent.Contains("blackberry") || userAgent.Contains("PlayBook"))
           Response.Redirect("http://216.86.147.141/netsummit/login.html");
    

    }
}