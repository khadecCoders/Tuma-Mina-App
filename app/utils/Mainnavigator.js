import { DefaultTheme, Provider as PaperProvider, Portal, Text } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Welcome from '../screens/Welcome';
import { ActivityIndicator, View } from 'react-native';
import { useLogin } from './LoginProvider';
import { StatusBar } from 'expo-status-bar';
import LoginStack from './LoginStack';
import Home from '../screens/Home';
import UserStack from './UserStack';
import Tabs from './Tabs'
import * as Location from 'expo-location';
import Signin from '../screens/Signin';

//Color Theming
const lightTheme = {
  ...DefaultTheme, 
  roundness: 2,
    "colors": {
      "primary": "rgb(112, 170, 205)",
      "onPrimary": "rgb(255, 255, 255)",
      "primaryContainer": "rgb(220, 225, 255)",
      "onPrimaryContainer": "rgb(0, 22, 78)",
      "secondary": "rgb(0, 100, 150)",
      "onSecondary": "rgb(255, 255, 255)",
      "secondaryContainer": "rgb(204, 229, 255)",
      "onSecondaryContainer": "rgb(0, 30, 49)",
      "tertiary": "rgb(0, 104, 116)",
      "onTertiary": "rgb(255, 255, 255)",
      "tertiaryContainer": "rgb(151, 240, 255)",
      "onTertiaryContainer": "rgb(0, 31, 36)",
      "error": "rgb(186, 26, 26)",
      "onError": "rgb(255, 255, 255)",
      "errorContainer": "rgb(255, 218, 214)",
      "onErrorContainer": "rgb(65, 0, 2)",
      "background": "rgb(254, 251, 255)",
      "onBackground": "rgb(27, 27, 31)",
      "surface": "rgb(254, 251, 255)",
      "onSurface": "rgb(27, 27, 31)",
      "surfaceVariant": "rgb(226, 225, 236)",
      "onSurfaceVariant": "rgb(69, 70, 79)",
      "outline": "rgb(118, 118, 128)",
      "outlineVariant": "rgb(198, 198, 208)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(48, 48, 52)",
      "inverseOnSurface": "rgb(242, 240, 244)",
      "inversePrimary": "rgb(182, 196, 255)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(245, 243, 251)",
        "level2": "rgb(239, 238, 248)",
        "level3": "rgb(233, 233, 246)",
        "level4": "rgb(231, 232, 245)",
        "level5": "rgb(228, 229, 243)"
      },
      "surfaceDisabled": "rgba(27, 27, 31, 0.12)",
      "onSurfaceDisabled": "rgba(27, 27, 31, 0.38)",
      "backdrop": "rgba(46, 48, 56, 0.4)",
      "button": "rgb(83, 172, 230)",
      "onButton": "rgb(255, 255, 255)",
      "buttonContainer": "rgb(204, 229, 255)",
      "onButtonContainer": "rgb(0, 30, 49)"
    }
};

const Loading = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator color='#369ADC' size='large'/>
    </View>
  )
}

const Mainnavigator = () => {
  const { viewedOnBoarding, setViewedOnBoarding, isLoggedIn, setIsLoggedIn, profile, setProfile, locationData, setLocationData,location, setLocation } = useLogin();
  const [loading, setLoading] = useState(true);

  // Check if the user has previously viewed the onboarding
  const checkOnBoarding = async () => {
    try {
      const value = await AsyncStorage.getItem('@viewedonboarding');

      if (value !== null){
        setViewedOnBoarding(true);
      }

    } catch (error) {
      console.log('Error @checkonboarding: ', error)
    } finally {
      // setLoading(false);
    }
  }

  useEffect(() => {
    checkOnBoarding();
  }, []);

  // Get the location current
  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
  
        if (status !== "granted") {
          console.log("Location permission denied");
          return;
        }
        
        console.log("You can use location");
        let location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
          accuracy: Location.Accuracy.High,
        });
        setLocation(location["coords"]);

        
      } catch (error) {
        console.error("Error requesting location permission:", error);
      }
      
    };
    getLocation();
  }, []);

  useEffect(() => {
    const getData = async () => {
        try {
            const result = await AsyncStorage.getItem('@tumamMinaCredentials');

            if(result !== null && result !== ""){
                const data = JSON.parse(result);
                await setProfile(data);
                // setReady(true)
                // setLoadingSignIn(false);
                setIsLoggedIn(true);
                setLoading(false);
            }else{
                //Result is null
                // setReady(true)
                setIsLoggedIn(false)
                setLoading(false);
                // setLoadingSignIn(false);
                setProfile({})
            }

        } catch (error) {
            console.log(error)
        }
    }
    getData();
  }, [isLoggedIn]);

  if(loading){
    <Loading />
  } else {
    if(viewedOnBoarding){
      if(isLoggedIn){
        return (
          <PaperProvider theme={lightTheme}>
            <Portal>
              <View style={{flex: 1, marginTop: - 50}}>
              <StatusBar style='dark' />
              <Tabs />
               </View>
            </Portal>
          </PaperProvider>
        )
      } else {
        return (
          <PaperProvider theme={lightTheme}>
               <View style={{flex: 1, marginTop: - 50}}>
               <StatusBar style='dark' />
               <LoginStack />
               </View>
          </PaperProvider>
        )
      }
    } else {
      return (
        <Welcome />
      )
    }
  }
}

export default Mainnavigator