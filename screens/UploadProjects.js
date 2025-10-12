import React, { useEffect, useRef, useState } from 'react';
import { View, BackHandler, Linking, StyleSheet, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

const initialUrl = 'https://miageksar.ct.ws/';

export default function UploadProjects() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleShouldStartLoad = (request) => {
    const url = request.url;
    if (url.startsWith(initialUrl)) {
      return true;
    }
    Linking.openURL(url);
    return false;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [canGoBack]);

  // Disable selection and zoom inside webview
  const injectedJS = `
    const style = document.createElement('style');
    style.innerHTML = '* { user-select: none; -webkit-user-select: none; -ms-user-select: none; touch-action: manipulation; }';
    document.head.appendChild(style);
    document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
  
  `;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <WebView
        ref={webViewRef}
        source={{ uri: initialUrl }}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        style={styles.webview}
        injectedJavaScript={injectedJS}
        scalesPageToFit={false} // disables zoom scaling
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 30,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
});
