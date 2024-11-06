import React, {useState, useEffect, useCallback} from 'react';
import {View, ScrollView, Text, Button,TouchableOpacity, StyleSheet} from 'react-native';
// import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Header from '../Components/Header';
import myTheme from '../utils/theme';
import { auth, db, storage } from '../config';
import { ref, set,push, onValue } from 'firebase/database';
import { useLogin } from '../utils/LoginProvider';
import {
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { router } from 'expo-router';

const Chats = ({route}) => {
  const [messages, setMessages] = useState([]);
 const {userName} = route.params;
 const {userIds} = route.params;
 const {allChats} = route.params;


 const { isLoggedIn, setIsLoggedIn, profile, setProfile } = useLogin();

 //.........................................................................

  const { COLORS, screenHeight, screenWidth, STYLES } = myTheme();

  useEffect(() => {
    setMessages(allChats.filter((item) => (item.receiver_id === profile.userId && userIds === item.user._id) || (item.user._id === profile.userId && item.receiver_id === userIds)));
  }, []);

  // [
  //   {
  //     _id: 1,
  //     text: 'Hello developer',
  //     createdAt: new Date(),
  //     user: {
  //       _id: 2,
  //       name: 'React Native',
  //       avatar: require('../assets/images/icon.png'),
  //     },
  //   },
  //   {
  //     _id: 2,
  //     text: 'Hello world',
  //     createdAt: new Date(),
  //     user: {
  //       _id: 1,
  //       name: 'React Native',
  //       avatar: require('../assets/images/icon.png'),
  //     },
  //   },
  // ]

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
    //console.log( messages[0].createdAt);
    push(ref(db, 'chats'), {
  
      _id: messages[0]._id,
      receiver_id:route.params.userId,
      text: messages[0].text,
      createdAt:new Date().toISOString(),
      user: {
        _id: profile.userId,
        name: profile.username,
        avatar: profile.profilePicture,
      },

    }).then(() => {

    }).catch((error) => {
      let errorMessage = error.message.replace(/[()]/g," ");
      console.log(errorMessage);
    })



  }, []);

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{marginBottom: 5, marginRight: 5}}
            size={32}
            color="#2e64e5"
          />
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return(
      <FontAwesome name='angle-double-down' size={22} color='#333' />
    );
  }

  return (
    <View style={{flex: 1}}>
    <Header 
    style={{width:screenWidth}}
    title={userName} 
    titleColor={COLORS.outline}

  />
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: profile.userId,
      }}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
    />
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});