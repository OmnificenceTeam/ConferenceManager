//
//  ViewController.m
//  ConferenceApp
//
//  Created by user on 11/01/14.
//  Copyright (c) 2014 Omnificence. All rights reserved.
//

#import "ViewController.h"
#import "SSZipArchive.h"
#import "UpdateHeader.h"

BOOL g_bInvokePush = FALSE;
NSString* g_deviceToken = @"";
NSData* g_pushData = NULL;

@interface ViewController ()

@end

@implementation ViewController
@synthesize webView;
@synthesize updateView;
@synthesize noInternetView;

-(BOOL) prefersStatusBarHidden
{
    return YES;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [[NSURLCache sharedURLCache] removeAllCachedResponses];
    [[NSURLCache sharedURLCache] setDiskCapacity:0];
    [[NSURLCache sharedURLCache] setMemoryCapacity:0];
    
    /*[[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(reachabilityChanged:)
                                                 name:kReachabilityChangedNotification
                                               object:nil];
    
    NSString* _HOST = @"www.google.com";
    networkReachability = [Reachability reachabilityWithHostName:_HOST];
    [networkReachability startNotifier];
    */
    
    
    
    webView.delegate = self;
    updateView.delegate = self;
    webView.scrollView.bounces = NO;
    updateView.scrollView.bounces = NO;
    noInternetView.scrollView.bounces = NO;
    
    [self.view sendSubviewToBack:webView];
    [webView setBackgroundColor:[UIColor clearColor]];
    [updateView setBackgroundColor:[UIColor clearColor]];
    [noInternetView setBackgroundColor:[UIColor clearColor]];
    
    [noInternetView loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:[self noInternetPage]]]];
    
    webView.hidden = YES;
    
    [updateView loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:[self appUpdatePage]]]];
    
    NSArray *dirArray = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,    NSUserDomainMask, YES);
    appDirectory = [NSString stringWithFormat:@"%@/Output", [dirArray objectAtIndex:0]];
    fileManager = [[NSFileManager alloc] init];
    

    // Check for server reachability in different thread.
    dispatch_queue_t iqueue = dispatch_queue_create("iqueue", NULL);
    dispatch_async(iqueue, ^void {
        int lastStatus = 0 , currentStatus = -1;
        while (true) {
            NSData *data = [NSData dataWithContentsOfURL:[NSURL URLWithString:@"http://apps.omnificence.in"]];
            
            if([data length] > 300 ) {
                dispatch_async(dispatch_get_main_queue(), ^void {
                [self.view bringSubviewToFront:webView];
                });
                currentStatus = 1;
            }
            else
            {
                dispatch_async(dispatch_get_main_queue(), ^void {
                    [self.view bringSubviewToFront:noInternetView];
                });
                currentStatus = 0;
            }
            
            if(lastStatus != currentStatus) {
                dispatch_async(dispatch_get_main_queue(), ^void {
                    [webView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"onNetworkStatus(%d)", currentStatus ]];
                });
            }
            
            lastStatus = currentStatus;
            sleep(10);
           
        }

    });
    
    // Check whether app is loading first time, if so copy all files from bundle to local storage.
    
    if(![fileManager fileExistsAtPath:appDirectory])
    {   
        // Copy the files from AppBundle to local storage
        NSLog(@"Need to copy files from bundle...");
        dispatch_queue_t queue = dispatch_queue_create("myqueue", NULL);
        dispatch_async(queue, ^void {
            NSError* dError;
            if(YES != [fileManager copyItemAtPath:[self appWebFolder] toPath:appDirectory error:&dError])
            {
                NSLog(@"Failed to copy files. %@", dError);
            }
            
            NSURL *url = [NSURL fileURLWithPath:appDirectory];
            
            NSError *error = nil;
            BOOL success = [url setResourceValue: [NSNumber numberWithBool: YES]
                                          forKey: NSURLIsExcludedFromBackupKey error: &error];
            if(!success){
                NSLog(@"Error excluding %@ from backup %@", [url lastPathComponent], error);
            }
            else
                NSLog(@"Excluded folder %@ from iCloud backup.", appDirectory);
            
            
            // Check for Updates
            dispatch_async(dispatch_get_main_queue(), ^void {
                [self checkForUpdates ];
            });
        });
        
    }
    else
    {
        // On load just check for updates...
        [self checkForUpdates ];
    }
    
     NSLog(@"view load message ...");
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)reachabilityChanged:(NSNotification*)notification
{
    //sleep(1);
    //Reachability *notifier = [notification object];
    //NSLog(@"Network status : %d", [notifier currentReachabilityStatus]);
    
    
    /*
    if([notifier currentReachabilityStatus] == 1) {
        NSData *data = [NSData dataWithContentsOfURL:[NSURL URLWithString:@"http://apps.omnificence.in"]];
        
        if([data length] > 300 ) {
        
        [self.view bringSubviewToFront:webView];
        [webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:[self appStartPage]]]];
        }
        else
            [self.view bringSubviewToFront:noInternetView];
    }
    else
        [self.view bringSubviewToFront:noInternetView];
    */
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
    NSLog(@"Failed to load URL %@. Error : %@", webView.request.URL.absoluteString, error);
    /*
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Error"
                                                    message:@"Can't connect to server. Please check your internet connection."
                                                   delegate:self
                                          cancelButtonTitle:@"OK"
                                          otherButtonTitles:nil];
    [alert show];*/
}
-(void)viewWillAppear:(BOOL)animated{
        NSLog(@"view will appear...");
    if(g_bInvokePush){
        NSLog(@"ivoke message ...");
        g_bInvokePush = FALSE;
        [self invokeJSPushMethod:[[NSString alloc] initWithData:g_pushData encoding:NSUTF8StringEncoding]];
    }
}
-(void)webViewDidFinishLoad:(UIWebView *)WebView
{
    NSLog(@"webView finish loading...%@", webView.request.URL.path);
    if([WebView isEqual:self.webView]) {
    
        NSLog(@"Animation begin...");
        webView.hidden = NO;
        [UIView beginAnimations:@"fade" context:nil];
        [UIView setAnimationDelegate:self];
        [UIView setAnimationDidStopSelector:@selector(fadeAnimationDidStop:finished:context:)];
        
        updateView.alpha = 0.0;
        webView.alpha = 1.0;
        [UIView commitAnimations];

    }
    else if ([WebView isEqual:updateView])
    {
        NSLog(@"Update view is loaded.");
    }
}


- (void)fadeAnimationDidStop:(NSString*)animationID finished:(NSNumber*)finished context:(void*)context
{
    NSLog(@"Animation complete.");
    [webView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"SetDeviceToken('%@')",g_deviceToken]];
    
}

-(void)invokeJSPushMethod:(NSString *)message
{
    NSLog(@"invoking script...%@", message);
    [webView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"onPushNotification('%@')", message]];
}

-(void) checkForUpdates
{
    NSLog(@"Checking for updates...");
    NSString *updateFile = [NSString stringWithFormat:@"%@/version.txt", appDirectory];
    if([fileManager fileExistsAtPath:updateFile]) {
        NSData *fileData = [NSData dataWithContentsOfFile:updateFile];
        NSString* stringData = [[NSString alloc] initWithData:fileData encoding:NSUTF8StringEncoding];
        NSString *command = [NSString stringWithFormat:@" { \"command\" : \"CheckUpdate\", \"data\" : %@ }", stringData ];
        [self PostRequest:[command dataUsingEncoding:NSUTF8StringEncoding]];
    }
    else
    {
        NSLog(@"Version file is missing to do update.");
        [webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@/%@", appDirectory, [self appStartPage]]]]];
    }
}

-(id) PostRequest:(NSData*) data {
    
    NSString *reqURL = [self appUpdateURL];
    NSMutableURLRequest *Request = [[NSMutableURLRequest alloc] initWithURL: [[NSURL alloc] initWithString:reqURL]];
    
    [Request setHTTPMethod:@"POST"];
    [Request setValue:@"text/plain" forHTTPHeaderField:@"content-type"];
    
    [Request setValue:@"content-length" forHTTPHeaderField:[NSString stringWithFormat:@"%lu", (unsigned long)[data length]]];
    
    [Request setHTTPBody:data];
    
    NSURLConnection* conn = [[NSURLConnection alloc] initWithRequest:Request delegate:self startImmediately:TRUE];
    
    return conn;
}

- (void)connection:(NSURLConnection*)connection didReceiveResponse:(NSURLResponse *)response
{
    responseData = [[NSMutableData alloc]init];
    NSLog(@"Download size : %llu", [response expectedContentLength]);
}
- (void)connection:(NSURLConnection*)connection didReceiveData:(NSData*)data
{
    [responseData appendData:data];
}
- (void)connection:(NSURLConnection*)connection didFailWithError:(NSError*)error
{
    NSLog(@"Failed to connect to server. %@", error);
    dispatch_async(dispatch_get_main_queue(), ^void {
        
        [webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@/%@", appDirectory, [self appStartPage]]]]];
    });
}
- (void)connectionDidFinishLoading:(NSURLConnection *)connection
{
    dispatch_queue_t queue = dispatch_queue_create("myqueue", NULL);
    dispatch_async(queue, ^void {
        
        
        NSString* response = [[NSString alloc] initWithData:responseData encoding:NSASCIIStringEncoding];
        NSLog(@"Update Response : %@", response);
        NSDictionary* responseObject = [NSJSONSerialization JSONObjectWithData:responseData options:0 error:nil];
        
        
        UpdateHeader* responseHdr = [[UpdateHeader alloc] initWithDictionary:responseObject];
        
        if(!responseHdr.isError)
        {
            NSArray *result = responseHdr.Result;
            
            // If there is any update response should contain minimum two files.
            // One updated file and a version.txt file.
            if(result.count < 2)
            {
                // There is no update proceed to load the main page.
                dispatch_async(dispatch_get_main_queue(), ^void {
                    [webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@/%@", appDirectory, [self appStartPage]]]]];
                });
                return;
                
            }
            
            long totalBytes = 0;
            for(int i = 0; i< result.count; i++)
            {
                File* file = [result objectAtIndex:i];
                totalBytes += file.size;
            }
            
            dispatch_async(dispatch_get_main_queue(), ^void {
                //file.relPath = [file.relPath stringByReplacingOccurrencesOfString:@"\\" withString:@"\\\\"];
                [updateView stringByEvaluatingJavaScriptFromString: [NSString stringWithFormat: @"setFullSize(%ld)", totalBytes]];
            });
            
            totalBytes = 0;
            for(int i = 0; i< result.count; i++)
            {
                File* file = [result objectAtIndex:i];
                totalBytes = file.size;
                file.relPath = [file.relPath stringByReplacingOccurrencesOfString:@"\\" withString:@"/"];
                dispatch_async(dispatch_get_main_queue(), ^void {
                    
                    //file.relPath = [file.relPath stringByReplacingOccurrencesOfString:@"\\" withString:@"\\\\"];
                    [updateView stringByEvaluatingJavaScriptFromString: [NSString stringWithFormat: @"setDownloadingFile('%@')", file.relPath]];
                    NSLog(@"relative path : %@", file.relPath);
                });
                
                file.urlPath = [NSString stringWithFormat:@"%@?id=%f", file.urlPath, [[NSDate date] timeIntervalSince1970]];
                NSData *content = [NSData dataWithContentsOfURL:[NSURL URLWithString:file.urlPath]];
                NSLog(@"Url : %@", file.urlPath);
                //NSLog(@"File content : %@", [[NSString alloc] initWithData:content encoding:NSASCIIStringEncoding]);
                
                NSLog(@"Local Path : %@", [[NSString stringWithFormat:@"%@/%@", appDirectory, file.relPath] stringByDeletingLastPathComponent]);
                [fileManager createDirectoryAtPath:[[NSString stringWithFormat:@"%@/%@", appDirectory, file.relPath] stringByDeletingLastPathComponent] withIntermediateDirectories:YES attributes:nil error:nil];
                
                [content writeToFile:[NSString stringWithFormat:@"%@/%@", appDirectory, file.relPath] atomically:TRUE];
                
                dispatch_async(dispatch_get_main_queue(), ^void {
                    //file.relPath = [file.relPath stringByReplacingOccurrencesOfString:@"\\" withString:@"\\\\"];
                    [updateView stringByEvaluatingJavaScriptFromString: [NSString stringWithFormat: @"setFileSize(%ld)", totalBytes]];
                });
                
                
            }
            NSLog(@"Update completed.");
            
            sleep(1);
            dispatch_async(dispatch_get_main_queue(), ^void {
                
                [webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@/%@", appDirectory, [self appStartPage]]]]];
            });
        }
    });
}

-(NSString*) appUpdatePage
{
    NSLog(@"Update page : %@", [[NSBundle mainBundle] pathForResource:@"Output/update" ofType:@"html"]);
    return [[NSBundle mainBundle] pathForResource:@"Output/update" ofType:@"html"];
}

-(NSString*) appUpdateURL
{
    return @"http://apps.omnificence.in/MSCM2016/admin/service/updateservice.aspx";
}

-(NSString*) appStartPage
{
    return @"index.html";
}

-(NSString*)appWebFolder
{
    NSLog(@"Path : %@", [[NSBundle mainBundle] pathForResource:@"Output" ofType:nil]);
    return [[NSBundle mainBundle] pathForResource:@"Output" ofType:nil];
}

-(NSString*)noInternetPage
{
    NSLog(@"Path : %@", [[NSBundle mainBundle] pathForResource:@"NoInternet" ofType:@"html"]);
    return [[NSBundle mainBundle] pathForResource:@"NoInternet/internet" ofType:@"html"];
}

@end


