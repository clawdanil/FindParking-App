import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRef } from 'react';

const BASE_URL = 'https://www.orbinear.com?app=1';

export default function App() {
  const webRef = useRef(null);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.root} edges={['top']}>
        <StatusBar style="light" />
        <WebView
          ref={webRef}
          source={{ uri: BASE_URL }}
          style={s.web}
          geolocationEnabled={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          allowsBackForwardNavigationGestures={true}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A' },
  web:  { flex: 1 },
});