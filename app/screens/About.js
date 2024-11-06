import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Card, Text } from 'react-native-paper'
import myTheme from '../utils/theme';
import { useLogin } from '../utils/LoginProvider';
import Header from '../Components/Header';

const About = ({ navigation }) =>  {

  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const { isLoggedIn, setIsLoggedIn, profile, setProfile } = useLogin();

  return (
    <View style={{backgroundColor: COLORS.surface, flex: 1}}>
      <Header title='About Us' titleColor={COLORS.outline}/>
          <ScrollView style={{paddingHorizontal: 10, paddingVertical: 10}}>
              <Text style={[STYLES.textNormal]}>Welcome to Tuma Mina, your trusted delivery partner. We're passionate about delivering excellence, connecting people and businesses nationwide.</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansSemiBold', color: COLORS.onSurfaceVariant, marginTop: 10}}>Our Values</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>1. Integrity</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>2. Honesty</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>3. Reliable Service</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>4. Customer Satisfaction</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>5. Efficiency & Speed</Text>

              <Text style={{fontSize: 15, fontFamily: 'DMSansSemiBold', color: COLORS.onSurfaceVariant, marginTop: 10}}>Our Vision</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>To be the leading nationwide delivery service provider, setting new industry standards.</Text>

              <Text style={{fontSize: 15, fontFamily: 'DMSansSemiBold', color: COLORS.onSurfaceVariant, marginTop: 10}}>Our Mission</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>To provide efficient, reliable, and customer-centric delivery services, seamlessly connecting people and businesses.</Text>

              <Text style={{fontSize: 15, fontFamily: 'DMSansSemiBold', color: COLORS.onSurfaceVariant, marginTop: 10}}>Our Services</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>1. Medical Deliveries</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>2. Corporate Errands</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>3. Pick Up and Drop</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>4. Personalized Gifts</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>5. Town Runner</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>6. Money Collection and Delivery</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>7. Customized Business Services</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>8. Food Services (Fast and Traditional)</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>9. Grocery Shopping</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>10. Spare Parts Services</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>11. School Services</Text>
              <Text style={{fontSize: 15, fontFamily: 'DMSansRegular', color: COLORS.outline}}>12. Shuttle Services</Text>
          </ScrollView>
    </View>

  )
}

export default About
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 15
    },
})