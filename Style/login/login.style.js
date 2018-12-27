import {
    StyleSheet,
    Platform,
    Image,
} from 'react-native';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default StyleSheet.create({
    view: {
        flex: 1,
        height: currentHeight,
        backgroundColor: 'white',
    },
    editGroup: {
        margin: 30,
    },
    username: {
        marginTop: 20,
        height: 48,
        backgroundColor: 'white',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
    password: {
        height: 48,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
    },
    edit: {
        width: currentWidth - 60 - currentHeight * .06 * .4,
        fontSize: 13,
        backgroundColor: '#fff',
        paddingRight: 15,
        height: 48,
        marginLeft: 10
    },
    text: {
        textAlign: 'right',
        fontSize: 13,
        backgroundColor: '#fff',
    },
    icon: {
        width: 120,
        height: 120,
        borderRadius: 120,
    },
    icons: {
        width: currentHeight * .06 * .4,
        height: currentHeight * .06 * .4,
    },
    login: {
        width: currentWidth - 60,
        height: currentWidth * 70 / 750,
        marginTop: 30,
    },
    login_line: {
        width: currentWidth - 60,
        height: currentWidth * 70 / 750,
        borderRadius: currentWidth * 10 / 750,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    login_text: {
        color: 'white',
        fontSize: currentWidth * 32 / 750,
    }
});