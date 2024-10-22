import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button, Divider, HelperText } from 'react-native-paper';
import myTheme from '../utils/theme';

  const DropdownComponent = ({label, onChangeFunction, data, value, isRequired, errorText, clearVal}) => {
    const [isFocus, setIsFocus] = useState(false);
    const { screenWidth, STYLES, COLORS } = myTheme()
    const styles = useStyles(COLORS, screenWidth)

    const renderLabel = () => {
      if (value || isFocus) {
        return (
          <Text style={[STYLES.inputLabel, isFocus && { color: COLORS.primary }]}>
           Select {label}
          </Text>
        );
      }
      return (
        <Text style={[STYLES.inputLabel, isFocus && { color: COLORS.primary }]}>
        {label}
      </Text>
      );
    };

    return (
      <View style={STYLES.inputWrapper}>
        {renderLabel()}
        {isRequired && !value ? (
          <>
            <Dropdown
              style={[STYLES.inputFieldError, {paddingBottom: 30}]}
              containerStyle={{backgroundColor: COLORS.onTertiary}}
              itemTextStyle={{color: COLORS.outline}}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={'Select ' + label}
              searchPlaceholder="Search..."
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {onChangeFunction(item.value), setIsFocus(false)}}
            />
            <Button mode='outlined'>
              Clear
            </Button>
            <HelperText type="error" padding="none" visible={true}>
              {errorText}
            </HelperText>
          </>
        ):(
          <>
          <Dropdown
            style={[STYLES.inputField, {paddingBottom: 10}]}
            containerStyle={{backgroundColor: COLORS.onTertiary}}
            itemTextStyle={{color: COLORS.outline}}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={'Select ' + label}
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {onChangeFunction(item.value), setIsFocus(false)}}
          />
          {value ? (
            <TouchableOpacity onPress={clearVal}>
              <Button mode='text' contentStyle={{alignItems: 'flex-start'}} style={{alignItems: 'flex-start'}}>
                Clear
            </Button>
            </TouchableOpacity>
          ):(
            <></>
          )}
        </>
        )}
        <Divider />
      </View>
    );
  };

  export default DropdownComponent;

  const useStyles = (COLORS, screenWidth) => (StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 16,
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: COLORS.background,
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
      color: COLORS.outline
    },
    selectedTextStyle: {
      fontSize: 16,
      color: COLORS.outline
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  }));