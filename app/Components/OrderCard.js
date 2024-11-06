import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, {useState} from 'react'
import { Badge, Card, Divider, Menu, Text } from 'react-native-paper'
import myTheme from '../utils/theme';
import {
    AntDesign,
    MaterialCommunityIcons
  } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLogin } from '../utils/LoginProvider';

const OrderCard = ({ orderdate, order, type, shop, biker, delTime, orderStatus, onPress, onPressDelete, onCardPress, status, onPressStatus, customer}) => {
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
    const [menu3, setMenu3] = useState(false);
    const { profile } = useLogin();

  return (
    <>
        <TouchableOpacity style={{width: screenWidth - 20, paddingVertical: 5}} onPress={onCardPress}>
            {orderStatus === 'Delivered' ? (
            <View style={{flex: 1, flexDirection: 'row', padding: 5, marginVertical: 3, justifyContent: 'space-between'}}>
                <View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[STYLES.textNormal, {fontFamily: 'DMSansBold'}]}>Customer: </Text>
                    <Text style={STYLES.textNormal}>{customer || "-- --"}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[STYLES.textNormal, {fontFamily: 'DMSansBold'}]}>Order Date: </Text>
                    <Text style={STYLES.textNormal}>{orderdate || "-- --"}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[STYLES.textNormal, {fontFamily: 'DMSansBold'}]}>Order: </Text>
                    <Text style={STYLES.textNormal} numberOfLines={1}>{order || "-- --"}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[STYLES.textNormal, {fontFamily: 'DMSansBold'}]}>Type: </Text>
                    <Text style={STYLES.textNormal}>{type || "-- --"}</Text>
                    </View>
                </View>
                    <View>
                    {status === "Pending" ? (
                        <Badge style={{backgroundColor: COLORS.error}}>
                            Pending
                        </Badge>
                    ): status === "In Transit" ? (
                        <Badge style={{backgroundColor: COLORS.button}}>
                            In Transit
                        </Badge>
                    ) : (
                        <Badge style={{backgroundColor: '#2ac780'}}>
                            Delivered
                        </Badge>
                    )
                    }
                    </View>
            </View>
        ) : (
            <View style={{flex: 1,flexDirection: 'row', padding: 5, marginVertical: 3, justifyContent: 'space-between'}}>
                <View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[STYLES.textNormal, {fontFamily: 'DMSansBold'}]}>Customer: </Text>
                    <Text style={STYLES.textNormal}>{customer || "-- --"}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[STYLES.textNormal, {fontFamily: 'DMSansBold'}]}>Order Date: </Text>
                    <Text style={STYLES.textNormal}>{orderdate || "-- --"}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[STYLES.textNormal, {fontFamily: 'DMSansBold'}]}>Order: </Text>
                    <Text numberOfLines={1} style={STYLES.textNormal}>{order || "-- --"}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[STYLES.textNormal, {fontFamily: 'DMSansBold'}]}>Type: </Text>
                    <Text style={STYLES.textNormal}>{type || "-- --"}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[STYLES.textNormal, {fontFamily: 'DMSansBold'}]}>Shop: </Text>
                    <Text style={STYLES.textNormal}>{shop || "-- --"}</Text>
                    </View>
                </View>
                    <View>
                    {status === "Pending" ? (
                        <Badge style={{backgroundColor: COLORS.error}}>
                            Pending
                        </Badge>
                    ): status === "In Transit" ? (
                        <Badge style={{backgroundColor: COLORS.button}}>
                            In Transit
                        </Badge>
                    ) : (
                        <Badge style={{backgroundColor: '#2ac780'}}>
                            Delivered
                        </Badge>
                    )
                    }
                    </View>

            </View>
        )}
        </TouchableOpacity>
        <Divider style={{backgroundColor: COLORS.outline}}/>
    </>
  )
}

export default OrderCard

const styles = StyleSheet.create({})