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
import { ActivityIndicator, AnimatedFAB, Button, Card, Dialog, Divider, Menu, Modal, Portal, Searchbar, SegmentedButtons, Snackbar, Surface, Text } from 'react-native-paper';
import myTheme from '../utils/theme';
import { useLogin } from '../utils/LoginProvider';
import StoreCard from '../Components/StoreCard';
import {
    MaterialIcons,
    AntDesign,
    MaterialCommunityIcons,
    Feather
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
import MapView, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const StoresRestaurants = ({ navigation, animateFrom, }) => {
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
    const { isLoggedIn, setIsLoggedIn, profile, setProfile, location } = useLogin();
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
    const [pickUpLoc, setPickupLoc] = useState('');
    const [pickUpCords, setPickUpCords] = useState({});
    const [sMsg, setSMsg] = useState("");
    const [missingInputs, setMissingInputs] = useState(false);
    const [image, setImage] = useState("");
    const [imageName, setImageName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [deleteKey, setDeleteKey] = useState('')
    const [deleteImageName, setDeleteImageName] = useState('')
    const [viewCamera, setViewCamera] = useState(false);
    const [shops, setShops] = useState({});
    const [search, setSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchNone, setSearchNone] = useState(false);
    const [tempSearch, setTempSearch] = useState([]);
    const [viewMap, setViewMap] = useState(false);
    const [shopNumber, setShopNumber] = useState('');
    const [mapType, setMapType] = useState('standard');
    const [layers, setLayers] = useState("none");
    const [mapRegion, setMapRegion] = useState({           
          latitude: location.latitude, 
          longitude: location.longitude,
          latitudeDelta: 0.0140,
          longitudeDelta: 0.0080
      })
    const [showLoc, setShowLoc] = useState('none');
    const [myLocation, setMyLocation] = useState('');

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

                // All shops
                setShops(newShops);

                // All unfiltered orders
                setTempSearch(newShops);
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
        if (shopName !== '' && shopAddress !== '') {
        setIsLoading(true);
        if (image) {
            await uploadImage(image, "image");
        } else {
            handleAddShop(image);
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
                    handleAddShop(downloadUrl);
                });
            }
        );
    }

    const handleAddShop = (profilePic) => {
            push(ref(db, 'Shops/'), {
                shopName: shopName,
                shopCategory: shopCategory,
                shopAddress: shopAddress,
                shopPicture: profilePic,
                shopPicName: imageName,
                shopCords: pickUpCords,
                buildingNumber: shopNumber

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
                setShopNumber('');
                setAddStore(!addStore)

            }).catch((error) => {
                setIsLoading(false)
                let errorMessage = error.message.replace(/[()]/g, " ");
                let errorMsg = errorMessage.replace('Firebase:', "");
                setMSG(errorMsg);
                setErrorVisible(true)
            })
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

  const CustomHeader = () => (
    <View style={{flexDirection: 'row', justifyContent: 'space-around', flex: 1}}>
        {profile.accountType === "Admin" || profile.accountType === "Biker" ? (
           <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
            setAddStore(true)
          }}>
            <MaterialCommunityIcons color={COLORS.outline} name='plus' size={15}/>
          </TouchableOpacity>
       ): (
         <></>
       )}
     
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
          let temp = shops.filter((item) => String(item.shopAddress).includes(sQuery) || String(item.shopName).includes(sQuery) || String(item.shopCategory).includes(sQuery) || String(item.shop).includes(sQuery))
          setShops(temp);
          if(temp.length === 0){
            setSearchNone(true);
          } else{
            setSearchNone(false);
          }
        } else {
          setSearchNone(false);
          setShops(tempSearch);
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
                title='Shops' 
                titleColor={COLORS.outline}
                rightView={search ? null : <CustomHeader/>}
            />

            {search ? (
            <View style={{width: screenWidth}}>
                <Searchbar
                    mode='bar'
                    placeholder="Search by shop name, shop address, category"
                    value={searchQuery}
                    onChangeText={(searchQuery) => {
                        setSearchQuery(searchQuery);
                        searchQ(searchQuery);
                    }}
                    right={() => (<MaterialCommunityIcons name='close' size={20} style={{paddingRight: 10}} color={COLORS.outline} onPress={() => {
                        setSearchQuery('')
                        setSearch(false);
                        setShops(tempSearch);
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
                {/* Map view modal */}
                <Modal visible={viewMap} onDismiss={() => setViewMap(!viewMap)} contentContainerStyle={[STYLES.modalContainer, {justifyContent: 'flex-start',}]}>
                    <View style={{backgroundColor: '#fff', overflow: 'hidden', paddingVertical: 10, width: '100%', height: screenHeight - 200}}>
                        <View style={{alignItems: "flex-start"}}>
                            <Text style={[STYLES.textNormal, {textAlign: 'left', alignSelf: 'flex-start', paddingBottom: 10}]}>Move your map to the center of the marker, then press <Text style={[STYLES.textNormal, { fontFamily: "DMSansItalic", textAlign: 'left', alignSelf: 'flex-start', paddingBottom: 10}]}>"Choose location"</Text>.</Text>
                        </View>
                        <MapView
                            style={styles.map}
                            provider={Platform.OS == "android" ? PROVIDER_GOOGLE : undefined}
                            showsBuildings
                            showsCompass
                            showsMyLocationButt
                            showsUserLocation={true}
                            initialRegion={mapRegion}
                            followsUserLocation
                            mapType= {mapType}
                            onRegionChangeComplete={this.onRegionChange}
                        />

                        <View style={styles.markerFixed}>
                            <Image style={styles.marker} source={require("../assets/marker.png")} />
                        </View>
                        
                        <View style={{position: 'absolute', top: 70, right: 20}}>
                            <TouchableOpacity style={{backgroundColor: COLORS.background, padding: 5, alignItems: 'center', borderRadius: 5, marginBottom: 10}} onPress={() => {
                                if(layers === "none"){
                                    setLayers("flex")
                                }else{
                                    setLayers("none")
                                }
                            }}>
                                <Feather name="layers" size={25} color={COLORS.button} />
                                <Text style={{fontSize: 10}}>Layers</Text>
                            </TouchableOpacity>
                            <View style={{display: layers}}>
                                <TouchableOpacity style={{borderColor: COLORS.outline, borderWidth: 2,alignItems: 'center', marginBottom: 10}} onPress={() => {
                                    setMapType("hybrid")
                                    setLayers("none")
                                }}>
                                    <Image style={{width: 50, height: 40}} source={require("../assets/satellite.png")} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{borderColor: COLORS.outline, borderWidth: 2,alignItems: 'center', marginBottom: 10}} onPress={() => {
                                    setMapType("standard")
                                    setLayers("none")
                                }}>
                                    <Image style={{width: 50, height: 40}} source={require("../assets/standard.png")} />
                                </TouchableOpacity>

                            </View>
                        </View>

                        <View style={{position: 'absolute', bottom: 0, flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: COLORS.background}}>
                            <TouchableOpacity onPress={() => {
                                setViewMap(!viewMap);
                            }}>
                                <Button compact mode='contained' contentStyle={{width: 'auto'}} style={{borderRadius: 30, width: 'auto', paddingHorizontal: 1, backgroundColor: COLORS.error}}>Cancel</Button>
                            </TouchableOpacity>
                            <View style={{paddingHorizontal: 10, flex: 3, display: showLoc}}>
                                <Text style={[STYLES.textHeading, {textAlign: 'center', alignSelf: 'center', fontSize: 15}]}>Selected location</Text>
                                <Text style={[STYLES.textNormal, {textAlign: 'center', alignSelf: 'center'}]}>{myLocation.street +", "+myLocation.city +", "+myLocation.country}</Text>
                            </View>
                            <TouchableOpacity style={{ display: showLoc}} onPress={() => {
                                setShopAddress(myLocation.street +", "+myLocation.city +", "+myLocation.country);
                                setPickUpCords(mapRegion);
                                setViewMap(!viewMap);
                                setAddStore(!addStore)
                            }}>
                                <Button compact mode='contained' contentStyle={{width: 'auto'}} style={{borderRadius: 30, width: 'auto', paddingHorizontal: 1}}>Next</Button>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                
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
                <Modal visible={addStore} onDismiss={() => setAddStore(!addStore)} contentContainerStyle={{
                        height: screenHeight - 300,
                        padding: 10,
                        backgroundColor: COLORS.surface,
                        marginHorizontal: 10, 
                        marginVertical: 20,
                        borderRadius: 15,

                    }}>
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
                                onPress={() => {
                                    setViewMap(!viewMap);
                                    setAddStore(!addStore)
                                }}
                                label='Address/Location'
                                type='add'
                                placeholder='Address of the store/restaurant'
                                value={shopAddress}
                                onChangeFunction={(shopAddress) => setShopAddress(shopAddress)}
                            />
                             <MyInput
                                label='Shop/Building Number'
                                type='add'
                                placeholder='Shop or building number'
                                value={shopNumber}
                                onChangeFunction={(shopNumber) => setShopNumber(shopNumber)}
                            />

                        </ScrollView>
                        <View style={{paddingVertical:10, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20,  flexDirection: 'row', alignItems: 'center'}} onPress={() => {
                            setAddStore(!addStore)
                            setShopAddress('');
                            setShopCategory('');
                            setShopName('');
                            setImage('');
                            setShopNumber('');
                        }}>
                            <AntDesign color={COLORS.outline} name='left' size={18}/>
                            <Text style={[STYLES.textNormal, {paddingHorizontal: 5}]}>Cancel</Text>
                        </TouchableOpacity>
                            {isLoading ? (
                                <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, }} onPress={() => {
                                }}>
                                    <View style={{alignItems: "center"}}>
                                        <ActivityIndicator animating={true} color={COLORS.button} />
                                    </View>
                                </TouchableOpacity>
                            ):(
                                <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, flexDirection: 'row', alignItems: 'center'}} onPress={() => {
                                    handleClick();
                                }}>
                                <Text style={[STYLES.textNormal, {paddingHorizontal: 5}]}>Save</Text>
                                <MaterialIcons color={COLORS.outline} name='save' size={20}/>
                            </TouchableOpacity>
                            )}
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
    map: {
        flex: 1,
        borderRadius: 15
    },
    markerFixed: {
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        position: 'absolute',
        top: '50%'
      },
      marker: {
        height: 48,
        width: 48
      },
})