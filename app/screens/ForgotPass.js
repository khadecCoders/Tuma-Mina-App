import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import myTheme from "../utils/theme";
import { Portal, Snackbar, TextInput } from "react-native-paper";
import MyInput from "../Components/MyInput";
import CustomButton from "../Components/CustomButton";

const ForgotPass = () => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const { navigate } = useNavigation();
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [sMsg, setSMsg] = useState("");
  const [msg, setMSG] = useState("");
  const [missingInputs, setMissingInputs] = useState(false);

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgot = async () => {
    setIsLoading(true);
    if (email !== "") {
      await sendPasswordResetEmail(auth, email)
        .then(() => {
          setIsLoading(false);
          setMissingInputs(false);
          setSMsg(`Password reset email sent successfully to ${email}!`);
          setSuccessVisible(true);
        })
        .catch((error) => {
          setIsLoading(false);
          let errorMessage = error.message.replace(/[()]/g, " ");
          let errorMsg = errorMessage.replace("Firebase:", "");
          setMSG(errorMsg);
          setErrorVisible(true);
        });
    } else {
      setIsLoading(false);
      setMissingInputs(true);
      setMSG(
        "Error: Email input is missing, please fill in your email to proceed."
      );
      setErrorVisible(true);
    }
  };

  const clearOnBoarding = async () => {
    try {
      await AsyncStorage.removeItem("@viewedonboarding");
    } catch (error) {
      console.log("Error @viewedonboarding: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/upperCorner.png")}
        style={STYLES.upperCorner}
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
              width: screenWidth - 80,
              fontFamily: "DMSansRegular",
            }}
          >
            Send your email address to receive your password reset link if you
            forgot your password
          </Text>

          <MyInput 
            isRequired={missingInputs}
            errorText="Email address is required"
            value = {email}
            onChangeFunction={(email) => {
              setEmail(email)
            }}
            label="Email Address" 
            type="email" 
          />

          <CustomButton text="Send" onPress={() => handleForgot()} />

          <TouchableOpacity onPress={() => navigate("SignIn")}>
            <Text
              style={{
                fontSize: 15,
                marginVertical: 3,
                color: COLORS.primary,
                textAlign: "center",
                fontFamily: "DMSansRegular",
              }}
            >
              Back to sign in{" "}
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
                  fontFamily: "DMSansRegular",
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
          <Snackbar
            style={{ backgroundColor: '#2ac780' }}
            visible={successVisible}
            onDismiss={() => setSuccessVisible(false)}
            duration={3000}
          >
            {sMsg}
          </Snackbar>
        </Portal>
      </ScrollView>
      {/* <Image source={require('../assets/lowerCorner.png')} style={STYLES.lowerCorner} /> */}
    </View>
  );
};

export default ForgotPass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
