//
//  ViewController.h
//  ConferenceApp
//
//  Created by user on 11/01/14.
//  Copyright (c) 2014 Omnificence. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Reachability.h"

extern NSString* g_deviceToken;
extern NSData* g_pushData;
extern BOOL    g_bInvokePush;

@interface ViewController : UIViewController <UIWebViewDelegate>
{
    NSFileManager*  fileManager;
    NSMutableData*  responseData;
    NSString*       appDirectory;
    Reachability *networkReachability;
}

@property (weak, nonatomic) IBOutlet UIWebView *webView;
@property (weak, nonatomic) IBOutlet UIWebView *updateView;
@property (weak, nonatomic) IBOutlet UIWebView *noInternetView;

-(void)invokeJSPushMethod:(NSString *)message;
@end
