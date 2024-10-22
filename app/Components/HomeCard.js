import { View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Divider, Text } from 'react-native-paper'
import myTheme from '../utils/theme'

const HomeCard = ({name, addr, image, category}) => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();

  return (
   <View style={{justifyContent: 'center', alignItems: 'center'}}>
     <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginVertical: 5}}>
        <Image source={image} style={STYLES.homeCardImage2} />
        <View>
            <Text style={[STYLES.textNormal, {fontWeight: 'bold', color: '#161F3D'}]}>{name}</Text>
            <Text numberOfLines={1} ellipsizeMode='tail' style={[STYLES.textNormal, {flex: 1, width: 250}]}>{addr}</Text>
            <Text style={[STYLES.textNormal, {fontFamily: 'DMSansItalic'}]}>{category}</Text>
        </View>
    </TouchableOpacity>
    <Divider style={{width: '90%'}} />
   </View>
  )
}

export default HomeCard