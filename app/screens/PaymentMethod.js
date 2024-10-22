import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Card, Dialog, Divider, Menu, Modal, Portal, SegmentedButtons, Text, RadioButton } from 'react-native-paper';
import myTheme from '../utils/theme';
import { useLogin } from '../utils/LoginProvider';
import StoreCard from '../Components/StoreCard';
import {
    MaterialIcons,
    AntDesign,
    MaterialCommunityIcons
  } from "@expo/vector-icons";
import Header from '../Components/Header';
import MyInput from '../Components/MyInput';
import CustomButton from '../Components/CustomButton';
import MyTextArea from '../Components/MyTextArea';

const PaymentMethod = ({ navigation }) => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const [visible, setVisible] = useState(false);

  const toggleModal = () => {
    setVisible(!visible)
}
    return(    
    
    <View style={[styles.container,{backgroundColor:COLORS.background}]}>
        <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(!visible)} contentContainerStyle={[STYLES.modalContainer, {height: screenHeight - 300}]}>
                    <View style={[STYLES.modalInner,{alignItems:'center'},{justifyContent:'center'}]}>
                        <View style={[{backgroundColor:'#2ac780',borderRadius:60}]}> 
                         <MaterialCommunityIcons name="check" size={130} color={COLORS.background} style={{borderRadius: 100}}/>
                        </View>
                        <Text style={[STYLES.textHeading,{color:COLORS.backdrop},{fontSize:30},{fontWeight:'bold'}]}>Success!</Text>
                        <Text   style={[STYLES.textNormal,{color:COLORS.backdrop,fontWeight:'bold'}]}>Your Order Has been successfully placed. Please keep tracking it's progress.</Text>
                        <View style={{alignItems:'center',justifyContent:'center',marginVertical:15}}>
                          <CustomButton text='Done' onPress={() => toggleModal()}/>
                        </View>
                    </View>
                </Modal>
        </Portal>
        <Header title='Method' backPress={() => navigation.goBack()} menuPress={() => navigation.toggleDrawer()}/>
            
        <View style={{paddingHorizontal: 10, width: '100%'}}>
            <Text style={STYLES.textHeading}>Payment Method</Text>
        </View>

     <View style={{flexDirection: 'row',paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginVertical: 15, width: '100%'}}>
       <View style={{backgroundColor: COLORS.button, padding: 8, borderRadius: 8}}>
        <MaterialCommunityIcons name="cash-marker" size={35} color={COLORS.background} />
       </View>
       <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignItems: 'center'}}>
          <View  style={{paddingHorizontal: 10}}>
              <Text  ellipsizeMode='tail' style={[STYLES.textNormal]}>Cash Upon Delivery</Text>
              <Text style={[STYLES.textNormal, {fontWeight: 'bold', color: '#161F3D'}]}>USD$ 15.00</Text>
          </View>
          <RadioButton status='checked'/>
       </View>
    </View>
    <View style={{alignItems:'start',justifyContent:'start', marginHorizontal:25}}>
     <Text  ellipsizeMode='tail' style={[STYLES.textNormal]}>Click proceed to continue....</Text>
    </View>
    <View style={{alignItems:'center',justifyContent:'center',marginVertical:15}}>
    <CustomButton text='Proceed' onPress={() => toggleModal()}/>
    </View>

    </View>
    )

}
export default PaymentMethod

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'start',
        paddingBottom: 15
    },
})