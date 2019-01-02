import { PropTypes } from 'react';
import { requireNativeComponent } from 'react-native';

var iface = {
  name: 'X5WebView',
  propTypes: {
    source: PropTypes.string,
    allowUniversalAccessFromFileURLs: PropTypes.bool,
    messagingEnabled: PropTypes.bool,
    javaScriptEnabled: PropTypes.bool,
    scalesPageToFit: PropTypes.bool,
    domStorageEnabled: PropTypes.bool,
    accessibilityLabel: PropTypes.string,
    mediaPlaybackRequiresUserAction: PropTypes.bool,
    saveFormDataDisabled: PropTypes.bool,
    userAgent: PropTypes.string,
    onContentSizeChange: PropTypes.bool,
    importantForAccessibility: PropTypes.string,
    testID: PropTypes.string,
    nativeID: PropTypes.string,
    onLayout: PropTypes.bool,
    injectedJavaScript: PropTypes.string,
    accessibilityComponentType: PropTypes.string,
    accessibilityLiveRegion: PropTypes.string,
    renderToHardwareTextureAndroid: PropTypes.bool,

    //src: PropTypes.string,
    //borderRadius: PropTypes.number,
    //resizeMode: PropTypes.oneOf(['cover', 'contain', 'stretch']),
  },
};

module.exports = requireNativeComponent('X5WebView', iface);