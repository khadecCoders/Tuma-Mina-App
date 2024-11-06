import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper';
import React from 'react'
import myTheme from '../utils/theme';

const ProfileImage = ({name, size}) => {
    const { COLORS, screenHeight, screenWidth, STYLES } = myTheme()
    const nameParts = name.split(" ");
    const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
    const lastNameInitial = nameParts[1] ? nameParts[1][0] : "";
  
    return (
      <>
        {size === 'Large' ? (
        <View
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 100,
                height: 100,
                backgroundColor: COLORS.outline,
                borderRadius: 50,
                marginRight: 8
            }}
            >
            <Text style={[STYLES.textHeading, {color: COLORS.background, fontSize: 40}]}>
            {firstNameInitial}
            {lastNameInitial}
            </Text>
        </View>
        ):(
        <View
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 50,
                height: 50,
                backgroundColor: COLORS.outline,
                fontSize: 30,
                borderRadius: 50,
                marginRight: 8
            }}
            >
            <Text style={[STYLES.textHeading, {color: COLORS.background}]}>
            {firstNameInitial}
            {lastNameInitial}
            </Text>
        </View>
        )}
      </>
    );
}

export default ProfileImage

const styles = StyleSheet.create({
})