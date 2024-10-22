import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-paper'
import myTheme from '../utils/theme'

const MyTextAreaTwo = ({label, right, type, placeholder}) => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();

  return (
    <View style={{width: screenWidth - 50, marginVertical: 10}}>
      <TextInput
          style={{backgroundColor: '#E3E3E3', height: 70}}
          label={label}
          textColor={COLORS.outline}
          multiline={true}
          contentStyle={{fontFamily: 'DMSansSemiBold'}}
          placeholder={placeholder}
          placeholderTextColor='#BCBCBC'
        />
    </View>
  )
}

export default MyTextAreaTwo

const styles = StyleSheet.create({})