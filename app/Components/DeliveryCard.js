import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Card, Text } from 'react-native-paper'
import myTheme from '../utils/theme';

const DeliveryCard = ({ orderdate, order, type, shop, biker, customerName, customerAddress, fee, delTime, orderStatus}) => {
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();

  return (
    <>
        {orderStatus === 'History' ? (
        <Card mode='contained' elevation={5} style={{backgroundColor: '#fff', padding: 5, marginVertical: 3}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Order Date: </Text>
            <Text style={STYLES.textNormal}>{orderdate}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Order: </Text>
            <Text style={STYLES.textNormal}>{order}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Type: </Text>
            <Text style={STYLES.textNormal}>{type}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Shop: </Text>
            <Text style={STYLES.textNormal}>{shop}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Biker: </Text>
            <Text style={STYLES.textNormal}>{biker}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Customer Name: </Text>
            <Text style={STYLES.textNormal}>{customerName}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Customer Address: </Text>
            <Text style={STYLES.textNormal}>{customerAddress}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Fee Charged: </Text>
            <Text style={STYLES.textNormal}>{fee}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Delivery Time: </Text>
            <Text style={STYLES.textNormal}>{delTime}</Text>
            </View>
        </Card>
    ) : (
        <Card mode='contained' elevation={5} style={{backgroundColor: '#fff', padding: 5, marginVertical: 3}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Order Date: </Text>
            <Text style={STYLES.textNormal}>{orderdate}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Order: </Text>
            <Text  numberOfLines={4} style={[STYLES.textNormal, {flex: 1}]}>{order}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Type: </Text>
            <Text style={STYLES.textNormal}>{type}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Shop: </Text>
            <Text style={STYLES.textNormal}>{shop}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Biker: </Text>
            <Text style={STYLES.textNormal}>{biker}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Customer Name: </Text>
            <Text style={STYLES.textNormal}>{customerName}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Customer Address: </Text>
            <Text  numberOfLines={4} style={[STYLES.textNormal, {flex: 1}]}>{customerAddress}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Fee Charged: </Text>
            <Text style={STYLES.textNormal}>{fee}</Text>
            </View>
        </Card>
    )}
    </>
  )
}

export default DeliveryCard

const styles = StyleSheet.create({})