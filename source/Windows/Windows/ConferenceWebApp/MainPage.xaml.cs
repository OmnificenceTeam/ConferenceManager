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
using System.Collections.ObjectModel;
using Microsoft.Phone.Tasks;
using Windows.Networking.Connectivity;
using System.Net.NetworkInformation;
using Windows.UI.Core;


namespace ConferenceWebApp
{

    public class JsonHelper
    {
        /// <summary>
        /// JSON Serialization
        /// </summary>
        public static string JsonSerializer<T>(T t)
        {
            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(T));
            MemoryStream ms = new MemoryStream();
            ser.WriteObject(ms, t);
            string jsonString = Encoding.UTF8.GetString(ms.ToArray(), 0, Convert.ToInt32(ms.Length));
            ms.Close();
            return jsonString;
        }
        /// <summary>
        /// JSON Deserialization
        /// </summary>
        public static T JsonDeserialize<T>(string jsonString)
        {
            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(T));
            MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(jsonString));
            T obj = (T)ser.ReadObject(ms);
            return obj;
        }
    }
    /// <summary>
    /// Suppresses pinch zoom and optionally scrolling of the WebBrowser control
    /// </summary>


    public class PostData
    {
        public String Command = String.Empty;
        public Object Data = new Object();
    }


    public class PushMessage
    {
        public string message;
        public string page;
        public string title;
        public string type;
    }
    public class FileObject
    {
        public String FileName = String.Empty;
        public String FilePath = String.Empty;
        public Double Revision = 0.0;
    }


    public class ServerObj
    {
        public String urlPath = String.Empty;
        public String relPath = String.Empty;
        public UInt64 size = 0;
    }

    public class ResponseHeader
    {
        public Boolean isError = false;
        public String ErrorMessage = String.Empty;
        public List<ServerObj> Result = new List<ServerObj>();
        public int ErrorCode = 0;
    }

    public partial class MainPage : PhoneApplicationPage
    {
        public ObservableCollection<string> Changes { get; set; }

        // List of all currently available network interfaces
        public ObservableCollection<string> NetworkInterfaces { get; set; }


        // Constructor
        private static String PushUri = String.Empty;
        private WebBrowser _wb;
        StorageFolder appMainFolder = ApplicationData.Current.LocalFolder;

        public MainPage()
        {
            if (!FirstLoad)
                return;

            FirstLoad = false;

            InitializeComponent();

            //Sample code to localize the ApplicationBar
            //BuildLocalizedApplicationBar();
            frontrectangle.IsScriptEnabled = true;
            _wb = frontrectangle;
            backrectangle.IsScriptEnabled = true;


            //webBrowser.LoadCompleted += webBrowser_LoadCompleted;
            RegisterForNotification();

            NetworkInformation.NetworkStatusChanged += NetworkInformation_NetworkStatusChanged;
            if (isInternetAvaliable())
            {
                frontrectangle.Navigate(new Uri("/assets/WebAppUI/update.html", UriKind.Relative));
                frontrectangle.LoadCompleted += webBrowser_LoadCompleted;
            }
            else
            {

                frontrectangle.Navigate(new Uri("/assets/NoInternet/internet.html", UriKind.Relative));

            }



        }

        void NetworkInformation_NetworkStatusChanged(object sender)
        {
            if (!isInternetAvaliable())
            {
                Dispatcher.BeginInvoke(() =>
             {
                 VisualStateManager.GoToState(this, "FlipCardBack", true);
                 frontrectangle.Navigate(new Uri("/assets/NoInternet/internet.html", UriKind.Relative));

             });

            }
            else
            {
                Dispatcher.BeginInvoke(() =>
            {
                frontrectangle.Navigate(new Uri("/assets/WebAppUI/update.html", UriKind.Relative));
                frontrectangle.LoadCompleted += webBrowser_LoadCompleted;
            });

            }
        }

        public bool isInternetAvaliable()
        {
            bool isConnected = NetworkInterface.GetIsNetworkAvailable();
            if (!isConnected)
            {
                isConnected = false;

            }
            //else
            //{
            //    ConnectionProfile InternetConnectionProfile = NetworkInformation.GetInternetConnectionProfile();
            //    NetworkConnectivityLevel connection = InternetConnectionProfile.GetNetworkConnectivityLevel();
            //    if (connection == NetworkConnectivityLevel.LocalAccess || connection == NetworkConnectivityLevel.LocalAccess)
            //    {
            //        isConnected = false;
            //    }
            //}

            return isConnected;
        }


        public async void CheckForUpdatedFileAndLoad()
        {
            if (!await DoesFolderExistAsync("appData", appMainFolder))
            {
                backrectangle.IsScriptEnabled = true;
                Uri url = new Uri("/assets/WebAppUI/index.html", UriKind.Relative);
                backrectangle.LoadCompleted += backrectangle_LoadCompleted;
                backrectangle.Navigate(url);
            }
            else
            {
                backrectangle.IsScriptEnabled = true;
                Uri url = new Uri("/appdata/index.html", UriKind.Relative);
                backrectangle.LoadCompleted += backrectangle_LoadCompleted;
                backrectangle.Navigate(url);
            }
        }
        private bool FirstLoad = true;
        void webBrowser_LoadCompleted(object sender, NavigationEventArgs e)
        {

            try
            {
                System.Threading.Thread t = new Thread(new ThreadStart(CheckForUpdates));
                t.Start();


            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message,
                    "webbrowser_loadcomplete Exception", MessageBoxButton.OKCancel);
            }
        }

        void backrectangle_LoadCompleted(object sender, NavigationEventArgs e)
        {

            try
            {
                VisualStateManager.GoToState(this, "FlipCardFront", true);
                //webBrowser.InvokeScript("SetDeviceToken", new string[] { PushUri });
                PassMessageWeb("SetDeviceToken", PushUri);
                //PassMessageWeb("onFirstLoad", "");

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message,
                    "webbrowser_loadcomplete Exception", MessageBoxButton.OKCancel);
            }
        }



        #region __updatelogic
        public enum caller
        {
            LOADER = 1,
            UPDATER = 2
        }



        public class ModuleVersion
        {
            public string version = "0";
        }
        public void CheckForUpdates()
        {
            CreateFolder();
        }

        public void PassMessage(String FunctionName, String Data)
        {
            Dispatcher.BeginInvoke(() =>
            {
                frontrectangle.InvokeScript(FunctionName, new string[] { Data });
            });
        }

        public void PassMessageWeb(String FunctionName, String Data)
        {
            Dispatcher.BeginInvoke(() =>
            {
                backrectangle.InvokeScript(FunctionName, new string[] { Data });
            });
        }

        private async Task<bool> CreateFolder()
        {

            try
            {
                string url = "http://apps.omnificence.in/MSCM2016/admin/service/updateservice.aspx";
                var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
                httpWebRequest.ContentType = "application/x-www-form-urlencoded";
                httpWebRequest.Method = "POST";
                httpWebRequest.BeginGetRequestStream(new AsyncCallback(GetRequestStreamCallback), httpWebRequest);


                //if (!await DoesFolderExistAsync("appData", appMainFolder))
                //{
                //    await appMainFolder.CreateFolderAsync("appData");
                //    string url = "http://omnificence.in/conferenceadmin/admin/service/updateservice.aspx";
                //    var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
                //    httpWebRequest.ContentType = "application/x-www-form-urlencoded";
                //    httpWebRequest.Method = "POST";
                //    using (var stream = await Task.Factory.FromAsync<Stream>(httpWebRequest.BeginGetRequestStream,
                //                                         httpWebRequest.EndGetRequestStream, null))
                //    {
                //        //create some json string
                //        var pData = new PostData();
                //        pData.Command = "CheckUpdate";


                //        // convert json to byte array
                //        byte[] jsonAsBytes = Encoding.UTF8.GetBytes(JsonHelper.JsonSerializer<PostData>(pData));

                //        // Write the bytes to the stream
                //        await stream.WriteAsync(jsonAsBytes, 0, jsonAsBytes.Length);
                //    }
                //    httpWebRequest.BeginGetRequestStream(new AsyncCallback(GetRequestStreamCallback), httpWebRequest);
                //    return true;
                //}
                //else
                //{
                //    PassMessage("LoadTextDatas", "Folder Does not exists");
                //    StorageFolder appFolder = await appMainFolder.GetFolderAsync("appData");
                //    string data = null;
                //    string appversion = null;
                //    if (await DoesFileExistAsync("version.xml", appFolder))
                //    {
                //        try
                //        {
                //            StorageFile sf = await appFolder.GetFileAsync("version.xml");
                //            ModuleVersion version = new ModuleVersion();
                //            using (var fs = await sf.OpenAsync(FileAccessMode.Read))
                //            {
                //                using (var inStream = fs.GetInputStreamAt(0))
                //                {
                //                    using (var reader = new DataReader(inStream))
                //                    {
                //                        await reader.LoadAsync((uint)fs.Size);
                //                        data = reader.ReadString((uint)fs.Size);
                //                        MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(data));
                //                        DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(ModuleVersion));
                //                        ModuleVersion moduleVer = (ModuleVersion)ser.ReadObject(ms);
                //                        appversion = moduleVer.version;
                //                        reader.DetachStream();
                //                    }
                //                }
                //            }
                //            if (appversion != null)
                //            {
                //                string url = "http://apps.medtrixhealthcare.com/Redsummitapp2015/app/checkupdates.aspx?ver=" + appversion + "&type=windows";
                //                var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
                //                httpWebRequest.ContentType = "application/x-www-form-urlencoded";
                //                httpWebRequest.Method = "POST";
                //                httpWebRequest.BeginGetRequestStream(new AsyncCallback(GetRequestStreamCallback), httpWebRequest);
                //                return true;
                //            }

                //        }
                //        catch (Exception ex)
                //        {
                //            MessageBox.Show(ex.Message,
                //                "check version xml Exception", MessageBoxButton.OKCancel);
                //            return false;
                //        }
                //    }
                //    else
                //    {
                //        PassMessage("LoadTextDatas", "xml file does not exists");
                //        string url = "http://apps.medtrixhealthcare.com/Redsummitapp2015/app/checkupdates.aspx?ver=0&type=windows";
                //        var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
                //        httpWebRequest.ContentType = "application/x-www-form-urlencoded";
                //        httpWebRequest.Method = "POST";
                //        httpWebRequest.BeginGetRequestStream(new AsyncCallback(GetRequestStreamCallback), httpWebRequest);

                //    }

                //    return true;
                //}
                return true;

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message,
                    "create folder Exception", MessageBoxButton.OKCancel);
                return false;
            }
        }



        private async Task<bool> DoesFolderExistAsync(string fileName, StorageFolder folder)
        {
            try
            {
                await folder.GetFolderAsync(fileName);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        private async Task<bool> DoesFileExistAsync(string fileName, StorageFolder folder)
        {
            try
            {
                await folder.GetFileAsync(fileName);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async void saveFile(string fileObject)
        {
            try
            {

                var fileobj = JsonHelper.JsonDeserialize<ResponseHeader>(fileObject);
                if (fileobj.Result.Count > 0)
                {
                    UInt64 FullSize = 0;
                    foreach (ServerObj so in fileobj.Result)
                    {
                        FullSize += so.size;
                            
                    }
                        PassMessage("setFullSize", FullSize.ToString());

                    foreach (ServerObj so in fileobj.Result)
                    {
                        if (await DownloadFileFromWeb(new Uri(so.urlPath), so.relPath))
                            PassMessage("setFileSize", so.size.ToString());
                    }

                    if (fileobj.Result.Count > 1)
                        clearCahe();

                    Dispatcher.BeginInvoke(() =>
                    {

                        backrectangle.IsScriptEnabled = true;
                        Uri url = new Uri("/appdata/index.html", UriKind.Relative);
                        backrectangle.LoadCompleted += backrectangle_LoadCompleted;
                        backrectangle.Navigate(url);
                        //NavigationService.Navigate(new Uri("/Page1.xaml", UriKind.Relative));
                    });
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message,
                    "save file Exception", MessageBoxButton.OKCancel);
            }
        }


        public async Task<bool> clearCahe()
        {
            await backrectangle.ClearCookiesAsync();
            await backrectangle.ClearInternetCacheAsync();
            return true;
        }


        public static Task<Stream> DownloadFile(Uri url)
        {
            var tcs = new TaskCompletionSource<Stream>();
            var wc = new WebClient();
            wc.OpenReadCompleted += (s, e) =>
            {
                if (e.Error != null) tcs.TrySetException(e.Error);
                else if (e.Cancelled) tcs.TrySetCanceled();
                else tcs.TrySetResult(e.Result);
            };
            wc.OpenReadAsync(url);
            return tcs.Task;
        }





        public async Task<bool> DownloadFileFromWeb(Uri uriToDownload, string fileName)
        {
            try
            {

                if (!await DoesFolderExistAsync("appData", appMainFolder))
                {
                    await appMainFolder.CreateFolderAsync("appData");
                }
                StorageFolder appFolder = await appMainFolder.GetFolderAsync("appData");
                StorageFile file = await appFolder.CreateFileAsync(fileName, CreationCollisionOption.ReplaceExisting);
                var webRequest = WebRequest.CreateHttp(uriToDownload);
                var webResponse = await Task.Factory.FromAsync<WebResponse>(webRequest.BeginGetResponse, webRequest.EndGetResponse, null);
                using (var responseStream = webResponse.GetResponseStream())
                {
                    using (var resultFileStream = await file.OpenStreamForWriteAsync())
                    {
                        await responseStream.CopyToAsync(resultFileStream);
                    }
                }


                //const int BUFFER_SIZE = 4096;
                //if (!await DoesFolderExistAsync("appData", appMainFolder))
                //{
                //    await appMainFolder.CreateFolderAsync("appData");
                //}
                //StorageFolder appFolder = await appMainFolder.GetFolderAsync("appData");
                //StorageFile file = await appFolder.CreateFileAsync(fileName, CreationCollisionOption.ReplaceExisting);
                //Stream mystr = await DownloadFile(uriToDownload);
                //byte[] buf = new byte[BUFFER_SIZE];
                //int bytesread = 0;
                //while ((bytesread = await mystr.ReadAsync(buf, 0, BUFFER_SIZE)) > 0)
                //{

                //    using (var s = await file.OpenStreamForWriteAsync())
                //    {
                //       await s.WriteAsync(buf, 0, bytesread);
                //    }
                //}


                return true;
            }
            catch (Exception exc)
            {
                return false;
            }
        }

        void wb_Navigated(object sender, NavigationEventArgs e)
        {
            frontrectangle.LoadCompleted += wb_LoadCompleted;
        }

        private void wb_LoadCompleted(object sender, NavigationEventArgs e)
        {
            try
            {
                frontrectangle.InvokeScript("onProcessComplete", new string[] { ((int)caller.UPDATER).ToString() });

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message,
                    "wb navigated Exception", MessageBoxButton.OKCancel);
            }
        }



        private async void GetRequestStreamCallback(IAsyncResult asynchronousResult)
        {
            try
            {

                List<FileObject> lfo = new List<FileObject>();
                lfo.Add(new FileObject());
                HttpWebRequest myRequest = (HttpWebRequest)asynchronousResult.AsyncState;
                Stream postStream = myRequest.EndGetRequestStream(asynchronousResult);
                PostData pd = new PostData();
                pd.Command = "CheckUpdate";
                pd.Data = lfo;

                if (!await DoesFolderExistAsync("appData", appMainFolder))
                {

                    pd.Data = lfo;
                    var ResrouceStream = Application.GetResourceStream(new Uri(@"Assets\Webappui\version.txt", UriKind.Relative));
                    if (ResrouceStream != null)
                    {
                        Stream myFileStream = ResrouceStream.Stream;
                        if (myFileStream.CanRead)
                        {
                            StreamReader myStreamReader = new StreamReader(myFileStream);

                            pd.Data = JsonConvert.DeserializeObject<List<FileObject>>(myStreamReader.ReadToEnd());
                        }
                    }
                    else
                        pd.Data = lfo;
                }
                else
                {
                    StorageFolder appFolder = await appMainFolder.GetFolderAsync("appData");
                    if (await DoesFileExistAsync("version.txt", appFolder))
                    {
                        try
                        {
                            List<FileObject> localFo = null;
                            StorageFile sf = await appFolder.GetFileAsync("version.txt");
                            string data = null;
                            using (var fs = await sf.OpenAsync(FileAccessMode.Read))
                            {
                                using (var inStream = fs.GetInputStreamAt(0))
                                {
                                    using (var reader = new DataReader(inStream))
                                    {
                                        await reader.LoadAsync((uint)fs.Size);
                                        data = reader.ReadString((uint)fs.Size);
                                        MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(data));
                                        DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(List<FileObject>));
                                        localFo = (List<FileObject>)ser.ReadObject(ms);
                                        reader.DetachStream();
                                    }
                                }
                            }
                            if (localFo != null)
                                pd.Data = localFo;
                        }

                        catch (Exception ex) { }
                    }
                    else
                        pd.Data = lfo;
                }


                string postData = JsonConvert.SerializeObject(pd);
                byte[] byteArray = Encoding.UTF8.GetBytes(postData);
                postStream.Write(byteArray, 0, byteArray.Length);
                postStream.Close();
                myRequest.BeginGetResponse(new AsyncCallback(GetResponseCallback), myRequest);

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message,
                    "getrequeststream Exception", MessageBoxButton.OKCancel);
            }
        }

        void GetResponseCallback(IAsyncResult callbackResult)
        {


            try
            {
                //HttpWebRequest myrequest = (HttpWebRequest)callbackResult.AsyncState;
                //using (HttpWebResponse response = (HttpWebResponse)myrequest.EndGetResponse(callbackResult))
                //{
                //    System.IO.Stream responseStream = response.GetResponseStream();
                //    using (var reader = new System.IO.StreamReader(responseStream))
                //    {
                //        string data = reader.ReadToEnd();
                //    }
                //    responseStream.Close();
                //}
                HttpWebRequest request = (HttpWebRequest)callbackResult.AsyncState;
                HttpWebResponse response = (HttpWebResponse)request.EndGetResponse(callbackResult);
                Stream s = response.GetResponseStream();
                if (s.Length <= 0)
                {
                    //Dispatcher.BeginInvoke(() =>
                    //{
                    //    NavigationService.Navigate(new Uri("/Page1.xaml", UriKind.Relative));
                    //});
                }

                s.Position = 0;
                // Now read s into a byte buffer with a little padding. 
                byte[] bytes = new byte[s.Length];
                int numBytesToRead = (int)s.Length;
                int numBytesRead = 0;
                do
                {
                    // Read may return anything from 0 to 10. 
                    int n = s.Read(bytes, numBytesRead, numBytesToRead);
                    numBytesRead += n;
                    numBytesToRead -= n;
                } while (numBytesToRead > 0);
                s.Close();
                if (bytes.Length > 0)
                {
                    String UpdateObj = System.Text.Encoding.UTF8.GetString(bytes, 0, bytes.Length);
                    var fileobj = JsonHelper.JsonDeserialize<ResponseHeader>(UpdateObj);
                    UInt64 fileSize = 0;
                    foreach (ServerObj so in fileobj.Result)
                    {
                        fileSize += Convert.ToUInt64(so.size);
                    }
                    PassMessage("setFullSize", fileSize.ToString());
                    saveFile(UpdateObj);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message,
                    "response callback Exception", MessageBoxButton.OKCancel);
            }
        }



        #endregion
        private void RegisterForNotification()
        {
            HttpNotificationChannel pushChannel;

            // The name of our push channel.
            string channelName = "Netsummit";

            InitializeComponent();



            // Try to find the push channel.
            pushChannel = HttpNotificationChannel.Find(channelName);

            // If the channel was not found, then create a new connection to the push service.
            if (pushChannel == null)
            {
                pushChannel = new HttpNotificationChannel(channelName);

                // Register for all the events before attempting to open the channel.
                pushChannel.ChannelUriUpdated += new EventHandler<NotificationChannelUriEventArgs>(PushChannel_ChannelUriUpdated);

                // Register for this notification only if you need to receive the notifications while your application is running.
                pushChannel.ShellToastNotificationReceived += new EventHandler<NotificationEventArgs>(PushChannel_ShellToastNotificationReceived);

                pushChannel.Open();

                // Bind this new channel for toast events.
                pushChannel.BindToShellToast();

            }
            else
            {
                // The channel was already open, so just register for all the events.
                pushChannel.ChannelUriUpdated += new EventHandler<NotificationChannelUriEventArgs>(PushChannel_ChannelUriUpdated);

                // Register for this notification only if you need to receive the notifications while your application is running.
                pushChannel.ShellToastNotificationReceived += new EventHandler<NotificationEventArgs>(PushChannel_ShellToastNotificationReceived);


                // Display the URI for testing purposes. Normally, the URI would be passed back to your web service at this point.
                if (pushChannel.ChannelUri != null)
                {
                    PushUri = pushChannel.ChannelUri.ToString();
                    System.Diagnostics.Debug.WriteLine(pushChannel.ChannelUri.ToString());
                }

            }
        }



        void PushChannel_ChannelUriUpdated(object sender, NotificationChannelUriEventArgs e)
        {

            Dispatcher.BeginInvoke(() =>
            {
                // Display the new URI for testing purposes.   Normally, the URI would be passed back to your web service at this point.
                PushUri = e.ChannelUri.ToString();
                System.Diagnostics.Debug.WriteLine(e.ChannelUri.ToString());

            });
        }


        protected override void OnNavigatingFrom(NavigatingCancelEventArgs e)
        {

            // When user launched the app by clicking on push notification, then new MainPage.xaml file will loaded
            // on the stack. To avoid loading the same page again on the stack, after reading all the push notification
            // parameters cancel the navigation event.
            if (e.Uri.OriginalString.Contains("page"))
            {
                String str = e.Uri.OriginalString.Substring(e.Uri.OriginalString.IndexOf('?') + 1);
                String[] args = str.Split('&');

                PushMessage pushMessage = new PushMessage();

                pushMessage.title = args[0].Split('=')[1];
                pushMessage.type = args[1].Split('=')[1];
                pushMessage.page = args[2].Split('=')[1];

                MemoryStream stream = new MemoryStream();
                DataContractJsonSerializer sr = new DataContractJsonSerializer(pushMessage.GetType());

                sr.WriteObject(stream, pushMessage);
                stream.Position = 0;

                StreamReader reader = new StreamReader(stream);
                string jsonResult = reader.ReadToEnd();
                Dispatcher.BeginInvoke(() =>
                {
                    backrectangle.InvokeScript("onPushNotification", new string[] { jsonResult });
                });
                //PhoneApplicationService.Current.State["msg"] = jsonResult;
                e.Cancel = true;
            }


        }

        void PushChannel_ShellToastNotificationReceived(object sender, NotificationEventArgs e)
        {
            StringBuilder message = new StringBuilder();
            string relativeUri = string.Empty;

            message.AppendFormat("Received Toast {0}:\n", DateTime.Now.ToShortTimeString());
            PushMessage pushMessage = new PushMessage();

            pushMessage.message = e.Collection["wp:Text2"];
            string[] args = e.Collection["wp:Param"].Substring(e.Collection["wp:Param"].IndexOf('?') + 1).Split('&');
            pushMessage.title = args[0].Split('=')[1];
            pushMessage.type = args[1].Split('=')[1];
            pushMessage.page = args[2].Split('=')[1];

            if (pushMessage.type.ToLower() == "update")
            {
                Dispatcher.BeginInvoke(() =>
                {
                    MessageBoxResult mRes = MessageBox.Show(pushMessage.message, pushMessage.title, MessageBoxButton.OKCancel);
                    if (mRes == MessageBoxResult.OK)
                    {
                        VisualStateManager.GoToState(this, "FlipCardBack", true);
                        PassMessage("setProgressBar", "0");
                        System.Threading.Thread t = new Thread(new ThreadStart(CheckForUpdates));
                        t.Start();
                    }
                });
                return;
            }

            MemoryStream stream = new MemoryStream();
            DataContractJsonSerializer sr = new DataContractJsonSerializer(pushMessage.GetType());

            sr.WriteObject(stream, pushMessage);
            stream.Position = 0;

            StreamReader reader = new StreamReader(stream);
            string jsonResult = reader.ReadToEnd();

            // Display a dialog of all the fields in the toast.
            //Dispatcher.BeginInvoke(() => MessageBox.Show(message.ToString()));
            Dispatcher.BeginInvoke(() =>
            {
                try
                {
                    backrectangle.InvokeScript("onPushNotification", new string[] { jsonResult });
                }
                catch (Exception ex)
                {

                }
            });

        }

        private void PhoneApplicationPage_BackKeyPress_1(object sender, System.ComponentModel.CancelEventArgs e)
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


        //Sample code for building a localized ApplicationBar
        //private void BuildLocalizedApplicationBar()
        //{
        //    // Set the page's ApplicationBar to a new instance of ApplicationBar.
        //    ApplicationBar = new ApplicationBar();

        //    // Create a new button and set the text value to the localized string from AppResources.
        //    ApplicationBarIconButton appBarButton = new ApplicationBarIconButton(new Uri("/Assets/AppBar/appbar.add.rest.png", UriKind.Relative));
        //    appBarButton.Text = AppResources.AppBarButtonText;
        //    ApplicationBar.Buttons.Add(appBarButton);

        //    // Create a new menu item with the localized string from AppResources.
        //    ApplicationBarMenuItem appBarMenuItem = new ApplicationBarMenuItem(AppResources.AppBarMenuItemText);
        //    ApplicationBar.MenuItems.Add(appBarMenuItem);
        //}
    }
}