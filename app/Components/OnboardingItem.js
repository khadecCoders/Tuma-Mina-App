import { View, Text, Image, Animated } from 'react-native'
import React, { useRef } from 'react'
import myTheme from '../utils/theme';

const OnboardingItem = ({item}) => {
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();

  return (
    <View style={STYLES.container}>
        <Image source={item.image} style={STYLES.image} />
        <Text style={{fontSize: 35, fontWeight: 'bold', color: COLORS.outline, fontFamily: 'DMSansBold' }}>{item.title}</Text>
        <Text style={{fontSize: 18, color: COLORS.outline, textAlign: 'center', paddingHorizontal: 30, paddingVertical: 8}}>
        {item.description}</Text>
    </View>
  )
}

export default OnboardingItem