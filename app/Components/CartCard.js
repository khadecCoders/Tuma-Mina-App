import { View, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { Divider, Text, Menu } from 'react-native-paper'
import {
  MaterialIcons,
  AntDesign,
  Entypo,
  FontAwesome,
  Octicons,
  SimpleLineIcons,
  MaterialCommunityIcons

} from "@expo/vector-icons";
import myTheme from '../utils/theme'

const CartCard = ({name, addInfo, image, subtotal, onPress, onPressMinus}) => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const [menu3, setMenu3] = useState(false);
  const [quant, setQuant] = useState(1);

  return (
   <View>
     <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderRadius: 5, marginVertical: 5}}>
        <View>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold', color: '#161F3D'}]}>{name}</Text>
            <Text numberOfLines={2} ellipsizeMode='tail' style={[STYLES.textNormal, {flex: 1, width: 250}]}>{addInfo}</Text>
        </View>
        <View style={{justifyContent: 'space-between', flexDirection:'row'}}>
          <TouchableOpacity style={{alignItems: 'flex-start',justifyContent: 'flex-start',borderRadius:20,marginHorizontal:5}}>
            <MaterialCommunityIcons name="delete" size={18} color={COLORS.error}/>
          </TouchableOpacity>
        </View>
    </View>
    <Divider style={{width: '90%'}} />
   </View>
  )
}
export default CartCard;