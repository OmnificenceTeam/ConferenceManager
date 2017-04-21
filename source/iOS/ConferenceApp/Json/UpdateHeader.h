//
//  UpdateHeader.h
//  Update
//
//  Created by kandee on 29/08/15.
//  Copyright (c) 2015 Omnificence. All rights reserved.
//
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "Jastor.h"

@interface ResponseHdr : Jastor
@property (atomic) NSInteger ErrorCode;
@property (atomic, retain) NSString *ErrorMessage;
@property (atomic) Boolean isError;
//@property (atomic, retain) NSString* Result;
@end

@interface File : Jastor
@property (atomic, retain) NSString *urlPath;
@property (atomic, retain) NSString *relPath;
@property (atomic) NSInteger size;
@end

@interface UpdateHeader : ResponseHdr
@property (atomic, retain) NSArray* Result;
@end
