import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import DeliveryType from '../screens/DeliveryType';

const Stack = createNativeStackNavigator();

const TaskNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      
        <Stack.Screen name='create-task' component={DeliveryType}/>
    </Stack.Navigator>
  )
}

export default TaskNavigation

const styles = StyleSheet.create({})