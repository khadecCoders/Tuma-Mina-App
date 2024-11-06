import { ModalPortal } from 'react-native-modals';
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
      "tertiary": "#161F3D",
      "onTertiary": "rgb(255, 255, 255)",
      "tertiaryContainer": "rgb(151, 240, 255)",
      "onTertiaryContainer": "rgb(0, 31, 36)",
      "error": "rgb(186, 26, 26)",
      "onError": "rgb(255, 255, 255)",
      "errorContainer": "rgb(255, 218, 214)",
      "onErrorContainer": "rgb(65, 0, 2)",
      "background": "rgb(254, 251, 255)",
      "onBackground": "rgb(27, 27, 31)",
      "surface": "rgba(242,242,242,255)",
      "onSurface": "rgb(27, 27, 31)",
      "backdrop": "rgb(27, 27, 31)",
      "surfaceVariant": "rgb(226, 225, 236)",
      "onSurfaceVariant": "rgb(69, 70, 79)",
      "outline": "rgb(69, 70, 79)",
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
const darkTheme = {
  ...DefaultTheme, 
  roundness: 2,
    "colors": {
      "primary": "rgb(127, 208, 255)",
      "onPrimary": "rgb(0, 52, 74)",
      "primaryContainer": "rgb(0, 76, 106)",
      "onPrimaryContainer": "rgb(197, 231, 255)",
      "secondary": "rgb(144, 205, 255)",
      "onSecondary": "rgb(0, 51, 80)",
      "secondaryContainer": "rgb(0, 75, 114)",
      "onSecondaryContainer": "rgb(203, 230, 255)",
      "tertiary": "rgb(182, 196, 255)",
      "onTertiary": "rgb(7, 41, 120)",
      "tertiaryContainer": "rgb(39, 65, 144)",
      "onTertiaryContainer": "rgb(220, 225, 255)",
      "error": "rgb(255, 180, 171)",
      "onError": "rgb(105, 0, 5)",
      "errorContainer": "rgb(147, 0, 10)",
      "onErrorContainer": "rgb(255, 180, 171)",
      "background": "rgb(25, 28, 30)",
      "onBackground": "rgb(225, 226, 229)",
      "surface": "rgb(25, 28, 30)",
      "onSurface": "rgb(225, 226, 229)",
      "backdrop": "rgb(225, 226, 229)",
      "surfaceVariant": "rgb(65, 72, 77)",
      "onSurfaceVariant": "rgb(193, 199, 206)",
      "outline": "rgb(193, 199, 206)",
      "outlineVariant": "rgb(65, 72, 77)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(225, 226, 229)",
      "inverseOnSurface": "rgb(46, 49, 51)",
      "inversePrimary": "rgb(0, 101, 139)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(30, 37, 41)",
        "level2": "rgb(33, 42, 48)",
        "level3": "rgb(36, 48, 55)",
        "level4": "rgb(37, 50, 57)",
        "level5": "rgb(39, 53, 62)"
      },
      "surfaceDisabled": "rgba(225, 226, 229, 0.12)",
      "onSurfaceDisabled": "rgba(225, 226, 229, 0.38)",
      "backdrop": "rgba(42, 49, 54, 0.4)",
      "button": "rgb(141, 205, 255)",
      "onButton": "rgb(0, 52, 79)",
      "buttonContainer": "rgb(0, 75, 112)",
      "onButtonContainer": "rgb(202, 230, 255)"
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
  const {themeDark, setThemeDark, viewedOnBoarding, setViewedOnBoarding, isLoggedIn, setIsLoggedIn, profile, setProfile, locationData, setLocationData,location, setLocation } = useLogin();
  const [loading, setLoading] = useState(true);
  const scheme = themeDark ? 'dark' : 'light';
  
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
    checkOnBoarding();
    getLocation();
  }, []);

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const result = await AsyncStorage.getItem('@tumamMinaCredentials');
      const theme = await AsyncStorage.getItem('themeDark');

      if(theme !== null && theme !== ''){
          setThemeDark(JSON.parse(theme))
      }else{
          console.log('No local theme')
      }
      
      if(result !== null && result !== ""){
          const data = JSON.parse(result);
          await setProfile(data);
          setIsLoggedIn(true);
          setLoading(false);
      }else{
          setIsLoggedIn(false)
          setLoading(false);
          setProfile({})
      }
      // ...
    }
    fetchData();
  }, [isLoggedIn]); 

  if(loading){
    <Loading />
  } else {
    if(viewedOnBoarding){
      if(isLoggedIn){
        return (
          <PaperProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
              <View style={{flex: 1, marginTop: - 50}}>
              <StatusBar style={themeDark ? 'light' : 'dark'} />
              <Tabs />
              <ModalPortal />
              </View>
          </PaperProvider>
        )
      } else {
        return (
          <PaperProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
               <View style={{flex: 1, marginTop: - 50}}>
               <StatusBar style={themeDark ? 'light' : 'dark'} />
               <LoginStack />
               </View>
          </PaperProvider>
        )
      }
    } else {
      return (
        <PaperProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
            <StatusBar style={themeDark ? 'light' : 'dark'} />
            <Welcome />
      </PaperProvider>
      )
    }
  }
}

export default Mainnavigator