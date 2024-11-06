import { StyleSheet, View, Platform } from 'react-native'
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
// import Chats from "../screens/Chats";
import Bikers from "../screens/Bikers";
import Help from "../screens/Help";
import Contacts from '../screens/Contacts';
import TaskNavigation from './TaskNavigation';
import myTheme from './theme';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useLogin } from './LoginProvider';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const { profile } = useLogin();

  return (
    <Tab.Navigator
        screenOptions = {({ route }) =>({
          tabBarLabel: '',
          headerShown: false,
          tabBarStyle: {
            width: '100%',
            backgroundColor: COLORS.background,
            paddingBottom: Platform.OS === 'android' ? 10 : 0,
            height: 70,
            paddingHorizontal: 10
          }    
    })}
    >
        <Tab.Screen name='Tasks' component={Orders} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='file-document-multiple-outline' size={20} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>{profile.accountType === 'Public' ? 'Deliveries' : 'Tasks'} </Text>
            </View>
          )
        }}/>
        <Tab.Screen name='Shops' component={StoresRestaurants} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialIcons name='shop' size={20} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Shops</Text>
            </View>
          )
        }}/>

        {profile.accountType === "Admin" && (
            <Tab.Screen name='Drivers' component={Bikers} options={{
              tabBarIcon: ({focused}) => (
                <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
                  <MaterialCommunityIcons name='bike-fast' size={20} color={focused ? COLORS.button : COLORS.outline}/>
                  <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Drivers</Text>
                </View>
              )
            }}/>
        )}

        {/* <Tab.Screen name='Chats' component={Chats} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='wechat' size={20} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Chats</Text>
            </View>
          )
        }}/> */}

        <Tab.Screen name='Addresses' component={Addresses} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='wechat' size={20} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Addresses</Text>
            </View>
          ),
          tabBarButton: () => {
            if(profile.accountType === "Public"){
              return null
            } else {return true}
          }
        }}/>

      {profile.accountType === 'Public' && (
        <>
           <Tab.Screen name='MyAddresses' component={Addresses} options={{
        tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
            <MaterialCommunityIcons name='wechat' size={20} color={focused ? COLORS.button : COLORS.outline}/>
            <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Addresses</Text>
          </View>
        ),
      }}/>

      <Tab.Screen name='MyAccount' component={Account} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='account' size={20} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Account</Text>
            </View>
          )
        }}/>
        </>
      )}
       
       {profile.accountType !== "Public" && (
         <Tab.Screen name='Contacts' component={Contacts} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='contacts' size={20} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Contacts</Text>
            </View>
          ),
          
        }}/>
       )}

        <Tab.Screen name='Account' component={Account} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='account' size={20} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Account</Text>
            </View>
          ), 
          tabBarButton: () => {
            if(profile.accountType === "Public"){
              return null
            } else {return true}
          }
        }}/>

        <Tab.Screen name='More' component={More} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='forwardburger' size={20} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>More</Text>
            </View>
          )
        }}/>
        
        <Tab.Screen name='Create'  component={TaskNavigation} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='backburger' size={20} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Create</Text>
            </View>
          ),
          tabBarButton: () => null
        }}/>

        <Tab.Screen name='About'  component={About} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='backburger' size={20} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>About</Text>
            </View>
          ),
          tabBarButton: () => null
        }}/>

        <Tab.Screen name='T&C'  component={TermsAndCons} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='backburger' size={20} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Create</Text>
            </View>
          ),
          tabBarButton: () => null
        }}/>

        <Tab.Screen name='Help'  component={Help} options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons name='help' size={20} color={focused ? COLORS.button : COLORS.outline}/>
              <Text style={{color: focused ? COLORS.button : COLORS.outline, fontSize: 13}}>Help</Text>
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