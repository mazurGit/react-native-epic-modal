#import "EpicSharedElementView.h"
#import <float.h>

@interface EpicSharedElementView ()
@property(nonatomic, strong) CADisplayLink *displayLink;
@property(nonatomic, assign) CGRect lastFrame;
@property(nonatomic, assign) CFTimeInterval lastEmissionTime;
@end

@implementation EpicSharedElementView

- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    self.lastFrame = CGRectNull;
    self.lastEmissionTime = -DBL_MAX;
    self.throttle = 0;
  }
  return self;
}

- (void)didMoveToWindow {
  [super didMoveToWindow];

  if (self.window && self.trackFrame) {
    [self startTracking];
  } else {
    [self stopTracking];
    self.lastFrame = CGRectNull;
    self.lastEmissionTime = -DBL_MAX;
  }
}

- (void)startTracking {
  if (self.displayLink) return;
  self.displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(emitFrame)];
  [self.displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
}

- (void)stopTracking {
  [self.displayLink invalidate];
  self.displayLink = nil;
}

- (void)setTrackFrame:(BOOL)trackFrame {
  _trackFrame = trackFrame;
  if (trackFrame && self.window) {
    [self startTracking];
  } else if (!trackFrame) {
    [self stopTracking];
  }
  self.lastFrame = CGRectNull;
  self.lastEmissionTime = -DBL_MAX;
}

- (void)dealloc {
  [self.displayLink invalidate];
}

- (void)layoutSubviews {
  [super layoutSubviews];
  [self emitFrame];
}

- (void)emitFrame {
  if (!self.onFrame || !self.window || self.bounds.size.width <= 0 || self.bounds.size.height <= 0) {
    return;
  }

  UIView *ancestor = [self ancestorView];
  CGRect frame = [self convertRect:self.bounds toView:ancestor];
  if (CGRectEqualToRect(frame, self.lastFrame)) return;

  CFTimeInterval now = CACurrentMediaTime();
  if (self.throttle > 0 && (now - self.lastEmissionTime) * 1000 < self.throttle) {
    return;
  }
  self.lastFrame = frame;
  self.lastEmissionTime = now;

  self.onFrame(@{
    @"x": @(frame.origin.x),
    @"y": @(frame.origin.y),
    @"width": @(frame.size.width),
    @"height": @(frame.size.height),
  });
}

- (UIView<RCTComponent> *)ancestorView {
  if (!self.ancestorTag) return nil;

  UIView<RCTComponent> *candidate = (UIView<RCTComponent> *)self.superview;
  while (candidate) {
    if ([candidate respondsToSelector:@selector(reactTag)] &&
        [candidate.reactTag isEqualToNumber:self.ancestorTag]) {
      return candidate;
    }
    candidate = candidate.superview;
  }
  return nil;
}

@end
