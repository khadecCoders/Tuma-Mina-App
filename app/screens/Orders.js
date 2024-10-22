import { FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, Button, Card, Dialog, Modal, Portal, SegmentedButtons, Snackbar, Text } from 'react-native-paper';
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

const Orders = ({ navigation }) => {
    const { navigate } = useNavigation(); 
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
    const { isLoggedIn, setIsLoggedIn, profile, setProfile } = useLogin();
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
    const [statusVisible, setStatusVisible] = useState(false);
    const [newStat, setNewStat] = useState('');
    const [currStat, setCurrStat] = useState('');
    const [ordID, setOrdID] = useState('');
    const [bikerOrders, setBikerOrders] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [deliveries, setDeliveries] = useState('');

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

              setUserOrders(myUserOrders);
              setBikerOrders(myOrders);
              setOrders(newOrders);
          }

      const accRef = ref(db, `users/${profile.userId}`);
      onValue(accRef, (snapshot) => {
        const userAcc = snapshot.val();
        setDeliveries(userAcc.deliveries)
      })
      
      });
  }, [])

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

            const availBikers = newBikers.filter((item) => item.available && item.accountType === "Biker")
            setBikers(availBikers);
        }
    });
  }, []);

    const toggleModal = (ordId) => {
        setOrderId(ordId);
        setVisible(!visible)
    }

    const toggleStatus = (id, stat, newStat) => {
      setCurrStat(stat)
      setOrdID(id)
      setStatusVisible(!statusVisible)
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
            toggleStatus()
          })
        } else {
          setIsLoading(false);
          setSMsg("Order status successfully updated to " + stat + "!")
          setSuccessVisible(true)
          toggleStatus()
        }
      })
    }
    
    const toggleViewOrder = (item, index) => {
      setOrder(item);
      setViewOrder(!viewOrder);
  }

  const toggleDeleteModal = (itemId, imgName) => {
      setDeleteKey(itemId);
      setDeleteImageName(imgName)
      setDeleteVisible(!deleteVisible)
  }
    const proceed = (disId, id) => {
      console.log(bikerId)
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
      <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
        console.log('create task')
      }}>
        <MaterialCommunityIcons color={COLORS.outline} name='reload' size={15}/>
      </TouchableOpacity>
      <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
        console.log('create task')
      }}>
        <MaterialCommunityIcons color={COLORS.outline} name='qrcode' size={15}/>
      </TouchableOpacity>
      <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
        console.log('create task')
      }}>
        <MaterialIcons color={COLORS.outline} name='search' size={15}/>
      </TouchableOpacity>
   </View>
  )

  return (
    <View style={[styles.container]}>
      <Header 
        title='Tasks' 
        titleColor={COLORS.outline}
        rightView={<CustomHeader/>}
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
            <Modal visible={viewOrder} onDismiss={() => setViewOrder(!viewOrder)} contentContainerStyle={[STYLES.modalContainer, { height: screenHeight - 200 }]}>
                <View style={STYLES.modalInner}>
                    <Text style={STYLES.textHeading}>Order details</Text>
                    <ScrollView>
                        {order ? (
                            <View>
                            <View style={{ alignItems: 'center' }}>
                                <Image source={order.packagePicture ? ({uri: order.packagePicture}):(require('../assets/Order.jpg'))} style={STYLES.bikerAccImg} />
                            </View>

                            <View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Customer Name</Text>
                                        <Text style={STYLES.textNormal}>{order.customerName || "-- --"}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Order Date</Text>
                                        <Text style={STYLES.textNormal}>{new Date(order.orderDate).toUTCString() || "-- --"}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Order Status</Text>
                                        <Text style={STYLES.textNormal}>{order.orderStatus || "-- --"}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Delivery Date</Text>
                                        <Text style={STYLES.textNormal}>{order.deliveryDate ? (new Date(order.deliveryDate).toUTCString()): ("-- --")}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Category</Text>
                                        <Text style={STYLES.textNormal}>{order.deliveryCat || "-- --"}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Type</Text>
                                        <Text style={STYLES.textNormal}>{order.delType || "-- --"}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Additional Info</Text>
                                        <Text style={STYLES.textNormal}>{order.addInfo || "-- --"}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Delivery</Text>
                                        <Text style={STYLES.textNormal}>{order.packageName || "-- --"}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Pick Up Location</Text>
                                        <Text style={STYLES.textNormal}>{order.pickUpRoomNo + ","} {order.pickUpLoc}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Shop</Text>
                                        <Text style={STYLES.textNormal}>{order.shop || "-- --"}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Delivery Location</Text>
                                        <Text style={STYLES.textNormal}>{order.delRoomNo}, {order.delLoc}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Delivery Contact</Text>
                                        <Text style={STYLES.textNormal}>{order.delPhone || "-- --"}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Additional Instructions</Text>
                                        <Text style={STYLES.textNormal}>{order.addInstr || "-- --"}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Payment Method</Text>
                                        <Text style={STYLES.textNormal}>{order.paymentMeth}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Biker</Text>
                                        <Text style={STYLES.textNormal}>{order.biker || "-- --"}</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Delivery Time</Text>
                                        <Text style={STYLES.textNormal}>35 Mins</Text>
                                    </View>
                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[STYLES.textHeading, { paddingVertical: 2, fontSize: 15 }]}>Fee</Text>
                                        <Text style={STYLES.textNormal}>US$ 40</Text>
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
            
            {/* Change status dialog */}
            <Dialog visible={statusVisible} onDismiss={() => setStatusVisible(!statusVisible)}>
                <Dialog.Title style={{color: '#161F3D', fontFamily: 'DMSansRegular'}}>Change status</Dialog.Title>
                <Dialog.Content>
                {isLoading ? (
                      <ActivityIndicator animating={true} color={COLORS.button} />
                  ):(
                      <>
                      <Button mode='outlined' style={{marginVertical: 5, borderRadius: 0}} textColor={COLORS.button} onPress={() => confirmChange(ordID, 'In Transit')}>In Transit</Button>
                      <Button mode='outlined' style={{marginVertical: 5, borderRadius: 0}} textColor={COLORS.button} onPress={() => confirmChange(ordID, 'Arrived')}>Arrived</Button>
                      <Button mode='outlined' style={{marginVertical: 5, borderRadius: 0}} textColor='#2ac780' onPress={() => confirmChange(ordID, 'Delivered')}>Delivered</Button>
                      </>
                  )}
                  
                </Dialog.Content>
              
            </Dialog>
        </Portal>

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
            delTime='38 Mins'
            orderStatus = {segValue}
            status= {item.orderStatus}
            onPress={() => toggleModal(item.id)}
            onPressDelete={() => toggleDeleteModal(item.id, item.packagePicName)}
            onCardPress={() => toggleViewOrder(item, index)}
            onPressStatus ={() => toggleStatus(item.id)}
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
            biker={item.biker}
            delTime='38 Mins'
            orderStatus = {segValue}
            status= {item.orderStatus}
            onPress={() => toggleModal(item.id)}
            onPressDelete={() => toggleDeleteModal(item.id, item.packagePicName)}
            onCardPress={() => toggleViewOrder(item, index)}
            onPressStatus ={() => toggleStatus(item.id)}
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
            delTime='38 Mins'
            orderStatus = {segValue}
            status= {item.orderStatus}
            onPress={() => toggleModal(item.id)}
            onPressDelete={() => toggleDeleteModal(item.id, item.packagePicName)}
            onCardPress={() => toggleViewOrder(item, index)}
            onPressStatus ={() => toggleStatus(item.id)}
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
})