import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Image, StyleSheet, TouchableOpacity, View, SafeAreaView } from "react-native";
import { Text } from 'react-native-paper'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerToggleButton } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Fragment } from "react";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import Home from "../screens/Home";
import myTheme from "./theme";
import { useLogin } from "./LoginProvider";
import Orders from "../screens/Orders";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Addresses from "../screens/Addresses";
import Account from "../screens/Account";
import About from "../screens/About"
import StoresRestaurants from "../screens/StoresRestaurants"
import TermsAndCons from "../screens/TermsAndCons";
import Help from "../screens/Help";
import DeliveryType from "../screens/DeliveryType";
import Bikers from "../screens/Bikers";
import {
  auth
} from "../config";
import { signOut } from "firebase/auth";
import userAccount from '../screens/UserAccounts';
import userAccounts from '../screens/UserAccounts';
import Maps from '../screens/Maps';

const Drawer = createDrawerNavigator();

const CustomSidebar = (props) => {
  const {navigate} = useNavigation();
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const { isLoggedIn, setIsLoggedIn, profile, setProfile } = useLogin();

  const { state, descriptors, navigation } = props;
  let lastGroupName = '';
  let newGroup = true;

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
    <SafeAreaView style={{ flex: 1, paddingVertical: 0, marginVertical: 0, backgroundColor:COLORS.background}}>
      <View style={{backgroundColor: COLORS.button, height: 160, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Image source={profile.profilePicture ? ({uri: profile.profilePicture}):(require('../assets/user.png'))} style={STYLES.userImage} />
          <View style={{padding:10}}>
            <Text numberOfLines={2} style={{color: COLORS.background, fontSize: 25, fontFamily: 'DMSansBold'}}>{profile.username}</Text>
            <Text numberOfLines={2} style={{color: COLORS.background, fontSize: 15, fontFamily: 'DMSansRegular'}}>{profile.useremail}</Text>
            <Text numberOfLines={2} style={{color: COLORS.background, fontSize: 15, fontFamily: 'DMSansRegular'}}>{profile.accountType} account</Text>
          </View>
        </View>
      </View>
      <DrawerContentScrollView {...props} style={{backgroundColor:COLORS.background, padding: 0}} >
        {state.routes.map((route, i) => {
          const {
            drawerLabel,
            activeTintColor,
            groupName,
            drawerIcon,
            drawerShown
          } = descriptors[route.key].options;
          return (
            <Fragment key={i}>
              {drawerShown ? (
                   <DrawerItem
                   label={
                     ({ color }) =>
                       <Text style={{ color: COLORS.outline, fontSize: 18, fontFamily: 'DMSansRegular' }}>
                         {drawerLabel}
                       </Text>
                   }
                   icon={drawerIcon}
                   focused={
                     state.routes.findIndex(
                       (e) => e.name === route.name
                     ) === state.index
                   }
                   activeTintColor={activeTintColor}
                   onPress={() => navigation.navigate(route.name)}
                   style={{borderRadius: 0, width: '100%', marginLeft: 0, top: - 40}}
                 />
              ) : null}
            </Fragment>
          );
        })}

        <DrawerItem
          label={
            ({ color }) =>
              <Text style={{ color: COLORS.outline, fontSize: 15, fontFamily: 'DMSansRegular' }}>
              Sign Out
              </Text>
          }
          icon= {() => (
            <Entypo name="log-out" size={25} color={COLORS.outline}/>
          )}
          activeTintColor='blue'
          // onPress={}
          style={{borderRadius: 0, width: '90%', marginTop: 60, marginBottom: 10}}
          onPress={async () => {
            handleSignOutFunction();
          }}
        />

        <DrawerItem
          label={
            ({ color }) =>
              <Text style={{ color: COLORS.outline, fontSize: 12, fontFamily: 'DMSansRegular' }}>
              V 1.0.0
              </Text>
          }
          activeTintColor='blue'
          // onPress={}
          style={{borderRadius: 0, width: '90%', borderTopWidth: 1, borderTopColor: COLORS.outline}}
        />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const UserStack = () => {
  const { navigate } = useNavigation();
  const {COLORS} = myTheme();
  const { profile } = useLogin()

  return(
    <GestureHandlerRootView style={{ flex: 1 }}>
      {profile.accountType === 'Admin' ? (
      <Drawer.Navigator
      drawerContent={(props) => <CustomSidebar {...props}/>}
        initialRouteName="Home"
        backBehavior="history"
        screenOptions={{
          headerMode: "screen",
          headerTintColor: COLORS.outline,
          headerTitleAlign: "left",
          headerBackTitle: "Back",
          headerBackTitleVisible: true,
          headerShadowVisible: true,
          headerStyle: {height: 100, backgroundColor: COLORS.button},
          headerTitleStyle: { fontFamily: 'DMSansRegular-Medium'},
          drawerType: 'back',
          
        }}
    >

      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Tuma Mina",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Home",
          key: "drawer-item-01",
          // title: "Home",
          drawerIcon: () => (
            <MaterialIcons name="home" size={25} color={COLORS.outline}/>
          ),
          
        }}
      />

    <Drawer.Screen
        name="MyAddresses"
        component={Addresses}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "My Addresses",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "My Addresses",
          title: "My Addresses",
          drawerIcon: () => (
            <Entypo name="location" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Deliveries"
        component={Orders}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Orders",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Deliveries",
          title: "Deliveries",
          drawerIcon: () => (
            <MaterialCommunityIcons name="cart" size={25} color={COLORS.outline} />
          ),
          headerRight: () => (
            <TouchableOpacity style={{marginRight: 10}}>
              <DrawerToggleButton tintColor="#fff" />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity style={{marginRight: 10}} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="cart" size={25} color={COLORS.outline} />
            </TouchableOpacity>
          ),
          
        }}
      />

      <Drawer.Screen
        name="Stores"
        component={ StoresRestaurants }
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Shops & Restaurants",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Shops & Restaurants",
          title: "Stores",
          drawerIcon: () => (
            <MaterialCommunityIcons name="store" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Bikers"
        component={ Bikers }
        options={{
          activeTintColor: '#16272D',
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Bikers",
          title: "Stores",
          drawerIcon: () => (
            <MaterialIcons name="bike-scooter" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Accounts"
        component={ userAccounts }
        options={{
          activeTintColor: '#16272D',
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Users",
          title: "Stores",
          drawerIcon: () => (
            <Entypo name="users" size={25} color={COLORS.outline} />

          ),
        }}
      />

      <Drawer.Screen
        name="Account"
        component={Account}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Account",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Account",
          title: "Account",
          drawerIcon: () => (
            <Entypo name="user" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="About"
        component={About}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "About",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "About",
          title: "About",
          drawerIcon: () => (
            <MaterialIcons name="info" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Help"
        component={Help}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Help",
          drawerShown: true,
          headerBackTitleVisible: false,
          drawerLabel: "Help",
          headerShown: false,
          title: "Help",
          drawerIcon: () => (
            <MaterialIcons name="help-center" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Ts&Cs"
        component={TermsAndCons}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Ts & Cs",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Terms & Conditions",
          title: "Ts & Cs",
          drawerIcon: () => (
            <MaterialIcons name="edit-document" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Delivery"
        component={DeliveryType}
        options={{
          activeTintColor: '#16272D',
          drawerShown: false,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Delivery Type",
          title: "Delivery Type",
          drawerIcon: () => (
            <MaterialIcons name="edit-document" size={25} color={COLORS.outline} />
          ),
        }}
      />
      </Drawer.Navigator>
    ): profile.accountType === 'Biker' ?(
      <Drawer.Navigator
      drawerContent={(props) => <CustomSidebar {...props}/>}
        initialRouteName="Home"
        backBehavior="history"
        screenOptions={{
          headerMode: "screen",
          headerTintColor: COLORS.outline,
          headerTitleAlign: "left",
          headerBackTitle: "Back",
          headerBackTitleVisible: true,
          headerShadowVisible: true,
          headerStyle: {height: 100, backgroundColor: COLORS.button},
          headerTitleStyle: { fontFamily: 'DMSansRegular-Medium'},
          drawerType: 'back',
          
        }}
    >

      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Tuma Mina",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Home",
          key: "drawer-item-01",
          // title: "Home",
          drawerIcon: () => (
            <MaterialIcons name="home" size={25} color={COLORS.outline}/>
          ),
          
        }}
      />

      <Drawer.Screen
        name="Deliveries"
        component={Orders}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Orders",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Deliveries",
          title: "Deliveries",
          drawerIcon: () => (
            <MaterialCommunityIcons name="cart" size={25} color={COLORS.outline} />
          ),
          headerRight: () => (
            <TouchableOpacity style={{marginRight: 10}}>
              <DrawerToggleButton tintColor="#fff" />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity style={{marginRight: 10}} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="cart" size={25} color={COLORS.outline} />
            </TouchableOpacity>
          ),
          
        }}
      />

      <Drawer.Screen
        name="MyAddresses"
        component={Addresses}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "My Addresses",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "My Addresses",
          title: "My Addresses",
          drawerIcon: () => (
            <Entypo name="location" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Stores"
        component={ StoresRestaurants }
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Shops & Restaurants",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Shops & Restaurants",
          title: "Stores",
          drawerIcon: () => (
            <MaterialCommunityIcons name="store" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Account"
        component={Account}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Account",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Account",
          title: "Account",
          drawerIcon: () => (
            <Entypo name="user" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="About"
        component={About}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "About",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "About",
          title: "About",
          drawerIcon: () => (
            <MaterialIcons name="info" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Help"
        component={Help}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Help",
          drawerShown: true,
          headerBackTitleVisible: false,
          drawerLabel: "Help",
          headerShown: false,
          title: "Help",
          drawerIcon: () => (
            <MaterialIcons name="help-center" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Ts&Cs"
        component={TermsAndCons}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Ts & Cs",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Terms & Conditions",
          title: "Ts & Cs",
          drawerIcon: () => (
            <MaterialIcons name="edit-document" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Delivery"
        component={DeliveryType}
        options={{
          activeTintColor: '#16272D',
          drawerShown: false,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Delivery Type",
          title: "Delivery Type",
          drawerIcon: () => (
            <MaterialIcons name="edit-document" size={25} color={COLORS.outline} />
          ),
        }}
      />
      </Drawer.Navigator>
    ): (
      <Drawer.Navigator
      drawerContent={(props) => <CustomSidebar {...props}/>}
        initialRouteName="Home"
        backBehavior="history"
        screenOptions={{
          headerMode: "screen",
          headerTintColor: COLORS.outline,
          headerTitleAlign: "left",
          headerBackTitle: "Back",
          headerBackTitleVisible: true,
          headerShadowVisible: true,
          headerStyle: {height: 100, backgroundColor: COLORS.button},
          headerTitleStyle: { fontFamily: 'DMSansRegular-Medium'},
          drawerType: 'back',
          
        }}
    >

      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Tuma Mina",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Home",
          key: "drawer-item-01",
          // title: "Home",
          drawerIcon: () => (
            <MaterialIcons name="home" size={25} color={COLORS.outline}/>
          ),
          
        }}
      />

      <Drawer.Screen
        name="Deliveries"
        component={Orders}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Orders",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Deliveries",
          title: "Deliveries",
          drawerIcon: () => (
            <MaterialCommunityIcons name="cart" size={25} color={COLORS.outline} />
          ),
          headerRight: () => (
            <TouchableOpacity style={{marginRight: 10}}>
              <DrawerToggleButton tintColor="#fff" />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity style={{marginRight: 10}} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="cart" size={25} color={COLORS.outline} />
            </TouchableOpacity>
          ),
          
        }}
      />

      <Drawer.Screen
        name="MyAddresses"
        component={Addresses}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "My Addresses",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "My Addresses",
          title: "My Addresses",
          drawerIcon: () => (
            <Entypo name="location" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Stores"
        component={ StoresRestaurants }
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Shops & Restaurants",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Shops & Restaurants",
          title: "Stores",
          drawerIcon: () => (
            <MaterialCommunityIcons name="store" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Account"
        component={Account}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Account",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Account",
          title: "Account",
          drawerIcon: () => (
            <Entypo name="user" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="About"
        component={About}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "About",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "About",
          title: "About",
          drawerIcon: () => (
            <MaterialIcons name="info" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Help"
        component={Help}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Help",
          drawerShown: true,
          headerBackTitleVisible: false,
          drawerLabel: "Help",
          headerShown: false,
          title: "Help",
          drawerIcon: () => (
            <MaterialIcons name="help-center" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Ts&Cs"
        component={TermsAndCons}
        options={{
          activeTintColor: '#16272D',
          headerTitle: "Ts & Cs",
          drawerShown: true,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Terms & Conditions",
          title: "Ts & Cs",
          drawerIcon: () => (
            <MaterialIcons name="edit-document" size={25} color={COLORS.outline} />
          ),
        }}
      />

      <Drawer.Screen
        name="Delivery"
        component={DeliveryType}
        options={{
          activeTintColor: '#16272D',
          drawerShown: false,
          headerShown: false,
          headerBackTitleVisible: false,
          drawerLabel: "Delivery Type",
          title: "Delivery Type",
          drawerIcon: () => (
            <MaterialIcons name="edit-document" size={25} color={COLORS.outline} />
          ),
        }}
      />
      </Drawer.Navigator>
    )}
      </GestureHandlerRootView>
  )
    }

export default UserStack

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
      MainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // padding: 10,
      },
     
      sectionView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      },
      separatorLine: {
        flex: 1,
        backgroundColor: '#676767',
        height: 1.2,
        marginLeft: 12,
        marginRight: 24,
      },
  });
  