import { StyleSheet, View } from 'react-native'
import React from 'react'
import { shadow, Text } from 'react-native-paper'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Orders from "../screens/Orders";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Addresses from "../screens/Addresses";
import Account from "../screens/Account";
import About from "../screens/About"
import StoresRestaurants from "../screens/StoresRestaurants"
import TermsAndCons from "../screens/TermsAndCons";
import More from "../screens/More";
import Chats from "../screens/Chats";
import Bikers from "../screens/Bikers";
import Create from "../screens/Create";
import TaskNavigation from './TaskNavigation';
import myTheme from './theme';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress, COLORS}) => (
  <TouchableOpacity 
    onPress={onPress}
    style={{
      top: -10,
      justifyContent:'center',
      alignItems: 'center',
      ...styles.shadow,
      shadowColor: 'rgb(118, 118, 128)',

    }}
  >
    <View
      style={{
        width: 50,
        height: 50,
        borderRadius: 35,
        backgroundColor: 'rgb(83, 172, 230)',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >{children}</View>
  </TouchableOpacity>
)

const Tabs = () => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();

  return (
    <Tab.Navigator
        screenOptions = {({ route }) =>({
          tabBarLabel: '',
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            elevation: 0,
            backgroundColor: COLORS.background,
            borderRadius: 15,
            height: 80,
            ...styles.shadow,
            shadowColor: COLORS.outline,
          }    
    })}
    >
        <Tab.Screen name='Tasks' component={Orders} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='file-document-multiple-outline' size={25} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Tasks</Text>
            </View>
          )
        }}/>
        <Tab.Screen name='Shops' component={StoresRestaurants} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialIcons name='shop' size={25} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Shops</Text>
            </View>
          )
        }}/>
        <Tab.Screen name='Drivers' component={Bikers} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='bike-fast' size={25} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Drivers</Text>
            </View>
          )
        }}/>
        <Tab.Screen name='Chats' component={Chats} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='wechat' size={25} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Chats</Text>
            </View>
          )
        }}/>
        <Tab.Screen name='More' component={More} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='dots-grid' size={25} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>More</Text>
            </View>
          )
        }}/>
        <Tab.Screen name='Create'  component={TaskNavigation} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='dots-grid' size={25} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Create</Text>
            </View>
          ),
          tabBarButton: () => null
          
        }}/>
    </Tab.Navigator>
  )
}

export default Tabs

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  }
})