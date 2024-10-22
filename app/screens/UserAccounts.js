import {
    ScrollView,
    StyleSheet,
    View,
    Platform,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, AnimatedFAB, Button, Dialog, Divider, Modal, Portal, Snackbar, Text } from 'react-native-paper';
import myTheme from '../utils/theme';
import { useLogin } from '../utils/LoginProvider';
import Header from '../Components/Header';
import MyInput from '../Components/MyInput';
import CustomButton from '../Components/CustomButton';
import ImageInput from '../Components/ImageInput';
import BikeCard from '../Components/BikeCard';
import MyTextArea from '../Components/MyTextArea';
import { uriToBlob } from "../Components/UriToBlob";
import * as ImagePicker from 'expo-image-picker';
import { ref, set, onValue, remove, update, push } from 'firebase/database'
import { ref as imgRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from '../config'
import DropdownComponent from '../Components/DropdownComponent';
import { MaterialIcons } from '@expo/vector-icons'
import UserCard from '../Components/UserCard';

const UserAccounts = ({ navigation, animateFrom, }) => {
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
    const { isLoggedIn, setIsLoggedIn, profile, setProfile } = useLogin();
    const [visible, setVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [isExtended, setIsExtended] = useState(true);
    const [fabVisible, setFabVisible] = useState(true);
    const [addBiker, setAddBiker] = useState(false);
    const [viewBiker, setViewBiker] = useState(false);
    const [image, setImage] = useState("");
    const [imageName, setImageName] = useState("");
    const [userName, setuserName] = useState("");
    const [userNumber, setuserNumber] = useState("");
    const [gender, setGender] = useState('');
    const [userEmail, setuserEmail] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [accType, setAccType] = useState("");
    const [bikeNo, setBikeNo] = useState("");
    const [userPassword, setuserPassword] = useState("");
    const [userPasswordConfirm, setuserPasswordConfirm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [msg, setMSG] = useState("");
    const [sMsg, setSMsg] = useState("");
    const [missingInputs, setMissingInputs] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [users, setUsers] = useState([]);
    const [biker, setBiker] = useState(null);
    const [editBiker, setEditBiker] = useState({});
    const [bikerId, setBikerId] = useState('');
    const [deleteKey, setDeleteKey] = useState('')
    const [deleteImageName, setDeleteImageName] = useState('')

    const isIOS = Platform.OS === 'ios';

    useEffect(() => {
        const bikersRef = ref(db, 'users/');
        onValue(bikersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const newBikers = Object.keys(data)
                    .map(key => ({
                        id: key,
                        ...data[key]
                    }));
                
                const bikerAccounts = newBikers.filter((item) => item.accountType !== "Biker"); 
                setUsers(bikerAccounts);
            }
        });
    }, [])

    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setIsExtended(currentScrollPosition <= 0);
    };

    const fabStyle = { [animateFrom]: 16 };

    const toggleModal = (item, index) => {
        setUserAddress(item.userAddress);
        setBikeNo(item.bikeNo);
        setuserNumber(item.usernumber);
        setuserEmail(item.useremail);
        setuserName(item.username);
        setAccType(item.accountType);
        setBikerId(item.id)
        setVisible(!visible)
    }

    const toggleViewBiker = (item, index) => {
        setBiker(item);
        setViewBiker(!viewBiker);
    }

    const toggleDeleteModal = (itemId, imgName) => {
        setDeleteKey(itemId);
        setDeleteImageName(imgName)
        setDeleteVisible(!deleteVisible)
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
        if (image) {
            await uploadImage(image, "image");
        } else {
            handleSignUp(image);
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
        if (userName !== '' && userEmail !== '' && userPassword !== '' && userPasswordConfirm !== '') {
            if (userPassword != userPasswordConfirm) {
                setMSG("Error: Password don't match");
                setErrorVisible(true);
            } else {
                setIsLoading(true);

                createUserWithEmailAndPassword(auth, userEmail, userPasswordConfirm)
                    .then(userCredentials => {
                        // const user = userCredentials.user;

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
                            bikeNo: bikeNo,
                            deliveries: 0,
                            gender: gender

                        }).then(() => {
                            setIsLoading(false)
                            setSMsg(`A user account for ${userEmail} was created successfully!`);
                            setSuccessVisible(true)
                            setMissingInputs(false)

                            // Clear input states
                            setImage('');
                            setuserPassword('');
                            setUserAddress('');
                            setBikeNo('');
                            setuserPasswordConfirm('');
                            setuserNumber('');
                            setuserEmail('');
                            setuserName('');

                        }).catch((error) => {
                            setIsLoading(false)
                            let errorMessage = error.message.replace(/[()]/g, " ");
                            let errorMsg = errorMessage.replace('Firebase:', "");
                            setMSG(errorMsg);
                            setErrorVisible(true)
                        })
                    })
                    .catch(error => {
                        setIsLoading(false)
                        let errorMessage = error.message.replace(/[()]/g, " ");
                        let errorMsg = errorMessage.replace('Firebase:', "");
                        setMSG(errorMsg);
                        setErrorVisible(true)
                    })
            }
        } else {
            setIsLoading(false)
            setMissingInputs(true);
            setMSG("Error: Some required inputs are missing, please fill all the red boxes with required.");
            setErrorVisible(true);
        }
    }

    const handleProfileEdit = () => {
        // Upload details
        setIsLoading(true)
        update(ref(db, 'users/' + bikerId), {
          username: userName,
          usernumber: userNumber,
          userAddress: userAddress,
          accountType: accType,
          bikeNo: bikeNo,

        }).then(() => {
          setIsLoading(false)
          setMissingInputs(false);
          setSMsg(`User account edited succesfully, sign out first to see changes!`);
          setVisible(!visible)
          setSuccessVisible(true)

        setuserName('')
        setuserNumber('')
        setBikeNo('')
        setAccType('')
        setAccType('')
        setUserAddress('')
        })
      }

      const confirmDelete = (index, deleteImageName) => {
        // .......
        const desertRef = imgRef(storage, `Images/${deleteImageName}`);
        setIsLoading(true)
       if(deleteImageName !== ""){
        deleteObject(desertRef).then(() => {
            remove(ref(db,"users/" + index))
            .then(()=>{
              setSMsg("User account deleted successfully deleted")
              setSuccessVisible(true)
              setDeleteVisible(!deleteVisible)
              setDeleteVisible(!deleteVisible)
        
            }).catch((error)=>{
                setDeleteVisible(!deleteVisible)
                let errorMessage = err.message.replace(/[()]/g," ");
                let errorMsg = errorMessage.replace('Firebase:',"");
                setMSG("unsuccessful, Error: "+errorMsg);
                setErrorVisible(true)
            });
          }).catch((error) => {
            let errorMessage = error.message.replace(/[()]/g," ");
            let errorMsg = errorMessage.replace('Firebase:',"");
            setIsLoading(false)
            setMSG("unsuccessful, Error: "+errorMsg);
            setErrorVisible(true)
            setDeleteVisible(!deleteVisible)
          })
       }else{
        remove(ref(db,"users/" + index))
        .then(()=>{
          setIsLoading(false)
          setSMsg("Address deleted successfully deleted")
          setSuccessVisible(true)
          setDeleteVisible(!deleteVisible)
          setDeleteVisible(!deleteVisible)
    
        }).catch((error)=>{
            setIsLoading(false)
            setDeleteVisible(!deleteVisible)
            let errorMessage = err.message.replace(/[()]/g," ");
            let errorMsg = errorMessage.replace('Firebase:',"");
            setMSG("unsuccessful, Error: "+errorMsg);
            setErrorVisible(true)
        });
       }
    
      }

    return (
        <View style={styles.container}>
            <Portal>
                {/* Edit biker modal */}
                <Modal visible={visible} onDismiss={() => setVisible(!visible)} contentContainerStyle={[STYLES.modalContainer, { height: screenHeight - 300 }]}>
                    <View style={STYLES.modalInner}>
                        <Text style={STYLES.textHeading}>Edit the user details</Text>
                        <ScrollView>
                            <MyInput
                                label='Full name'
                                type='add'
                                value={userName}
                                onChangeFunction={(userName) => setuserName(userName)}
                            />
                            <MyInput
                                label='Phone number'
                                type='number'
                                value={userNumber}
                                onChangeFunction={(usernumber) => setuserNumber(usernumber)}
                            />
                            
                            <DropdownComponent 
                                value={accType} label='Account Type' onChangeFunction={(accType) => {setAccType(accType)}}
                                clearVal = {() => setAccType('')} 
                                data={[
                                    { label: 'Administrator', value: 'Admin' },
                                    { label: 'Biker', value: 'Biker' },
                                    { label: 'General User', value: 'Public' },
                                    
                                ]}/>
                            <MyTextArea
                                label='Residential address'
                                type='add'
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
                                        handleProfileEdit();
                                    }} />
                                </>
                            )}

                            
                        </ScrollView>
                    </View>
                </Modal>

                {/* Add biker modal */}
                <Modal visible={addBiker} onDismiss={() => setAddBiker(!addBiker)} contentContainerStyle={[STYLES.modalContainer, { height: screenHeight - 300 }]}>
                    <View style={STYLES.modalInner}>
                        <Text style={STYLES.textHeading}>Add a user account</Text>
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
                                placeholder='Full name(s)'
                                label='Full Name(s)'
                                type='add'
                                isRequired={missingInputs}
                                errorText="Fullname is required"
                                value={userName}
                                onChangeFunction={(userName) => setuserName(userName)}
                            />
                            <MyInput
                                placeholder='+263 7.. .. ...'
                                label='Phone Number'
                                type='number'
                                value={userNumber}
                                onChangeFunction={(userNumber) => setuserNumber(userNumber)}
                            />
                            <DropdownComponent
                                value={gender} label='Gender' onChangeFunction={(gender) => { setGender(gender) }}
                                data={[
                                    { label: 'Female', value: 'Female' },
                                    { label: 'Male', value: 'Male' },
                                ]} />
                            <MyInput
                                placeholder='Email address'
                                label='Email Address'
                                type='email'
                                isRequired={missingInputs}
                                errorText="Address is required"
                                value={userEmail}
                                onChangeFunction={(userEmail) => setuserEmail(userEmail)}
                            />
                            
                            <MyTextArea
                                placeholder='Residential address of the biker'
                                label='Address/Location'
                                type='add'
                                isRequired={missingInputs}
                                errorText="Residential address is required"
                                value={userAddress}
                                onChangeFunction={(userAddress) => setUserAddress(userAddress)}
                            />
                            <MyInput
                                placeholder='Password'
                                label='Password'
                                type='password'
                                isRequired={missingInputs}
                                errorText="Password confirm is required"
                                value={userPassword}
                                onChangeFunction={(userPassword) => setuserPassword(userPassword)}
                            />
                            <MyInput
                                placeholder='Enter the same password'
                                label='Confirm Password'
                                type='password'
                                isRequired={missingInputs}
                                errorText="Password confirm is required"
                                value={userPasswordConfirm}
                                onChangeFunction={(userPasswordConfirm) => setuserPasswordConfirm(userPasswordConfirm)}
                            />
                            {isLoading ? (
                                <Button mode="contained" style={{ borderRadius: 0, width: screenWidth - 50, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.background }}>
                                    <ActivityIndicator animating={true} color={COLORS.button} />
                                </Button>
                            ) : (
                                <>
                                    <CustomButton text='Add user' onPress={() => {
                                        // alert('Successfully')
                                        handleClick();
                                    }} />
                                    <CustomButton type='cancel' text='Cancel' onPress={() => {
                                        // alert('Successfully')
                                        setAddBiker(!addBiker)
                                    }} />
                                    
                                </>
                            )}
                            
                        </ScrollView>
                    </View>
                </Modal>

                {/* View biker modal */}
                <Modal visible={viewBiker} onDismiss={() => setViewBiker(!viewBiker)} contentContainerStyle={[STYLES.modalContainer, { height: screenHeight - 200 }]}>
                    <View style={STYLES.modalInner}>
                        <Text style={STYLES.textHeading}>User account details</Text>
                        <ScrollView>
                            {biker ? (
                                <View>
                                <View style={{ alignItems: 'center' }}>
                                    <Image source={biker.profilePicture ? ({uri: biker.profilePicture}):(require('../assets/user.png'))} style={STYLES.bikerAccImg} />
                                </View>

                                <View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <View style={{ paddingVertical: 5 }}>
                                            <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Full Name</Text>
                                            <Text style={STYLES.textNormal}>{biker.username}</Text>
                                        </View>
                                        <View style={{ paddingVertical: 5 }}>
                                            <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Account Type</Text>
                                            <Text style={STYLES.textNormal}>{biker.accountType}</Text>
                                        </View>
                                        
                                        <View style={{ paddingVertical: 5 }}>
                                            <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Phone Number</Text>
                                            <Text style={STYLES.textNormal}>{biker.usernumber}</Text>
                                        </View>
                                        
                                      
                                        <View style={{ paddingVertical: 5 }}>
                                            <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>eMail Address</Text>
                                            <Text style={STYLES.textNormal}>{biker.useremail}</Text>
                                        </View>
                                        <View style={{ paddingVertical: 5 }}>
                                            <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Residential Address</Text>
                                            <Text style={STYLES.textNormal}>{biker.userAddress}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            ):(
                                <></>
                            )}
                        </ScrollView>
                    </View>
                </Modal>

                <Dialog visible={deleteVisible} onDismiss={() => toggleDeleteModal()}>
                    <Dialog.Title style={{ color: COLORS.error, fontFamily: 'DMSansRegular' }}>Delete User</Dialog.Title>
                    <Dialog.Content>
                        <Text style={{ color: COLORS.outline, fontFamily: 'DMSansRegular' }} variant="bodyMedium">You are about to delete a user account, are you sure you want to proceed ?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => toggleDeleteModal()}>Cancel</Button>
                        <Button textColor={COLORS.error} onPress={() => confirmDelete(deleteKey, deleteImageName)}>Proceed</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Header title='Users' backPress={() => navigation.goBack()} menuPress={() => navigation.toggleDrawer()} />

            <ScrollView horizontal={true} onScroll={onScroll} showsVerticalScrollIndicator={true} style={{ height: screenHeight - 580, backgroundColor: COLORS.background, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                <FlatList
                    data={users}
                    key={(item, index) => index}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => (
                    <UserCard 
                        name={item.username} 
                        accType={item.accountType}
                        email={item.useremail}
                        gender={item.gender} 
                        deliveries={item.deliveries} 
                        addr={item.userAddress}
                        image={item.profilePicture ? ({uri: item.profilePicture}):(require('../assets/user.png'))} 
                        onCardPress={() => toggleViewBiker(item, index)} 
                        onEditPress={() => toggleModal(item, index)} 
                        onPressDelete={() => toggleDeleteModal(item.id, item.profilePicName)}
                    />
                    )}
                />

            </ScrollView>

            <AnimatedFAB
                icon={'plus'}
                label={'Add A User      '}
                extended={isExtended}
                onPress={() => setAddBiker(!addBiker)}
                visible={fabVisible}
                animateFrom='right'
                iconMode={'static'}
                style={[styles.fabStyle, fabStyle, { backgroundColor: COLORS.button }]}
                color={COLORS.background}
            />
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
        </View>
    )
}

export default UserAccounts

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 15,
        flexGrow: 1,
    },
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
        elevation: 3
    },
})