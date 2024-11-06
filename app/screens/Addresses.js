import { FlatList, Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, AnimatedFAB, Button, Card, Dialog, Divider, Modal, Portal, SegmentedButtons, Snackbar, Text, Searchbar } from 'react-native-paper';
import myTheme from '../utils/theme';
import { useLogin } from '../utils/LoginProvider';
import {
    MaterialIcons,
    AntDesign,
    Feather
  } from "@expo/vector-icons";
import Header from '../Components/Header';
import AddressComponent from '../Components/AddressComponent';
import MyInput from '../Components/MyInput';
import CustomButton from '../Components/CustomButton';
import { onValue, push, ref, remove } from 'firebase/database';
import { db } from '../config';
import MapView, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import MyTextArea from '../Components/MyTextArea';

const Addresses = ({ navigation, animateFrom }) => {
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
    const { isLoggedIn, setIsLoggedIn, profile, setProfile, location, setLocation, setLocationData  } = useLogin();
    const [visible, setVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [isExtended, setIsExtended] = useState(true);
    const [fabVisible, setFabVisible] = useState(true);
    const [addAddress, setAddAddress] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [msg, setMSG] = useState("");
    const [sMsg, setSMsg] = useState("");
    const [missingInputs, setMissingInputs] = useState(false);
    const [streetName, setStreetName] = useState('');
    const [suburb, setSuburb] = useState('')
    const [building, setBuilding] = useState('');
    const [roomNo, setRoomNo] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [deleteKey, setDeleteKey] = useState('')
    const [viewMap, setViewMap] = useState(false);
    const [delLoc, setdelLoc] = useState('');
    const [delRoomNo, setdelRoomNo] = useState('');
    const [delPhone, setdelPhone] = useState('');
    const [delName, setdelName] = useState('');
    const [delCords, setDelCords] = useState({});
    const [viewAdds, setViewAds] = useState(false);
    const [cordType, setCordType] = useState('');
    const [mapType, setMapType] = useState('standard');
    const [layers, setLayers] = useState("none");
    const [mapRegion, setMapRegion] = useState({           
          latitude: location.latitude, 
          longitude: location.longitude,
          latitudeDelta: 0.0140,
          longitudeDelta: 0.0080
      });

    const [showLoc, setShowLoc] = useState('none');
    const [myLocation, setMyLocation] = useState('');
    const [search, setSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchNone, setSearchNone] = useState(false);
    const [tempSearch, setTempSearch] = useState([]);

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
    
    const isIOS = Platform.OS === 'ios';

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
                    setTempSearch(MyAddresses);
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

    const toggleDeleteModal = (itemId) => {
        setDeleteVisible(!deleteVisible);
        setDeleteKey(itemId)
    }

    const handleAddAddress = () => {
        if (delLoc !== '') {
            setIsLoading(true);
            push(ref(db, 'Addresses/'), {
                userId: profile.userId,
                delLoc: delLoc,
                roomNo: delRoomNo,
                delCords: delCords,
                delName: delName, 
                delPhone: delPhone,         

            }).then(() => {
                setIsLoading(false)
                setSMsg(`An address has been added to your list of addresses!`);
                setSuccessVisible(true)
                setMissingInputs(false)
                setAddAddress(!addAddress)

                // Clear input states
                setdelLoc('');
                setdelRoomNo('');
                setDelCords('');
                setdelName('');
                setdelPhone('');

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

    const confirmDelete = (index) => {
        // .......
        remove(ref(db,"Addresses/" + index))
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
    
      }

    onRegionChange = region => {
        setMapRegion(region)
        fetchLocationAddress(region);
    }

    const CustomHeader = () => (
        <View style={{flexDirection: 'row', justifyContent: 'space-around', flex: 1}}>
           <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
               // Clear input states
               setdelLoc('');
               setdelRoomNo('');
               setDelCords('');
               setdelName('');
               setdelPhone('');
               setAddAddress(!addAddress)
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
        let temp = addresses.filter((item) => String(item.delName).includes(sQuery) || String(item.delLoc).includes(sQuery) || String(item.roomNo).includes(sQuery) || String(item.delPhone).includes(sQuery))
        setAddresses(temp);
        if(temp.length === 0){
            setSearchNone(true);
        } else{
            setSearchNone(false);
        }
        } else {
        setSearchNone(false);
        setAddresses(tempSearch);
        }
    }

  return (
    <View style={[styles.container, {backgroundColor: COLORS.surface}]}>
        <Header
            title='My Addresses'
            titleColor={COLORS.outline}
            rightView={search ? null : <CustomHeader/>}
        />

        {search ? (
        <View style={{width: screenWidth}}>
            <Searchbar
                mode='bar'
                placeholder="Search by name, address, house No, phone number"
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
                                setMapType("hybridFlyover")
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
                            setAddAddress(!addAddress)
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
                                setPickUpCords(location);
                            } else if(cordType === "Delivery"){
                                setdelLoc(myLocation.street +", "+myLocation.city +", "+myLocation.country);
                                setDelCords(location);
                            } else{
                                // Do nothing
                            }
                            setCordType('');
                            setViewMap(!viewMap);
                            setAddAddress(!addAddress)
                        }}>
                            <Button compact mode='contained' contentStyle={{width: 'auto'}} style={{borderRadius: 30, width: 'auto', paddingHorizontal: 1}}>Next</Button>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

            <Modal visible={visible} onDismiss={() => setVisible(!visible)} contentContainerStyle={[STYLES.modalContainer, {height: screenHeight - 300}]}>
                <View style={STYLES.modalInner}>
                    <Text style={STYLES.textHeading}>Edit your delivery address</Text>
                    <ScrollView>
                        <MyInput label='City' type='add'/>
                        <MyInput label='Suburb/Location' type='add'/>
                        <MyInput label='Street(s)' type='add'/>
                        <MyInput label='Building Name' type='add'/>
                        <MyInput label='Apart/House Number' type='add'/>

                        <CustomButton text='Update Changes' onPress={() => {
                            alert('Successfully')
                            toggleModal()
                        }}/>
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
                <Button textColor={COLORS.error} onPress={() => confirmDelete(deleteKey)}>Proceed</Button>
                </Dialog.Actions>
            </Dialog>

            {/* Add Address modal */}
            <Modal visible={addAddress} onDismiss={() => setAddAddress(!addAddress)} contentContainerStyle={[STYLES.modalContainer, { height: screenHeight - 300 }]}>
                <View style={STYLES.modalInner}>
                    <Text style={STYLES.textHeading}>Add an address</Text>
                    <ScrollView>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Button icon={() => <MaterialIcons name="touch-app" size={20} color={COLORS.button} />} contentStyle={{flexDirection: 'row-reverse'}} mode="text" style={{borderRadius: 0, marginVertical: 5, backgroundColor: 'transparent',  alignItems: 'flex-start',}} onPress={() => {
                                setCordType("Delivery");
                                setViewMap(!viewMap);
                                setAddAddress(!addAddress)
                            }}>
                                Open Map
                            </Button>
                        </View>
                        <Divider />
                        <MyTextArea
                            placeholder='Delivery Address'
                            label='Delivery Address'
                            disabled = {true}
                            type='add'
                            value={delLoc}
                            onChangeFunction={(delLoc) => setdelLoc(delLoc)}
                        />
                        <MyInput
                            placeholder='Apartment/House/Room Number'
                            label='Apartment/House/Room Number'
                            type='add'
                            value={delRoomNo}
                            onChangeFunction={(delRoomNo) => setdelRoomNo(delRoomNo)}
                        />
                        <Text style={[STYLES.textHeading, {fontSize: 18, paddingTop: 15, paddingBottom: 0}]}>Other Details</Text>
                        <MyInput
                            placeholder='Contact Name'
                            label='Contact Name'
                            type='add'
                            value={delName}
                            onChangeFunction={(delName) => setdelName(delName)}
                        />
                        
                        <MyInput 
                            placeholder='Contact Phone'
                            label='Contact phone' 
                            type='number'
                            value={delPhone}
                            onChangeFunction={(delPhone) => setdelPhone(delPhone)}
                        />
                      
                    </ScrollView>
                    {isLoading ? (
                            <Button mode="contained" style={{ borderRadius: 0, width: screenWidth - 50, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.background }}>
                                <ActivityIndicator animating={true} color={COLORS.button} />
                            </Button>
                        ) : (
                            <>
                                <TouchableOpacity onPress={() => {
                                    handleAddAddress()
                                    }}>
                                    <Button mode='contained' style={{borderRadius: 0, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.button}}>
                                        Add Address
                                    </Button>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setAddAddress(!addAddress)
                                    }}>
                                    <Button mode='contained' style={{borderRadius: 0, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.error}}>
                                        Cancel
                                    </Button>
                                </TouchableOpacity>
                            </>
                        )}
                </View>
            </Modal>
        </Portal>

      <ScrollView horizontal={true} onScroll={onScroll} style={{flex: 1, paddingVertical: 5}}>
      <FlatList
            data={addresses}
            key={(item, index) => index}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => (
            <AddressComponent
                loc={item.delLoc}
                houseNo={item.roomNo}
                contName={item.delName}
                phone={item.delPhone}
                deleteItem={true}
                onPressEdit={() => toggleModal()}
                onPressDelete={() => toggleDeleteModal(item.id)}
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

export default Addresses


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
        // elevation: 3
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