import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    StyleProp,
    ViewStyle,
    Animated,
    Platform,
    SafeAreaView,
    I18nManager,
    Image,
    FlatList,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, AnimatedFAB, Button, Card, Dialog, Divider, Menu, Modal, Portal, SegmentedButtons, Snackbar, Text } from 'react-native-paper';
import myTheme from '../utils/theme';
import { useLogin } from '../utils/LoginProvider';
import StoreCard from '../Components/StoreCard';
import {
    MaterialIcons,
    AntDesign
} from "@expo/vector-icons";
import Header from '../Components/Header';
import AddressComponent from '../Components/AddressComponent';
import MyInput from '../Components/MyInput';
import CustomButton from '../Components/CustomButton';
import ImageInput from '../Components/ImageInput';
import MyTextArea from '../Components/MyTextArea';
import { uriToBlob } from "../Components/UriToBlob";
import * as ImagePicker from 'expo-image-picker';
import { ref, set, onValue, remove, update, push } from 'firebase/database'
import { ref as imgRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from '../config'

const StoresRestaurants = ({ navigation, animateFrom, }) => {
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
    const { isLoggedIn, setIsLoggedIn, profile, setProfile } = useLogin();
    const [visible, setVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [isExtended, setIsExtended] = useState(true);
    const [fabVisible, setFabVisible] = useState(true);
    const [addStore, setAddStore] = useState(false);
    const [shopName, setShopName] = useState('');
    const [shopAddress, setShopAddress] = useState('');
    const [shopCategory, setShopCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [msg, setMSG] = useState("");
    const [sMsg, setSMsg] = useState("");
    const [missingInputs, setMissingInputs] = useState(false);
    const [image, setImage] = useState("");
    const [imageName, setImageName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [deleteKey, setDeleteKey] = useState('')
    const [deleteImageName, setDeleteImageName] = useState('')
  
    const [shops, setShops] = useState({});

    const isIOS = Platform.OS === 'ios';

    useEffect(() => {
        const shopsRef = ref(db, 'Shops/');
        onValue(shopsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const newShops = Object.keys(data)
                    .map(key => ({
                        id: key,
                        ...data[key]
                    }));

                setShops(newShops);
            }
        });
    }, [])

    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setIsExtended(currentScrollPosition <= 0);
    };

    const fabStyle = { [animateFrom]: 16 };

    const toggleModal = () => {
        setVisible(!visible)
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
            handleAddShop(image);
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
                    handleAddShop(downloadUrl);
                });
            }
        );
    }

    const handleAddShop = (profilePic) => {
        if (shopName !== '' && shopAddress !== '') {
            setIsLoading(true);
            push(ref(db, 'Shops/'), {
                shopName: shopName,
                shopCategory: shopCategory,
                shopAddress: shopAddress,
                shopPicture: profilePic,
                shopPicName: imageName

            }).then(() => {
                setIsLoading(false)
                setSMsg(`A shop has been added to your list of shops/restaurants!`);
                setSuccessVisible(true)
                setMissingInputs(false)

                // Clear input states
                setShopAddress('');
                setShopCategory('');
                setShopName('');
                setImage('');
                setAddStore(!addStore)

            }).catch((error) => {
                setIsLoading(false)
                let errorMessage = error.message.replace(/[()]/g, " ");
                let errorMsg = errorMessage.replace('Firebase:', "");
                setMSG(errorMsg);
                setErrorVisible(true)
            })
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
        remove(ref(db,"Shops/" + index))
        .then(()=>{
          setSMsg("Address deleted successfully deleted")
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
    alert(index)
    remove(ref(db,"Shops/" + index))
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
                {/* Edit store modal */}
                <Modal visible={visible} onDismiss={() => setVisible(!visible)} contentContainerStyle={[STYLES.modalContainer, { height: screenHeight - 300 }]}>
                    <View style={STYLES.modalInner}>
                        <Text style={STYLES.textHeading}>Edit the store</Text>
                        <ScrollView>
                            <MyInput label='Name' type='add' />
                            <MyTextArea
                                label='Address/Location'
                                type='add'
                                value={shopAddress}
                                onChangeFunction={(shopAddress) => setShopAddress(shopAddress)}
                            />
                            <MyInput label='Category' type='add' />

                            <CustomButton text='Update Changes' onPress={() => {
                                alert('Successfully')
                                // toggleModal()
                            }} />
                        </ScrollView>
                    </View>
                </Modal>

                {/* Add store modal */}
                <Modal visible={addStore} onDismiss={() => setAddStore(!addStore)} contentContainerStyle={[STYLES.modalContainer, { height: screenHeight - 300 }]}>
                    <View style={STYLES.modalInner}>
                        <Text style={STYLES.textHeading}>Add your shop/restaurant</Text>
                        <ScrollView>
                            <View>
                                <View style={STYLES.labelWrapper}>
                                    <Text style={STYLES.inputLabel}>Shop/Restaurant Image</Text>
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
                                        Add your shop/Restaurant image
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
                                label='Store name'
                                type='add'
                                placeholder='Store name'
                                value={shopName}
                                onChangeFunction={(shopName) => setShopName(shopName)}
                            />
                            <MyInput
                                label='Category'
                                type='add'
                                placeholder='i.e Fast food, Grocery, Hardware, etc ...'
                                value={shopCategory}
                                onChangeFunction={(shopCategory) => setShopCategory(shopCategory)}
                            />
                            <MyTextArea
                                label='Address/Location'
                                type='add'
                                placeholder='Address of the store/restaurant'
                                value={shopAddress}
                                onChangeFunction={(shopAddress) => setShopAddress(shopAddress)}
                            />
                            {isLoading ? (
                                <Button mode="contained" style={{ borderRadius: 0, width: screenWidth - 50, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.background }}>
                                    <ActivityIndicator animating={true} color={COLORS.button} />
                                </Button>
                            ) : (
                                <>
                                    <CustomButton text='Add Shop' onPress={() => {
                                        // alert('Successfully')
                                        handleClick()
                                    }} />

                                </>
                            )}

                        </ScrollView>
                    </View>
                </Modal>

                <Dialog visible={deleteVisible} onDismiss={() => setDeleteVisible(!deleteVisible)}>
                    <Dialog.Title style={{ color: COLORS.error, fontFamily: 'DMSansRegular' }}>Delete Shop</Dialog.Title>
                    <Dialog.Content>
                        <Text style={{ color: COLORS.outline, fontFamily: 'DMSansRegular' }} variant="bodyMedium">You are about to delete a shop from your saved shops, are you sure you want to proceed ?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        {isLoading ? (
                            <ActivityIndicator animating={true} color={COLORS.button} />
                        ):(
                            <>
                                <Button onPress={() => setDeleteVisible(!deleteVisible)}>Cancel</Button>
                                <Button textColor={COLORS.error} onPress={() => confirmDelete(deleteKey, deleteImageName)}>Proceed</Button>
                            </>
                        )}
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Header title='Shops' backPress={() => navigation.goBack()} menuPress={() => navigation.toggleDrawer()} />

            <ScrollView horizontal={true} onScroll={onScroll} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={true} style={{ flex: 1, height: screenHeight - 580,  borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                <FlatList
                    data={shops}
                    key={(item, index) => index}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => (
                    <StoreCard
                        name={item.shopName}
                        category={item.shopCategory}
                        addr={item.shopAddress}
                        image={item.shopPicture ? ({ uri: item.shopPicture }) : (require('../assets/Cin.jpg'))}
                        onPress={() => toggleModal()}
                        onPressDelete={() => toggleDeleteModal(item.id, item.shopPicName)}
                    />
                    )}
                />

            </ScrollView>

            {profile.accountType === "Admin" ? (
                <AnimatedFAB
                    icon={'plus'}
                    label={'Add New Shop'}
                    extended={isExtended}
                    onPress={() => setAddStore(!addStore)}
                    visible={fabVisible}
                    animateFrom='right'
                    iconMode={'static'}
                    style={[styles.fabStyle, fabStyle, { backgroundColor: COLORS.button }]}
                    color={COLORS.background}
                />
            ):(
                <></>
            )}
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

export default StoresRestaurants

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
    },
})