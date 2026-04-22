import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, Linking
} from 'react-native';

export default function ResultsScreen({ navigation, route }) {
  const { data, label } = route.params;
  const spots = data?.parking || data?.results || data?.elements || [];

  function openMaps(item) {
    const name = item.tags?.name || item.name || 'Parking';
    const lat  = item.lat ?? item.geometry?.location?.lat;
    const lng  = item.lon ?? item.geometry?.location?.lng;
    if (lat && lng) {
      Linking.openURL(`maps://?q=${encodeURIComponent(name)}&ll=${lat},${lng}`);
    }
  }

  function renderSpot({ item, index }) {
    const tags   = item.tags || {};
    const name   = tags.name || item.name || `Parking Spot ${index + 1}`;
    const fee    = tags.fee === 'yes' ? 'Paid' : tags.fee === 'no' ? 'Free' : '';
    const access = tags.access || '';
    const type   = tags.amenity || tags.parking || item.type || 'parking';

    return (
      <TouchableOpacity style={s.card} onPress={() => openMaps(item)}>
        <View style={s.cardHeader}>
          <Text style={s.icon}>🅿️</Text>
          <View style={s.cardInfo}>
            <Text style={s.name} numberOfLines={1}>{name}</Text>
            <Text style={s.sub}>{[type, access].filter(Boolean).join(' · ') || 'Parking'}</Text>
          </View>
          {fee ? <View style={[s.badge, fee==='Free'?s.badgeFree:s.badgePaid]}>
            <Text style={s.badgeTxt}>{fee}</Text>
          </View> : null}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
          <Text style={s.backTxt}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.title} numberOfLines={1}>{label}</Text>
        <Text style={s.count}>{spots.length} spots found</Text>
      </View>

      {spots.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyTxt}>No parking found for this location.</Text>
        </View>
      ) : (
        <FlatList
          data={spots}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderSpot}
          contentContainerStyle={{ padding:16 }}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root:      { flex:1, backgroundColor:'#0F172A' },
  header:    { paddingTop:60, paddingHorizontal:20, paddingBottom:20, backgroundColor:'#1E293B' },
  back:      { marginBottom:8 },
  backTxt:   { color:'#6366F1', fontSize:15, fontWeight:'600' },
  title:     { color:'#fff', fontSize:22, fontWeight:'800' },
  count:     { color:'#94A3B8', fontSize:13, marginTop:4 },
  card:      { backgroundColor:'#1E293B', borderRadius:14, padding:16, marginBottom:12 },
  cardHeader:{ flexDirection:'row', alignItems:'center' },
  icon:      { fontSize:28, marginRight:12 },
  cardInfo:  { flex:1 },
  name:      { color:'#fff', fontSize:16, fontWeight:'700' },
  sub:       { color:'#94A3B8', fontSize:13, marginTop:2 },
  badge:     { borderRadius:8, paddingHorizontal:10, paddingVertical:4 },
  badgeFree: { backgroundColor:'rgba(74,222,128,.2)' },
  badgePaid: { backgroundColor:'rgba(251,113,133,.2)' },
  badgeTxt:  { color:'#fff', fontSize:12, fontWeight:'600' },
  empty:     { flex:1, alignItems:'center', justifyContent:'center' },
  emptyTxt:  { color:'#94A3B8', fontSize:16 },
});
