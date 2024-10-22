import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Card, Text } from 'react-native-paper'
import myTheme from '../utils/theme';
import { TouchableOpacity } from 'react-native';
import {
    MaterialIcons,
    AntDesign,
    Entypo,
    FontAwesome,
    Octicons,
    SimpleLineIcons,

  } from "@expo/vector-icons";

const AddressComponent = ({loc, houseNo, onPressDelete, onPressAdd, deleteItem, phone, contName }) => {
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();

  return (
    <TouchableOpacity onPress={onPressAdd} style={{flexDirection: 'row', flex:1, backgroundColor: '#fff', padding: 5, marginVertical: 3, justifyContent: 'space-between', width: screenWidth -20}}>
        <View>
            <View style={{flexDirection: 'row',  alignItems: 'flex-start'}}>
                {/* <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Address: </Text> */}
                <Text style={[STYLES.textNormal, {width: '80%', fontFamily: 'DMSansBold'}]} numberOfLines={3}>{contName}</Text>
            </View>
            <View style={{flexDirection: 'row',  alignItems: 'flex-start'}}>
                {/* <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Address: </Text> */}
                <Text style={[STYLES.textNormal, {width: '80%'}]} numberOfLines={3}>{loc}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <Text style={STYLES.textNormal}>{houseNo}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <Text style={STYLES.textNormal}>{phone}</Text>
            </View>
        </View>

      {deleteItem ? (
        <View style={{justifyContent: 'space-between'}}>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={onPressDelete}>
                <MaterialIcons name="delete" size={25} color={COLORS.error} />
                <Text style={{fontFamily: 'DMSansRegular', fontSize: 11, color: COLORS.outline}}>Delete</Text>
            </TouchableOpacity>
        </View>
      ):(
        <></>
      )}
    </TouchableOpacity>
  )
}

export default AddressComponent

const styles = StyleSheet.create({})