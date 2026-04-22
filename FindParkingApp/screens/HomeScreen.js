import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, StatusBar, Alert
} from 'react-native';
import * as Location from 'expo-location';

const API = 'https://www.orbinear.com';

const CITIES = [
  { label: 'New York, NY',   lat: 40.7128, lng: -74.0060 },
  { label: 'Jersey City, NJ',lat: 40.7178, lng: -74.0431 },
  { label: 'Chicago, IL',    lat: 41.8781, lng: -87.6298 },
  { label: 'Los Angeles, CA',lat: 34.0522, lng: -118.2437 },
  { label: 'Atlanta, GA',    lat: 33.7490, lng: -84.3880 },
  { label: 'Cairo',          lat: 30.0444, lng: 31.2357  },
];

export default function HomeScreen({ navigation }) {
  const [query, setQuery]     = useState('');
  const [loading, setLoading] = useState(false);

  async function search(address, lat, lng) {
    setLoading(true);
    try {
      const body = lat ? { lat, lng, units: 'imperial' }
                       : { address, units: 'imperial' };
      const res  = await fetch(`${API}/api/parking`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const data = await res.json();
      navigation.navigate('Results', { data, label: address || 'Your Location' });
    } catch (e) {
      Alert.alert('Error', 'Could not fetch parking. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function useLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Enable location to find nearby parking.');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    search('', loc.coords.latitude, loc.coords.longitude);
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <View style={s.hero}>
        <Text style={s.brand}>Orbinear</Text>
        <Text style={s.tagline}>Find parking near you</Text>
      </View>

      <View style={s.card}>
        <TextInput
          style={s.input}
          placeholder="Enter city or address..."
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={() => query.trim() && search(query.trim())}
        />
        <TouchableOpacity
          style={[s.btn, s.btnPrimary]}
          onPress={() => query.trim() && search(query.trim())}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnTxt}>Search Parking</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[s.btn, s.btnSecondary]} onPress={useLocation} disabled={loading}>
          <Text style={s.btnTxtDark}>Use My Current Location</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.sectionLabel}>Quick Cities</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chips}>
        {CITIES.map(c => (
          <TouchableOpacity key={c.label} style={s.chip} onPress={() => search(c.label, c.lat, c.lng)}>
            <Text style={s.chipTxt}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:         { flex:1, backgroundColor:'#0F172A' },
  hero:         { paddingTop:80, paddingBottom:32, alignItems:'center' },
  brand:        { fontSize:36, fontWeight:'800', color:'#fff', letterSpacing:1 },
  tagline:      { fontSize:15, color:'#94A3B8', marginTop:6 },
  card:         { marginHorizontal:20, backgroundColor:'#1E293B', borderRadius:16, padding:20, gap:12 },
  input:        { backgroundColor:'#0F172A', color:'#fff', borderRadius:10, padding:14, fontSize:15 },
  btn:          { borderRadius:10, padding:15, alignItems:'center' },
  btnPrimary:   { backgroundColor:'#6366F1' },
  btnSecondary: { backgroundColor:'#fff' },
  btnTxt:       { color:'#fff', fontWeight:'700', fontSize:15 },
  btnTxtDark:   { color:'#0F172A', fontWeight:'700', fontSize:15 },
  sectionLabel: { color:'#94A3B8', fontSize:13, marginTop:28, marginLeft:20, marginBottom:10 },
  chips:        { paddingLeft:20 },
  chip:         { backgroundColor:'#1E293B', borderRadius:20, paddingHorizontal:16, paddingVertical:8, marginRight:10 },
  chipTxt:      { color:'#fff', fontSize:13 },
});
