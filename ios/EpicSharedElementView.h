#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>

@interface EpicSharedElementView : UIView
@property(nonatomic, strong) NSNumber *ancestorTag;
@property(nonatomic, assign) CGFloat throttle;
@property(nonatomic, assign) BOOL trackFrame;
@property(nonatomic, copy) RCTDirectEventBlock onFrame;
@end
