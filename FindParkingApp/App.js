import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useEffect, useState } from 'react';
import * as Location from 'expo-location';

const BASE_URL = 'https://www.orbinear.com?app=1';

export default function App() {
  const webRef = useRef(null);
  const [geoScript, setGeoScript] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setGeoScript(''), 6000); // fallback if location hangs
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const { latitude, longitude, accuracy, altitude, heading, speed } = loc.coords;
          setGeoScript(
            `(function(){var p={coords:{latitude:${latitude},longitude:${longitude},` +
            `accuracy:${accuracy ?? 100},altitude:${altitude ?? 'null'},altitudeAccuracy:null,` +
            `heading:${heading ?? 'null'},speed:${speed ?? 'null'}},timestamp:${loc.timestamp}};` +
            `navigator.geolocation.getCurrentPosition=function(s){s(p)};` +
            `navigator.geolocation.watchPosition=function(s){s(p);return 1};` +
            `navigator.geolocation.clearWatch=function(){}})();`
          );
        } else {
          setGeoScript('');
        }
      } catch {
        setGeoScript('');
      } finally {
        clearTimeout(timer);
      }
    })();
  }, []);

  // Wait for location before rendering WebView so injectedJavaScript is ready
  if (geoScript === null) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={s.root} edges={['top']}>
          <StatusBar style="light" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.root} edges={['top']}>
        <StatusBar style="light" />
        <WebView
          ref={webRef}
          source={{ uri: BASE_URL }}
          style={s.web}
          geolocationEnabled={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          allowsBackForwardNavigationGestures={true}
          injectedJavaScriptBeforeContentLoaded={geoScript}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A' },
  web:  { flex: 1 },
});