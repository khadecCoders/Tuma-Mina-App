import { FlatList, Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { ActivityIndicator, Button, Card, Dialog, Portal, Searchbar, SegmentedButtons, Modal, Snackbar, Text, Divider, Surface } from 'react-native-paper';
import myTheme from '../utils/theme';
import { useLogin } from '../utils/LoginProvider';
import {
    MaterialIcons,
    AntDesign,
    MaterialCommunityIcons
  } from "@expo/vector-icons";
import Header from '../Components/Header';
import OrderCard from '../Components/OrderCard';
import CustomButton from '../Components/CustomButton';
import MyInput from '../Components/MyInput';
import BikeCard from '../Components/BikeCard';
import { ref, set, onValue, remove, update, push } from 'firebase/database'
import { ref as imgRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from '../config'
import { useNavigation } from '@react-navigation/native';
import { BottomModal, ModalFooter, ModalTitle, SlideAnimation, ModalContent, FadeAnimation } from 'react-native-modals';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { Linking } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import QRCode from 'react-native-qrcode-svg';
import MyTextArea from '../Components/MyTextArea';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { uriToBlob } from "../Components/UriToBlob";

const Orders = ({ navigation }) => {
    const refRBSheet = useRef();
    const cameraRef = useRef(null)
    const { navigate } = useNavigation(); 
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
    const { profile, location } = useLogin();
    const [segValue, setSegValue] = useState('Pending');
    const [visible, setVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [orders, setOrders] = useState([]);
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [msg, setMSG] = useState("");
    const [sMsg, setSMsg] = useState("");
    const [deleteKey, setDeleteKey] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [deleteImageName, setDeleteImageName] = useState('')
    const [viewOrder, setViewOrder] = useState(false);
    const [order, setOrder] = useState(null);
    const [bikers, setBikers] = useState([]);
    const [dispatchId, setDispatchId] = useState('');
    const [orderId, setOrderId] = useState('');
    const [bikerId, setBikerId] = useState('');
    const [bikerOrders, setBikerOrders] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [deliveries, setDeliveries] = useState('');
    const [search, setSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchNone, setSearchNone] = useState(false);
    const [tempSearch, setTempSearch] = useState([]);
    const [tempBikerOrders, setTempBikerOrders] = useState([]);
    const [tempUserOrders, setTempUserOrders] = useState([]);
    const [viewCamera, setViewCamera] = useState(false);
    const [optionsModal, setOptionModal] = useState(false)
    const [optionsCnt, setOptionsCnt] = useState(1);
    const [recName, setRecName] = useState('')
    const [notes, setNotes] = useState('');
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scanVisible, setScanVisible] = useState(false);
    const [qrVal, setQrVal] = useState('');
    const [image, setImage] = useState("");
    const [imageName, setImageName] = useState("");
    const [showError, setShowError] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [missingInputs, setMissingInputs] = useState(false);
    const [startCamera,setStartCamera] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [flashMode, setFlashMode] = useState('off');

  useEffect(() => {
      const ordersRef = ref(db, 'Orders/');
      onValue(ordersRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
              const newOrders = Object.keys(data)
                  .map(key => ({
                      id: key,
                      ...data[key]
              }));
              
              const myOrders = newOrders.filter((item) => item.biker === profile.username);
              const myUserOrders = newOrders.filter((item) => item.userId === profile.userId);

              // All orders
              setOrders(newOrders);

              // Orders for the signed in user 
              setUserOrders(myUserOrders);

              // Orders assigned to current biker account
              setBikerOrders(myOrders);

              // All unfiltered orders
              setTempSearch(newOrders);

              // Biker unfiltered temp orders
              setTempBikerOrders(myOrders);

              // User unfiltered temp orders
              setTempUserOrders(myUserOrders);
          }

      const accRef = ref(db, `users/${profile.userId}`);
      onValue(accRef, (snapshot) => {
        const userAcc = snapshot.val();
        setDeliveries(userAcc.deliveries)
      })
      
      });
  }, [])

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const takePicture = async () => {
    const options = {
      quality: 1,
      base64: true,
      exif: false,
    };
  
    const photo = await cameraRef.current.takePictureAsync(options);
    setImage(photo.uri);
    setPreviewVisible(true);
  };
  
  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setScanVisible(false);
    if(data === order.id){
      setQrVal(data);

    } else {
      setShowError(true);
    }

    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
  
  const handleQRScanned = ({ type, data }) => {
    setScanned(true);
    let myOrder = orders.filter((item) => item.id === data);
    setOrder(myOrder[0]);
    setViewCamera(false);
    setViewOrder(true);
  };

  if (hasPermission === null) {
    console.log("Requesting the camera permission")
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
      if(recName !== ''){
        await uploadImage(image, "image");
      } else {
        setMissingInputs(true);
      }
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
          handleConfirm(downloadUrl);
        });
      }
    );
  }

  const handleConfirm = (picUrl) => {
    setIsLoading(true)
    update(ref(db, 'Orders/' + qrVal), {
      orderStatus: "Delivered",
      deliveryDate: new Date().toISOString(),
      receivedBy: recName,
      receiveNotes: notes,
      idPicName: imageName,
      idPicUrl: picUrl
    }).then(() => {
        update(ref(db, 'users/' + profile.userId), {
          available: true,
          deliveries: deliveries + 1
        }).then(() => {
          setIsLoading(false);
          refRBSheet.current.close();
          showToast();
          setOptionsCnt(1);
          setViewOrder(!viewOrder);
          
          setRecName('');
          setNotes('');
          setQrVal('');
          setImage('');
          setImageName('');
          setImageUrl('');
        })
    })
  }

  useEffect(async () => {
    const bikersRef = ref(db, 'users/');
    onValue(bikersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const newBikers = Object.keys(data)
                .map(key => ({
                    id: key,
                    ...data[key]
                }));

            const availBikers = newBikers.filter((item) => item.available && item.accountType === "Biker")
            setBikers(availBikers);
        }
    });
  }, []);

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Task successfully completed!'
    }); 
  }

  const searchQ = (sQuery) => {
    if(profile.accountType === 'Admin'){
        if(sQuery !== ''){
          let temp = orders.filter((item) => String(item.packageName).includes(sQuery) || String(item.biker).includes(sQuery) || String(item.customerName).includes(sQuery) || String(item.shop).includes(sQuery))
          setOrders(temp);
          if(temp.length === 0){
            setSearchNone(true);
          } else{
            setSearchNone(false);
          }
        } else {
          setSearchNone(false);
          setOrders(tempSearch);
        }
      } else if(profile.accountType === 'Public') {
        if(sQuery !== ''){
          let temp = userOrders.filter((item) => String(item.packageName).includes(sQuery) || String(item.biker).includes(sQuery) || String(item.customerName).includes(sQuery) || String(item.shop).includes(sQuery))
          setUserOrders(temp);
          if(temp.length === 0){
            setSearchNone(true);
          } else{
            setSearchNone(false);
          }
        } else {
          setSearchNone(false);
          setUserOrders(tempUserOrders);
        }
      } else {
        if(sQuery !== ''){
          let temp = bikerOrders.filter((item) => String(item.packageName).includes(sQuery) || String(item.biker).includes(sQuery) || String(item.customerName).includes(sQuery) || String(item.shop).includes(sQuery))
          setBikerOrders(temp);
          if(temp.length === 0){
            setSearchNone(true);
          } else{
            setSearchNone(false);
          }
        } else {
          setBikerOrders(tempBikerOrders);
          setSearchNone(false);
        }
      }
  }

  const toggleModal = (ordId) => {
      setOrderId(ordId);
      setVisible(!visible)
  }

  const openMaps = (lat, lng, currUser) => {
    const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const label = currUser + '`s delivery location';
    const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`
    });
    Linking.openURL(url);
  }

  const confirmChange = (ordID, stat) => {
    setIsLoading(true)
    update(ref(db, 'Orders/' + ordID), {
      orderStatus: stat,
      deliveryDate: new Date().toISOString()
    }).then(() => {
      if(stat == "Delivered"){
        update(ref(db, 'users/' + profile.userId), {
          available: true,
          deliveries: deliveries + 1
        }).then(() => {
          setIsLoading(false);
          setSMsg("Order status successfully updated to " + stat + "!")
          setSuccessVisible(true)
          refRBSheet.current.close();
          setOptionsCnt(1)
        })
      } else {
        setIsLoading(false);
        setSMsg("Order status successfully updated to " + stat + "!")
        setSuccessVisible(true)
        refRBSheet.current.close();
        setOptionsCnt(1)
      }
    })
  }
    
  const toggleViewOrder = (item) => {
    setOrder(item);
    setViewOrder(!viewOrder);
  }

  const toggleDeleteModal = (itemId, imgName) => {
      setDeleteKey(itemId);
      setDeleteImageName(imgName)
      setDeleteVisible(!deleteVisible)
  }

  const proceed = (disId, id) => {
    setBikerId(id)
    setDispatchId(disId)
    setPageNo(pageNo + 1)
  }

  const goback = () => {
    setPageNo(pageNo - 1)
  }

  const handleDispatch = async (dispatchId, orderId, bikerId) => {
    // ....
    setIsLoading(true);
    await update(ref(db, 'Orders/' + orderId), {
      biker: dispatchId
    }).then(async() => {
      await update(ref(db, 'users/' + bikerId), {
        available: false
      }).then(() => {
        setIsLoading(false);
        setSMsg("Order successfully dispatched to biker " + dispatchId + "!")
        setSuccessVisible(true)
        setPageNo(1)
        toggleModal()
      })
    })
  }

  const confirmDelete = (index, deleteImageName) => {
    // .......
    const desertRef = imgRef(storage, `Images/${deleteImageName}`);
    setIsLoading(true)
   if(deleteImageName !== ""){
    deleteObject(desertRef).then(() => {
        remove(ref(db,"Orders/" + index))
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
    remove(ref(db,"Orders/" + index))
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
      <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
        navigate('Create')
      }}>
        <MaterialCommunityIcons color={COLORS.outline} name='plus' size={15}/>
      </TouchableOpacity>
      <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}}>
        <MaterialCommunityIcons color={COLORS.outline} name='reload' size={15}/>
      </TouchableOpacity>
      {profile.accountType === "Admin" || profile.accountType === "Biker" ? (
        <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
          setScanned(false);
          setViewCamera(!viewCamera);
        }}>
          <MaterialCommunityIcons color={COLORS.outline} name='qrcode' size={15}/>
        </TouchableOpacity>
      ): (
        <></>
      )}
      <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
        setSearch(!search)
      }}>
        <MaterialIcons color={COLORS.outline} name='search' size={15}/>
      </TouchableOpacity>
   </View>
  )

  return (
    <View style={[styles.container, {backgroundColor: COLORS.surface}]}>
      <Header 
        title={profile.accountType === 'Public' ? 'Deliveries' : 'Tasks'}
        titleColor={COLORS.outline}
        rightView={search ? null : <CustomHeader/>}
      />
      <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(!visible)} contentContainerStyle={[STYLES.modalContainer, {height: screenHeight - 300}]}>
                <View style={STYLES.modalInner}>
                    <Text style={STYLES.textHeading}>Dispatch order to a biker</Text>
                    <View>
                      {pageNo === 1 ? (
                         <>
                          {bikers.length > 0 ? (
                            <FlatList
                            data={bikers}
                            key={(item, index) => index}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item, index }) => (
                              item.available ? (
                                <BikeCard 
                                  type='dispatch'
                                  email={item.useremail}
                                  accType={item.accountType} 
                                  name={item.username} 
                                  gender={item.gender} 
                                  deliveries={item.deliveries} 
                                  image={item.profilePicture ? ({uri: item.profilePicture}):(require('../assets/user.png'))} 
                                  onCardPress={() => proceed(item.username, item.id)}
                                />
                              ):(
                                <></>
                              )
                            )}
                          />
                          ):(
                            <>
                              <Text style={[STYLES.textNormal, {paddingVertical: 10}]}>Sorry, no free bikers, all bikers are occupied at the moment :(</Text>
                            </>
                          )}
                          <CustomButton type='cancel' text='Cancel' onPress={() => {
                              toggleModal();
                          }}/>
                         </>
                      ):(
                        <>
                          <Text style={STYLES.textNormal}>Dispatch order to {dispatchId} ?</Text>
                          {isLoading ? (
                                <Button mode="contained" style={{ borderRadius: 0, width: screenWidth - 50, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.background }}>
                                    <ActivityIndicator animating={true} color={COLORS.button} />
                                </Button>
                            ) : (
                                <>
                                   <CustomButton text='Yes, Dispatch' onPress={() => {
                                        handleDispatch(dispatchId, orderId, bikerId);
                                    }}/>
                                    <CustomButton type='cancel' text='No, Cancel' onPress={() => {
                                        goback();
                                    }}/>
                                </>
                            )}
                          
                        </>
                      )}
                    </View>
                </View>
            </Modal>

            {/* View Orders Modal */}
            <Modal visible={viewOrder} onDismiss={() => setViewOrder(!viewOrder)} contentContainerStyle={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: COLORS.surface,
              borderRadius: 10
              }}
              style={{height: screenHeight, paddingBottom: 60}}
              >
                <View>
                    <ScrollView>
                        {order ? (
                          <>
                        <View style={{flex: 1, paddingHorizontal: 10, borderRadius: 10}}>
                           <MapView
                              style={styles.map}
                              provider={Platform.OS == "android" ? PROVIDER_GOOGLE : undefined}
                              showsBuildings
                              showsCompass
                              initialRegion={{
                                latitude: order.delCords.latitude, 
                                longitude: order.delCords.longitude,
                                latitudeDelta: 0.0240,
                                longitudeDelta: 0.0080
                              }}
                              
                            >
                              <Marker coordinate={{
                                latitude: order.delCords.latitude, 
                                longitude: order.delCords.longitude,
                                latitudeDelta: 0.0240,
                                longitudeDelta: 0.0080
                              }}
                              title={`Delivery location for ${order.customerName}`}
                              description={order.delLoc}
                              />
                            </MapView>
                            
                            {profile.userId !== order.userId && (
                              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10}}>
                                <TouchableOpacity style={{alignItems: 'center', backgroundColor: COLORS.button, padding: 5, borderRadius: 8, flex: 1, marginHorizontal: 5}} onPress={() => {
                                    Linking.openURL(`tel:${order.delPhone}`)
                                }}>
                                    <MaterialCommunityIcons color={COLORS.background} size={20} name='phone'/>
                                    <Text style={[STYLES.textNormal, {color: COLORS.background, fontSize: 12}]}>Call</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{alignItems: 'center', backgroundColor: COLORS.button, padding: 5, borderRadius: 8, flex: 1, marginHorizontal: 5}} onPress={() => {
                                    Linking.openURL(`sms:${order.delPhone}`)
                                }}>
                                    <MaterialCommunityIcons color={COLORS.background} size={20} name='message-text'/>
                                    <Text style={[STYLES.textNormal, {color: COLORS.background, fontSize: 12}]}>SMS</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{alignItems: 'center', backgroundColor: COLORS.button, padding: 5, borderRadius: 8, flex: 1, marginHorizontal: 5}} onPress={() => {
                                    Linking.openURL(`whatsapp://send?text=hello&phone=+263${order.delPhone}`)
                                }}>
                                    <MaterialCommunityIcons color={COLORS.background} size={20} name='whatsapp'/>
                                    <Text style={[STYLES.textNormal, {color: COLORS.background, fontSize: 12}]}>WhatsApp</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{alignItems: 'center', backgroundColor: COLORS.button, padding: 5, borderRadius: 8, flex: 1, marginHorizontal: 5}} onPress={() => {
                                    openMaps(order.delCords.latitude, order.delCords.longitude, order.customerName);
                                }}>
                                    <MaterialIcons color={COLORS.background} size={20} name='location-pin'/>
                                    <Text style={[STYLES.textNormal, {color: COLORS.background, fontSize: 12}]}>Directions</Text>
                                </TouchableOpacity>
                            </View>
                            )}
                            
                          </View>
                          <View style={{backgroundColor: COLORS.onSurfaceVariant, width: '100%', paddingHorizontal: 10, paddingVertical: 10, marginVertical: 10}}>
                              <Text style={{color: COLORS.background}}>Order Details</Text>
                          </View>
                          
                        <View style={{flex: 1, paddingHorizontal: 10, borderRadius: 10}}>
                          <View>
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Customer Name</Text>
                                  <Text style={STYLES.textNormal}>{order.customerName || "-- --"}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Order Date</Text>
                                  <Text style={STYLES.textNormal}>{new Date(order.orderDate).toUTCString() || "-- --"}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Order Status</Text>
                                  <Text style={STYLES.textNormal}>{order.orderStatus || "-- --"}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Delivery Date</Text>
                                  <Text style={STYLES.textNormal}>{order.deliveryDate ? (new Date(order.deliveryDate).toUTCString()): ("-- --")}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Category</Text>
                                  <Text style={STYLES.textNormal}>{order.deliveryCat || "-- --"}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Type</Text>
                                  <Text style={STYLES.textNormal}>{order.delType || "-- --"}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Additional Info</Text>
                                  <Text style={STYLES.textNormal}>{order.addInfo || "-- --"}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Delivery</Text>
                                  <Text style={STYLES.textNormal}>{order.packageName || "-- --"}</Text>
                              </View>
                              <Divider />
                              {order.packagePicture && (
                                <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>List Photo</Text>
                                  <Image
                                    source={{ uri: order.packagePicture }}
                                    style={{ width: '100%', height: 250, marginRight: 20, resizeMode: 'cover', marginBottom: 20 }}
                                  />
                                </View>
                              )}
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Pick Up Location</Text>
                                  <Text style={STYLES.textNormal}>{order.pickUpRoomNo + "-- --"} {order.pickUpLoc}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Shop</Text>
                                  <Text style={STYLES.textNormal}>{order.shop || "-- --"}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Delivery Location</Text>
                                  <Text style={STYLES.textNormal}>{order.delRoomNo}, {order.delLoc}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Delivery Contact</Text>
                                  <Text style={STYLES.textNormal}>{order.delPhone || "-- --"}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Additional Instructions</Text>
                                  <Text style={STYLES.textNormal}>{order.addInstr || "-- --"}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Payment Method</Text>
                                  <Text style={STYLES.textNormal}>{order.paymentMeth}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Biker</Text>
                                  <Text style={STYLES.textNormal}>{order.biker || "-- --"}</Text>
                              </View>
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Proof Of Delivery</Text>
                                  <Text style={STYLES.textNormal}>{order.proofOfDel || "-- --"}</Text>
                              </View>
                              <Divider />
                              {/* <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Delivery Time</Text>
                                  <Text style={STYLES.textNormal}>35 Mins</Text>
                              </View>
                              <Divider /> */}
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Fee</Text>
                                  <Text style={STYLES.textNormal}>US$ {order.deliveryFee.toFixed(2)}</Text>
                              </View>
                          </View>
                        </View>
                        
                        {order.orderStatus === "Delivered" && (
                          <>
                             <View style={{backgroundColor: COLORS.onSurfaceVariant, width: '100%', paddingHorizontal: 10, paddingVertical: 10, marginVertical: 10}}>
                                <Text style={{color: COLORS.background}}>Received by</Text>
                            </View>
                            <View style={{flex: 1, paddingHorizontal: 10, borderRadius: 10}}>
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Recipient name</Text>
                                  <Text style={STYLES.textNormal}>{order.receivedBy || "-- --"}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Task ID</Text>
                                  <Text style={STYLES.textNormal}>{order.id || "-- --"}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                                  <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Notes</Text>
                                  <Text style={STYLES.textNormal}>{order.receiveNotes || "-- --"}</Text>
                              </View>
                              <Divider />
                              <View style={{ paddingVertical: 5 }}>
                              <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>ID Photo</Text>
                              <Image
                                source={{ uri: order.idPicUrl }}
                                style={{ width: '100%', height: 250, marginRight: 20, resizeMode: 'cover', marginBottom: 20 }}
                              />
                              </View>
                            </View>
                          </>
                        )}
                        </>
                        ):(
                            <></>
                        )}
                    </ScrollView>
                    <Surface elevation={5} style={[styles.shadow, {paddingVertical:10, width: screenWidth, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 35, backgroundColor: COLORS.background, marginTop: 5}]}>
                      <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20,}} onPress={() => {
                          setViewOrder(!viewOrder)
                      }}>
                          <AntDesign color={COLORS.outline} name='left' size={18}/>
                      </TouchableOpacity>
                          {isLoading ? (
                            <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, }} onPress={() => {
                              }}>
                                <View style={{alignItems: "center"}}>
                                    <ActivityIndicator animating={true} color={COLORS.button} />
                                </View>
                            </TouchableOpacity>
                          ):(
                            <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, }} onPress={() => {
                                // handleEdit(order.id)
                                refRBSheet.current.open();
                              }}>
                            <MaterialCommunityIcons color={COLORS.outline} name='dots-horizontal' size={20}/>
                          </TouchableOpacity>
                          )}
                    </Surface>
                </View>
            </Modal>

            <RBSheet
              ref={refRBSheet}
              // useNativeDriver={true}
              openDuration={650}
              closeOnPressBack
              customStyles={{
                wrapper: {
                  backgroundColor: 'transparent',
                  height: 500
                },
                draggableIcon: {
                  backgroundColor: 'redwhite',
                },
                container: {
                  backgroundColor: COLORS.background,
                  borderRadius: 15,
                  height: optionsCnt === 4 ? 450 : profile.accountType === "Public" && optionsCnt !== 2 ? 180 : profile.accountType !== "Public" && optionsCnt !== 2 ? 250 : screenHeight - 50
                },
              }}
              customModalProps={{
                animationType: 'slide',
                statusBarTranslucent: true,
              }}
              customAvoidingViewProps={{
                enabled: false,
              }}>
                
              <Surface style={{
                  elevation: 4,
                  ...styles.shadow,
                  height: '100%',
                  paddingVertical: 5,
                  minHeight: 500
                }}>

                {optionsCnt === 1 ? (
                  <>
                  {profile.accountType !== "Public" && (
                    <>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}} onPress={() => {
                          setOptionsCnt(2);
                        }}>
                          <MaterialCommunityIcons name='check-circle-outline' color={COLORS.tertiary} style={{padding: 8}} size={25}/>
                          <Text style={[STYLES.textNormal, {fontSize: 15,color: COLORS.tertiary}]}>Complete Task</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}} onPress={() => {
                          setOptionsCnt(3);
                        }}>
                          <MaterialIcons name='change-circle' color={COLORS.tertiary} style={{padding: 8}} size={25}/>
                          <Text style={[STYLES.textNormal, {fontSize: 15,color: COLORS.tertiary}]}>Change Status</Text>
                        </TouchableOpacity>
                    </>
                  )}
                  {profile.accountType === "Public" && (
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}} onPress={() => {
                      setOptionsCnt(4);
                    }}>
                      <AntDesign name='qrcode' color={COLORS.tertiary} style={{padding: 8}} size={25}/>
                      <Text style={[STYLES.textNormal, {fontSize: 15,color: COLORS.tertiary}]}>Generate QR Code</Text>
                    </TouchableOpacity>
                  )}
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}} onPress={() => {
                      refRBSheet.current.close();
                      toggleDeleteModal(order.id, order.packagePicName)
                    }}>
                      <AntDesign name='delete' color={COLORS.error} style={{padding: 8}} size={25}/>
                      <Text style={[STYLES.textNormal, {fontSize: 15,color: COLORS.error}]}>Delete Task</Text>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}} onPress={() => {
                      refRBSheet.current.close();
                    }}>
                      <AntDesign name='closecircleo' color={COLORS.tertiary} style={{padding: 8}} size={25}/>
                      <Text style={[STYLES.textNormal, {fontSize: 15,color: COLORS.tertiary}]}>Close</Text>
                    </TouchableOpacity>
                  </>
                ) : optionsCnt === 2 ? (
                  <View style={{height: '100%'}}>
                      <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15,}}>
                        <TouchableOpacity style={{paddingRight: 20}} onPress={() => {
                          refRBSheet.current.close();
                          setOptionsCnt(1);
                          setRecName('');
                          setNotes('');
                          setQrVal('');
                          setImage('');
                          setImageName('');
                          setImageUrl('');
                        }}>
                          <AntDesign color={COLORS.outline} name='left' size={20}/>
                        </TouchableOpacity>
                        <Text style={STYLES.textHeading}>Task Completion</Text>
                      </View>

                      <View style={{backgroundColor: COLORS.onSurfaceVariant, width: '100%', paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10}}>
                          <Text style={{color: COLORS.background}}>Recipient Details</Text>
                      </View>

                      <MyInput
                        isRequired={missingInputs}
                        errorText="Recipient name is required"
                        placeholder='Recipient name'
                        label='Recipient name'
                        type='add'
                        value={recName}
                        onChangeFunction={(recName) => setRecName(recName)}
                      />
                      <MyTextArea
                          placeholder='Notes'
                          label='Notes'
                          type='add'
                          value={notes}
                          onChangeFunction={(notes) => setNotes(notes)}
                      />

                      <View style={{backgroundColor: COLORS.onSurfaceVariant, width: '100%', paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10}}>
                          <Text style={{color: COLORS.background}}>Proof of delivery (Attachments)</Text>
                      </View>
                      
                      {scanVisible ? (
                         <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', padding: 15, margin: 15}}>
                            <CameraView
                              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                              barcodeScannerSettings={{
                                barcodeTypes: ["qr", "pdf417"],
                              }}
                              style={StyleSheet.absoluteFillObject}
                            />
                            {scanned ? (
                              <Button mode='contained' onPress={() => setScanned(false)} >Scan Again</Button>
                            ) : (
                              <Button mode='contained' style={{backgroundColor: COLORS.error}} onPress={() => {
                                setScanned(false);
                                setScanVisible(false);
                              }} >Cancel</Button>
                            )}
                          </View>
                      ): startCamera ? (
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 15, margin: 15}}>
                          {previewVisible && image ? (
                            <View
                              style={{
                                backgroundColor: 'black',
                                flex: 1,
                                width: '100%',
                                height: '100%'
                              }}
                            >
                              <ImageBackground
                                source={{uri: image}}
                                style={{
                                  flex: 1
                                }}
                              />
                              <View                               
                              style={{
                                position: 'absolute',
                                bottom: 0,
                                flexDirection: 'row',
                                flex: 1,
                                width: '100%',
                                padding: 10,
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}> 
                              <TouchableOpacity style={{borderColor: COLORS.outline, backgroundColor: COLORS.button, borderRadius: 10, padding: 5}} onPress={() => {
                                  setPreviewVisible(false);
                                  setImage('');
                                }}>
                                    <Text style={{color: COLORS.background}}>Retake</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={{borderColor: COLORS.outline, backgroundColor: COLORS.button, borderRadius: 10, padding: 5}} onPress={() => {
                                  setStartCamera(false);
                                }}>
                                    <Text style={{color: COLORS.background}}>Save Photo</Text>
                              </TouchableOpacity>
                              </View>
                            </View>
                          ) : (
                          <CameraView ref={cameraRef} facing='back' style={[StyleSheet.absoluteFillObject, {alignItems: 'center', justifyContent: 'flex-end', paddingVertical: 10}]}
                            flash={flashMode}
                          >
                          <View
                              style={{
                              position: 'absolute',
                              bottom: 0,
                              flexDirection: 'row',
                              flex: 1,
                              width: '80%',
                              padding: 20,
                              justifyContent: 'space-between',
                              alignItems: 'center'
                              }}
                            >
                            <TouchableOpacity style={{borderWidth: 1, borderColor: "rgb(254, 251, 255)", borderRadius: 10, padding: 5}} onPress={() => {
                              setStartCamera(false)
                            }}>
                                <Text style={{color: "rgb(254, 251, 255)"}}>Cancel</Text>
                            </TouchableOpacity>
                              <View
                                style={{
                                alignSelf: 'center',
                                flex: 1,
                                alignItems: 'center'
                                }}
                                >
                                  <TouchableOpacity
                                    style={{
                                    width: 60,
                                    height: 60,
                                    bottom: 0,
                                    borderRadius: 50,
                                    backgroundColor: '#fff'
                                    }}
                                    onPress={() => takePicture()}
                                  />
                              </View>
                            <TouchableOpacity style={{borderWidth: 1, borderColor: "rgb(254, 251, 255)", borderRadius: 10, padding: 5}} onPress={() => {
                               if (flashMode === 'on') {
                                setFlashMode('off')
                              } else {
                                setFlashMode('on')
                              }
                            }}>
                              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                                <Text style={{color: "rgb(254, 251, 255)", fontSize: 15}}>{flashMode}</Text>
                                <MaterialCommunityIcons name={flashMode === 'off' ? 'flash-off' : flashMode === 'on' ? 'flash' : 'flash-alert'} color="rgb(254, 251, 255)" size={18}/>
                              </View>
                            </TouchableOpacity>
                          </View>
                          </CameraView>
                          )}
                        </View>
                      ) : (
                        <>
                          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10}}>
                            <TouchableOpacity style={{alignItems: 'center', backgroundColor: COLORS.button, padding: 5, borderRadius: 8, flex: 1, marginHorizontal: 5}} onPress={() => {
                              setScanVisible(true);
                              setQrVal('');
                              setScanned(false);
                              setShowError(false);
                            }}>
                                <MaterialCommunityIcons color={COLORS.background} size={50} name='qrcode-plus'/>
                                <Text style={[STYLES.textNormal, {color: COLORS.background, fontSize: 12}]}>QR Code</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{alignItems: 'center', backgroundColor: COLORS.button, padding: 5, borderRadius: 8, flex: 1, marginHorizontal: 5}} onPress={() => {
                              // pickImage()
                              setStartCamera(true)
                            }}>
                                <MaterialCommunityIcons color={COLORS.background} size={50} name='upload'/>
                                <Text style={[STYLES.textNormal, {color: COLORS.background, fontSize: 12}]}>Upload ID Photo</Text>
                            </TouchableOpacity>
                          </View>
                          
                          {image && (
                            <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
                              <Image
                                source={{ uri: image }}
                                style={{ width: 50, height: 50, marginRight: 10 }}
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
                          {showError && <Text style={[STYLES.textNormal, {color: COLORS.error, padding: 10}]}>Error: Can not complete task, task ID's does not match</Text>}
                          {qrVal && <Text style={[STYLES.textNormal, {color: COLORS.outline, padding: 10}]}>Task ID: {qrVal}</Text>}

                          <View style={{flex: 1,alignItems: 'center', marginBottom: 0}}>
                            {qrVal && image ? (
                              isLoading ? (
                               <Button mode="contained" style={{borderRadius: 0, width: screenWidth - 20, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.button}} onPress={() => {
                               }}>
                                  <ActivityIndicator animating={true} color={COLORS.background} />
                              </Button>
                              ):(
                               <Button mode="contained" style={{borderRadius: 0, width: screenWidth - 20, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.button}} onPress={() => {
                                handleClick();
                               }}>
                                  <Text style={{color: COLORS.background}}>Confirm Delivery</Text>
                              </Button>
                              )
                            ):(
                               <Button disabled={true} mode="contained" style={{borderRadius: 0, width: screenWidth - 20, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.button, opacity: 0.5}} onPress={() => {
                                
                               }}>
                                  <Text style={{color: COLORS.background}}>Confirm Delivery</Text>
                              </Button>
                            )}
                          </View>
                        </>
                      )}
                  </View>
                ) : optionsCnt === 3 ? (
                  <View style={{paddingHorizontal: 15}}>
                  <Text style={STYLES.textNormal}>Change the status of the task</Text>
                    {isLoading ? (
                      <ActivityIndicator animating={true} color={COLORS.button} />
                  ):(
                      <>
                      <Button mode='outlined' style={{marginVertical: 5, borderRadius: 0}} textColor={COLORS.button} onPress={() => confirmChange(order.id, 'In Transit')}>In Transit</Button>
                      <Button mode='outlined' style={{marginVertical: 5, borderRadius: 0}} textColor={COLORS.button} onPress={() => confirmChange(order.id, 'Arrived')}>Arrived</Button>
                      {/* <Button mode='outlined' style={{marginVertical: 5, borderRadius: 0}} textColor='#2ac780' onPress={() => confirmChange(order.id, 'Delivered')}>Delivered</Button> */}
                      </>
                  )}
                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}} onPress={() => {
                      refRBSheet.current.close();
                      setOptionsCnt(1);
                    }}>
                      <AntDesign name='closecircleo' color={COLORS.tertiary} style={{padding: 8}} size={25}/>
                      <Text style={[STYLES.textNormal, {fontSize: 15,color: COLORS.tertiary}]}>Close</Text>
                    </TouchableOpacity>
                  </View>
                ) : optionsCnt === 4 ? (
                  <View style={{padding: 10, alignItems: 'center'}}>
                    <Text style={STYLES.textNormal}>Biker to scan the QR Code to confirm delivery</Text>
                    <View style={{paddingVertical: 15}}>
                    <QRCode
                      size={300}
                      value={order.id}
                      logo={require('../assets/Logo.png')}
                    />
                    </View>
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}} onPress={() => {
                      // refRBSheet.current.close();
                      setOptionsCnt(1);
                    }}>
                      <AntDesign name='closecircleo' color={COLORS.tertiary} style={{padding: 8}} size={25}/>
                      <Text style={[STYLES.textNormal, {fontSize: 15,color: COLORS.tertiary}]}>Close</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <></>
                )}
              </Surface>
            </RBSheet>

            {/* Options modal */}
            <BottomModal visible={optionsModal} onTouchOutside={() => {
              setOptionModal(!optionsModal);
              setViewOrder(!viewOrder);
            }} onDismiss={() => {
              setOptionModal(!optionsModal);
              setViewOrder(!viewOrder);
            }}>
                {optionsCnt === 1 ? (
                <ModalContent style={{height: 500}}>
                  <Text>Modal footer</Text>
                </ModalContent>
                ): optionsCnt === 2 ? (
                <ModalContent>
                  <Text>Modal footer</Text>
                </ModalContent>
                ):(
                <ModalContent style={{height: 500}}>
                  <Text>Modal footer</Text>
                </ModalContent>

                )}
            </BottomModal>

            {/* QR Code scanner*/}
            <Modal visible={viewCamera} onDismiss={() => setViewCamera(!viewCamera)} contentContainerStyle={[STYLES.modalContainer, { height: screenHeight - 200 }]}>
               <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', padding: 15, margin: 15, width: '100%'}}>
                <CameraView
                  onBarcodeScanned={scanned ? undefined : handleQRScanned}
                  barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417"],
                  }}
                  style={StyleSheet.absoluteFillObject}
                />
                  <Text style={[STYLES.textNormal ,{color: "rgb(254, 251, 255)", position: 'absolute', top: 0, paddingVertical: 10}]}>Scan QR to view the task</Text>
                <Button mode='contained' style={{backgroundColor: COLORS.error}} onPress={() => {
                  setScanned(false);
                  setViewCamera(!viewCamera);
                }} >Cancel</Button>
              </View>

            </Modal>

            <Dialog visible={deleteVisible} onDismiss={() => setDeleteVisible(!deleteVisible)}>
                <Dialog.Title style={{color: COLORS.error, fontFamily: 'DMSansRegular'}}>Delete Order</Dialog.Title>
                <Dialog.Content>
                <Text style={{color: COLORS.outline, fontFamily: 'DMSansRegular'}} variant="bodyMedium">You are about to delete an order, are you sure you want to proceed ?</Text>
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

      {search ? (
          <View style={{width: screenWidth}}>
              <Searchbar
                  mode='bar'
                  placeholder="Search by customer, order, biker, shop"
                  value={searchQuery}
                  onChangeText={(searchQuery) => {
                    setSearchQuery(searchQuery);
                    searchQ(searchQuery);

                  }}
                  right={() => (<MaterialCommunityIcons name='close' size={20} style={{paddingRight: 10}} color={COLORS.outline} onPress={() => {
                      setSearchQuery('')
                      setSearch(false);
                      setOrders(tempSearch);
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
        <View style={{width: '100%', alignItems:'center', padding: 10}}>
          <SegmentedButtons
              value={segValue}
              onValueChange={setSegValue}
              buttons={[
                {
                  value: 'Pending',
                  label: 'Pending',
                  style: STYLES.segButton,
                  showSelectedCheck: true,
                },
                {
                  value: 'In Transit',
                  label: 'In Transit',
                  style: STYLES.segButton2,
                  showSelectedCheck: true,
                },
                {
                  value: 'Delivered',
                  label: 'Delivered',
                  style: STYLES.segButton,
                  showSelectedCheck: true,
                },
              ]}
              style={STYLES.segGroup}
            />
          {searchNone && (
            <>
              <Text style={[STYLES.textNormal, {fontSize: 18}]}>No search results found :(</Text>
            </>
          )}
        </View>

      <ScrollView horizontal={true}>
        {profile.accountType === "Biker" ? (
          <FlatList
          data={bikerOrders}
          key={(item, index) => index}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => (
          item.orderStatus === segValue ? (
          <OrderCard
            orderdate={new Date(item.orderDate).toUTCString()}
            order={item.packageName}
            shop={item.shop}
            type={item.deliveryCat}
            biker={item.biker}
            customer={item.customerName}
            delTime='38 Mins'
            orderStatus = {segValue}
            status= {item.orderStatus}
            onPress={() => toggleModal(item.id)}
            onPressDelete={() => toggleDeleteModal(item.id, item.packagePicName)}
            onCardPress={() => toggleViewOrder(item)}
          />
          ) : (
            <></>
          )
          )}
      />
        ): profile.accountType === "Admin" ? (
          <FlatList
          data={orders}
          key={(item, index) => index}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => (
          item.orderStatus === segValue ? (
          <OrderCard
            orderdate={new Date(item.orderDate).toUTCString()}
            order={item.packageName}
            shop={item.shop}
            type={item.deliveryCat}
            customer={item.customerName}
            biker={item.biker}
            delTime='38 Mins'
            orderStatus = {segValue}
            status= {item.orderStatus}
            onPress={() => toggleModal(item.id)}
            onPressDelete={() => toggleDeleteModal(item.id, item.packagePicName)}
            onCardPress={() => toggleViewOrder(item)}
          />
              ) : (
                <></>
              )
              )}
          />
        ) : (
          <FlatList
          data={userOrders}
          key={(item, index) => index}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => (
          item.orderStatus === segValue ? (
          <OrderCard
            orderdate={new Date(item.orderDate).toUTCString()}
            order={item.packageName}
            shop={item.shop}
            type={item.deliveryCat}
            biker={item.biker}
            customer={item.customerName}
            delTime='38 Mins'
            orderStatus = {segValue}
            status= {item.orderStatus}
            onPress={() => toggleModal(item.id)}
            onPressDelete={() => toggleDeleteModal(item.id, item.packagePicName)}
            onCardPress={() => toggleViewOrder(item)}
          />
              ) : (
                <></>
              )
              )}
          />
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
      </ScrollView>
      
      <Toast />

    </View>
  )
}

export default Orders

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 15,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    map: {
      flex: 1,
      width: '100%',
      height: 300,
      borderRadius: 10
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
        shadowOffset: {
          width: 3,
          height: 0.5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
        
    }
})