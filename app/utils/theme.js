import { StyleSheet, Dimensions} from 'react-native';
import { useTheme } from 'react-native-paper';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const myTheme = () => {
    const {colors} = useTheme()
    const STYLES = useStyles(colors)
    const COLORS = colors;

    return { COLORS,screenHeight, screenWidth, STYLES };
}

const useStyles = COLORS => (StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: screenWidth - 20,
        paddingBottom: 15
    },

    image: {
        width: 200,
        height:  200,
        marginBottom: 15
      },
      upperCorner: {
        width: 500,
        height: 200,
        top: - 50,
        zIndex: 1000,
        // position: 'absolute',
        opacity: 0.8
      },
      upperCorner2: {
        width: 500,
        height: 200,
        top: - 50,
        zIndex: 1000,
        position: 'absolute',
        opacity: 0.8
      },
      lowerCorner: {
        width: 500,
        height: 200,
        bottom: -80,
        position: "absolute"
      },
      loginImage: {
        width: screenWidth - 275,
        height: screenHeight - 675,
        top: 20,
        backgroundColor: 'transparent'
      },
      loginImage2: {
        width: screenWidth - 230,
        height: screenHeight - 675,
        paddingVertical: 10
      },
      userImage: {
        width: 50,
        height: 50,
        borderRadius: 5
      },
      accImage: {
        resizeMode: 'cover',
        width: '100%',
        height: 200,
        marginHorizontal: 10
      },
      homeCardImage: {
        width: 30,
        height: 30,
        borderRadius: 0,
        marginRight: 5
      },
      homeCardImage2: {
        width: 60,
        height: 60,
        borderRadius: 5,
        marginRight: 5
      },
      homeCardImageLarge: {
        width: 60,
        height: 60,
        borderRadius: 5,
        marginRight: 5
      },
      cartCardImage2: {
        width: 80,
        height: 60,
        borderRadius: 5,
        marginRight: 5
      },
      homeImage: {
        width: 150,
        height: 120,
        borderRadius: 5
      },
      textNormal: {
        fontSize: 15,
        color: COLORS.outline,
        fontFamily: 'DMSansRegular',
        
      },
      textHeading: {
        fontSize: 20,
        fontFamily: 'DMSansSemiBold',
        color: COLORS.tertiary,
        paddingVertical: 8
      },
      shadowCard: {
        backgroundColor: COLORS.background,
        shadowColor: COLORS.outline,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        elevation: 2.5,
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center'
      },
      segButton: {
        flex: 1,
        borderRadius: 0,
        padding: 0,
      },
      segButton2: {
        flex: 1,
        borderRadius: 0,
        padding: 0
      },
      segGroup: {
        paddingHorizontal: 0,
        justifyContent: 'center',
        paddingBottom: 8,
        width: '100%'
      },
      modalContainer: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: COLORS.background,
        marginHorizontal: 10, 
        marginVertical: 20,
        borderRadius: 15,
      },
      modalInner: {
        // width: screenWidth -20,
        backgroundColor: COLORS.background,
        borderRadius: 5,
        height: '100%',
        justifyContent: 'flex-start'
      },
      inputLabel: {
        color: COLORS.outline,
        fontSize: 15,
        fontFamily: 'DMSansRegular',
        paddingBottom: 10,
    },
    labelWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bikerAccImg: {
      resizeMode: 'contain',
      flex: 1,
      width: 500,
      height: 300
    },
    inputWrapper: {
      width: '100%',
      marginBottom: 5,
      marginTop: 10,
      paddingHorizontal: 15
  },
}))

export default myTheme;