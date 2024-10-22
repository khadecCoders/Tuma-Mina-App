import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import myTheme from '../utils/theme';
import { TextInput, Text } from 'react-native-paper';
import MyInput from '../Components/MyInput';
import CustomButton from '../Components/CustomButton';

const AccountCreated = () => {
  const { navigate } = useNavigation();
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();

    const clearOnBoarding = async () => {
        try {
            await AsyncStorage.removeItem('@viewedonboarding');
        } catch (error) {
            console.log('Error @viewedonboarding: ', error)
        }
    }
 
  return (
    <View style={[styles.container]}>
      <Image source={require('../assets/upperCorner.png')} style={STYLES.upperCorner} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 8, justifyContent: 'center', alignItems: 'center', height: screenHeight -50}}>
          <Image source={require('../assets/success.png')} style={STYLES.loginImage2} />
          <Text variant="labelLarge" style={{fontSize: 30, color: COLORS.outline, textAlign: 'center', width: screenWidth - 80, paddingVertical: 15, fontFamily: 'DMSansRegular'}}>Account Created!</Text>
          <Text style={{fontSize: 15, color: COLORS.outline, textAlign: 'center', width: screenWidth - 80, paddingBottom: 10, fontFamily: 'DMSansRegular'}}>Congratulations user, your account has been created successfully. Continue to start using app</Text>
          <CustomButton text='Continue' onPress={() => navigate('SignIn')}/>
        </View>

      </ScrollView>
      <Text style={{fontSize: 15, marginBottom: 20, color: COLORS.outline, textAlign: 'center', width: screenWidth - 40, fontFamily: 'DMSansRegular'}}>By clicking continue, you agree to our <Text style={{fontSize: 13, color: COLORS.primary, textAlign: 'center', fontFamily: 'DMSansRegular'}}>terms and conditions </Text>and our <Text style={{fontSize: 13, color: COLORS.primary, textAlign: 'center', fontFamily: 'DMSansRegular'}}>privacy policy.</Text></Text>

      {/* <Image source={require('../assets/lowerCorner.png')} style={STYLES.lowerCorner} /> */}
    </View>
  )
}

export default AccountCreated

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
})