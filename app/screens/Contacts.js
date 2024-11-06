import { FlatList, Platform, StyleSheet,View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import myTheme from '../utils/theme'
import { AntDesign, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native'
import { ActivityIndicator, Button, Divider, HelperText, Modal, Portal, Snackbar, Text, TextInput, Searchbar } from 'react-native-paper'
import { useLogin } from '../utils/LoginProvider'
import MyTextArea from '../Components/MyTextArea'
import MyInput from '../Components/MyInput'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Image } from 'react-native'
import * as Location from 'expo-location'
import { ref, set, onValue, remove, update, push } from 'firebase/database'
import { ref as imgRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from '../config'
import { BottomModal, ModalFooter, ModalTitle, SlideAnimation, ModalContent, FadeAnimation } from 'react-native-modals';
import ProfileImage from '../Components/ProfileImage'
import * as Linking from 'expo-linking';

const Contacts = () => {
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
    const { isLoggedIn, setIsLoggedIn, profile, setProfile, location, setLocation, setLocationData  } = useLogin();

    const { navigate } = useNavigation();
    const [viewAdd, setViewAdd] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [msg, setMSG] = useState("");
    const [sMsg, setSMsg] = useState("");
    const [missingInputs, setMissingInputs] = useState(false);
    const [pickUpLoc, setPickupLoc] = useState('');
    const [pickUpCords, setPickUpCords] = useState({});
    const [viewMap, setViewMap] = useState(false);
    const [delRoomNo, setdelRoomNo] = useState('');
    const [contPhone, setContPhone] = useState('');
    const [contName, setContName] = useState('');
    const [current, setCurrent] = useState('');
    const [mapType, setMapType] = useState('standard');
    const [layers, setLayers] = useState("none");
    const [contEmail, setContEmail] = useState('');
    const [search, setSearch] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editAcc, setEditAcc] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mapRegion, setMapRegion] = useState({           
          latitude: location.latitude, 
          longitude: location.longitude,
          latitudeDelta: 0.0140,
          longitudeDelta: 0.0080
      });

    const [showLoc, setShowLoc] = useState('none');
    const [myLocation, setMyLocation] = useState('');
    const [tempContacts, setTempContacts] = useState([]);

    useEffect(() => {
        const contRefs = ref(db, 'Contacts/');
        onValue(contRefs, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const newCont = Object.keys(data)
                    .map(key => ({
                        id: key,
                        ...data[key]
                    }));
                
                const contacts = newCont.filter((item) => item.accountType === "Biker"); 
                setTempContacts(newCont);
                setContacts(newCont);
            }
        });
    }, []);

    const searchQ = (sQuery) => {
        if(sQuery !== ''){
          if(profile.accountType === 'Admin'){
            let temp = contacts.filter((item) => String(item.address).includes(sQuery) || String(item.name).includes(sQuery))
            setContacts(temp);
          }
        } else {
          setContacts(tempContacts);
        }
      }

    const handleUpload = () => {
        setIsLoading(true);
        if(contName !== '' && contPhone !== '' && pickUpLoc !== ''){
            push(ref(db, 'Contacts/'), {
                name: contName,
                email: contEmail,
                phone: contPhone,
                address: pickUpLoc,
                coords: pickUpCords,
                houseNo: delRoomNo
        
            }).then(() => {
                setIsLoading(false)
                setSMsg(`A contact was created successfully!`);
                setSuccessVisible(true)
                setMissingInputs(false)
    
                // Clear input states
                setContName('');
                setContEmail('');
                setContPhone('');
                setPickupLoc('');
                setPickUpCords({});
                setdelRoomNo('');
    
                toggleAddContact();
        
            }).catch((error) => {
                setIsLoading(false)
                let errorMessage = error.message.replace(/[()]/g, " ");
                let errorMsg = errorMessage.replace('Firebase:', "");
                setMSG(errorMsg);
                setErrorVisible(true)
            })

        } else{
            setIsLoading(false)
            setMissingInputs(true);
            setMSG("Error: Some required inputs are missing, please fill all the red boxes with required.");
            setErrorVisible(true);
            }
    }

    const handleEdit = (itemId) => {
        setIsLoading(true);
        if(contName !== '' && contPhone !== '' && pickUpLoc !== ''){
            set(ref(db, 'Contacts/' + itemId), {
                name: contName,
                email: contEmail,
                phone: contPhone,
                address: pickUpLoc,
                coords: pickUpCords,
                houseNo: delRoomNo
        
            }).then(() => {
                setIsLoading(false)
                setSMsg(`A contact was edited successfully!`);
                setSuccessVisible(true)
                setMissingInputs(false)
                setEditAcc(!editAcc);
                setModalVisible(!modalVisible)
    
                // Clear input states
                setContName('');
                setContEmail('');
                setContPhone('');
                setPickupLoc('');
                setPickUpCords({});
                setdelRoomNo('');
            }).catch((error) => {
                setIsLoading(false)
                let errorMessage = error.message.replace(/[()]/g, " ");
                let errorMsg = errorMessage.replace('Firebase:', "");
                setMSG(errorMsg);
                setErrorVisible(true)
            })

        } else{
            setIsLoading(false)
            setMissingInputs(true);
            setMSG("Error: Some required inputs are missing, please fill all the red boxes with required.");
            setErrorVisible(true);
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

    const toggleAddContact = () => {
    setViewAdd(!viewAdd)
    }

    const handleBottomModal = (item) => {
        setModalVisible(!modalVisible)
        setCurrent(item)
    }
    
    const CustomHeader = () => (
        <View style={{flexDirection: 'row', justifyContent: 'space-around', flex: 1}}>
            <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
                setContEmail('');
                setContName('');
                setContPhone('');
                setPickupLoc('');
                setPickUpCords({});
                setdelRoomNo('');
                toggleAddContact();

            }}>
                <MaterialCommunityIcons color={COLORS.outline} name='plus' size={15}/>
            </TouchableOpacity>
            <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
                setSearch(!search);
            }}>
                <MaterialIcons color={COLORS.outline} name='search' size={15}/>
            </TouchableOpacity>
        </View>
        )

  const LeftView = () => (
    <View style={{flexDirection: 'row', justifyContent: 'space-around', flex: 1}}>
       <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {
            toggleAddContact();
                // Clear input states
                setContName('');
                setContEmail('');
                setContPhone('');
                setPickupLoc('');
                setPickUpCords({});
                setdelRoomNo('');
                setMissingInputs(false)
       }}>
        <AntDesign color={COLORS.error} name='left' size={18}/>
        <Text style={[STYLES.textNormal, {fontSize: 20, marginLeft: 5, color: COLORS.error}]}>Cancel</Text>
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
            console.log("Yeas 1")
            handleUpload()
        }}>
            <Text style={[STYLES.textNormal, {fontSize: 20, marginLeft: 5}]}>Add Contact</Text>
            <AntDesign color={COLORS.outline} name='right' size={18}/>
        </TouchableOpacity>
       )}
    </View>
   );

   const openMaps = (lat, lng, currUser) => {
    const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const label = currUser + '`s location';
    const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`
    });
       
    Linking.openURL(url);
   }

  return (
    <View style={[styles.container, {backgroundColor: COLORS.surface}]}>
       <Header 
        leftView={search ? null : viewAdd ? <LeftView/> : null}
        title={viewAdd ? ' ' : 'Contacts'} 
        titleColor={COLORS.outline}
        rightView={search ? null : viewAdd ? <RightView2/> : <CustomHeader/>}
      />

      <Portal>
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
                        setPickupLoc(myLocation.street +", "+myLocation.city +", "+myLocation.country);
                        setPickUpCords(mapRegion);
                        setViewMap(!viewMap);
                        setVisible(!visible);
                    }}>
                        <Button compact mode='contained' contentStyle={{width: 'auto'}} style={{borderRadius: 30, width: 'auto', paddingHorizontal: 1}}>Next</Button>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

        <BottomModal
          swipeThreshold={200}
          onBackDropPress={() => {
            setEditAcc(false)
            setModalVisible(!modalVisible)
            setContName('');
                setContEmail('');
                setContPhone('');
                setPickupLoc('');
                setPickUpCords({});
                setdelRoomNo('');

          }}
          onSwiping={() => {
            setEditAcc(false)
            setModalVisible(!modalVisible)
            setContName('');
                setContEmail('');
                setContPhone('');
                setPickupLoc('');
                setPickUpCords({});
                setdelRoomNo('');

          }}
          swipeDirection={["up", "down"]}
          modalTitle={<ModalTitle title='Contact Details' style={{backgroundColor: COLORS.surface, color: COLORS.outline}}/>}
          modalStyle={{color: COLORS.outline}}
          modalAnimation={new SlideAnimation({
            slideFrom: "bottom"
          })}
          onHardwareBackPress={() => {
            setEditAcc(false)
            setModalVisible(!modalVisible)
            setContName('');
                setContEmail('');
                setContPhone('');
                setPickupLoc('');
                setPickUpCords({});
                setdelRoomNo('');

          }}
          visible={modalVisible}
          onTouchOutside={() => {
            setEditAcc(false)
            setModalVisible(!modalVisible)
            setContName('');
                setContEmail('');
                setContPhone('');
                setPickupLoc('');
                setPickUpCords({});
                setdelRoomNo('');

          }}
          footer={
            <ModalFooter
              style={{justifyContent: 'center', backgroundColor: COLORS.surface}}
            >
              <View style={{paddingVertical:10, width: '100%', paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
                {editAcc ? (
                    <>
                        <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20,}} onPress={() => {
                            setEditAcc(!editAcc);
                        }}>
                            <AntDesign color={COLORS.outline} name='left' size={18}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, }} onPress={() => {
                            handleEdit(current.id)
                        }}>
                            {isLoading ? (
                                <View style={{alignItems: "center"}}>
                                    <ActivityIndicator animating={true} color={COLORS.button} />
                                </View>
                            ):(
                                <>
                                    <Text style={[STYLES.textNormal]}>Done</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </>
                ):(
                    <>
                        <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20,}} onPress={() => {
                            setModalVisible(!modalVisible)
                        }}>
                            <AntDesign color={COLORS.outline} name='left' size={18}/>
                        </TouchableOpacity>
                        {profile.accountType === 'Admin' && (
                            <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, }} onPress={() => {
                                setContName(current.name);
                                setContEmail(current.email);
                                setContPhone(current.phone);
                                setPickupLoc(current.address);
                                setPickUpCords(current.coords);
                                setdelRoomNo(current.houseNo);
                                setEditAcc(!editAcc);
                            }}>
                                <Text style={[STYLES.textNormal]}>Edit</Text>
                        </TouchableOpacity>
                        )}
                    </>
                )}
              </View>
            </ModalFooter>
          }
  
          >
          <ModalContent style={{width: "100%", height: 450, backgroundColor: COLORS.surface}}>
            {editAcc ? (
                <View style={{flex: 1, alignItems: 'center'}}>
                    <MyInput
                        isRequired={missingInputs}
                        errorText="Name is required"
                        placeholder='Name'
                        label='Name'
                        type='add'
                        value={contName}
                        onChangeFunction={(contName) => setContName(contName)}
                    />
                    <MyInput 
                        isRequired={missingInputs}
                        errorText="Contact phone is required"
                        placeholder='Contact Phone'
                        label='Contact phone' 
                        type='number'
                        value={contPhone}
                        onChangeFunction={(contPhone) => setContPhone(contPhone)}
                    />
                    <MyInput
                        placeholder='Email'
                        label='Email'
                        type='email'
                        value={contEmail}
                        onChangeFunction={(contEmail) => setContEmail(contEmail)}
                    />
                    <View style={{width: screenWidth, justifyContent: 'center',}}>
                        <TextInput
                            style={{backgroundColor: 'transparent', height: 100, paddingBottom: 10, overflow: "scroll"}}
                            placeholder='Address'
                            label='Address'
                            multiline={true}
                            type='add'
                            textColor={COLORS.outline}
                            contentStyle={{fontFamily: 'DMSansSemiBold'}}
                            placeholderTextColor='#BCBCBC'
                            value={pickUpLoc}
                            onChangeText={(pickUpLoc) => setPickupLoc(pickUpLoc)}
                            onPress={() => {
                                setViewMap(!viewMap);
                            }}
                            isRequired={missingInputs}
                            errorText="Contact phone is required"
                        />
                        <HelperText type="error" padding="normal" visible={!pickUpLoc && missingInputs ? true : false}>
                            Address is required
                        </HelperText>
                    </View>
                    <MyInput
                        placeholder='Apartment/House/Room Number'
                        label='Apartment/House/Room Number'
                        type='add'
                        value={delRoomNo}
                        onChangeFunction={(delRoomNo) => setdelRoomNo(delRoomNo)}
                    />
                </View>
            ):(
                <>
                <View style={{alignItems: 'center', paddingVertical: 10}}>
                    <ProfileImage name={current.name} size='Large'/>
                    <Text style={STYLES.textHeading}>{current.name}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity style={{alignItems: 'center', backgroundColor: COLORS.button, padding: 5, borderRadius: 8, flex: 1, marginHorizontal: 5}} onPress={() => {
                            Linking.openURL(`tel:${current.phone}`)
                        }}>
                            <MaterialCommunityIcons color={COLORS.background} size={20} name='phone'/>
                            <Text style={[STYLES.textNormal, {color: COLORS.background, fontSize: 12}]}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignItems: 'center', backgroundColor: COLORS.button, padding: 5, borderRadius: 8, flex: 1, marginHorizontal: 5}} onPress={() => {
                            Linking.openURL(`sms:${current.phone}`)
                        }}>
                            <MaterialCommunityIcons color={COLORS.background} size={20} name='message-text'/>
                            <Text style={[STYLES.textNormal, {color: COLORS.background, fontSize: 12}]}>SMS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignItems: 'center', backgroundColor: COLORS.button, padding: 5, borderRadius: 8, flex: 1, marginHorizontal: 5}} onPress={() => {
                            Linking.openURL(`whatsapp://send?text=hello&phone=+263${current.phone}`)
                        }}>
                            <MaterialCommunityIcons color={COLORS.background} size={20} name='whatsapp'/>
                            <Text style={[STYLES.textNormal, {color: COLORS.background, fontSize: 12}]}>WhatsApp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignItems: 'center', backgroundColor: COLORS.button, padding: 5, borderRadius: 8, flex: 1, marginHorizontal: 5}} onPress={() => {
                            openMaps(current.coords.latitude, current.coords.longitude, current.name);
                        }}>
                            <MaterialIcons color={COLORS.background} size={20} name='location-pin'/>
                            <Text style={[STYLES.textNormal, {color: COLORS.background, fontSize: 12}]}>Map</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 15}}>
                        <MaterialIcons color={COLORS.outline} size={30} name='location-pin'/>
                        <Text style={[STYLES.textNormal, {marginHorizontal: 10}]}>{current.address}</Text>
                    </View>
                    <Divider />
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 15}}>
                        <MaterialCommunityIcons color={COLORS.outline} size={30} name='home-city-outline'/>
                        <Text style={[STYLES.textNormal, {marginHorizontal: 10}]}>{current.houseNo}</Text>
                    </View>
                    <Divider />
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 15}}>
                        <MaterialCommunityIcons color={COLORS.outline} size={30} name='phone'/>
                        <Text style={[STYLES.textNormal, {marginHorizontal: 10}]}>{current.phone}</Text>
                    </View>
                    <Divider />
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 15}}>
                        <MaterialCommunityIcons color={COLORS.outline} size={30} name='email-outline'/>
                        <Text style={[STYLES.textNormal, {marginHorizontal: 10}]}>{current.email}</Text>
                    </View>
                </View>
                </>
            )}
          </ModalContent>
        </BottomModal>
      </Portal>

        <View style={{flex: 1, height: screenHeight}}>
            {viewAdd ? (
                <View style={{flex: 1, alignItems: 'center'}}>
                    <MyInput
                        isRequired={missingInputs}
                        errorText="Name is required"
                        placeholder='Name'
                        label='Name'
                        type='add'
                        value={contName}
                        onChangeFunction={(contName) => setContName(contName)}
                    />
                     <MyInput 
                        isRequired={missingInputs}
                        errorText="Contact phone is required"
                        placeholder='Contact Phone'
                        label='Contact phone' 
                        type='number'
                        value={contPhone}
                        onChangeFunction={(contPhone) => setContPhone(contPhone)}
                    />
                    <MyInput
                        placeholder='Email'
                        label='Email'
                        type='email'
                        value={contEmail}
                        onChangeFunction={(contEmail) => setContEmail(contEmail)}
                    />
                    <View style={{width: screenWidth, justifyContent: 'center',}}>
                        <TextInput
                            style={{backgroundColor: 'transparent', height: 100, paddingBottom: 10, overflow: "scroll"}}
                            placeholder='Address'
                            label='Address'
                            multiline={true}
                            type='add'
                            textColor={COLORS.outline}
                            contentStyle={{fontFamily: 'DMSansSemiBold'}}
                            placeholderTextColor='#BCBCBC'
                            value={pickUpLoc}
                            onChangeText={(pickUpLoc) => setPickupLoc(pickUpLoc)}
                            onPress={() => {
                                setViewMap(!viewMap);
                            }}
                            isRequired={missingInputs}
                            errorText="Contact phone is required"
                        />
                        <HelperText type="error" padding="normal" visible={!pickUpLoc && missingInputs ? true : false}>
                            Address is required
                        </HelperText>
                    </View>
                    <MyInput
                        placeholder='Apartment/House/Room Number'
                        label='Apartment/House/Room Number'
                        type='add'
                        value={delRoomNo}
                        onChangeFunction={(delRoomNo) => setdelRoomNo(delRoomNo)}
                    />
                </View>
            ):(
                <View style={{height: '95%'}}>
                    {search ? (
                        <View style={{width: screenWidth}}>
                            <Searchbar
                                mode='bar'
                                placeholder="Search by name, address"
                                onChangeText={(searchQuery) => {
                                    setSearchQuery(searchQuery)
                                    searchQ(searchQuery);
                                }}
                                value={searchQuery}
                                right={() => (<MaterialCommunityIcons name='close' size={20} style={{paddingRight: 10}} color={COLORS.outline} onPress={() => {
                                    setSearchQuery('');
                                    setSearch(false)
                                    setContacts(tempContacts);
                                }}/>)}
                                onClearIconPress={() => {
                                    searchQ(searchQuery);
                                    setSearch(false);
                                }}
                                style={{borderRadius: 0}}
                                inputStyle={{color: COLORS.outline}}
                                />
                        </View>
                    ):(
                        <></>
                    )}
                    <FlatList
                        data={contacts}
                        key={(item, index) => index}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => handleBottomModal(item)}>
                            <View style={{flex: 1, flexDirection: 'row', padding: 15, width: '100%', alignItems: 'center' }}>
                                {/* <Image style={{width: 50, height: 50, marginRight: 10}} source={require('../assets/user.png')}/> */}
                               <ProfileImage name={item.name} size='Small'/>
                                <View>
                                    <Text style={[STYLES.textHeading, {fontSize: 15, paddingVertical: 2, color: COLORS.onTertiaryContainer}]}>{item.name}</Text>
                                    <Text numberOfLines={3} style={{fontSize: 15, color: COLORS.outline}}>{item.address}</Text>
                                </View>
                            </View>
                            <Divider style={{backgroundColor: COLORS.outline}}/>
                    </TouchableOpacity>
                        )}
                    />
                    
                </View>
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
    </View>
  )
}

export default Contacts

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
})