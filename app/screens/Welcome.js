import React, { useState, useRef } from 'react'
import { View, Image, StyleSheet, FlatList, Animated } from 'react-native'
import { useTheme, Dialog, Portal, Text, Button } from 'react-native-paper';
import CustomButton from '../Components/CustomButton';
import Slides from '../utils/Slides';
import OnboardingItem from '../Components/OnboardingItem';
import Paginator from '../Components/Paginator';
import NextButton from '../Components/NextButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../utils/LoginProvider';
import myTheme from '../utils/theme';

function Welcome() {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme()
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null)
  const { viewedOnBoarding, setViewedOnBoarding } = useLogin();

  // Set the view index of the flatlist to the curent index being viewed
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  // Tell the flatlist that the index should be counted viewable if it's 50% viewed
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50}).current;

  const scrollTo = async () => {
      if(currentIndex < Slides.length -1 ){
          slidesRef.current.scrollToIndex({index: currentIndex + 1 });
      } else {
        try {
          await AsyncStorage.setItem('@viewedonboarding', 'true');
          await setViewedOnBoarding(true);
        } catch (error) {
          console.log('Error @setitem: ', error)
        }
      }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/upperCorner.png')} style={STYLES.upperCorner} />
      <View style={STYLES.container}>
          <FlatList
           data={Slides} 
           renderItem={({item}) => <OnboardingItem item={item} />}
           horizontal 
           showsHorizontalScrollIndicator={false} 
           pagingEnabled
           bounces={false}
           keyExtractor={(item) => item.id}
           onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX }}}], {
            useNativeDriver: false
           })}
           scrollEventThrottle={32}
           onViewableItemsChanged={viewableItemsChanged}
           viewabilityConfig={viewConfig}
           ref={slidesRef}
          />
      </View>
      <Paginator data={Slides} scrollX={scrollX}/>
      {/* <CustomButton text="Next"></CustomButton>  */}
      <NextButton percentage = {(currentIndex + 1) * (100/Slides.length + 2)} scrollTo={scrollTo} />

      <Image source={require('../assets/lowerCorner.png')} style={STYLES.lowerCorner} />
    </View>
  )
}

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent:'center',
    fontFamily: 'DMSansBold'
  },
})