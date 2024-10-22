import { ScrollView, StyleSheet, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Button, Card, Dialog, Divider, Modal, Portal, SegmentedButtons, Snackbar, Text } from 'react-native-paper';
import myTheme from '../utils/theme';
import { useLogin } from '../utils/LoginProvider';
import {
    MaterialIcons,
    AntDesign
  } from "@expo/vector-icons";
import Header from '../Components/Header';
import AddressComponent from '../Components/AddressComponent';
import MyTextArea from '../Components/MyTextArea';
import CustomButton from '../Components/CustomButton';
import { ref, set, onValue, update, remove } from 'firebase/database'
import { ref as imgRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { auth, db, storage } from '../config'
import * as ImagePicker from 'expo-image-picker';
import { uriToBlob } from "../Components/UriToBlob";
import MyInput from '../Components/MyInput';
import { deleteUser, sendPasswordResetEmail } from 'firebase/auth';

const Account = ({ navigation }) => {
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
    const { isLoggedIn, setIsLoggedIn, profile, setProfile } = useLogin();
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [userEdit, setUserEdit] = useState(false);
    const [image, setImage] = useState(profile.profilePicture);
    const [imageName, setImageName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [userName, setuserName] = useState("");
    const [userNumber, setuserNumber] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [msg, setMSG] = useState("");
    const [sMsg, setSMsg] = useState("");
    const [missingInputs, setMissingInputs] = useState(false);
    const [passVisible, setPassVisible] = useState(false);
    const [email, setEmail] = useState('')

    const signedInUser = auth.currentUser;

    const toggleModal = () => {
        setUserAddress(profile.userAddress);
        setuserNumber(profile.usernumber);
        setuserName(profile.username);
        setVisible(!visible)
    }

    const toggleDeleteModal = () => {
        setModalVisible(!modalVisible)
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (!result.assets[0].canceled) {
          setUserEdit(true);
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
        if (userEdit) {
          await uploadImage(image, "image");
        } else {
            handleProfileEdit(image);
        }
      };

      const passwordReset = () => {
        setPassVisible(!passVisible)
      }
      
      async function uploadImage (uri, fileType) {
        setIsLoading(true);
    
          const blob = await uriToBlob(uri);
    
          const storageRef = imgRef(storage, "Images/" + new Date().getTime());
          const uploadTask = uploadBytesResumable(storageRef, blob);
      
          // Listen for events
          uploadTask.on("state_changed", (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              // setProgress(progress.toFixed());
            },
              (error) => {
                // Handle error
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
                  // Save record
                  handleProfileEdit(downloadUrl)
                })
              }
            );
      }
      const handleProfileEdit = (imageUrl) => {
        // Upload details
        update(ref(db, 'users/' + profile.userId), {
          username: userName,
          profilePicture: imageUrl,
          usernumber: userNumber,
          userAddress: userAddress,
          profilePicName: imageName

        }).then(() => {
          setIsLoading(false);
          alert("Account edited succesfully, sign out first to see changes!")
        })
      }

      const handleForgot = async () => {
        setIsLoading(true)
        if(email !== ''){
        await sendPasswordResetEmail(auth, email)
          .then(() => {
              setIsLoading(false)
              setMissingInputs(false);
              setSMsg(`Password reset email sent successfully to ${email}, check your inbox for a password reset link!`);
              setSuccessVisible(true)
              setEmail('')
              setPassVisible(!passVisible)
          })
          .catch((error) => {
            setIsLoading(false)
            let errorMessage = error.message.replace(/[()]/g," ");
            let errorMsg = errorMessage.replace('Firebase:',"");
            setMSG(errorMsg);
            setErrorVisible(true);
          });
        } else {
          setIsLoading(false)
          setMissingInputs(true);
          setMSG("Error: Email input is missing, please fill in your email to proceed.");
          setErrorVisible(true);
        }
    }

    const confirmDelete = () => {

        // Create a reference to the file to delete
        setIsLoading(true)
        if(profile.profilePicName){
          const desertRef = imgRef(storage, `Images/${profile.profilePicName}`);
          const myId = profile.userId;
    
            AsyncStorage
            .removeItem('@tumamMinaCredentials')
            .then(() => {
              setIsLoggedIn(false);
              setProfile({})
              setIsLoading(false);
    
            deleteUser(signedInUser).then(() => {
              // User deleted.
            console.log("Email removed.....")
            deleteObject(desertRef).then(() => {
              remove(ref(db,"users/" + myId))
              .then(()=>{
                // .....
                
                console.log('User account successfully deleted')
                }).catch((error)=>{
                  console.log("unsuccessful, Error: "+error);
                  setModalVisible(!modalVisible)
              });
            }).catch((error) => {
              // An error ocurred
              // ...
              alert("unsuccessful, Error: "+error);
              setModalVisible(!modalVisible)
            });
              }).catch((error) => {
                // An error ocurred
                // ...
                alert("unsuccessful, Error: "+error);
                setModalVisible(!modalVisible)
              });
            })
            .catch((error) => alert(error.message))
    
        }else{
          const myId = profile.userId;
    
            AsyncStorage
            .removeItem('@tumamMinaCredentials')
            .then(() => {
              setIsLoggedIn(false);
              setProfile({})
              setIsLoading(false);
    
            deleteUser(signedInUser).then(() => {
              // User deleted.
            console.log("Email removed.....")
              remove(ref(db,"users/" + myId))
              .then(()=>{
                // .....
                
                console.log('User account successfully deleted')
                }).catch((error)=>{
                  console.log("unsuccessful, Error: "+error);
                  setModalVisible(!modalVisible)
              });
              }).catch((error) => {
                // An error ocurred
                // ...
                alert("unsuccessful, Error: "+error);
                setModalVisible(!modalVisible)
              });
            })
            .catch((error) => alert(error.message))
    
        }
      }

  return (
    <View style={styles.container}>
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(!visible)} contentContainerStyle={[STYLES.modalContainer, {height: screenHeight - 300}]}>
                <View style={STYLES.modalInner}>
                    <Text style={STYLES.textHeading}>Edit your delivery address</Text>
                    <ScrollView>
                    <View>
                        <View style={STYLES.labelWrapper}>
                        <Text style={STYLES.inputLabel}>Add Picture</Text>
                        </View>
                        <TouchableOpacity
                        onPress={pickImage}
                        style={{
                            padding: 5,
                            backgroundColor: "#fff",
                            width: screenWidth - 80,
                            marginBottom: 15,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                        >
                        <Text style={{ color: COLORS.button }}>
                            Change your profile image
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
                            errorText="Fullname is required"
                            value={userName}
                            onChangeFunction={(userName) => setuserName(userName)}
                            label="Full Name"
                            type="text"
                        />
                        <MyInput
                            label="Phone Number"
                            type="number"
                            value={userNumber}
                            onChangeFunction={(userNumber) => setuserNumber(userNumber)}
                        />
                        <MyTextArea
                            label="Residential Address"
                            placeholder="Your residential address"
                            value={userAddress}
                            onChangeFunction={(userAddress) => setUserAddress(userAddress)}
                        />

                        {isLoading ? (
                            <Button mode="contained" style={{borderRadius: 0, width: screenWidth - 50, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.background}}>
                            <ActivityIndicator animating={true} color={COLORS.button} />
                            </Button>
                        ):(
                           <>
                             <CustomButton text='Update Changes' onPress={() => {
                                handleClick()
                                toggleModal()
                            }}/>
                           </>
                        )}
                       
                    </ScrollView>
                </View>
            </Modal>

            {/* Password reset modal */}
            <Modal visible={passVisible} onDismiss={() => setPassVisible(!passVisible)} contentContainerStyle={[STYLES.modalContainer, {height: screenHeight - 300}]}>
                <View style={STYLES.modalInner}>
                    <ScrollView>
                    <View>
                    <Text
                        style={{
                        fontSize: 15,
                        color: COLORS.outline,
                        textAlign: "center",
                        width: screenWidth - 80,
                        fontFamily: "DMSansRegular",
                        }}
                    >
                        Send your email address to receive your password reset link to change your password
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

                    {isLoading ? (
                        <Button mode="contained" style={{borderRadius: 0, width: screenWidth - 50, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.background}}>
                        <ActivityIndicator animating={true} color={COLORS.button} />
                        </Button>
                    ):(
                        <CustomButton text="Send" onPress={() => handleForgot()} />
                    )}

                    </View>
                    </ScrollView>
                </View>
            </Modal>

            <Dialog visible={modalVisible} onDismiss={() => toggleDeleteModal()}>
                <Dialog.Title style={{color: COLORS.error, fontFamily: 'DMSansRegular'}}>Delete User Account</Dialog.Title>
                <Dialog.Content>
                <Text style={{color: COLORS.outline, fontFamily: 'DMSansRegular'}} variant="bodyMedium">You are about to delete an account with email {profile.useremail}, are you sure you want to proceed ?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                <Button onPress={() => toggleDeleteModal()}>Cancel</Button>
                <Button textColor={COLORS.error} onPress={() => confirmDelete()}>Proceed</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
        <Header title='My Account' backPress={() => navigation.goBack()} menuPress={() => navigation.toggleDrawer()}/>

        <ScrollView>
            <View style={{alignItems: 'center'}}>
                <Image source={image ? ({uri: image}):(require('../assets/user.png'))} style={STYLES.accImage} />
            </View>

            <View style ={{paddingHorizontal: 20, paddingVertical: 10}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={STYLES.textHeading}>Details</Text>
                    <Button mode="outlined" contentStyle={{borderRadius: 50}} onPress={() => toggleModal()}>
                    Edit
                    </Button>
                </View>
                <View style={{paddingHorizontal: 10}}>
                    <View style={{paddingVertical: 5}}>
                        <Text style={[STYLES.textHeading, {paddingVertical: 2, fontSize: 15}]}>Full Name</Text>
                        <Text  style={STYLES.textNormal}>{profile.username}</Text>
                    </View>
                    <View style={{paddingVertical: 5}}>
                        <Text style={[STYLES.textHeading, {paddingVertical: 2, fontSize: 15}]}>Phone Number</Text>
                        <Text style={STYLES.textNormal}>{profile.usernumber}</Text>
                    </View>
                    <View style={{paddingVertical: 5}}>
                        <Text style={[STYLES.textHeading, {paddingVertical: 2, fontSize: 15}]}>eMail Address</Text>
                        <Text style={STYLES.textNormal}>{profile.useremail}</Text>
                    </View>
                    <View style={{paddingVertical: 5}}>
                        <Text style={[STYLES.textHeading, {paddingVertical: 2, fontSize: 15}]}>Residential Address</Text>
                        <Text style={STYLES.textNormal}>{profile.userAddress}</Text>
                    </View>

                    <Divider style={{marginVertical: 10}}/>
                    {isLoading ? (
                        <Button mode="contained" style={{borderRadius: 0, width: screenWidth - 50, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.background}}>
                        <ActivityIndicator animating={true} color={COLORS.button} />
                        </Button>
                    ):(
                        <>
                        <CustomButton text='Change Password' onPress={() => passwordReset()}/>
                        <CustomButton type='cancel' text='Delete Account' onPress={() => {
                           toggleDeleteModal()
                        }}/>
                        </>
                    )}
                </View>
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
  )
}

export default Account

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 15
    },
})