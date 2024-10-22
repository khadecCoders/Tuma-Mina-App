import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerToggleButton } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import App from './App';
import { Provider } from 'react-native-paper';
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import Mainnavigator from './utils/Mainnavigator';
import LoginProvider from './utils/LoginProvider';

const index = () => {
  const [ fontsLoaded ] = useFonts({
    "DMSansRegular": require("./assets/fonts/DMSans_18pt-Regular.ttf"),
    "DMSansItalic": require("./assets/fonts/DMSans_18pt-Italic.ttf"),
    "DMSansSemiBold": require("./assets/fonts/DMSans_18pt-SemiBold.ttf"),
    "DMSansBold": require("./assets/fonts/DMSans_18pt-Bold.ttf"),
  });

  async function prepare () {
    await SplashScreen.preventAutoHideAsync();
  }

  if(!fontsLoaded){
    return undefined;
  }else{
    SplashScreen.hideAsync();
  }

  prepare();

  return (
    <GestureHandlerRootView>
      {/* content */}
      <Provider>
        <LoginProvider>
          <>
            <Mainnavigator />
          </>
        </LoginProvider>
      </Provider>
    </GestureHandlerRootView>
  )
}

export default index

const styles = StyleSheet.create({})