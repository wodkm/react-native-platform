import {
    StyleSheet,
    Platform,
    StatusBar
} from 'react-native';
import config from '../../Const/config';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default StyleSheet.create({
    container: {
        height: currentHeight - currentWidth * 184 / 750 - StatusBar.currentHeight,
        backgroundColor: '#F5F5F5',
    },
    userIcon: {
        width: currentWidth * 8 / 75,
        height: currentWidth * 8 / 75,
        marginLeft: currentWidth * .03,
        marginRight: currentWidth / 25,
        borderRadius: currentWidth * 8 / 75,
    },
    arrow: {
        width: currentHeight * .06 * .4,
        height: currentWidth * 2 / 75,
        marginLeft: currentWidth * .015,
        marginRight: currentWidth / 25,
    },
    icons: {
        width: currentHeight * .06 * .4,
        height: currentHeight * .06 * .4,
        marginLeft: currentWidth * .03
    },
    item: {
        height: currentWidth * 100 / 750,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
    },
    font: {
        marginLeft: currentWidth / 25,
        fontSize: currentWidth * 34 / 750,
        marginRight: 10,
        color: '#333333',
    },
    wrapper: {
        marginTop: 10,
    },
    tag: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    exit: {
        height: currentWidth * 2 / 15,
    },
    exit_linearGradient: {
        height: currentWidth * 2 / 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    exit_text: {
        color: 'white',
        fontSize: currentWidth * 34 / 750,
    }
});