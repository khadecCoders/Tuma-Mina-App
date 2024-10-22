import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'
import myTheme from '../utils/theme';
import {
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign
} from "@expo/vector-icons";

const CustomButton = ({text, onPress, type}) => {
  const { COLORS, screenHeight, screenWidth } = myTheme();

  return (
    <TouchableOpacity>
      {type === 'cancel' ? (
        <Button mode="contained" style={{borderRadius: 0, width: screenWidth - 60, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.error}} onPress={onPress}>
            {text}
        </Button>
      ): type === 'outline' ? (
        <Button mode="outlined" style={{borderRadius: 0, width: screenWidth - 60, paddingVertical: 5, marginVertical: 5, backgroundColor: 'transparent', borderColor: COLORS.button}} onPress={onPress}>
            {text}
        </Button>
      ): type === 'text' ? (
        <Button icon={() => <MaterialIcons name="touch-app" size={20} color={COLORS.button} />} contentStyle={{flexDirection: 'row-reverse'}} mode="text" style={{borderRadius: 0, width: screenWidth - 60, marginVertical: 5, backgroundColor: 'transparent', borderColor: COLORS.button, alignItems: 'flex-start',}} onPress={onPress}>
            {text}
        </Button>
      ) : (
        <Button mode="contained" style={{borderRadius: 0, width: screenWidth - 60, paddingVertical: 5, marginVertical: 5, backgroundColor: COLORS.button}} onPress={onPress}>
            {text}
        </Button>
      )}
    </TouchableOpacity>
  )
}

export default CustomButton