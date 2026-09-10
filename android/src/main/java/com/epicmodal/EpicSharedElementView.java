package com.epicmodal;

import android.content.Context;
import android.os.SystemClock;
import android.view.View;
import android.view.ViewTreeObserver;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class EpicSharedElementView extends View {
  private final int[] location = new int[2];
  private final ViewTreeObserver.OnPreDrawListener preDrawListener = this::emitFrame;
  private int lastX = Integer.MIN_VALUE;
  private int lastY = Integer.MIN_VALUE;
  private int lastWidth = 0;
  private int lastHeight = 0;
  private long throttleMs = 0;
  private long lastEmissionTime = Long.MIN_VALUE;
  private boolean trackFrame = false;
  private int ancestorTag = -1;

  public EpicSharedElementView(Context context) {
    super(context);
  }

  public void setThrottle(float throttle) {
    throttleMs = Math.max(0L, (long) throttle);
  }

  public void setTrackFrame(boolean trackFrame) {
    this.trackFrame = trackFrame;
    if (!trackFrame) {
      getViewTreeObserver().removeOnPreDrawListener(preDrawListener);
    } else if (isAttachedToWindow()) {
      getViewTreeObserver().addOnPreDrawListener(preDrawListener);
    }
    lastX = Integer.MIN_VALUE;
    lastY = Integer.MIN_VALUE;
    lastEmissionTime = Long.MIN_VALUE;
  }

  public void setAncestorTag(int ancestorTag) {
    this.ancestorTag = ancestorTag;
    lastX = Integer.MIN_VALUE;
    lastY = Integer.MIN_VALUE;
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    if (trackFrame) {
      getViewTreeObserver().addOnPreDrawListener(preDrawListener);
    }
  }

  @Override
  protected void onDetachedFromWindow() {
    getViewTreeObserver().removeOnPreDrawListener(preDrawListener);
    super.onDetachedFromWindow();
  }

  @Override
  protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    super.onLayout(changed, left, top, right, bottom);
    emitFrame();
  }

  private boolean emitFrame() {
    if (getWidth() <= 0 || getHeight() <= 0 || !(getContext() instanceof ReactContext)) {
      return true;
    }

    getLocationInWindow(location);
    int x = location[0];
    int y = location[1];
    View ancestor = findAncestor();
    if (ancestor != null) {
      int[] ancestorLocation = new int[2];
      ancestor.getLocationInWindow(ancestorLocation);
      x -= ancestorLocation[0];
      y -= ancestorLocation[1];
    }
    if (x == lastX && y == lastY && getWidth() == lastWidth && getHeight() == lastHeight) {
      return true;
    }

    long now = SystemClock.uptimeMillis();
    if (throttleMs > 0 && now - lastEmissionTime < throttleMs) return true;

    lastX = x;
    lastY = y;
    lastWidth = getWidth();
    lastHeight = getHeight();
    lastEmissionTime = now;
    WritableMap event = Arguments.createMap();
    event.putDouble("x", lastX);
    event.putDouble("y", lastY);
    event.putDouble("width", lastWidth);
    event.putDouble("height", lastHeight);
    ReactContext reactContext = (ReactContext) getContext();
    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "topFrame", event);
    return true;
  }

  private View findAncestor() {
    if (ancestorTag < 0) return null;
    View current = this;
    while (current.getParent() instanceof View) {
      current = (View) current.getParent();
      if (current.getId() == ancestorTag) return current;
    }
    return null;
  }

  public static class Manager extends SimpleViewManager<EpicSharedElementView> {
    @Override
    public String getName() {
      return "EpicSharedElementView";
    }

    @Override
    protected EpicSharedElementView createViewInstance(ThemedReactContext reactContext) {
      return new EpicSharedElementView(reactContext);
    }

    @com.facebook.react.uimanager.annotations.ReactProp(name = "throttle", defaultFloat = 0f)
    public void setThrottle(EpicSharedElementView view, float throttle) {
      view.setThrottle(throttle);
    }

    @com.facebook.react.uimanager.annotations.ReactProp(name = "trackFrame", defaultBoolean = false)
    public void setTrackFrame(EpicSharedElementView view, boolean trackFrame) {
      view.setTrackFrame(trackFrame);
    }

    @com.facebook.react.uimanager.annotations.ReactProp(name = "ancestorTag", defaultInt = -1)
    public void setAncestorTag(EpicSharedElementView view, int ancestorTag) {
      view.setAncestorTag(ancestorTag);
    }

    @Override
    public java.util.Map<String, Object> getExportedCustomDirectEventTypeConstants() {
      return java.util.Collections.singletonMap(
          "topFrame",
          java.util.Collections.singletonMap("registrationName", "onFrame")
      );
    }
  }
}
