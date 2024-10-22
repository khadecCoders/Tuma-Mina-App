import { View, Text, StyleSheet, Animated } from 'react-native'
import React from 'react'
import myTheme from '../utils/theme';

const Paginator = ({data, scrollX}) => {
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();

  return (
    <View style={{flexDirection: 'row', height: 24, marginTop: 8}}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * screenWidth, i * screenWidth * 1, (i + 1) * screenWidth];

        const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10,20,10],
            extrapolate: 'clamp'
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
        });

        return <Animated.View style={[styles.dot, {width: dotWidth, opacity: opacity}]} key={i.toString()}/>
      })}
    </View>
  )
}

export default Paginator
const styles = StyleSheet.create({
    dot: {
        height: 10, 
        borderRadius: 5, 
        backgroundColor: '#369ADC',
        marginHorizontal: 8
    }
})