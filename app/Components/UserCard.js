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

const UserCard = ({name, addr, image, deliveries, email, onEditPress, onPressDelete, onCardPress, type}) => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const [menu3, setMenu3] = useState(false);

  return (
   <View style={{justifyContent: 'center', alignItems: 'center'}}>
     <TouchableOpacity onPress={onCardPress} style={{flex: 1,flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginVertical: 5, width: screenWidth}}>
        <Image source={image} style={STYLES.homeCardImage} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
            <View>
                <Text style={[STYLES.textNormal, {fontWeight: 'bold', color: '#161F3D'}]}>{name}</Text>
                <Text style={STYLES.textNormal}>{email}</Text>
                <Text style={STYLES.textNormal}>{deliveries} Deliveries</Text>
            </View>
            {type === 'dispatch' ? (
                <></>
            ):(
                <View style={{justifyContent: 'space-between'}}>
            <Menu
                visible={menu3}
                onDismiss={() => setMenu3(!menu3)}
                anchor={
                <TouchableOpacity style={{alignItems: 'flex-start', justifyContent: 'flex-start'}} onPress={() =>setMenu3(!menu3)}>
                    <MaterialCommunityIcons name="dots-horizontal" size={25} color={COLORS.outline} />
                </TouchableOpacity>
                }
            >
                <Menu.Item leadingIcon={() => <AntDesign name="edit" size={25} color={COLORS.outline} />} onPress={onEditPress} title="Edit" />
                <Divider />
                <Menu.Item leadingIcon={() => <AntDesign name="delete" size={25} color={COLORS.error} />} onPress={onPressDelete} titleStyle={{color: COLORS.error}} title="Remove" />
            </Menu>
            
            </View>
            )}
        </View>
    </TouchableOpacity>
    <Divider style={{width: '90%'}} />
   </View>
  )
}

export default UserCard