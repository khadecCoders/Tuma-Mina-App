import React, { useState } from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import myTheme from '../utils/theme';
import { Divider } from 'react-native-paper';
import {
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign
} from "@expo/vector-icons";

export default function ImageInput({useAsterisk, label, placeholder}) {
  const [image, setImage] = useState(null);
  const [fileName, setfileName] = useState("")
  const { COLORS, screenWidth, STYLES } = myTheme();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.assets[0].canceled) {
      setImage(result.assets[0].uri);
      const fileName = result.assets[0].uri.split('/').pop();
      const fileType = fileName.split('.').pop();

      setfileName(fileName);
      
    }

  };
  
  const removeImage = () => {
    setImage(null);

  }

  return (
    <View>
      {/* <Button title="Pick an image from camera roll" onPress={pickImage} /> */}
      <View style={STYLES.labelWrapper}>
        <Text style={STYLES.inputLabel}>{label}</Text>
        {useAsterisk ? (<Text style={STYLES.asterisk}>*</Text>) : <Text></Text>}
      </View>
      <TouchableOpacity onPress={pickImage} style={{padding: 5, backgroundColor: '#fff', width: screenWidth - 80, marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Text style={{color: COLORS.button}}>{placeholder}</Text>
        <MaterialIcons name="touch-app" size={25} color={COLORS.button} />
      </TouchableOpacity>
      <Divider />
      {image && 
        <View style={{flexDirection: 'row'}}>
          <Image source={{ uri: image }} style={{ width: 50, height: 50, marginRight: 20 }} />
          <View style={{justifyContent: 'center'}}>
            {/* <Text numberOfLines={3}>{fileName}</Text> */}
            <TouchableOpacity onPress={removeImage} style={{padding: 8, backgroundColor: COLORS.outline, width:100, marginTop:5}} >
              <Text style={{color: '#fff'}}>Remove Image</Text>
            </TouchableOpacity>
          </View>
        </View>
        }
    </View>
  );
}

const useStyles = (COLORS, screenWidth) => (StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    fontFamily: 'DMSansRegular',
  },

}))
