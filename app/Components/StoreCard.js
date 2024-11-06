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
import { useLogin } from '../utils/LoginProvider';

const StoreCard = ({name, addr, image, category, onPress, onPressDelete}) => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const [menu3, setMenu3] = useState(false);
  const { profile } = useLogin();

  return (
    <>
   <View style={{justifyContent: 'space-between',  width: screenWidth - 10 , alignItems: 'center'}}>
     <TouchableOpacity style={{flexDirection: 'row', flex: 1, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginVertical: 5, width: screenWidth - 20}}>
        <Image source={image} style={STYLES.homeCardImage2} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
          <View style={{width: '80%'}}>
              <Text style={[STYLES.textNormal, {fontFamily: 'DMSansBold', color: COLORS.onTertiaryContainer}]}>{name}</Text>
              <Text numberOfLines={2} ellipsizeMode='tail' style={[STYLES.textNormal]}>{addr}</Text>
              <Text style={[STYLES.textNormal, {fontFamily: 'DMSansItalic'}]}>{category}</Text>
          </View>
         {profile.accountType === "Admin" ? (
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
             <Menu.Item leadingIcon={() => <AntDesign name="delete" size={25} color={COLORS.error} />} onPress={onPressDelete} titleStyle={{color: COLORS.error}} title="Remove" />
           </Menu>
         
         </View>
         ):(
          <></>
         )}
        </View>
    </TouchableOpacity>
   </View>
    <Divider />
  </>
  )
}

export default StoreCard