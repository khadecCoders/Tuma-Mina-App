import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-paper'
import myTheme from '../utils/theme'

const MyTextArea = ({label, right, type, placeholder, value, onChangeFunction, disabled}) => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();

  return (
    <View style={{width: screenWidth}}>
      <TextInput
          style={{backgroundColor: 'transparent', height: 110, paddingBottom: 10, overflow: "scroll"}}
          disabled = {disabled}
          label={label}
          textColor={COLORS.outline}
          multiline={true}
          contentStyle={{fontFamily: 'DMSansSemiBold', paddingBottom: 10}}
          placeholder={placeholder}
          placeholderTextColor='#BCBCBC'
          value={value}
          onChangeText={onChangeFunction}
        />
    </View>
  )
}

export default MyTextArea

const styles = StyleSheet.create({})