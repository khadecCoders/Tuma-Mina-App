import { StyleSheet } from 'react-native';
import { Provider } from 'react-native-paper';
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import Mainnavigator from './utils/Mainnavigator';
import LoginProvider from './utils/LoginProvider';

export default function App() {

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
      <Provider>
        <LoginProvider>
          <NavigationContainer>
            <Mainnavigator />
            <ModalPortal />
          </NavigationContainer>
        </LoginProvider>
      </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
