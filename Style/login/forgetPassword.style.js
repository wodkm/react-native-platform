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
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    userIcon: {
        width: currentHeight * .06 * .7,
        height: currentHeight * .06 * .7,
        marginLeft: currentWidth * .03,
        marginRight: currentWidth * .05
    },
    arrow: {
        width: currentHeight * .06 * .4,
        height: currentHeight * .06 * .4,
        marginLeft: currentWidth * .03,
        marginRight: currentWidth * .02
    },
    icons: {
        width: currentHeight * .06 * .4,
        height: currentHeight * .06 * .4,
        marginLeft: currentWidth * .03
    },
    item: {
        height: 40,
        justifyContent: 'flex-start',
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
        flex: 1,
    },
    font: {
        fontSize: 15,
        marginLeft: 5,
        marginRight: 10,
    },
    wrapper: {
        marginTop: 0,
    },
    tag: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    exit: {
        marginTop: 55,
        marginLeft: 20,
        marginRight: 20
    },
    edit: {
        width: currentWidth - currentHeight * .06 * .4 - 60 - 15,
        fontSize: 13,
        paddingRight: 15,
        height: 40,
        marginLeft: 0
    },
    phoneInput: {
        width: currentWidth - currentHeight * .06 * .4 - 60 - 15 - 100,
        fontSize: 13,
        paddingRight: 15,
        height: 40,
        marginLeft: 0,
    },
    countBtn: {
        marginLeft: 0,
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    },
    text: {
        color: 'white',
        fontSize: currentWidth * 32 / 750,
    }
});