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

const OrderCard = ({ orderdate, order, type, shop, biker, delTime, orderStatus, onPress, onPressDelete, onCardPress, status, onPressStatus}) => {
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
    const [menu3, setMenu3] = useState(false);
    const { profile } = useLogin();

  return (
    <TouchableOpacity style={{width: screenWidth - 20}} onPress={onCardPress}>
        {orderStatus === 'Delivered' ? (
        <View style={{flex: 1, flexDirection: 'row', backgroundColor: '#fff', padding: 5, marginVertical: 3, justifyContent: 'space-between'}}>
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Order Date: </Text>
                <Text style={STYLES.textNormal}>{orderdate || "-- --"}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Order: </Text>
                <Text style={STYLES.textNormal}>{order || "-- --"}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Type: </Text>
                <Text style={STYLES.textNormal}>{type || "-- --"}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Shop: </Text>
                <Text style={STYLES.textNormal}>{shop || "-- --"}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Biker: </Text>
                <Text style={STYLES.textNormal}>{biker || "-- --"}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Delivery Time: </Text>
                <Text style={STYLES.textNormal}>{delTime || "-- --"}</Text>
                </View>
            </View>
            {profile.accountType === "Admin" ? (
            <View>
                <Menu
                    visible={menu3}
                    onDismiss={() => setMenu3(!menu3)}
                    anchor={
                    <TouchableOpacity style={{alignItems: 'flex-start', justifyContent: 'flex-start'}} onPress={() =>setMenu3(!menu3)}>
                        <MaterialCommunityIcons name="dots-horizontal" size={25} color={COLORS.outline} />
                    </TouchableOpacity>
                    }
                >
                    <Menu.Item leadingIcon={() => <AntDesign name="delete" size={25} color={COLORS.error} />} onPress={onPressDelete} titleStyle={{color: COLORS.error}} title="Remove" />

                </Menu>
                
            </View>
            ): profile.accountType === "Public" ?(
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
            ) : (
                <View>
                    <Menu
                        visible={menu3}
                        onDismiss={() => setMenu3(!menu3)}
                        anchor={
                        <TouchableOpacity style={{alignItems: 'flex-start', justifyContent: 'flex-start'}} onPress={onPressStatus}>
                            <MaterialCommunityIcons name="dots-horizontal" size={25} color={COLORS.outline} />
                        </TouchableOpacity>
                        }
                    >
                        <Text style={[STYLES.textNormal, {padding: 10, color: '#161F3D'}]}>Change order status</Text>
                        <Divider />
                        <Menu.Item onPress={onPressStatus} titleStyle={{color: COLORS.outline}} title="In Transit" />
                        <Menu.Item onPress={onPressStatus} titleStyle={{color: COLORS.outline}} title="Delivered" />
                    </Menu>
                </View>
            )}
        </View>
    ) : (
        <View style={{flex: 1,flexDirection: 'row', backgroundColor: '#fff', padding: 5, marginVertical: 3, justifyContent: 'space-between'}}>
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Order Date: </Text>
                <Text style={STYLES.textNormal}>{orderdate || "-- --"}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Order: </Text>
                <Text style={STYLES.textNormal}>{order || "-- --"}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Type: </Text>
                <Text style={STYLES.textNormal}>{type || "-- --"}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[STYLES.textNormal, {fontWeight: 'bold'}]}>Shop: </Text>
                <Text style={STYLES.textNormal}>{shop || "-- --"}</Text>
                </View>
            </View>
            {profile.accountType === "Admin" ? (
            <View>
                <Menu
                    visible={menu3}
                    onDismiss={() => setMenu3(!menu3)}
                    anchor={
                    <TouchableOpacity style={{alignItems: 'flex-start', justifyContent: 'flex-start'}} onPress={() =>setMenu3(!menu3)}>
                        <MaterialCommunityIcons name="dots-horizontal" size={25} color={COLORS.outline} />
                    </TouchableOpacity>
                    }
                >
                    <Menu.Item leadingIcon={() => <AntDesign name="clouddownload" size={25} color={COLORS.outline} />} onPress={onPress} titleStyle={{color: COLORS.outline}} title="Dispatch" />
                    <Menu.Item leadingIcon={() => <AntDesign name="delete" size={25} color={COLORS.error} />} onPress={onPressDelete} titleStyle={{color: COLORS.error}} title="Remove" />
                    <Divider />
                    <Menu.Item onPress={onPressStatus} titleStyle={{color: COLORS.outline}} title="Change Order Status" />
                </Menu>
            </View>
            ): profile.accountType === "Public" ?(
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
            ) : (
                <View>
                    <Menu
                        visible={menu3}
                        onDismiss={() => setMenu3(!menu3)}
                        anchor={
                        <TouchableOpacity style={{alignItems: 'flex-start', justifyContent: 'flex-start'}} onPress={onPressStatus}>
                            <MaterialCommunityIcons name="dots-horizontal" size={25} color={COLORS.outline} />
                        </TouchableOpacity>
                        }
                    >
                        <Text style={[STYLES.textNormal, {padding: 10, color: '#161F3D'}]}>Change order status</Text>
                        <Divider />
                        <Menu.Item onPress={onPressStatus} titleStyle={{color: COLORS.outline}} title="In Transit" />
                        <Menu.Item onPress={onPressStatus} titleStyle={{color: COLORS.outline}} title="Delivered" />
                    </Menu>
                </View>
            )}
        </View>
    )}
    </TouchableOpacity>
  )
}

export default OrderCard

const styles = StyleSheet.create({})