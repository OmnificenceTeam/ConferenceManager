<%@ Page Language="C#" AutoEventWireup="true" CodeFile="appdownload.aspx.cs" Inherits="appstore" %>

<!DOCTYPE html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!--Declare page as mobile friendly -->
    <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0" />
    <!-- Declare page as iDevice WebApp friendly -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <!-- iDevice WebApp Splash Screen, Regular Icon, iPhone, iPad, iPod Retina Icons -->
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/splash/splash-icon.png">
    <!-- iPhone 3, 3Gs -->
    <link rel="apple-touch-startup-image" href="img/splash/splash-screen.png" media="screen and (max-device-width: 320px)" />
    <!-- iPhone 4 -->
    <link rel="apple-touch-startup-image" href="img/splash/splash-screen@2x.png" media="(max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2)" />
    <!-- iPhone 5 -->
    <link rel="apple-touch-startup-image" sizes="640x1096" href="img/splash/splash-screen@3x.png" />

    <!-- Page Title -->
    <title>App Store</title>

    <!-- Stylesheet Load -->
    <link href="styles/style.css" rel="stylesheet" type="text/css">
    <link href="styles/framework-style.css" rel="stylesheet" type="text/css">
    <link href="styles/framework.css" rel="stylesheet" type="text/css">
    <link href="styles/bxslider.css" rel="stylesheet" type="text/css">
    <link href="styles/swipebox.css" rel="stylesheet" type="text/css">
    <link href="styles/icons.css" rel="stylesheet" type="text/css">
    <link href="styles/fontstyle.css" rel="stylesheet" type="text/css">
    <link href="styles/retina.css" rel="stylesheet" type="text/css" media="only screen and (-webkit-min-device-pixel-ratio: 2)" />
    <link href="styles/bootstrap.css" rel="stylesheet" type="text/css">

    <script src="scripts/ui/jquery.min.js" type="text/javascript"></script>
    <script src="scripts/bootstrap.min.js" type="text/javascript"></script>
    <!--Page Scripts Load -->
    <script src="scripts/service/sessvars.js" type="text/javascript"></script>
    <script src="scripts/ui/jquery.min.js" type="text/javascript"></script>
    <script src="scripts/service/Service.js" type="text/javascript"></script>
    <script src="scripts/service/ServiceData.js" type="text/javascript"></script>
    <script src="scripts/poll.js" type="text/javascript"></script>
    <style>
        img {
            cursor:pointer;
        }

        body {
            background: #8ccfda;
background: -moz-linear-gradient(top, #8ccfda 0%, #e5f3f6 43%, #ffffff 100%, #2989d8 100%);
background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#8ccfda), color-stop(43%,#e5f3f6), color-stop(100%,#ffffff), color-stop(100%,#2989d8));
background: -webkit-linear-gradient(top, #8ccfda 0%,#e5f3f6 43%,#ffffff 100%,#2989d8 100%);
background: -o-linear-gradient(top, #8ccfda 0%,#e5f3f6 43%,#ffffff 100%,#2989d8 100%);
background: -ms-linear-gradient(top, #8ccfda 0%,#e5f3f6 43%,#ffffff 100%,#2989d8 100%);
background: linear-gradient(to bottom, #8ccfda 0%,#e5f3f6 43%,#ffffff 100%,#2989d8 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#8ccfda', endColorstr='#2989d8',GradientType=0 );
        }
    </style>
</head>
<body onload="onloadPoll()">

    <div id="preloader">
        <div id="status">
            <p class="center-text">
                Loading the content...
            <em>Loading depends on your connection speed!</em>
            </p>
        </div>
    </div>


    <input type="hidden" id="HdnOptionID" />
    <input type="hidden" id="HdnUserID" value="0" />
    <div class="all-elements">


       
           
            <img class="bgimage" style="position: absolute; right: 0px; min-height: 350px;" src="img/bg1.png" />
        <center><img src="img/netsummit.png" /></center>
            <div style="text-align:center;padding-top: 40px; padding-bottom:20px;" class="container main-Container">
               <h2 style="text-align:center;">Download NET Summit </h2>
           <center>
                <img id="apple" visible="false" runat="server" src="img/ios.png" />
                  <img  runat="server" visible="false" id="blackberry" src="img/bb.png"  />
                  <img runat="server" visible="false"  id="google" src="img/google.png"/>
                  <img runat="server" visible="false" id="windows" src="img/win.png" />
           </center>
            </div>


    </div>

    <script src="scripts/ui/snap.js" type="text/javascript"></script>
    <script src="scripts/ui/hammer.js" type="text/javascript"></script>
    <script src="scripts/ui/jquery-ui-min.js" type="text/javascript"></script>
    <script src="scripts/ui/subscribe.js" type="text/javascript"></script>
    <script src="scripts/ui/contact.js" type="text/javascript"></script>
    <script src="scripts/ui/jquery.swipebox.js" type="text/javascript"></script>
    <script src="scripts/ui/bxslider.js" type="text/javascript"></script>
    <script src="scripts/ui/colorbox.js" type="text/javascript"></script>
    <script src="scripts/ui/retina.js" type="text/javascript"></script>
    <script src="scripts/ui/custom.js" type="text/javascript"></script>
    <script src="scripts/ui/framework.js" type="text/javascript"></script>
    <script>
        $('#apple').click(function ()
        {
            window.location.href = "";
            });
        $('#blackberry').click(function ()
        {
            window.location.href = "login.html";
            });
        $('#google').click(function ()
        {
            window.location.href = "";
                  });
        $('#windows').click(function ()
        {
            window.location.href = "http://www.windowsphone.com/en-in/store/app/net-summit/34b88d13-dc76-46a5-9273-7a486ac88306";
                  });


    </script>
</body>
</html>





























