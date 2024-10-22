import { FlatList, StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Appbar ,Button,Card,Divider,Text } from 'react-native-paper';
import myTheme from '../utils/theme';
import {
  MaterialIcons,
} from "@expo/vector-icons";
import { useLogin } from '../utils/LoginProvider';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import HomeCard from '../Components/HomeCard';
import { onValue, ref } from 'firebase/database';
import { db } from '../config';
import StoreCard from '../Components/StoreCard';

const Home = ({ navigation }) => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const { isLoggedIn, setIsLoggedIn, profile, setProfile } = useLogin();
  const { navigate } = useNavigation(); 
  const [user, setUser] = useState('admin');
  const [shops, setShops] = useState({});

  const _goBack = () => console.log('Went back');

  const _handleMore = () => console.log('Shown more');

  useEffect(() => {
    const shopsRef = ref(db, 'Shops/');
    onValue(shopsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const newShops = Object.keys(data)
                .map(key => ({
                    id: key,
                    ...data[key]
                }));

            setShops(newShops);
        }
    });
}, [])

  return (
    <View style={styles.container}>
       <View style={{height: 280, backgroundColor: COLORS.button, width: '100%', paddingVertical: 60, paddingHorizontal: 20, borderBottomRightRadius: 25, borderBottomLeftRadius: 25}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={profile.profilePicture ? ({uri: profile.profilePicture}):(require('../assets/user.png'))} style={STYLES.userImage} />
            <View style={{padding:10}}>
              <Text style={{color: COLORS.background, fontSize: 25, paddingTop: 10, fontFamily: 'DMSansBold'}} variant='bodyLarge'>Welcome back</Text>
              <Text style={{color: COLORS.background, fontSize: 15, fontFamily: 'DMSansRegular'}}>{profile.useremail}</Text>
            </View>
          </View>
        </View>
       </View>

      <View style={{ top: - 100, width: '100%', alignItems: 'center'}}>
       <Card mode='elevated' style={{width: '70%', height: 180, backgroundColor: COLORS.background, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
        <Image source={require('../assets/Logo.png')} style={STYLES.homeImage} />
       </Card>

         <View style={{width:'90%', paddingVertical: 0}}>
            <Text style={STYLES.textHeading}>Categories</Text>
            <View style={{marginBottom: 15}}>
              <TouchableOpacity style={[STYLES.shadowCard, {flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 5}]} onPress={() => navigate('Delivery', { deliveryCat: 'Package' })}>
                  <Image source={require('../assets/Package.jpg')} style={STYLES.homeCardImage} />
                  <View style={{alignItems: 'flex-start'}}>
                    <Text style={[STYLES.textNormal, {textAlign: 'center', letterSpacing: 2}]}>Package</Text>
                    <Text style={[STYLES.textNormal, {textAlign: 'center'}]}>Delivery</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={[STYLES.shadowCard, {flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 5}]} onPress={() => navigate('Delivery', { deliveryCat: 'Grocery' })}>
                  <Image source={require('../assets/Grocery.jpg')} style={STYLES.homeCardImage} />
                  <View style={{alignItems: 'flex-start'}}>
                    <Text style={[STYLES.textNormal, {textAlign: 'center', letterSpacing: 2}]}>Grocery</Text>
                    <Text style={[STYLES.textNormal, {textAlign: 'center'}]}>Delivery</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={[STYLES.shadowCard, {flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 5}]} onPress={() => navigate('Delivery', { deliveryCat: 'Fast Food' })}>
                  <Image source={require('../assets/FastFood.jpg')} style={STYLES.homeCardImage} />
                  <View style={{alignItems: 'flex-start'}}>
                    <Text style={[STYLES.textNormal, {textAlign: 'center', letterSpacing: 2}]}>Fast Food</Text>
                    <Text style={[STYLES.textNormal, {textAlign: 'center'}]}>Delivery</Text>
                  </View>
              </TouchableOpacity>
            </View>
          </View>

       {/* <View style={{width:'90%',}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
         <Text style={STYLES.textHeading}>Shops & Restaurants</Text>
         <Button mode="text" contentStyle={{padding: 1}} onPress={() => navigate("Stores")}>
          View All
        </Button>
        </View>
        <ScrollView horizontal={true} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={{height: screenHeight - 580, backgroundColor: COLORS.background, borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
        <FlatList
            showsVerticalScrollIndicator={false}
            data={shops}
            key={(item, index) => index}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => (
            <HomeCard
                name={item.shopName}
                category={item.shopCategory}
                addr={item.shopAddress}
                image={item.shopPicture ? ({ uri: item.shopPicture }) : (require('../assets/Cin.jpg'))}
            />
            )}
        />
        </ScrollView>
       </View> */}
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
})