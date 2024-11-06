import { ModalPortal } from 'react-native-modals';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-native-paper';
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import Mainnavigator from './utils/Mainnavigator';
import LoginProvider from './utils/LoginProvider';
import { CameraView, Camera } from "expo-camera";
import Toast from 'react-native-toast-message';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [ fontsLoaded ] = useFonts({
    "DMSansRegular": require("./assets/fonts/DMSans_18pt-Regular.ttf"),
    "DMSansItalic": require("./assets/fonts/DMSans_18pt-Italic.ttf"),
    "DMSansSemiBold": require("./assets/fonts/DMSans_18pt-SemiBold.ttf"),
    "DMSansBold": require("./assets/fonts/DMSans_18pt-Bold.ttf"),
  });

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

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
            <Toast />
          </NavigationContainer>
        </LoginProvider>
      </Provider>
  );
}

