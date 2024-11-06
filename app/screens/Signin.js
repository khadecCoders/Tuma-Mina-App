import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import myTheme from "../utils/theme";
import MyInput from "../Components/MyInput";
import { auth, db } from "../config";
import {
  ref,
  get,
  child,
} from "firebase/database";
import { signInWithEmailAndPassword } from "firebase/auth";
import CustomButton from "../Components/CustomButton";
import { useLogin } from "../utils/LoginProvider";
import { ActivityIndicator, Button, Portal, Snackbar } from "react-native-paper";

const Signin = () => {
  const { navigate } = useNavigation();
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const { isLoggedIn, setIsLoggedIn, profile, setProfile } = useLogin();
  const [errorVisible, setErrorVisible] = useState(false);
  const [msg, setMSG] = useState("");
  const [missingInputs, setMissingInputs] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const clearOnBoarding = async () => {
    try {
      await AsyncStorage.removeItem("@viewedonboarding");
      console.log("cleared onboarding");
    } catch (error) {
      console.log("Error @viewedonboarding: ", error);
    }
  };

  //Email and password login
  loginUser = () => {
    setIsLoading(true);
    if (email !== "" && password !== "") {
      try {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // ..
            var user = userCredential.user;
            var userId = user.uid;

            const dbRef = ref(db);

            get(child(dbRef, `users/${userId}`))
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const data = snapshot.val();

                    AsyncStorage.setItem(
                      "@tumamMinaCredentials",
                      JSON.stringify(data)
                    ).then(() => {
                      setProfile(data);
                      setIsLoggedIn(true);
                      setIsLoading(true);
                    });
                 
                } else {
                  setMSG("No such user exists");
                  setErrorVisible(true);
                }
              })
              .then(() => {
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            // ..
            setIsLoading(false);
            let errorMessage = error.message.replace(/[()]/g, " ");
            let errorMsg = errorMessage.replace("Firebase:", "");
            setMSG(errorMsg);
            setErrorVisible(true);
          });
      } catch (error) {
        setIsLoading(false);
        let errorMessage = error.message.replace(/[()]/g, " ");
        let errorMsg = errorMessage.replace("Firebase:", "");
        setMSG(errorMsg);
        setErrorVisible(true);
      }
    } else {
      setIsLoading(false);
      setMissingInputs(true);
      setMSG(
        "Error: Some required inputs are missing, please fill all the red boxes."
      );
      setErrorVisible(true);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: COLORS.surface}]}>
      <Image
        source={require("../assets/upperCorner.png")}
        style={STYLES.upperCorner2}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 8,
            justifyContent: "center",
            alignItems: "center",
            height: screenHeight - 50,
          }}
        >
          <Image
            source={require("../assets/signin.png")}
            style={STYLES.loginImage}
          />
          <Text
            style={{
              fontSize: 18,
              color: COLORS.outline,
              textAlign: "center",
              fontFamily: "DMSansRegular",
            }}
          >
            Provide your login details and sign in
          </Text>

          <View style={{width: screenWidth - 50}}>
          <MyInput 
            isRequired={missingInputs}
            errorText="Email address is required"
            value = {email}
            label="Email Address" 
            type="email" 
            onChangeFunction={(email) => {
              setEmail(email)
            }}
          />
          <MyInput 
            isRequired={missingInputs}
            errorText="Password is required"
            label="Password" 
            value = {password}
            type="password"
            onChangeFunction={(password) => {
                setPassword(password)
              }} 
          />
          </View>

          {isLoading ? (
            <Button mode="contained" style={{borderRadius: 0, width: screenWidth - 50, paddingVertical: 5, marginVertical: 20, backgroundColor: COLORS.background}}>
              <ActivityIndicator animating={true} color={COLORS.button} />
            </Button>
          ):(
            <Button mode="contained" style={{borderRadius: 0, paddingVertical: 5, marginVertical: 20, backgroundColor: COLORS.button,  width: screenWidth - 50,}} onPress={() => loginUser()}>
              Sign In
            </Button>
          )}
          <TouchableOpacity onPress={() => navigate("ForgotPassword")}>
            <Text
              style={{
                fontSize: 15,
                marginVertical: 3,
                color: COLORS.primary,
                textAlign: "center",
                fontFamily: "DMSansRegular",
              }}
            >
              Forgot password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate("SignUp")}>
            <Text
              style={{
                fontSize: 15,
                marginVertical: 3,
                color: COLORS.outline,
                textAlign: "center",
                fontFamily: "DMSansRegular",
              }}
            >
              New to Tuma Mina ?{" "}
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.primary,
                  textAlign: "center",
                }}
              >
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Portal>
          <Snackbar
            style={{ backgroundColor: COLORS.error }}
            visible={errorVisible}
            onDismiss={() => setErrorVisible(false)}
            duration={3000}
          >
            {msg}
          </Snackbar>
        </Portal>
      </ScrollView>
      {/* <Image source={require('../assets/lowerCorner.png')} style={STYLES.lowerCorner} /> */}
    </View>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
