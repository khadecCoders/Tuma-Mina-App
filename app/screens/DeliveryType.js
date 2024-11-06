import { Dimensions, Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Button, Dialog, Divider, List, Modal, Portal, RadioButton, Text } from 'react-native-paper';
import myTheme from '../utils/theme';
import {
    MaterialIcons,
    MaterialCommunityIcons,
    Feather,
    Entypo,
    AntDesign
  } from "@expo/vector-icons";
import Header from '../Components/Header';
import MyInput from '../Components/MyInput';
import CustomButton from '../Components/CustomButton';
import MyTextArea from '../Components/MyTextArea';
import * as ImagePicker from 'expo-image-picker';
import CartCard from '../Components/CartCard';
import DropdownComponent from '../Components/DropdownComponent';
import { uriToBlob } from "../Components/UriToBlob";
import { ref, set, onValue, remove, update, push } from 'firebase/database'
import { ref as imgRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from '../config'
import { useLogin } from '../utils/LoginProvider';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import MapView, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { FlatList } from 'react-native';
import AddressComponent from '../Components/AddressComponent';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const DeliveryType = ({ route, navigation }) => {
  const { isLoggedIn, setIsLoggedIn, profile, setProfile, location, setLocation, setLocationData  } = useLogin();
  const { navigate } = useNavigation(); 

  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const [visible, setVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [delType, setDelType] = useState('');
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState('');
  const [modalNo, setModalNo] = useState(1);
  const [shop, setShop] = useState('');
  const [packageName, setPackageName] = useState('');
  const [addInfo, setAddInfo] = useState('');
  const [pickUpLoc, setPickupLoc] = useState('');
  const [pickUpCords, setPickUpCords] = useState({});
  const [pickUpContName, setPickUpContName] = useState('');
  const [pickUpNumber, setPickUpNumber] = useState('');
  const [pickUpRoomNo, setPickUpRoomNo] = useState('');
  const [delLoc, setdelLoc] = useState('');
  const [delCords, setDelCords] = useState({});
  const [delName, setdelName] = useState('');
  const [delBuild, setdelBuild] = useState('');
  const [delRoomNo, setdelRoomNo] = useState('');
  const [delPhone, setdelPhone] = useState('');
  const [shopAdd, setShopAdd] = useState('');
  const [addInstr, setAddInstr] = useState('');
  const [paymentMeth, setPaymentMeth] = useState('Cash upon delivery');
  const [isLoading, setIsLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [msg, setMSG] = useState("");
  const [sMsg, setSMsg] = useState("");
  const [missingInputs, setMissingInputs] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [shops, setShops] = useState([]);
  const [viewMap, setViewMap] = useState(false);
  const [viewAdds, setViewAds] = useState(false);
  const [cordType, setCordType] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [mapType, setMapType] = useState('standard');
  const [layers, setLayers] = useState("none");
  const [deliveryCat, setDeliverycat] = useState('');
  const [radioValue, setRadioValue] = useState('Cash On Delivery');
  const [proofOfDel, setProofOfDel] = useState('');
  const [disTime, setDisTime] = useState({});
  const [totPrice, setTotPrice] = useState(0);
  const [mapRegion, setMapRegion] = useState({           
        latitude: location.latitude, 
        longitude: location.longitude,
        latitudeDelta: 0.0140,
        longitudeDelta: 0.0080
    })

    const [showLoc, setShowLoc] = useState('none');
    const [myLocation, setMyLocation] = useState('');

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
  
  useEffect(() => {
    const addressRef = ref(db, 'Addresses/');
    onValue(addressRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const newAddresses = Object.keys(data)
                .map(key => ({
                    id: key,
                    ...data[key]
                }));

                const MyAddresses = newAddresses.filter((item) => item.userId === profile.userId)
                setAddresses(MyAddresses);
                setModalNo(1);
        }
    });

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

    const showSuccessToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Task successfully completed!'
        }); 
    }

    const showErrorToast = () => {
        console.log('error')
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Some required inputs are missing, please fill all the red boxes with required.'
        }); 
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
      setPackageName('Listed on the picture')
      const fileName = result.assets[0].uri.split('/').pop();
      const fileType = fileName.split('.').pop();
      // Upload the image test
    }

  };

  const removeImage = () => {
    setImage('');
  }

  const handleClick = async () => {
    if(image){
        await uploadImage(image, "image");
    }else{
        handleUpload(image)
    }
  }

  async function uploadImage (uri, fileType) {
    setIsLoading(true);

      const blob = await uriToBlob(uri);

      const storageRef = imgRef(storage, "Images/" + imageName);
      const uploadTask = uploadBytesResumable(storageRef, blob);
  
      // Listen for events
      uploadTask.on("state_changed", (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
          (error) => {
            // Handle error
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
              console.log("File available at: " + downloadUrl)
              setImageUrl(downloadUrl)
              // Save record
              handleUpload(downloadUrl)
            })
          }
        );
  }

  const handleUpload = (profilePic) => {
    setIsLoading(true);
    push(ref(db, 'Orders/'), {
        userId: profile.userId,
        customerName: profile.username,
        biker: '',
        orderDate: new Date().toISOString(),
        deliveryDate: '',
        delType: delType,
        deliveryCat: deliveryCat,
        deliveryFee: totPrice,
        packagePicture: profilePic,
        packagePicName: imageName,
        orderStatus: 'Pending',
        packageName:packageName,    
        addInfo: addInfo, 
        pickUpLoc: pickUpLoc, 
        pickUpContName: pickUpContName, 
        pickUpNumber: pickUpNumber, 
        pickUpRoomNo: pickUpRoomNo, 
        delLoc: delLoc, 
        delName: delName, 
        delBuild: delBuild, 
        delRoomNo: delRoomNo, 
        delPhone: delPhone, 
        addInstr: addInstr, 
        paymentMeth: paymentMeth,
        shop: shop,
        shopAdd: shopAdd,
        pickUpCords: pickUpCords,
        delCords: delCords,
        proofOfDel: proofOfDel,
        receiveNotes: '',
        idPicName: '',
        idPicUrl: '',


    }).then(() => {
        setIsLoading(false)
        _handleNext();
        setMissingInputs(false)

        // Clear input states
        setImage('');
        setProofOfDel('');
        setPackageName('');
        setAddInfo('');
        setPickupLoc('');
        setPickUpCords({});
        setPickUpContName('');
        setPickUpNumber('');
        setPickUpRoomNo('');
        setdelLoc('');
        setdelName('');
        setdelBuild('');
        setdelRoomNo('');
        setdelPhone('');
        setAddInstr('');
        setShop('');
        setShopAdd('');

    }).catch((error) => {
        setIsLoading(false)
        let errorMessage = error.message.replace(/[()]/g, " ");
        let errorMsg = errorMessage.replace('Firebase:', "");
        setMSG(errorMsg);
        setErrorVisible(true)
    })
    }

  const toggleDeleteModal = () => {
      setDeleteVisible(!deleteVisible)
  }

  const _handleNext = () => {
    setModalNo(modalNo + 1);
  };

  const _handlePrevious = () => {
    if(modalNo > 1){
        setModalNo(modalNo - 1);
    } else {
        // Do nothing
    }
  };

  onRegionChange = region => {
    setMapRegion(region)
    fetchLocationAddress(region);
  };

  const calculateDisTime = async (pickUp, Dest) => {
    console.log("Cords:", pickUp.latitude, Dest.latitude);
    console.log('Calculating');
    setDisTime([]);
    if(Dest && pickUp){
        const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickUp.latitude},${pickUp.longitude}&destinations=${Dest.latitude},${Dest.longitude}&key=AIzaSyCcYXQM7H4EiDTMxSY3g6aSYx7U0FPLkiI`);
        setDisTime(response.data.rows[0].elements[0]);
        console.log(disTime);
        console.log(response.data.origin_addresses[0]);
        console.log(response.data.destination_addresses[0]);
    } else{
        //No distance to calculate yet
        console.log('No distance to calculate yet')
    }
  }

  const calcTotalPrice = async () => {
    let val = await disTime.distance.value/1000;
    if(val){
        if(val <= 3 && val > 0){
            setTotPrice(2);
            console.log("Total", tot)
        } else if(val <= 5 && val > 3){
            setTotPrice(3);
        } else if(val <= 8 && val > 4){
            setTotPrice(4);
        } else if(val <= 9 && val > 5){
            setTotPrice(5);
        } else if(val <= 12 && val > 6){
            setTotPrice(6);
        } else if(val > 12){
            if(val/12 >= 1){
                let val2 = (val/12 - 1) * 0.5;
                setTotPrice(6 + val2);
            } else {
                setTotPrice(6);
            }
        } else{
            setTotPrice(6);
      }
    } else{

    }
}

  const CustomHeader = () => (
    modalNo !== 6 ? (
        <View style={{flexDirection: 'row', justifyContent: 'space-around', flex: 1}}>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {
            _handlePrevious()
            }}>
            <AntDesign color={COLORS.outline} name='left' size={18}/>
            <Text style={[STYLES.textNormal, {fontSize: 20, marginLeft: 5}]}>Previous</Text>
            </TouchableOpacity>
        </View>
    ):(
        <></>
    )
   );

  const RightView = () => (
    <View style={{flexDirection: 'row', justifyContent: 'space-around', flex: 1}}>
       <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', borderRadius: 60, }} onPress={() => {
        if(proofOfDel !== ""){
            _handleNext()
            calculateDisTime(pickUpCords, delCords);
            calcTotalPrice();

        } else{
            setMissingInputs(true);
            showErrorToast()
        }
       }}>
        <Text style={[STYLES.textNormal, {fontSize: 20, marginLeft: 5}]}>{modalNo === 4 ? "Confirm" : modalNo >= 6 ? "" : "Next"}</Text>
        {modalNo < 6 && <AntDesign color={COLORS.outline} name='right' size={18}/>}
       </TouchableOpacity>
    </View>
   );

  const RightView2 = () => (
    <View style={{flexDirection: 'row', justifyContent: 'space-around', flex: 1}}>
       {isLoading ? (
        <View style={{alignItems: "center"}}>
            <ActivityIndicator animating={true} color={COLORS.button} />
        </View>
       ):(
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', borderRadius: 60, }} onPress={() => {
            handleClick();
        }}>
            <Text style={[STYLES.textNormal, {fontSize: 20, marginLeft: 5}]}>Create</Text>
            <AntDesign color={COLORS.outline} name='right' size={18}/>
        </TouchableOpacity>
       )}
    </View>
   );

   const BackHandler = () => (
    <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', borderRadius: 60, paddingRight: 20}} onPress={() => {
            navigate('Tasks')
        }}>
            <AntDesign color={COLORS.outline} name='left' size={18}/>
        </TouchableOpacity>
        <Text style={[STYLES.textNormal, {fontSize: 20, marginLeft: 5}]}>{profile.accountType === "Admin" || profile.accountType === "Biker" ? 'Create a task' : 'Create a delivery'}</Text>
    </View>
   )

  return (
    <View style={[styles.container, {backgroundColor: COLORS.surface}]}>
        <Header 
            title='.' 
            titleColor={modalNo > 1 ? COLORS.background : COLORS.outline}
            leftView={modalNo > 1 ? <CustomHeader/> : <BackHandler />}
            rightView={modalNo === 5 ? <RightView2/> : modalNo > 2 ? <RightView/> : modalNo >= 6 ? null : null}
        />
        <Portal>
            {/* Map view modal */}
            <Modal visible={viewMap} onDismiss={() => setViewMap(!viewMap)} contentContainerStyle={[STYLES.modalContainer, {justifyContent: 'flex-start',}]}>
                <View style={{backgroundColor: COLORS.surface, overflow: 'hidden', paddingVertical: 10, width: '100%', height: screenHeight - 200}}>
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
                            setCordType('');
                            setViewMap(!viewMap);
                            setVisible(!visible);
                        }}>
                            <Button compact mode='contained' contentStyle={{width: 'auto'}} style={{borderRadius: 30, width: 'auto', paddingHorizontal: 1, backgroundColor: COLORS.error}}>Cancel</Button>
                        </TouchableOpacity>
                        <View style={{paddingHorizontal: 10, flex: 3, display: showLoc}}>
                            <Text style={[STYLES.textHeading, {textAlign: 'center', alignSelf: 'center', fontSize: 15}]}>Selected location</Text>
                            <Text style={[STYLES.textNormal, {textAlign: 'center', alignSelf: 'center'}]}>{myLocation.street +", "+myLocation.city +", "+myLocation.country}</Text>
                        </View>
                        <TouchableOpacity style={{ display: showLoc}} onPress={() => {
                            if(cordType === "Pick up"){
                                setPickupLoc(myLocation.street +", "+myLocation.city +", "+myLocation.country);
                                setShopAdd(myLocation.street +", "+myLocation.city +", "+myLocation.country);
                                setPickUpCords(mapRegion);
                            } else if(cordType === "Delivery"){
                                setdelLoc(myLocation.street +", "+myLocation.city +", "+myLocation.country);
                                setDelCords(mapRegion);
                            } else{
                                // Do nothing
                            }
                            setCordType('');
                            setViewMap(!viewMap);
                            setVisible(!visible);
                            calculateDisTime(pickUpCords, delCords);

                        }}>
                            <Button compact mode='contained' contentStyle={{width: 'auto'}} style={{borderRadius: 30, width: 'auto', paddingHorizontal: 1}}>Next</Button>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* My addresses modal */}
            <Modal visible={viewAdds} onDismiss={() => setViewAds(!viewAdds)} contentContainerStyle={[STYLES.modalContainer, {justifyContent: 'flex-start',}]}>
                <View style={{backgroundColor: COLORS.surface, overflow: 'hidden', paddingVertical: 10, width: '100%', height: screenHeight - 200, alignItems: 'center'}}>
                    <View style={{alignItems: "flex-start"}}>
                        <Text style={STYLES.textHeading}>Choose from your addresses</Text>
                    </View>
                    <ScrollView horizontal={true} style={{flex: 1, paddingVertical: 5, overflow: 'hidden'}}>
                    <FlatList
                            data={addresses}
                            key={(item, index) => index}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item, index }) => (
                            <AddressComponent
                                loc={item.delLoc}
                                houseNo={item.roomNo}
                                deleteItem={false}
                                contName={item.delName}
                                phone={item.delPhone}
                                onPressAdd={() => {
                                    fetchLocationAddress(item.delCords);
                                    
                                    if(cordType === "Pick up"){
                                        setPickupLoc(item.delLoc);
                                        setPickUpCords(item.delCords);
                                        setPickUpContName(item.delName);
                                        setPickUpNumber(item.delPhone)
                                        setPickUpRoomNo(item.roomNo);
                                    } else if(cordType === "Delivery"){
                                        setdelLoc(item.delLoc);
                                        setDelCords(item.delCords);
                                        setdelName(item.delName);
                                        setdelPhone(item.delPhone)
                                        setdelRoomNo(item.roomNo);
                                    } else{
                                        // Do nothing
                                    }

                                    setCordType('');
                                    setViewAds(!viewAdds);
                                    setVisible(!visible);
                                }}

                                onPressEdit={() => toggleModal()}
                                onPressDelete={() => toggleDeleteModal(item.id)}
                            />
                            )}
                    />
                    </ScrollView>
                </View>
            </Modal>

            <Dialog visible={deleteVisible} onDismiss={() => toggleDeleteModal()}>
                <Dialog.Title style={{color: COLORS.error, fontFamily: 'DMSansRegular'}}>Delete Address</Dialog.Title>
                <Dialog.Content>
                <Text style={{color: COLORS.outline, fontFamily: 'DMSansRegular'}} variant="bodyMedium">You are about to delete an address from your saved addresses, are you sure you want to proceed ?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                <Button onPress={() => toggleDeleteModal()}>Cancel</Button>
                <Button textColor={COLORS.error} onPress={() => toggleDeleteModal()}>Proceed</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>

        {
            modalNo === 1 ? (
            <View style={{paddingHorizontal: 10, width: '100%'}}>
                <Text style={STYLES.textHeading}>Select category</Text>
                
                    <View style={{paddingVertical: 10}}>
                        <View style={{flexDirection: 'row', marginBottom: 15, justifyContent: 'flex-start'}}>
                            <TouchableOpacity style={[STYLES.shadowCard]} onPress={() => {
                                setDeliverycat('Fast Food')
                                _handleNext();
                            }}>
                                <View style={{backgroundColor: COLORS.button, padding: 15, borderRadius: 8}}>
                                <MaterialCommunityIcons name="bike-fast" size={45} color={COLORS.background} />
                                </View>
                                <Text style={[STYLES.textNormal, {textAlign: 'center'}]}>Fast Food</Text>
                                <Text style={[STYLES.textNormal, {textAlign: 'center'}]}>Delivery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[STYLES.shadowCard, {marginHorizontal: 5}]} onPress={() => {
                                setDeliverycat('Grocery')
                                _handleNext();
                            }}>
                                <View style={{backgroundColor: COLORS.button, padding: 15, borderRadius: 8}}>
                                <MaterialCommunityIcons name="cart-arrow-down" size={45} color={COLORS.background} />
                                </View>
                                <Text style={[STYLES.textNormal, {textAlign: 'center'}]}>Grocery</Text>
                                <Text style={[STYLES.textNormal, {textAlign: 'center'}]}>Delivery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={STYLES.shadowCard} onPress={() => {
                                setDeliverycat('Package')
                                _handleNext();
                            }}>
                                <View style={{backgroundColor: COLORS.button, padding: 15, borderRadius: 8}}>
                                <MaterialCommunityIcons name="cart-arrow-down" size={45} color={COLORS.background} />
                                </View>
                                <Text style={[STYLES.textNormal, {textAlign: 'center'}]}>Package</Text>
                                <Text style={[STYLES.textNormal, {textAlign: 'center'}]}>Delivery</Text>
                            </TouchableOpacity>
                        </View>
                </View>
            </View>
            ) : modalNo === 2 ? (
                <View style={{paddingHorizontal: 10, width: '100%'}}>
                    <Text style={STYLES.textHeading}>Type of delivery ?</Text>
                    
                        <View style={{width:'90%', paddingVertical: 10}}>
                        <View style={{flexDirection: 'row', marginBottom: 15}}>
                        <TouchableOpacity style={[STYLES.shadowCard, {marginRight: 8}]} onPress={() => {
                            setDelType("Pick and drop");
                            _handleNext();
                        }}>
                            <View style={{backgroundColor: COLORS.button, padding: 15, borderRadius: 8}}>
                            <MaterialCommunityIcons name="bike-fast" size={45} color={COLORS.background} />
                            </View>
                            <Text style={[STYLES.textNormal, {textAlign: 'center'}]}>Pick And</Text>
                            <Text style={[STYLES.textNormal, {textAlign: 'center'}]}>Drop</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={STYLES.shadowCard} onPress={() => {
                            setDelType("Buy and deliver");
                            _handleNext();
                        }}>
                            <View style={{backgroundColor: COLORS.button, padding: 15, borderRadius: 8}}>
                            <MaterialCommunityIcons name="cart-arrow-down" size={45} color={COLORS.background} />
                            </View>
                            <Text style={[STYLES.textNormal, {textAlign: 'center'}]}>Buy And</Text>
                            <Text style={[STYLES.textNormal, {textAlign: 'center'}]}>Deliver</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : modalNo === 3 ? (
                <View style={{paddingBottom: 95}}>
                    <ScrollView>
                        <View style={{backgroundColor: COLORS.onSurfaceVariant, width: '100%', paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10}}>
                            <Text style={{color: COLORS.background}}>Add Details</Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <MyTextArea 
                                label='Item(s)'
                                value={packageName}
                                onChangeFunction={(packageName) => setPackageName(packageName)}
                                placeholder="Write a list of your items here ...."
                            />

                            <View style={{ width: screenWidth, paddingHorizontal: 20, paddingBottom: 10}}>
                                <View style={STYLES.labelWrapper}>
                                    <Text style={STYLES.inputLabel}>Or Add Image</Text>
                                </View>
                                <TouchableOpacity onPress={pickImage} style={{padding: 5, backgroundColor: 'transparent', marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Text style={{color: COLORS.button}}>Add image of the list</Text>
                                    <MaterialIcons name="touch-app" size={25} color={COLORS.button} />
                                </TouchableOpacity>
                                {image && 
                                    <View style={{flexDirection: 'row'}}>
                                    <Image source={{ uri: image }} style={{ width: 50, height: 50, marginRight: 20 }} />
                                    <View style={{justifyContent: 'center'}}>
                                        {/* <Text numberOfLines={3}>{fileName}</Text> */}
                                        <TouchableOpacity onPress={removeImage} style={{padding: 5, backgroundColor: COLORS.outline, width:80}} >
                                        <Text style={{color: '#fff'}}>Remove Image</Text>
                                        </TouchableOpacity>
                                    </View>
                                    </View>
                                    }
                            </View>

                            {delType === "Pick and drop" ? (
                                <>
                                    <View style={{backgroundColor: COLORS.onSurfaceVariant, width: '100%', paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10}}>
                                        <Text style={{color: COLORS.background}}>Add Pick Up Location</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                                    <Button icon={() => <MaterialIcons name="touch-app" size={20} color={COLORS.button} />} contentStyle={{flexDirection: 'row-reverse'}} mode="text" style={{borderRadius: 0, marginVertical: 5, backgroundColor: 'transparent',  alignItems: 'flex-start',}} onPress={() => {
                                            setCordType("Pick up");
                                            setPickUpCords({})
                                            setViewMap(!viewMap);
                                            setVisible(!visible);
                                        }}>
                                        Open Map
                                    </Button>
                                    <Text style={{fontSize: 15, color: COLORS.outline}}>Or use</Text>
                                    <Button icon={() => <MaterialIcons name="touch-app" size={20} color={COLORS.button} />} contentStyle={{flexDirection: 'row-reverse'}} mode="text" style={{borderRadius: 0, marginVertical: 5, backgroundColor: 'transparent', alignItems: 'flex-start',}} onPress={() => {
                                        setCordType("Pick up");
                                        setPickUpCords({})
                                            setViewAds(!viewAdds);
                                            setVisible(!visible);
                                        }}>
                                        My Addresses
                                    </Button>
                                    </View>
                                    <Divider />
                                    <MyTextArea
                                        placeholder='Pick up Address'
                                        label='Pick up Address'
                                        disabled = {true}
                                        type='add'
                                        value={pickUpLoc}
                                        onChangeFunction={(pickUpLoc) => {
                                            setPickupLoc(pickUpLoc)
                                        }}
                                    />
                                    <MyInput
                                        placeholder='Apartment/House/Room Number'
                                        label='Apartment/House/Room Number'
                                        type='add'
                                        value={pickUpRoomNo}
                                        onChangeFunction={(pickUpRoomNo) => setPickUpRoomNo(pickUpRoomNo)}
                                    />
                                </>
                            ):(
                                <>
                                    <View style={{backgroundColor: COLORS.onSurfaceVariant, width: '100%', paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10}}>
                                        <Text style={{color: COLORS.background}}>Shop/Restaurant Details</Text>
                                    </View>
                                    <DropdownComponent 
                                    value={shop} label='Shop/Restaurant name' onChangeFunction={(shop) => {
                                        setShop(shop);
                                        const temp = shops.filter((item) => {
                                            if(item.shopName == shop){
                                                // console.log('found: ', item.shopName)
                                                return item
                                            } else {
                                                return ''
                                            }
                                        })

                                        setShopAdd(temp[0].shopAddress)
                                        
                                    }}
                                    clearVal = {() => setShop('')} 
                                    data={shops.map((item) => {
                                        return { label: item.shopName, value: item.shopName }
                                    })}/>

                                    <Text style={[STYLES.textNormal, {paddingTop: 5}]}>Shop not on the list ? Add the name & address below.</Text>

                                    <MyInput
                                        label='Shop Name'
                                        value={shop}
                                        onChangeFunction={(shop) => setShop(shop)}
                                        placeholder="Shop name"
                                    />
                                    
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                                        <Button icon={() => <MaterialIcons name="touch-app" size={20} color={COLORS.button} />} contentStyle={{flexDirection: 'row-reverse'}} mode="text" style={{borderRadius: 0, marginVertical: 5, backgroundColor: 'transparent',  alignItems: 'flex-start',}} onPress={() => {
                                                setCordType("Pick up");
                                                setViewMap(!viewMap);
                                                setVisible(!visible);
                                            }}>
                                            Open Map
                                        </Button>
                                    </View>
                                    <MyTextArea
                                        placeholder='Shop address here'
                                        disabled={true}
                                        label='Shop Address'
                                        type='add'
                                        value={shopAdd}
                                        onChangeFunction={(shopAdd) => {
                                            setShopAdd(shopAdd);
                                            calculateDisTime(pickUpCords, delCords);
                                        }}
                                    />
                                </>
                            )}

                            <View style={{backgroundColor: COLORS.onSurfaceVariant, width: '100%', paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10}}>
                                <Text style={{color: COLORS.background}}>Add Destination Location</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                            <Button icon={() => <MaterialIcons name="touch-app" size={20} color={COLORS.button} />} contentStyle={{flexDirection: 'row-reverse'}} mode="text" style={{borderRadius: 0, marginVertical: 5, backgroundColor: 'transparent',  alignItems: 'flex-start',}} onPress={() => {
                                    setCordType("Delivery");
                                    setDelCords({})
                                    setViewMap(!viewMap);
                                    setVisible(!visible);
                                }}>
                                Open Map
                            </Button>
                            <Text style={{fontSize: 15, color: COLORS.outline}}>Or use</Text>
                            <Button icon={() => <MaterialIcons name="touch-app" size={20} color={COLORS.button} />} contentStyle={{flexDirection: 'row-reverse'}} mode="text" style={{borderRadius: 0, marginVertical: 5, backgroundColor: 'transparent', alignItems: 'flex-start',}} onPress={() => {
                                setCordType("Delivery");
                                setDelCords({})
                                    setViewAds(!viewAdds);
                                    setVisible(!visible);
                                }}>
                                My Addresses
                            </Button>
                            </View>
                            <Divider />
                            <MyTextArea
                                placeholder='Delivery Address'
                                label='Delivery Address'
                                disabled = {true}
                                type='add'
                                value={delLoc}
                                onChangeFunction={(delLoc) => {
                                    setdelLoc(delLoc)
                                    calculateDisTime(pickUpCords, delCords);
                                }}
                            />
                            <MyInput
                                placeholder='Apartment/House/Room Number'
                                label='Apartment/House/Room Number'
                                type='add'
                                value={delRoomNo}
                                onChangeFunction={(delRoomNo) => setdelRoomNo(delRoomNo)}
                            />

                            <View style={{backgroundColor: COLORS.onSurfaceVariant, width: '100%', paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10}}>
                                <Text style={{color: COLORS.background}}>Add Destination Contatcs</Text>
                            </View>
                            <MyInput
                                placeholder='Recipient Name'
                                label='Recipient Name'
                                type='add'
                                value={delName}
                                onChangeFunction={(delName) => setdelName(delName)}
                            />
                            
                            <MyInput 
                                placeholder='Recipient Phone'
                                label='Delivery contact phone' 
                                type='number'
                                value={delPhone}
                                onChangeFunction={(delPhone) => setdelPhone(delPhone)}
                            />
                            <MyTextArea 
                                label='Additional instructions'
                                value={addInstr}
                                onChangeFunction={(addInstr) => setAddInstr(addInstr)}
                            />

                             <View style={{backgroundColor: COLORS.onSurfaceVariant, width: '100%', paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10}}>
                                <Text style={{color: COLORS.background}}>Options</Text>
                            </View>
                            <DropdownComponent
                                isRequired={missingInputs}
                                errorText="Proof of delivery is required"
                                clearVal={() => setProofOfDel('')}
                                value={proofOfDel} label='Proof Of Delivery' onChangeFunction={(proofOfDel) => { setProofOfDel(proofOfDel)}}
                                data={[
                                    { label: 'QR Code & ID Photo', value: 'QRCode & Photo' },
                            ]} />
                        </View>
                    </ScrollView>
                </View>
            ) : modalNo === 4 ? (
                <View style={{paddingHorizontal: 10}}>
                    <Text style={STYLES.textHeading}>Confirm details</Text>
                    <Text numberOfLines={5} style={[STYLES.textNormal, {paddingVertical: 10}]}>Buy the following from {shop} and deliver them to {delName +" at "+ delRoomNo}, {delLoc}?</Text>
                    <ScrollView>
                    <MyTextArea 
                        label='Package(s) Name(s)'
                        value={packageName}
                        onChangeFunction={(packageName) => setPackageName(packageName)}
                        placeholder="Write a list of your packages here ...."
                    />                     
                    </ScrollView>
                </View>
            ) : modalNo === 5 ? (
                <View style={{paddingHorizontal: 20}}>
                    <Text style={STYLES.textHeading}>Choose a payment method</Text>
                        <ScrollView>
                            <List.Section>
                                <RadioButton.Group
                                    value={radioValue}
                                    onValueChange={(radioValue) => {
                                        setRadioValue(radioValue)
                                    }}
                                >
                                <TouchableOpacity style={{flexDirection: 'row',paddingVertical: 5, borderRadius: 5, marginVertical: 5, width: '100%', backgroundColor: COLORS.background}}>
                                    <View style={{backgroundColor: COLORS.button, padding: 8, borderRadius: 8}}>
                                        <MaterialCommunityIcons name="cash-marker" size={35} color={COLORS.onBackground} />
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignItems: 'center'}}>
                                        <View  style={{paddingHorizontal: 10}}>
                                            <Text  ellipsizeMode='tail' style={[STYLES.textNormal,]}>Cash Upon Delivery</Text>
                                            <Text style={[STYLES.textNormal, {fontFamily: 'DMSansBold'}]}>USD$ {totPrice.toFixed(2)}</Text>
                                        </View>
                                        <RadioButton value='Cash On Delivery'/>
                                    </View>
                                </TouchableOpacity>
                                
                                <TouchableOpacity style={{flexDirection: 'row',paddingVertical: 5, borderRadius: 5, marginVertical: 5, width: '100%', backgroundColor: COLORS.background}}>
                                    <View style={{backgroundColor: COLORS.button, padding: 8, borderRadius: 8}}>
                                        <MaterialIcons name="paypal" size={35} color={COLORS.onBackground} />
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignItems: 'center'}}>
                                        <View  style={{paddingHorizontal: 10}}>
                                            <Text  ellipsizeMode='tail' style={[STYLES.textNormal]}>Paynow</Text>
                                            <Text style={[STYLES.textNormal, {fontFamily: 'DMSansBold'}]}>USD$ {totPrice.toFixed(2)}</Text>
                                        </View>
                                        <RadioButton value='PayNow'/>
                                    </View>
                                </TouchableOpacity>
                                </RadioButton.Group>
                            </List.Section>    
                            {radioValue === "PayNow" && (
                                <View>
                                    <Text style={STYLES.textNormal}>If you choose Pay Now method, you'll be redirected to an online payment portal, your delivery order won't be placed untill you complete the online payment.</Text>
                                </View>
                            )}   
                        </ScrollView>
                </View>
            ) : (
            <View style={{alignItems: 'center', justifyContent: 'center',height: '80%'}}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <View style={[{backgroundColor:'#2ac780', borderRadius:100}]}> 
                        <MaterialCommunityIcons name="check" size={200} color={COLORS.background} style={{borderRadius: 100}}/>
                    </View>      
                    <Text style={[STYLES.textHeading, {fontSize: 45, color: COLORS.outline}]}>Success!</Text>
                    <Text style={[STYLES.textNormal, {textAlign: 'center', marginBottom: 20}]}>Your {deliveryCat} order has been placed successfully, deliveries take 30+ minutes depending on location, keep tracking your order status.</Text>
                </View>               
            </View>
            )
        }
      <Toast />

    </View>
  )
}

export default DeliveryType

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 15,
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
      shadow: {
        shadow: {
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
          elevation: 5,
        }
      }
})