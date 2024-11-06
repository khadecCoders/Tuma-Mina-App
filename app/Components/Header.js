import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import myTheme from '../utils/theme';
import { Card, Surface } from 'react-native-paper';

const Header = ({title, leftView, rightView, titleColor}) => {
    const { COLORS } = myTheme();

  return (
     <Surface mode='elevated' style={{backgroundColor: COLORS.background, width: '100%', paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, borderRadius: 0, paddingBottom: 20}}>
        {leftView ? (
          <View>
              {leftView}
          </View>
        ):(
          <></>
        )}
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: titleColor, fontSize: 20, fontFamily: 'DMSansRegular', paddingHorizontal: 8}} variant='bodyLarge'>{title}</Text>
        </View>
        <View>
            {rightView}
        </View>
    </Surface>
  )
}

export default Header

const styles = StyleSheet.create({
  shadow: {
    shadow: {
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 5,
    }
  }
})