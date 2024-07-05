import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList} from 'react-native';
import React, { useState } from 'react';
import MapView,{UrlTile, Marker} from 'react-native-maps';
import Colors from '../../constants/Colors';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const LocationSearch = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState({
    latitude: 51.5078788,
    longitude: -0.0877321,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [sugestions, setSugestios] = useState([])

  async function fetchSugestion(query) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
    const data = await response.json()
    setSugestios(data)
  }

  function handleSuggestionPress(item) {
    setSelectedLocation(
      {
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon)
      }
    );
    setLocation(
      {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    );
    setSugestios([]);
    setSearchQuery('')
 } 

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.textInputContainer}>
        <View style={styles.boxIcon}>
            <Ionicons name="search-outline" size={24} color={Colors.medium} />
          </View>
        <TextInput
          placeholder="Search or move the map"
          value={searchQuery}
          onChangeText={(value) => {
            setSearchQuery(value)
            fetchSugestion(value)
          }}
          style={styles.textInput}
        />
      </View>
      <FlatList
        data={sugestions}
        keyExtractor={(item) => item?.place_id?.toString()}
        style={{ ...styles.flatlist, display: sugestions.length > 0 ? 'flex' : 'none' }}
        contentContainerStyle={{padding: 10}}
        renderItem={({ item }) => (
          <Text onPress={() => handleSuggestionPress(item)} style={styles.queryText}>{item?.display_name }</Text>
        )}
      />
      <MapView showsUserLocation={true} style={styles.map} region={location} >
        <UrlTile urlTemplate='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' maximumZ={19} /> 
        {selectedLocation && (<Marker coordinate={selectedLocation} />)}
      </MapView>
      <View style={styles.absoluteBox}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  absoluteBox: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  boxIcon: {
    position: 'absolute',
    left: 15,
    top: 20,
    zIndex: 1,
  },
  textInput: {
    backgroundColor: Colors.grey,
    borderRadius: 10,
    flex: 1,
    padding: 10,
    paddingLeft: 40
  },
  textInputContainer: {
    padding: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center'
  },
  flatlist: {
    flex: 0,
    position: 'absolute',
    top: 62,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    zIndex: 40
  },
  queryText: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 15,
    fontWeight: 'medium'
  }
});

export default LocationSearch;
