import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { AntDesign, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Header from '../Components/Header';
import myTheme from '../utils/theme';
import { useLogin } from '../utils/LoginProvider';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Switch, Text} from 'react-native-paper';
import { signOut } from 'firebase/auth';
import {
  auth
} from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const More = ({navigation}) => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const { isLoggedIn, setIsLoggedIn, profile, setProfile, themeDark, setThemeDark } = useLogin();
  const [optionsCnt, setOptionsCnt] = useState(1);
  const { navigate } = useNavigation();
  const [isSwitchOn, setIsSwitchOn] = useState(themeDark);

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn)
    AsyncStorage.setItem('themeDark', JSON.stringify(!themeDark))
    setThemeDark(!themeDark)
  };

  const CustomHeader = () => (
    <View style={{flexDirection: 'row', justifyContent: 'space-around', flex: 1}}>
       <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
          // Clear input states
          setImage('');
          setuserPassword('');
          setUserAddress('');
          setBikeNo('');
          setuserPasswordConfirm('');
          setuserNumber('');
          setuserEmail('');
          setuserName('');

          setAddBiker(!addBiker)
       }}>
         <MaterialCommunityIcons color={COLORS.outline} name='plus' size={15}/>
       </TouchableOpacity>
       <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}}>
         <MaterialCommunityIcons color={COLORS.outline} name='reload' size={15}/>
       </TouchableOpacity>
       <TouchableOpacity style={{borderWidth: 1, borderColor: COLORS.outline, borderRadius: 100, width: 25, height: 25, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
         setSearch(!search)
       }}>
         <MaterialIcons color={COLORS.outline} name='search' size={15}/>
       </TouchableOpacity>
    </View>
)

const handleSignOutFunction = () => {
  console.log('signout')
  signOut(auth)
  .then(() => {
        AsyncStorage
        .removeItem('@tumamMinaCredentials')
        .then(() => {
            setIsLoggedIn(false);
            setProfile({})
        })
        .catch((error) => alert(error.message))
      })
      .catch(error => alert(error.message))
    }

  return (
    <View style={[styles.container, {backgroundColor: COLORS.surface}]}>
        <Header
            title='More'
            titleColor={COLORS.outline}
        />

        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, paddingVertical: 20}} onPress={() => {
          navigate('Account')
        }}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <MaterialCommunityIcons name='account' size={25} color={COLORS.outline}/>
            <Text style={[STYLES.textNormal, {paddingHorizontal: 10}]}>My Account</Text>
          </View>
          <AntDesign name='rightcircleo' size={25} color={COLORS.outline}/>
        </TouchableOpacity>
        <Divider style={{width: '100%'}} />
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, paddingVertical: 20}} onPress={() => {
          navigate('Addresses')
        }}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <MaterialIcons name='location-on' size={25} color={COLORS.outline}/>
            <Text style={[STYLES.textNormal, {paddingHorizontal: 10}]}>My Addresses</Text>
          </View>
          <AntDesign name='rightcircleo' size={25} color={COLORS.outline}/>
        </TouchableOpacity>
        
        <View style={{backgroundColor: COLORS.onSurfaceVariant, width: '100%', paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10}}>
            <Text style={{color: COLORS.background}}>Info</Text>
        </View>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, paddingVertical: 20}} onPress={() => {
          navigate('Help')
        }}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <MaterialCommunityIcons name='help-circle-outline' size={25} color={COLORS.outline}/>
            <Text style={[STYLES.textNormal, {paddingHorizontal: 10}]}>Help</Text>
          </View>
          <AntDesign name='rightcircleo' size={25} color={COLORS.outline}/>
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, paddingVertical: 20}} onPress={() => {
          navigate('About')
        }}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <MaterialCommunityIcons name='information' size={25} color={COLORS.outline}/>
            <Text style={[STYLES.textNormal, {paddingHorizontal: 10}]}>About Tuma Mina</Text>
          </View>
          <AntDesign name='rightcircleo' size={25} color={COLORS.outline}/>
        </TouchableOpacity>
        <Divider style={{width: '100%'}} />
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, paddingVertical: 20}} onPress={() => {
          navigate('T&C')
        }}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <MaterialCommunityIcons name='file-document-edit' size={25} color={COLORS.outline}/>
            <Text style={[STYLES.textNormal, {paddingHorizontal: 10}]}>Terms And Conditions</Text>
          </View>
          <AntDesign name='rightcircleo' size={25} color={COLORS.outline}/>
        </TouchableOpacity>

        <View style={{backgroundColor: COLORS.onSurfaceVariant, width: '100%', paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10}}>
            <Text style={{color: COLORS.background}}>Settings</Text>
        </View>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, paddingVertical: 20}} onPress={() => {
            setIsSwitchOn(!isSwitchOn)
            AsyncStorage.setItem('themeDark', JSON.stringify(!themeDark))
            setThemeDark(!themeDark)
        }}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <Feather name={isSwitchOn ? 'moon' : 'sun'} size={25} color={COLORS.outline}/>
            <Text style={[STYLES.textNormal, {paddingHorizontal: 10}]}>Dark Theme</Text>
          </View>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} theme='dark' />
        </TouchableOpacity>
        <Divider style={{width: '100%'}} />

        <View style={{backgroundColor: COLORS.onSurfaceVariant, width: '100%', paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10}}>
            <Text style={{color: COLORS.background}}>Log Out</Text>
        </View>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, paddingVertical: 20}} onPress={async () => {
            handleSignOutFunction();
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <AntDesign name='logout' size={25} color={COLORS.outline}/>
            <Text style={[STYLES.textNormal, {paddingHorizontal: 10}]}>Log Out</Text>
          </View>
        </TouchableOpacity>
        <Divider style={{width: '100%'}} />
      
    </View>
  )
}

export default More

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 15,
        flexGrow: 1,
    },
})