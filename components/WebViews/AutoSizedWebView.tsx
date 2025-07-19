import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';

interface Props {
  html: string;
  ayahKey: string | number;
  minHeight?: number;
  style?: any;
  onHeightChange?: (key: string | number, height: number) => void;
}

const injectedJavaScript = `
  setTimeout(function() {
    window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight.toString());
  }, 50);
  true;
`;

export default function AutoSizedWebView({
  html,
  ayahKey,
  minHeight = 60,
  style,
  onHeightChange,
}: Props) {
  const [height, setHeight] = useState<number>(minHeight);

  return (
    <View style={[{ height }, style]}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        scrollEnabled={false}
        injectedJavaScript={injectedJavaScript}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        onMessage={(event) => {
          const newHeight = Number(event.nativeEvent.data);
          if (!isNaN(newHeight) && newHeight !== height) {
            setHeight(newHeight);
            onHeightChange?.(ayahKey, newHeight);
          }
        }}
      />
    </View>
  );
}
