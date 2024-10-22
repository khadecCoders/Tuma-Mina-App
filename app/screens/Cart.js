import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Card, Dialog, Divider, Menu, Modal, Portal, SegmentedButtons, Text } from 'react-native-paper';
import myTheme from '../utils/theme';
import { useLogin } from '../utils/LoginProvider';
import CartCard from '../Components/CartCard';
import {
    MaterialIcons,
    AntDesign,
    MaterialCommunityIcons
  } from "@expo/vector-icons";
import Header from '../Components/Header';

const Cart = ({ navigation }) => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
    return(    
    <View style={styles.container}>
        <Header title='Cart' backPress={() => navigation.goBack()} menuPress={() => navigation.toggleDrawer()}/>
        <View style={{paddingHorizontal: 10, width: '100%'}}>
            <Text style={STYLES.textHeading}>My Cart</Text>

        </View>
        <ScrollView showsVerticalScrollIndicator={true} style={{height: screenHeight - 580, backgroundColor: COLORS.background, borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
          <CartCard name='3 Piecer with chips' price='US$3 each' subtotal='US$6 subtotal' image={require('../assets/FastFood.jpg')} onPress={() => toggleModal()} onPressMinus={() => toggleDeleteModal()}/>
          <CartCard name='3 Piecer with chips' price='US$3 each' subtotal='US$6 subtotal' image={require('../assets/FastFood.jpg')} onPress={() => toggleModal()} onPressMinus={() => toggleDeleteModal()}/>
          <CartCard name='3 Piecer with chips' price='US$3 each' subtotal='US$6 subtotal' image={require('../assets/FastFood.jpg')} onPress={() => toggleModal()} onPressMinus={() => toggleDeleteModal()}/>
          <CartCard name='3 Piecer with chips' price='US$3 each' subtotal='US$6 subtotal' image={require('../assets/FastFood.jpg')} onPress={() => toggleModal()} onPressMinus={() => toggleDeleteModal()}/>
          <CartCard name='3 Piecer with chips' price='US$3 each' subtotal='US$6 subtotal' image={require('../assets/FastFood.jpg')} onPress={() => toggleModal()} onPressMinus={() => toggleDeleteModal()}/>
          <CartCard name='3 Piecer with chips' price='US$3 each' subtotal='US$6 subtotal' image={require('../assets/FastFood.jpg')} onPress={() => toggleModal()} onPressMinus={() => toggleDeleteModal()}/>
          <CartCard name='3 Piecer with chips' price='US$3 each' subtotal='US$6 subtotal' image={require('../assets/FastFood.jpg')} onPress={() => toggleModal()} onPressMinus={() => toggleDeleteModal()}/>
          <CartCard name='3 Piecer with chips' price='US$3 each' subtotal='US$6 subtotal' image={require('../assets/FastFood.jpg')} onPress={() => toggleModal()} onPressMinus={() => toggleDeleteModal()}/>
        </ScrollView>
    </View>
    )

}
export default Cart

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 15
    },
})