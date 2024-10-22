import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import myTheme from '../utils/theme';
import { TextInput, Text } from 'react-native-paper';
import MyInput from '../Components/MyInput';
import CustomButton from '../Components/CustomButton';

const VerifyAccount = () => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();

    const clearOnBoarding = async () => {
        try {
            await AsyncStorage.removeItem('@viewedonboarding');
        } catch (error) {
            console.log('Error @viewedonboarding: ', error)
        }
    }
 
  return (
    <View style={[styles.container, {width: screenWidth - 40}]}>
      <Image source={require('../assets/upperCorner.png')} style={STYLES.upperCorner} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{justifyContent: 'center', height: screenHeight - 10}}>
          <Text variant='labelLarge' style={{fontSize:30, color: COLORS.outline, textAlign: 'center', width: screenWidth - 80, paddingVertical: 10, fontFamily: 'DMSansRegular'}}>Verify Account</Text>
          <Text style={{fontSize: 15, color: COLORS.outline, textAlign: 'center', width: screenWidth - 80, fontFamily: 'DMSansRegular'}}>Enter the 4 digit code sent to decentncubet04@gmail</Text>

          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <TextInput
              style={{backgroundColor: '#E3E3E3', width: 150, letterSpacing: 50, marginVertical: 10}}
              label='Code'
              textColor={COLORS.outline}
              maxLength={4}
              inputMode='numeric'
              contentStyle={{letterSpacing: 20, fontSize: 25}}
            />
          </View>

          <Text style={{fontSize: 15, marginVertical: 3, color: COLORS.outline, textAlign: 'center', fontFamily: 'DMSansRegular'}}>Did not receive the code ?</Text>
          <TouchableOpacity>
            <Text style={{fontSize: 15, marginVertical: 3, color: COLORS.primary, textAlign: 'center', fontWeight: 'bold', fontFamily: 'DMSansRegular'}}>Resend the code </Text>
          </TouchableOpacity>
          
          <CustomButton text='Proceed' onPress={clearOnBoarding}/>
          <TouchableOpacity>
            <Text style={{fontSize: 15, marginVertical: 3, color: COLORS.primary, textAlign: 'center', fontWeight: 'bold', fontFamily: 'DMSansRegular'}}>Back to Sign In </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
      {/* <Image source={require('../assets/lowerCorner.png')} style={STYLES.lowerCorner} /> */}
      <Text style={{fontSize: 15, marginBottom: 20, color: COLORS.outline, textAlign: 'center', fontFamily: 'DMSansRegular' }}>By clicking proceed, you agree to our <Text style={{fontSize: 13, color: COLORS.primary, textAlign: 'center', fontFamily: 'DMSansRegular'}}>terms and conditions </Text>and our <Text style={{fontSize: 13, color: COLORS.primary, textAlign: 'center', fontFamily: 'DMSansRegular'}}>privacy policy.</Text></Text>
    </View>
  )
}

export default VerifyAccount

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
})