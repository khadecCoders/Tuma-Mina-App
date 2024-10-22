import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { HelperText, TextInput } from 'react-native-paper'
import myTheme from '../utils/theme'

const MyInput = ({label, right, type, placeholder, errorText, isRequired, value, onChangeFunction}) => {
  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();
  const [secureText, setSecureText] = useState(true);

  // Toggle show password icon
  function toggleShowPass(){
    setSecureText(!secureText);
  };

  return (
    <View style={{width: screenWidth, justifyContent: 'center'}}>
    {isRequired ? (
      <>
        {type === 'password' ? (
        <>
        <TextInput
          style={{backgroundColor: 'transparent'}}
          label={label}
          textColor={COLORS.outline}
          secureTextEntry={secureText}
          right={<TextInput.Icon icon={secureText ? 'eye-off' : 'eye'} forceTextInputFocus={false} onPress={() => toggleShowPass()}/>}
          contentStyle={{fontFamily: 'DMSansSemiBold'}}
          placeholder={placeholder}
          placeholderTextColor='#BCBCBC'
          value={value}
          onChangeText={onChangeFunction}
        />
        <HelperText type="error" padding="none" visible={!value}>
          {errorText}
        </HelperText>
        </>
    ) :
    type === 'otp' ? (
      <>
      <TextInput
        style={{backgroundColor: 'transparent', width: 150, letterSpacing: 50}}
        label={label}
        textColor={COLORS.outline}
        maxLength={4}
        inputMode='numeric'
        contentStyle={{letterSpacing: 20, fontSize: 25, fontFamily: 'DMSansSemiBold'}}
        placeholder={placeholder}
        placeholderTextColor='#BCBCBC'
        value={value}
        onChangeText={onChangeFunction}

      />
        <HelperText type="error" padding="none" visible={!value}>
        {errorText}
      </HelperText>
      </>
    ):
    type === 'number' ? (
      <>
      <TextInput
        style={{backgroundColor: 'transparent', letterSpacing: 50}}
        label={label}
        textColor={COLORS.outline}
        inputMode='numeric'
        contentStyle={{fontFamily: 'DMSansSemiBold'}}
        placeholder={placeholder}
        placeholderTextColor='#BCBCBC'
        value={value}
        onChangeText={onChangeFunction}

      />
        <HelperText type="error" padding="none" visible={!value}>
        {errorText}
      </HelperText>
      </>
    ):
    type === 'email' ? (
      <>
      <TextInput
        style={{backgroundColor: 'transparent', letterSpacing: 50}}
        label={label}
        textColor={COLORS.outline}
        inputMode='email'
        contentStyle={{fontFamily: 'DMSansSemiBold'}}
        placeholder={placeholder}
        placeholderTextColor='#BCBCBC'
        value={value}
        onChangeText={onChangeFunction}

      />
        <HelperText type="error" padding="none" visible={!value}>
        {errorText}
      </HelperText>
      </>
    ):
    type === 'add' ? (
      <>
      <TextInput
        style={{backgroundColor: 'transparent'}}
        label={label}
        textColor={COLORS.outline}
        contentStyle={{fontFamily: 'DMSansSemiBold'}}
        placeholder={placeholder}
        placeholderTextColor='#BCBCBC'
        value={value}
        onChangeText={onChangeFunction}

      />
        <HelperText type="error" padding="none" visible={!value}>
        {errorText}
      </HelperText>
      </>
    )
    : 
    <>
    <TextInput
        style={{backgroundColor: 'transparent'}}
        label={label}
        textColor={COLORS.outline}
        placeholder={placeholder}
        contentStyle={{fontFamily: 'DMSansSemiBold'}}
        placeholderTextColor='#BCBCBC'
        value={value}
        onChangeText={onChangeFunction}
      />
        <HelperText type="error" padding="none" visible={!value}>
        {errorText}
      </HelperText>
      </>
    }
      </>
    ):(
      <>
        {type === 'password' ? (
      <TextInput
        style={{backgroundColor: 'transparent'}}
        label={label}
        textColor={COLORS.outline}
        secureTextEntry={secureText}
        right={<TextInput.Icon icon={secureText ? 'eye-off' : 'eye'} forceTextInputFocus={false} onPress={() => toggleShowPass()}/>}
        contentStyle={{fontFamily: 'DMSansSemiBold'}}
        placeholder={placeholder}
        placeholderTextColor='#BCBCBC'
        value={value}
        onChangeText={onChangeFunction}
      />
    ) :
    type === 'otp' ? (
      <TextInput
        style={{backgroundColor: 'transparent', width: 150, letterSpacing: 50}}
        label={label}
        textColor={COLORS.outline}
        maxLength={4}
        inputMode='numeric'
        contentStyle={{letterSpacing: 20, fontSize: 25, fontFamily: 'DMSansSemiBold'}}
        placeholder={placeholder}
        placeholderTextColor='#BCBCBC'
        value={value}
        onChangeText={onChangeFunction}

      />
    ):
    type === 'number' ? (
      <TextInput
        style={{backgroundColor: 'transparent', letterSpacing: 50}}
        label={label}
        textColor={COLORS.outline}
        inputMode='numeric'
        contentStyle={{fontFamily: 'DMSansSemiBold'}}
        placeholder={placeholder}
        placeholderTextColor='#BCBCBC'
        value={value}
        onChangeText={onChangeFunction}

      />
    ):
    type === 'email' ? (
      <TextInput
        style={{backgroundColor: 'transparent', letterSpacing: 50}}
        label={label}
        textColor={COLORS.outline}
        inputMode='email'
        contentStyle={{fontFamily: 'DMSansSemiBold'}}
        placeholder={placeholder}
        placeholderTextColor='#BCBCBC'
        value={value}
        onChangeText={onChangeFunction}

      />
    ):
    type === 'add' ? (
      <TextInput
        style={{backgroundColor: 'transparent'}}
        label={label}
        textColor={COLORS.outline}
        contentStyle={{fontFamily: 'DMSansSemiBold'}}
        placeholder={placeholder}
        placeholderTextColor='#BCBCBC'
        value={value}
        onChangeText={onChangeFunction}

      />
    )
    : 
    <TextInput
        style={{backgroundColor: 'transparent'}}
        label={label}
        textColor={COLORS.outline}
        placeholder={placeholder}
        contentStyle={{fontFamily: 'DMSansSemiBold'}}
        placeholderTextColor='#BCBCBC'
        value={value}
        onChangeText={onChangeFunction}
      />
    }
      </>
    )}
  </View>
  )
}

export default MyInput

const styles = StyleSheet.create({})