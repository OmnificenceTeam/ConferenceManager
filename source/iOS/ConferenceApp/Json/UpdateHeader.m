//
//  UpdateHeader.m
//  Update
//
//  Created by kandee on 29/08/15.
//  Copyright (c) 2015 Omnificence. All rights reserved.
//

#import "UpdateHeader.h"

@implementation ResponseHdr
@synthesize ErrorCode;
@synthesize ErrorMessage;
@synthesize isError;
@end

@implementation File

@synthesize urlPath;
@synthesize relPath;
@synthesize size;

@end

@implementation UpdateHeader
@synthesize Result;
+ (Class)Result_class {
    return [File class];
}
@end
