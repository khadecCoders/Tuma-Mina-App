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
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput, Divider, Portal, Snackbar, ActivityIndicator, Button } from "react-native-paper";
import CustomButton from "../Components/CustomButton";
import MyInput from "../Components/MyInput";
import { ref, set, onValue } from 'firebase/database'
import { ref as imgRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from '../config'
import * as ImagePicker from 'expo-image-picker';
import { uriToBlob } from "../Components/UriToBlob";
import DropdownComponent from '../Components/DropdownComponent';

const SignUp = () => {
  const { navigate } = useNavigation();
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [userName, setuserName] = useState("");
  const [userNumber, setuserNumber] = useState("");
  const [userEmail, setuserEmail] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userPassword, setuserPassword] = useState("");
  const [userPasswordConfirm, setuserPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [msg, setMSG] = useState("");
  const [sMsg, setSMsg] = useState("");
  const [missingInputs, setMissingInputs] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [gender, setGender] = useState('');

  const clearOnBoarding = async () => {
    try {
      await AsyncStorage.removeItem("@viewedonboarding");
    } catch (error) {
      console.log("Error @viewedonboarding: ", error);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.assets[0].canceled) {
      setImage(result.assets[0].uri);
      setImageName(new Date().getTime().toString());
      const fileName = result.assets[0].uri.split("/").pop();
      const fileType = fileName.split(".").pop();
      // Upload the image test
    }
  };
  
  const removeImage = () => {
    setImage("");
  };
  
  const handleClick = async () => {
    if(userEmail !== '' && userPassword !== '' && userPasswordConfirm !== ''){
      if (image) {
        await uploadImage(image, "image");
      } else {
        handleSignUp(image);
      }
    } else {
      setIsLoading(false)
      setMissingInputs(true);
      setMSG("Error: Some required inputs are missing, please fill all the red boxes with required.");
      setErrorVisible(true);
    }
  };
  
  async function uploadImage(uri, fileType) {
    setIsLoading(true);
  
    const blob = await uriToBlob(uri);
  
    const storageRef = imgRef(storage, "Images/" + imageName);
    const uploadTask = uploadBytesResumable(storageRef, blob);
  
    // Listen for events
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        // Handle error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
          console.log("File available at: " + downloadUrl);
          setImageUrl(downloadUrl);
          // Save record
          handleSignUp(downloadUrl);
        });
      }
    );
  }

  const handleSignUp = (profilePic) => {
      if(userPassword != userPasswordConfirm){
        setMSG("Error: Password don't match");
        setErrorVisible(true);
      }else{
        setIsLoading(true);
  
      createUserWithEmailAndPassword(auth, userEmail, userPasswordConfirm)
        .then(userCredentials => {
          // const user = userCredentials.user;
          console.log("User: " + userCredentials.user.email + "created successfully")
  
          // Upload details
          set(ref(db, 'users/' + userCredentials.user.uid), {
            userId: userCredentials.user.uid,
            username: userName,
            useremail: userEmail,
            profilePicture: profilePic,
            profilePicName: imageName,
            usernumber: userNumber,
            userAddress: userAddress,
            accountType: "Public",
            bikeNo: 'None',
            deliveries: 0,
            gender: gender,
            available: true
  
          }).then(() => {
            setIsLoading(false)
            setSMsg(`Account for ${userEmail} was created successfully, proceed to login!`);
            setSuccessVisible(true)
            setMissingInputs(false)

            // Clear input states
            setImage('');
            setuserPassword('');
            setuserPasswordConfirm('');
            setuserNumber('');
            setuserEmail('');
            setuserName('');
            setGender('');
            setUserAddress('');
  
          }).catch((error) => {
            setIsLoading(false)
            let errorMessage = error.message.replace(/[()]/g," ");
            let errorMsg = errorMessage.replace('Firebase:',"");
            setMSG(errorMsg);
            setErrorVisible(true)
          })
        })
        .catch(error => {
          setIsLoading(false)
          let errorMessage = error.message.replace(/[()]/g," ");
          let errorMsg = errorMessage.replace('Firebase:',"");
          setMSG(errorMsg);
          setErrorVisible(true)
        })
    }
  }

  return (
    <View style={[styles.container, {backgroundColor: COLORS.surface}]}>
      <Image source={require('../assets/upperCorner.png')} style={STYLES.upperCorner} />

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            width: screenWidth - 50,
          }}
        >
            <Text
              style={{
                fontSize: 18,
                color: COLORS.outline,
                textAlign: "center",
                fontFamily: "DMSansRegular",
              }}
            >
              Enter your details and sign up
            </Text>

            <MyInput
              value={userName}
              onChangeFunction={(userName) => setuserName(userName)}
              label="Full Name"
              type="add"
            />

            <MyInput
              isRequired={missingInputs}
              errorText="Address is required"
              value={userEmail}
              onChangeFunction={(userEmail) => setuserEmail(userEmail)}
              label="Email Address"
              type="email"
            />

            <View style={{marginVertical: 20, paddingHorizontal: 15}}>
              <View style={STYLES.labelWrapper}>
                <Text style={STYLES.inputLabel}>Add Picture</Text>
              </View>
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: COLORS.button }}>
                  Add your profile image
                </Text>
                <MaterialIcons name="touch-app" size={25} color={COLORS.button} />
              </TouchableOpacity>
              <Divider />
              {image && (
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={{ uri: image }}
                    style={{ width: 50, height: 50, marginRight: 20 }}
                  />
                  <View style={{ justifyContent: "center" }}>
                    {/* <Text numberOfLines={3}>{fileName}</Text> */}
                    <TouchableOpacity
                      onPress={removeImage}
                      style={{
                        padding: 8,
                        backgroundColor: COLORS.outline,
                        width: 100,
                        marginTop: 5,
                      }}
                    >
                      <Text style={{ color: "#fff" }}>Remove Image</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
    
            <MyInput
              isRequired={missingInputs}
              errorText="Password is required"
              label="Password" 
              type="password" 
              value={userPassword}
              onChangeFunction={(userPassword) => setuserPassword(userPassword)}
          />
            <MyInput 
              isRequired={missingInputs}
              errorText="Password is required"
              label="Confirm Password" 
              type="password" 
              value={userPasswordConfirm}
              onChangeFunction={(userPasswordConfirm) => setuserPasswordConfirm(userPasswordConfirm)}
            />
          <View style={{ paddingBottom: 20, marginVertical: 20 }}>
          {isLoading ? (
            <Button mode="contained" style={{borderRadius: 0, width: screenWidth - 50, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.background}}>
              <ActivityIndicator animating={true} color={COLORS.button} />
            </Button>
          ):(
            <Button mode="contained" style={{borderRadius: 0, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.button}} onPress={() => handleClick()}>
              Sign Up
            </Button>
          )}
        
          <TouchableOpacity onPress={() => navigate("SignIn")}>
            <Text
              style={{
                fontSize: 15,
                marginVertical: 3,
                color: COLORS.outline,
                textAlign: "center",
                fontFamily: "DMSansRegular",
              }}
            >
              Already have an account ?{" "}
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.primary,
                  textAlign: "center",
                }}
              >
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
        {/* <Image source={require('../assets/lowerCorner.png')} style={STYLES.lowerCorner} /> */}
        <Text
          style={{
            fontSize: 15,
            marginBottom: 20,
            color: COLORS.outline,
            textAlign: "center",
            width: screenWidth - 40,
            fontFamily: "DMSansRegular",
          }}
        >
          By clicking sign up, you agree to our{" "}
          <Text
            style={{ fontSize: 13, color: COLORS.primary, textAlign: "center" }}
          >
            terms and conditions{" "}
          </Text>
          and our{" "}
          <Text
            style={{ fontSize: 13, color: COLORS.primary, textAlign: "center" }}
          >
            privacy policy.
          </Text>
        </Text>
        </View>
      </ScrollView>

      <Portal>
        <Snackbar
          style={{backgroundColor: COLORS.error}}
          visible={errorVisible}
          onDismiss={() => setErrorVisible(false)}
          duration={3000}
        >
          {msg}
        </Snackbar>
        <Snackbar
          style={{backgroundColor: '#2ac780'}}
          visible={successVisible}
          onDismiss={() => setSuccessVisible(false)}
          duration={3000}
        >
          {sMsg}
        </Snackbar>
      </Portal>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
