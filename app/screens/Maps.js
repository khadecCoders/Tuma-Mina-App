import React, {useState, useEffect} from 'react';
import { View,Platform,StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import MapView, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import myTheme from '../utils/theme';
import Header from '../Components/Header';
import * as Location from 'expo-location';
import { useLogin } from '../utils/LoginProvider';

function Maps({navigation}) {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const { viewedOnBoarding, setViewedOnBoarding, isLoggedIn, setIsLoggedIn,location, setLocation, profile, setProfile, locationData, setLocationData } = useLogin();

  return (
    <View style={styles.container}>
      <Header title='Maps' backPress={() => navigation.goBack()} menuPress={() => navigation.toggleDrawer()}/>

      <MapView
          style={styles.map}
          initialRegion={{           
            latitude: location.latitude, 
              longitude: location.longitude,
            latitudeDelta: 0.0400,
            longitudeDelta: 0.0100
            }}
          // onRegionChange={data=>console.log(data)}
      >
          <Marker
            draggable
            coordinate={{           
              latitude: location.latitude, 
              longitude: location.longitude
            }}
            title={locationData.city}
            description={locationData.street}
            onPress={data=>console.log(data.nativeEvent.coordinate)}
            onDragEnd={(e) => { 
              setLocation(e.nativeEvent.coordinate); 
              console.log("My loc" , location)
            }}
          />
      </MapView>
    </View>

  )
}

const styles = StyleSheet.create({    
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent:'center',
        alignItems:'center'
    },
    map:{
        ...StyleSheet.absoluteFillObject,
    }
});

export default Maps;