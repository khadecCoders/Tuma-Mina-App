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
import { ActivityIndicator, AnimatedFAB, Button, Dialog, Divider, Modal, Portal, Searchbar, Snackbar, Text } from 'react-native-paper';
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
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

const Bikers = ({ navigation, animateFrom, }) => {
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
    const [bikers, setBikers] = useState([]);
    const [biker, setBiker] = useState(null);
    const [editBiker, setEditBiker] = useState({});
    const [bikerId, setBikerId] = useState('');
    const [deleteKey, setDeleteKey] = useState('')
    const [deleteImageName, setDeleteImageName] = useState('')
    const [search, setSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchNone, setSearchNone] = useState(false);
    const [tempSearch, setTempSearch] = useState([]);

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
                
                const bikerAccounts = newBikers.filter((item) => item.accountType === "Biker"); 
                setBikers(bikerAccounts);
                setTempSearch(bikerAccounts);
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
                            accountType: "Biker",
                            bikeNo: bikeNo,
                            deliveries: 0,
                            gender: gender

                        }).then(() => {
                            setIsLoading(false)
                            setSMsg(`A biker account for ${userEmail} was created successfully!`);
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
          
    const confirmDelete = (index, deleteImageName) => {
        // .......
        const desertRef = imgRef(storage, `Images/${deleteImageName}`);
        setIsLoading(true)
    if(deleteImageName !== ""){
        deleteObject(desertRef).then(() => {
            remove(ref(db,"users/" + index))
            .then(()=>{
            setSMsg("Biker deleted successfully deleted")
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
            setSMsg(`Bikers account edited succesfully, sign out first to see changes!`);
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

    const CustomHeader = () => (
        <View style={{flexDirection: 'row', justifyContent: 'space-around', flex: 1}}>
           <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
              // Clear input states
              setImage('');
              setuserPassword('');
              setUserAddress('');
              setBikeNo('');
              setuserPasswordConfirm('');
              setuserNumber('');
              setuserEmail('');
              setuserName('');

              setAddBiker(!addBiker)
           }}>
             <MaterialCommunityIcons color={COLORS.outline} name='plus' size={15}/>
           </TouchableOpacity>
           <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}}>
             <MaterialCommunityIcons color={COLORS.outline} name='reload' size={15}/>
           </TouchableOpacity>
           <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
             setSearch(!search)
           }}>
             <MaterialIcons color={COLORS.outline} name='search' size={15}/>
           </TouchableOpacity>
        </View>
    )
    
    const searchQ = (sQuery) => {
    if(sQuery !== ''){
        let temp = bikers.filter((item) => String(item.username).includes(sQuery) || String(item.gender).includes(sQuery))
        setBikers(temp);
        if(temp.length === 0){
            setSearchNone(true);
        } else{
            setSearchNone(false);
        }
        } else {
        setSearchNone(false);
        setBikers(tempSearch);
        }
    }

    const fetchLocationAddress = async (reg) => {
    if (!reg) {
        return; // Do nothing if location is not available
    }
    
    try {
        const {latitude, longitude} = await reg;
        const response = await Location.reverseGeocodeAsync({ latitude, longitude });
        const address = response[0]; // Assuming the first address is relevant
        
        //updating the location state
        setMyLocation(address);
        setShowLoc('flex')
    } catch (error) {
        console.error('Error fetching location address:', error);
    }
    };

    onRegionChange = region => {
        setMapRegion(region)
        fetchLocationAddress(region);
    };

    return (
        <View style={[styles.container, {backgroundColor: COLORS.surface}]}>
            <Header
                title='Bikers'
                titleColor={COLORS.outline}
                rightView={search ? null : <CustomHeader/>}
            />

            {search ? (
            <View style={{width: screenWidth}}>
                <Searchbar
                    mode='bar'
                    placeholder="Search by biker name, gender"
                    value={searchQuery}
                    onChangeText={(searchQuery) => {
                        setSearchQuery(searchQuery);
                        searchQ(searchQuery);
                    }}
                    right={() => (<MaterialCommunityIcons name='close' size={20} style={{paddingRight: 10}} color={COLORS.outline} onPress={() => {
                        setSearchQuery('')
                        setSearch(false);
                        // setShops(tempSearch);
                        setSearchNone(false);
                    }}/>)}
                    onClearIconPress={() => setSearch(false)}
                    style={{borderRadius: 0}}
                    inputStyle={{color: COLORS.outline}}
                    />
            </View>
            ):(
            <></>
            )}
            
            {searchNone && (
                <>
                <Text style={[STYLES.textNormal, {fontSize: 18, paddingVertical: 10}]}>No search results found :(</Text>
                </>
            )}

            <Portal>
                {/* Edit biker modal */}
                <Modal visible={visible} onDismiss={() => setVisible(!visible)} contentContainerStyle={[STYLES.modalContainer, { height: screenHeight - 300 }]}>
                    <View style={STYLES.modalInner}>
                        <Text style={STYLES.textHeading}>Edit the biker details</Text>
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
                            <MyInput
                                label='Bike number'
                                type='number'
                                value={bikeNo}
                                onChangeFunction={(bikeNo) => setBikeNo(bikeNo)}
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
                                <TouchableOpacity onPress={() => {
                                    handleProfileEdit();
                                }}>
                                    <Button mode='contained' style={{borderRadius: 0, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.button}}>
                                        Update Changes
                                    </Button>
                                </TouchableOpacity>
                            )}

                            
                        </ScrollView>
                    </View>
                </Modal>

                {/* Add biker modal */}
                <Modal visible={addBiker} onDismiss={() => setAddBiker(!addBiker)} contentContainerStyle={[STYLES.modalContainer, { height: screenHeight - 300 }]}>
                    <View style={STYLES.modalInner}>
                        <Text style={STYLES.textHeading}>Add a biker account</Text>
                        <ScrollView>
                            <View>
                                <View style={STYLES.labelWrapper}>
                                    <Text style={STYLES.inputLabel}>Add Picture</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={pickImage}
                                    style={{
                                        padding: 5,
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
                            <MyInput
                                placeholder='Bike Number'
                                label='Bike Number'
                                type='number'
                                isRequired={missingInputs}
                                errorText="Bike number is required"
                                value={bikeNo}
                                onChangeFunction={(bikeNo) => setBikeNo(bikeNo)}
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
                                    <TouchableOpacity onPress={() => {
                                        handleClick();
                                        }}>
                                        <Button mode='contained' style={{borderRadius: 0, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.button}}>
                                            Add Biker
                                        </Button>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        setAddBiker(!addBiker)
                                        }}>
                                        <Button mode='contained' style={{borderRadius: 0, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.error}}>
                                           Cancel
                                        </Button>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </Modal>

                {/* View biker modal */}
                <Modal visible={viewBiker} onDismiss={() => setViewBiker(!viewBiker)} contentContainerStyle={[STYLES.modalContainer, { height: screenHeight - 200 }]}>
                    <View style={STYLES.modalInner}>
                        <Text style={STYLES.textHeading}>Biker account details</Text>
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
                                            <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Gender</Text>
                                            <Text style={STYLES.textNormal}>{biker.gender}</Text>
                                        </View>
                                        <View style={{ paddingVertical: 5 }}>
                                            <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Phone Number</Text>
                                            <Text style={STYLES.textNormal}>{biker.usernumber}</Text>
                                        </View>
                                        <View style={{ paddingVertical: 5 }}>
                                            <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Bike Number</Text>
                                            <Text style={STYLES.textNormal}>{biker.bikeNo}</Text>
                                        </View>
                                        <View style={{ paddingVertical: 5 }}>
                                            <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Deliveries</Text>
                                            <Text style={STYLES.textNormal}>{biker.deliveries}</Text>
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
                    <Dialog.Title style={{ color: COLORS.error, fontFamily: 'DMSansRegular' }}>Delete Biker</Dialog.Title>
                    <Dialog.Content>
                        <Text style={{ color: COLORS.outline, fontFamily: 'DMSansRegular' }} variant="bodyMedium">You are about to delete a biker account, are you sure you want to proceed ?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => toggleDeleteModal()}>Cancel</Button>
                        <Button textColor={COLORS.error} onPress={() => confirmDelete(deleteKey, deleteImageName)}>Proceed</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        
            <ScrollView horizontal={true} onScroll={onScroll} showsVerticalScrollIndicator={true}>
                <FlatList
                    data={bikers}
                    key={(item, index) => index}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => (
                    <BikeCard 
                        size="large"
                        name={item.username} 
                        gender={item.gender} 
                        accType={item.accountType}
                        email={item.useremail}
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

export default Bikers

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 15,
        flexGrow: 1,
        backgroundColor: '#fff'
    },
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
        elevation: 3
    },
})