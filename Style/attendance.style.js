import {
    StyleSheet,
    Platform,
    StatusBar
} from 'react-native';
import config from '../Const/config';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default StyleSheet.create({
    option: {
        height: currentHeight - currentWidth * 184 / 750 - StatusBar.currentHeight,
    },
    option_list: {
        width: currentWidth,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    option_item: {
        width: currentWidth * .5,
        height: currentWidth * 16 / 75,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#eeeeee',
        borderBottomWidth: 1,
        backgroundColor: 'white'
    },
    option_item_icon: {
        width: currentWidth * 7.8 / 75,
        height: currentWidth * 7.8 / 75,
        marginLeft: 15,
    },
    option_text1: {
        width: currentWidth * .5 - currentWidth * 7.8 / 75 - 30,
        borderRightWidth: 1,
        borderRightColor: '#eeeeee',
    },
    option_text2: {
        width: currentWidth * .5 - currentWidth * 7.8 / 75 - 30,
    },
    option_name: {
        fontSize: currentWidth * 2.8 / 75,
    },
    option_intro: {
        fontSize: currentWidth * 2.2 / 75,
        color: '#999999',
    }
});