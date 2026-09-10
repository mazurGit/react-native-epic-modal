#import <React/RCTViewManager.h>
#import "EpicSharedElementView.h"

@interface EpicSharedElementViewManager : RCTViewManager
@end

@implementation EpicSharedElementViewManager

RCT_EXPORT_MODULE(EpicSharedElementView)

- (UIView *)view {
  return [EpicSharedElementView new];
}

RCT_EXPORT_VIEW_PROPERTY(onFrame, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(throttle, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(trackFrame, BOOL)
RCT_EXPORT_VIEW_PROPERTY(ancestorTag, NSNumber)

@end
