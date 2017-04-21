using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using ConferenceWebApp.Resources;
using System.Runtime.Serialization.Json;
using Windows.Storage;
using Microsoft.Phone.Notification;
using System.Text;
using System.IO;
using System.Threading.Tasks;
using System.Threading;
using Windows.Storage.Streams;
using ICSharpCode.SharpZipLib.Zip;
using System.Xml.Linq;
using System.Windows.Input;
using Newtonsoft.Json;


namespace ConferenceWebApp
{
    public partial class Page1 : PhoneApplicationPage
    {
        StorageFolder appMainFolder = ApplicationData.Current.LocalFolder;
        public Page1()
        {
            InitializeComponent();

            webBrowser2.IsScriptEnabled = true;
            Uri url = new Uri("/appdata/index.html", UriKind.Relative);
            //webBrowser.LoadCompleted += webBrowser_LoadCompleted;
            webBrowser2.Navigate(url);
        }

        private void PhoneApplicationPage_BackKeyPress(object sender, System.ComponentModel.CancelEventArgs e)
        {
            MessageBoxResult mRes = MessageBox.Show("Would you like to exit?", "Exit", MessageBoxButton.OKCancel);
            if (mRes == MessageBoxResult.OK)
            {
                Application.Current.Terminate();
            }
            if (mRes == MessageBoxResult.Cancel)
            {
                e.Cancel = true;
            }
        }

    }
}